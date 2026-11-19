<?php
/**
 * Order storage.
 *
 * @package Noksha
 */

namespace Noksha\Orders;

use Noksha\Notify\Sms;
use Noksha\Region\Phone;

final class Repository {
    public const STATUSES = [
        'pending',
        'awaiting_payment',
        'confirmed',
        'no_answer',
        'fake',
        'paid',
        'shipped',
        'delivered',
        'returned',
        'cancelled',
    ];

    public const COUNTABLE = ['pending', 'no_answer', 'awaiting_payment', 'confirmed', 'paid', 'shipped', 'delivered'];

    /** @var array<string, list<string>> */
    public const TRANSITIONS = [
        'pending' => ['confirmed', 'no_answer', 'fake', 'cancelled', 'awaiting_payment', 'paid'],
        'awaiting_payment' => ['paid', 'confirmed', 'cancelled', 'pending'],
        'confirmed' => ['shipped', 'paid', 'cancelled', 'pending', 'no_answer', 'fake'],
        'no_answer' => ['pending', 'confirmed', 'fake', 'cancelled', 'no_answer'],
        'fake' => ['cancelled', 'pending'],
        'paid' => ['shipped', 'cancelled', 'confirmed'],
        'shipped' => ['delivered', 'returned', 'cancelled'],
        'delivered' => ['returned'],
        'returned' => [],
        'cancelled' => [],
    ];

    public static function table(): string {
        global $wpdb;
        return $wpdb->prefix . 'noksha_orders';
    }

    public static function items_table(): string {
        global $wpdb;
        return $wpdb->prefix . 'noksha_order_items';
    }

    public static function payments_table(): string {
        global $wpdb;
        return $wpdb->prefix . 'noksha_payments';
    }

    public static function notes_table(): string {
        global $wpdb;
        return $wpdb->prefix . 'noksha_order_notes';
    }

    public static function can_transition(string $from, string $to): bool {
        if ($from === $to) {
            return true;
        }
        if (!in_array($to, self::STATUSES, true)) {
            return false;
        }
        $allowed = self::TRANSITIONS[$from] ?? [];
        return in_array($to, $allowed, true);
    }

    public static function insert(array $order, array $item): int {
        $items = isset($item[0]) && is_array($item[0]) ? $item : [$item];
        global $wpdb;
        $now = current_time('mysql');
        $order['created_at'] = $now;
        $order['updated_at'] = $now;
        $wpdb->insert(self::table(), $order);
        $id = (int) $wpdb->insert_id;
        foreach ($items as $row) {
            if (!is_array($row)) {
                continue;
            }
            $row['order_id'] = $id;
            $wpdb->insert(self::items_table(), $row);
        }
        return $id;
    }

    public static function add_payment(array $payment): int {
        global $wpdb;
        $now = current_time('mysql');
        $payment['created_at'] = $now;
        $payment['updated_at'] = $now;
        $wpdb->insert(self::payments_table(), $payment);
        return (int) $wpdb->insert_id;
    }

    public static function update(int $id, array $fields, bool $note_status = true): void {
        global $wpdb;
        $old = self::find($id);
        $fields['updated_at'] = current_time('mysql');
        if (isset($fields['status']) && $old) {
            $new_status = (string) $fields['status'];
            $old_status = (string) ($old['status'] ?? '');
            if ($new_status === 'no_answer') {
                $fields['call_attempts'] = (int) ($old['call_attempts'] ?? 0) + 1;
                $fields['last_call_at'] = current_time('mysql');
            }
            $wpdb->update(self::table(), $fields, ['id' => $id]);
            if ($note_status && $new_status !== $old_status) {
                self::add_note($id, sprintf('Status: %s → %s', $old_status, $new_status));
                do_action('noksha_order_status_changed', $id, $old_status, $new_status);
            }
            return;
        }
        $wpdb->update(self::table(), $fields, ['id' => $id]);
    }

    public static function on_status_changed(int $id, string $old, string $new): void {
        $order = self::find($id);
        if (!$order) {
            return;
        }
        if ($new === 'confirmed') {
            Sms::order_confirmed($order);
        } elseif ($new === 'shipped') {
            Sms::order_shipped($order);
        } elseif ($new === 'delivered') {
            Sms::order_delivered($order);
        }
    }

    public static function add_note(int $order_id, string $note, int $user_id = 0): void {
        $note = trim($note);
        if ($note === '' || $order_id <= 0) {
            return;
        }
        global $wpdb;
        $table = self::notes_table();
        $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table)));
        if ($found !== $table) {
            return;
        }
        $wpdb->insert($table, [
            'order_id' => $order_id,
            'user_id' => $user_id > 0 ? $user_id : get_current_user_id(),
            'note' => noksha_clip($note, 2000),
            'created_at' => current_time('mysql'),
        ]);
    }

    public static function notes(int $order_id): array {
        global $wpdb;
        $table = self::notes_table();
        $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table)));
        if ($found !== $table) {
            return [];
        }
        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT id, user_id, note, created_at FROM {$table} WHERE order_id = %d ORDER BY id DESC LIMIT 100",
                $order_id
            ),
            ARRAY_A
        );
        return is_array($rows) ? array_map(static function ($row) {
            return [
                'id' => (int) $row['id'],
                'userId' => (int) $row['user_id'],
                'note' => (string) $row['note'],
                'createdAt' => (string) $row['created_at'],
            ];
        }, $rows) : [];
    }

    public static function update_payment(int $order_id, array $fields): void {
        global $wpdb;
        $fields['updated_at'] = current_time('mysql');
        $wpdb->update(self::payments_table(), $fields, ['order_id' => $order_id]);
    }

    public static function find(int $id): ?array {
        global $wpdb;
        $row = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . self::table() . ' WHERE id = %d', $id), ARRAY_A);
        return is_array($row) ? $row : null;
    }

    public static function find_by_number(string $number): ?array {
        global $wpdb;
        $row = $wpdb->get_row(
            $wpdb->prepare('SELECT * FROM ' . self::table() . ' WHERE order_number = %s', $number),
            ARRAY_A
        );
        return is_array($row) ? $row : null;
    }

    public static function items(int $order_id): array {
        global $wpdb;
        $rows = $wpdb->get_results(
            $wpdb->prepare('SELECT name, qty, price FROM ' . self::items_table() . ' WHERE order_id = %d', $order_id),
            ARRAY_A
        );
        return is_array($rows) ? $rows : [];
    }

    public static function payment(int $order_id): ?array {
        global $wpdb;
        $row = $wpdb->get_row(
            $wpdb->prepare('SELECT * FROM ' . self::payments_table() . ' WHERE order_id = %d ORDER BY id DESC LIMIT 1', $order_id),
            ARRAY_A
        );
        return is_array($row) ? $row : null;
    }

    public static function phone_count(string $phone, string $since): int {
        global $wpdb;
        return (int) $wpdb->get_var($wpdb->prepare(
            'SELECT COUNT(*) FROM ' . self::table() . ' WHERE phone = %s AND created_at >= %s AND status <> %s',
            $phone,
            $since,
            'cancelled'
        ));
    }

    public static function next_number(): string {
        do {
            $number = 'NK-' . wp_date('ymd') . '-' . strtoupper(wp_generate_password(4, false, false));
        } while (self::find_by_number($number));
        return $number;
    }

    /**
     * @param array{search?:string,status?:string,page?:int,per_page?:int,from?:string,to?:string,payment_method?:string} $args
     */
    public static function query(array $args = []): array {
        global $wpdb;
        $search = sanitize_text_field((string) ($args['search'] ?? ''));
        $status = sanitize_key((string) ($args['status'] ?? ''));
        $method = sanitize_key((string) ($args['payment_method'] ?? ''));
        $from = sanitize_text_field((string) ($args['from'] ?? ''));
        $to = sanitize_text_field((string) ($args['to'] ?? ''));
        $page = max(1, (int) ($args['page'] ?? 1));
        $per_page = max(1, min(100, (int) ($args['per_page'] ?? 50)));
        $offset = ($page - 1) * $per_page;

        $where = ['1=1'];
        $params = [];
        if ($status !== '' && in_array($status, self::STATUSES, true)) {
            $where[] = 'status = %s';
            $params[] = $status;
        }
        if ($method !== '') {
            $where[] = 'payment_method = %s';
            $params[] = $method;
        }
        if ($from !== '' && preg_match('/^\d{4}-\d{2}-\d{2}/', $from)) {
            $where[] = 'created_at >= %s';
            $params[] = substr($from, 0, 10) . ' 00:00:00';
        }
        if ($to !== '' && preg_match('/^\d{4}-\d{2}-\d{2}/', $to)) {
            $where[] = 'created_at <= %s';
            $params[] = substr($to, 0, 10) . ' 23:59:59';
        }
        if ($search !== '') {
            $like = '%' . $wpdb->esc_like($search) . '%';
            $where[] = '(customer_name LIKE %s OR phone LIKE %s OR order_number LIKE %s OR trx_id LIKE %s)';
            array_push($params, $like, $like, $like, $like);
        }
        $clause = implode(' AND ', $where);
        $total_sql = 'SELECT COUNT(*) FROM ' . self::table() . ' WHERE ' . $clause;
        $total = $params === []
            ? (int) $wpdb->get_var($total_sql)
            : (int) $wpdb->get_var($wpdb->prepare($total_sql, $params));
        $sql = 'SELECT * FROM ' . self::table() . ' WHERE ' . $clause . ' ORDER BY id DESC LIMIT %d OFFSET %d';
        $rows = $wpdb->get_results($wpdb->prepare($sql, array_merge($params, [$per_page, $offset])), ARRAY_A);
        return [
            'orders' => array_map([self::class, 'summary'], is_array($rows) ? $rows : []),
            'total' => $total,
            'page' => $page,
            'perPage' => $per_page,
            'totalPages' => max(1, (int) ceil($total / $per_page)),
        ];
    }

    public static function summary(array $row): array {
        return [
            'id' => (int) $row['id'],
            'number' => $row['order_number'],
            'pageId' => (int) $row['page_id'],
            'status' => $row['status'],
            'name' => $row['customer_name'],
            'phone' => $row['phone'],
            'total' => (float) $row['total'],
            'method' => $row['payment_method'],
            'risk' => $row['risk'],
            'trxId' => $row['trx_id'],
            'trxVerified' => (int) ($row['trx_verified'] ?? 0) === 1,
            'collectAmount' => (float) ($row['collect_amount'] ?? $row['total']),
            'courier' => (string) ($row['courier'] ?? ''),
            'trackingCode' => (string) ($row['tracking_code'] ?? ''),
            'callAttempts' => (int) ($row['call_attempts'] ?? 0),
            'lastCallAt' => (string) ($row['last_call_at'] ?? ''),
            'createdAt' => $row['created_at'],
        ];
    }

    public static function detail(array $row): array {
        $summary = self::summary($row);
        $summary['email'] = $row['email'];
        $summary['division'] = $row['division_name'];
        $summary['district'] = $row['district_name'];
        $summary['upazila'] = $row['upazila_name'];
        $summary['divisionId'] = (string) ($row['division_id'] ?? '');
        $summary['districtId'] = (string) ($row['district_id'] ?? '');
        $summary['upazilaId'] = (string) ($row['upazila_id'] ?? '');
        $summary['address'] = (string) $row['address'];
        $summary['note'] = (string) $row['customer_note'];
        $summary['qty'] = (int) $row['qty'];
        $summary['subtotal'] = (float) $row['subtotal'];
        $summary['shipping'] = (float) $row['shipping'];
        $summary['currency'] = $row['currency'];
        $summary['eventId'] = (string) ($row['event_id'] ?? '');
        $summary['attribution'] = self::decode_attribution($row['attribution'] ?? '');
        $summary['consignmentId'] = (string) ($row['consignment_id'] ?? '');
        $summary['courierStatus'] = (string) ($row['courier_status'] ?? '');
        $summary['language'] = (string) ($row['language'] ?? 'en');
        $summary['fraud'] = \Noksha\Fraud\Blacklist::score((string) $row['phone'], (string) $row['risk']);
        $summary['variant'] = (string) ($row['variant'] ?? '');
        $summary['otpVerified'] = (int) ($row['otp_verified'] ?? 0) === 1;
        $summary['codReceived'] = array_key_exists('cod_received', $row) && $row['cod_received'] !== null
            ? (float) $row['cod_received']
            : null;
        $summary['codSettled'] = (int) ($row['cod_settled'] ?? 0) === 1;
        $summary['codSettledAt'] = (string) ($row['cod_settled_at'] ?? '');
        $summary['codShort'] = (float) ($row['cod_short'] ?? 0);
        $summary['items'] = self::items((int) $row['id']);
        $summary['notes'] = self::notes((int) $row['id']);
        $summary['allowedStatuses'] = self::TRANSITIONS[(string) $row['status']] ?? [];
        $payment = self::payment((int) $row['id']);
        $summary['paymentStatus'] = $payment['status'] ?? '';
        return $summary;
    }

    public static function decode_attribution($raw): array {
        if (is_array($raw)) {
            return $raw;
        }
        if (!is_string($raw) || $raw === '') {
            return [];
        }
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }

    public static function trx_exists(string $trx_id, int $except_id = 0): bool {
        if ($trx_id === '') {
            return false;
        }
        global $wpdb;
        $sql = 'SELECT id FROM ' . self::table() . ' WHERE trx_id = %s AND status <> %s';
        $args = [$trx_id, 'cancelled'];
        if ($except_id > 0) {
            $sql .= ' AND id <> %d';
            $args[] = $except_id;
        }
        $sql .= ' LIMIT 1';
        return (int) $wpdb->get_var($wpdb->prepare($sql, $args)) > 0;
    }

    public static function bulk_status(array $ids, string $status): int {
        if (!in_array($status, self::STATUSES, true) || $ids === []) {
            return 0;
        }
        $ids = array_values(array_unique(array_filter(array_map('intval', $ids))));
        $updated = 0;
        foreach ($ids as $id) {
            $order = self::find($id);
            if (!$order) {
                continue;
            }
            $from = (string) ($order['status'] ?? '');
            if (!self::can_transition($from, $status)) {
                continue;
            }
            self::update($id, ['status' => $status]);
            $updated++;
        }
        return $updated;
    }

    public static function export_rows(string $search, string $status, int $limit = 2000): array {
        $result = self::query([
            'search' => $search,
            'status' => $status,
            'page' => 1,
            'per_page' => max(1, min(5000, $limit)),
        ]);
        $ids = array_map(static fn ($row) => (int) $row['id'], $result['orders']);
        if ($ids === []) {
            return [];
        }
        global $wpdb;
        $placeholders = implode(',', array_fill(0, count($ids), '%d'));
        $rows = $wpdb->get_results(
            $wpdb->prepare('SELECT * FROM ' . self::table() . " WHERE id IN ({$placeholders}) ORDER BY id DESC", $ids),
            ARRAY_A
        );
        return is_array($rows) ? $rows : [];
    }

    public static function validate_customer_fields(array $fields): array|\WP_Error {
        $out = [];
        if (array_key_exists('customer_name', $fields)) {
            $name = sanitize_text_field((string) $fields['customer_name']);
            if ($name === '') {
                return new \WP_Error('noksha_invalid_name', 'Name is required.', ['status' => 400]);
            }
            $out['customer_name'] = $name;
        }
        if (array_key_exists('phone', $fields)) {
            $phone = Phone::normalize((string) $fields['phone']);
            if (Phone::error($phone)) {
                return new \WP_Error('noksha_invalid_phone', 'Invalid phone.', ['status' => 400]);
            }
            $out['phone'] = $phone;
        }
        if (array_key_exists('email', $fields)) {
            $email = sanitize_email((string) $fields['email']);
            $out['email'] = $email;
        }
        foreach (['division_id', 'district_id', 'upazila_id'] as $key) {
            if (array_key_exists($key, $fields)) {
                $out[$key] = sanitize_text_field((string) $fields[$key]);
            }
        }
        foreach (['division_name', 'district_name', 'upazila_name'] as $key) {
            if (array_key_exists($key, $fields)) {
                $out[$key] = sanitize_text_field((string) $fields[$key]);
            }
        }
        if (array_key_exists('address', $fields)) {
            $out['address'] = sanitize_textarea_field((string) $fields['address']);
        }
        return $out;
    }
}
