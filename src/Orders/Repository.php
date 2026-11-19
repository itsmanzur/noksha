<?php
/**
 * Order storage.
 *
 * @package Noksha
 */

namespace Noksha\Orders;

final class Repository {
    public const STATUSES = [
        'pending',
        'awaiting_payment',
        'confirmed',
        'paid',
        'shipped',
        'delivered',
        'returned',
        'cancelled',
    ];

    public const COUNTABLE = ['awaiting_payment', 'confirmed', 'paid', 'shipped', 'delivered'];

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

    public static function update(int $id, array $fields): void {
        global $wpdb;
        $fields['updated_at'] = current_time('mysql');
        $wpdb->update(self::table(), $fields, ['id' => $id]);
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

    public static function query(string $search, string $status, int $limit = 50): array {
        global $wpdb;
        $where = ['1=1'];
        $args = [];
        if ($status !== '' && in_array($status, self::STATUSES, true)) {
            $where[] = 'status = %s';
            $args[] = $status;
        }
        if ($search !== '') {
            $like = '%' . $wpdb->esc_like($search) . '%';
            $where[] = '(customer_name LIKE %s OR phone LIKE %s OR order_number LIKE %s OR trx_id LIKE %s)';
            array_push($args, $like, $like, $like, $like);
        }
        $sql = 'SELECT * FROM ' . self::table() . ' WHERE ' . implode(' AND ', $where) . ' ORDER BY id DESC LIMIT %d';
        $args[] = $limit;
        $rows = $wpdb->get_results($wpdb->prepare($sql, $args), ARRAY_A);
        $total_sql = 'SELECT COUNT(*) FROM ' . self::table() . ' WHERE ' . implode(' AND ', $where);
        $total_args = array_slice($args, 0, -1);
        $total = $total_args === []
            ? (int) $wpdb->get_var($total_sql)
            : (int) $wpdb->get_var($wpdb->prepare($total_sql, $total_args));
        return [
            'orders' => array_map([self::class, 'summary'], is_array($rows) ? $rows : []),
            'total' => $total,
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
            'createdAt' => $row['created_at'],
        ];
    }

    public static function detail(array $row): array {
        $summary = self::summary($row);
        $summary['email'] = $row['email'];
        $summary['division'] = $row['division_name'];
        $summary['district'] = $row['district_name'];
        $summary['upazila'] = $row['upazila_name'];
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
        $summary['items'] = self::items((int) $row['id']);
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
        global $wpdb;
        $ids = array_values(array_unique(array_filter(array_map('intval', $ids))));
        if ($ids === []) {
            return 0;
        }
        $placeholders = implode(',', array_fill(0, count($ids), '%d'));
        $now = current_time('mysql');
        $sql = 'UPDATE ' . self::table() . " SET status = %s, updated_at = %s WHERE id IN ({$placeholders})";
        $wpdb->query($wpdb->prepare($sql, array_merge([$status, $now], $ids)));
        return count($ids);
    }

    public static function export_rows(string $search, string $status, int $limit = 2000): array {
        global $wpdb;
        $where = ['1=1'];
        $args = [];
        if ($status !== '' && in_array($status, self::STATUSES, true)) {
            $where[] = 'status = %s';
            $args[] = $status;
        }
        if ($search !== '') {
            $like = '%' . $wpdb->esc_like($search) . '%';
            $where[] = '(customer_name LIKE %s OR phone LIKE %s OR order_number LIKE %s OR trx_id LIKE %s)';
            array_push($args, $like, $like, $like, $like);
        }
        $sql = 'SELECT * FROM ' . self::table() . ' WHERE ' . implode(' AND ', $where) . ' ORDER BY id DESC LIMIT %d';
        $args[] = max(1, min(5000, $limit));
        $rows = $wpdb->get_results($wpdb->prepare($sql, $args), ARRAY_A);
        return is_array($rows) ? $rows : [];
    }
}
