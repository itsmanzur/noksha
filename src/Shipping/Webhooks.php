<?php
/**
 * Public courier status webhooks (Steadfast / Pathao / RedX).
 *
 * @package Noksha
 */

namespace Noksha\Shipping;

use Noksha\Options;
use Noksha\Orders\Repository as Orders;

final class Webhooks {
    public static function handle(string $courier, \WP_REST_Request $request) {
        $courier = sanitize_key($courier);
        if (!in_array($courier, ['steadfast', 'pathao', 'redx'], true)) {
            return new \WP_Error('noksha_unknown_courier', 'Unknown courier.', ['status' => 404]);
        }
        if (!self::authorized($courier, $request)) {
            return new \WP_Error('noksha_forbidden', 'Invalid webhook secret.', ['status' => 403]);
        }

        $payload = $request->get_json_params();
        if (!is_array($payload) || $payload === []) {
            $payload = $request->get_params();
        }
        if (!is_array($payload)) {
            $payload = [];
        }

        $parsed = match ($courier) {
            'steadfast' => self::parse_steadfast($payload),
            'pathao' => self::parse_pathao($payload),
            'redx' => self::parse_redx($payload),
            default => null,
        };
        if ($parsed === null) {
            return new \WP_Error('noksha_bad_webhook', 'Unrecognized webhook payload.', ['status' => 400]);
        }

        $order = self::find_order($courier, $parsed);
        if (!$order) {
            return ['ok' => true, 'matched' => false];
        }

        $fields = [
            'courier_status' => $parsed['courier_status'],
        ];
        if ($parsed['tracking_code'] !== '') {
            $fields['tracking_code'] = $parsed['tracking_code'];
        }
        if ($parsed['consignment_id'] !== '' && ($order['consignment_id'] ?? '') === '') {
            $fields['consignment_id'] = $parsed['consignment_id'];
        }
        if ($parsed['order_status'] !== null) {
            $current = (string) ($order['status'] ?? '');
            if (!in_array($current, ['cancelled'], true)) {
                if ($parsed['order_status'] === 'returned' || !in_array($current, ['delivered', 'returned'], true)) {
                    $fields['status'] = $parsed['order_status'];
                }
            }
        }

        Orders::update((int) $order['id'], $fields);
        return [
            'ok' => true,
            'matched' => true,
            'orderId' => (int) $order['id'],
            'status' => $fields['status'] ?? $order['status'],
            'courierStatus' => $parsed['courier_status'],
        ];
    }

    private static function authorized(string $courier, \WP_REST_Request $request): bool {
        unset($courier);
        $secrets = Options::secrets();
        $expected = (string) ($secrets['courier_webhook_secret'] ?? '');
        if ($expected === '') {
            return false;
        }
        $got = (string) ($request->get_header('x-noksha-webhook-secret') ?: '');
        return $got !== '' && hash_equals($expected, $got);
    }

    /**
     * @return array{consignment_id:string,tracking_code:string,invoice:string,courier_status:string,order_status:?string}|null
     */
    private static function parse_steadfast(array $payload): ?array {
        $consignment = (string) ($payload['consignment_id']
            ?? $payload['consignment']['consignment_id']
            ?? $payload['data']['consignment_id']
            ?? '');
        $tracking = (string) ($payload['tracking_code']
            ?? $payload['consignment']['tracking_code']
            ?? $payload['data']['tracking_code']
            ?? '');
        $invoice = (string) ($payload['invoice']
            ?? $payload['consignment']['invoice']
            ?? $payload['data']['invoice']
            ?? '');
        $raw = strtolower((string) ($payload['status']
            ?? $payload['delivery_status']
            ?? $payload['notification_type']
            ?? $payload['tracking_message']
            ?? $payload['consignment']['status']
            ?? ''));
        if ($consignment === '' && $tracking === '' && $invoice === '') {
            return null;
        }
        return [
            'consignment_id' => $consignment,
            'tracking_code' => $tracking,
            'invoice' => $invoice,
            'courier_status' => $raw !== '' ? noksha_clip($raw, 32) : 'updated',
            'order_status' => self::map_status($raw),
        ];
    }

    /**
     * @return array{consignment_id:string,tracking_code:string,invoice:string,courier_status:string,order_status:?string}|null
     */
    private static function parse_pathao(array $payload): ?array {
        $data = is_array($payload['data'] ?? null) ? $payload['data'] : $payload;
        $consignment = (string) ($data['consignment_id'] ?? $data['id'] ?? '');
        $tracking = (string) ($data['tracking_code'] ?? $data['consignment_id'] ?? '');
        $invoice = (string) ($data['merchant_order_id'] ?? $data['store_order_id'] ?? $data['invoice'] ?? '');
        $raw = strtolower((string) ($data['order_status'] ?? $data['status'] ?? $payload['event'] ?? ''));
        if ($consignment === '' && $tracking === '' && $invoice === '') {
            return null;
        }
        return [
            'consignment_id' => $consignment,
            'tracking_code' => $tracking,
            'invoice' => $invoice,
            'courier_status' => $raw !== '' ? noksha_clip($raw, 32) : 'updated',
            'order_status' => self::map_status($raw),
        ];
    }

    /**
     * @return array{consignment_id:string,tracking_code:string,invoice:string,courier_status:string,order_status:?string}|null
     */
    private static function parse_redx(array $payload): ?array {
        $data = is_array($payload['parcel'] ?? null) ? $payload['parcel'] : $payload;
        $consignment = (string) ($data['tracking_id'] ?? $data['id'] ?? $payload['tracking_id'] ?? '');
        $tracking = (string) ($data['tracking_id'] ?? $payload['tracking_id'] ?? $consignment);
        $invoice = (string) ($data['merchant_invoice_id'] ?? $data['invoice'] ?? $payload['invoice'] ?? '');
        $raw = strtolower((string) ($data['status'] ?? $payload['status'] ?? $payload['parcel_status'] ?? ''));
        if ($consignment === '' && $tracking === '' && $invoice === '') {
            return null;
        }
        return [
            'consignment_id' => $consignment,
            'tracking_code' => $tracking,
            'invoice' => $invoice,
            'courier_status' => $raw !== '' ? noksha_clip($raw, 32) : 'updated',
            'order_status' => self::map_status($raw),
        ];
    }

    private static function map_status(string $raw): ?string {
        $raw = strtolower(str_replace([' ', '-'], '_', $raw));
        if ($raw === '') {
            return null;
        }
        if (preg_match('/deliver|completed|success|handed_over/', $raw)) {
            return 'delivered';
        }
        if (preg_match('/return|rto|failed_delivery|undeliver/', $raw)) {
            return 'returned';
        }
        if (preg_match('/cancel/', $raw)) {
            return null;
        }
        if (preg_match('/ship|transit|pickup|picked|hold|in_review|pending|booked|dispatched|out_for/', $raw)) {
            return 'shipped';
        }
        return null;
    }

    private static function find_order(string $courier, array $parsed): ?array {
        global $wpdb;
        $table = Orders::table();
        if ($parsed['consignment_id'] !== '') {
            $row = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM {$table} WHERE courier = %s AND consignment_id = %s ORDER BY id DESC LIMIT 1",
                $courier,
                $parsed['consignment_id']
            ), ARRAY_A);
            if (is_array($row)) {
                return $row;
            }
        }
        if ($parsed['tracking_code'] !== '') {
            $row = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM {$table} WHERE tracking_code = %s ORDER BY id DESC LIMIT 1",
                $parsed['tracking_code']
            ), ARRAY_A);
            if (is_array($row)) {
                return $row;
            }
            $row = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM {$table} WHERE consignment_id = %s ORDER BY id DESC LIMIT 1",
                $parsed['tracking_code']
            ), ARRAY_A);
            if (is_array($row)) {
                return $row;
            }
        }
        if ($parsed['invoice'] !== '') {
            return Orders::find_by_number($parsed['invoice']);
        }
        return null;
    }
}
