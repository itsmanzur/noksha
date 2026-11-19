<?php
/**
 * Steadfast / Packzy create-order API.
 *
 * @package Noksha
 */

namespace Noksha\Shipping;

use Noksha\Options;

final class SteadfastCourier implements Courier {
    public function id(): string {
        return 'steadfast';
    }

    public function ready(): bool {
        $secrets = Options::secrets();
        $settings = Options::settings();
        return !empty($settings['couriers']['steadfast']['enabled'])
            && ($secrets['steadfast_api_key'] ?? '') !== ''
            && ($secrets['steadfast_secret_key'] ?? '') !== '';
    }

    public function book(array $order): array {
        if (!$this->ready()) {
            return ['error' => 'courier_not_ready'];
        }
        $secrets = Options::secrets();
        $address = trim(implode(', ', array_filter([
            (string) ($order['address'] ?? ''),
            (string) ($order['upazila_name'] ?? ''),
            (string) ($order['district_name'] ?? ''),
            (string) ($order['division_name'] ?? ''),
        ])));
        $body = [
            'invoice' => (string) ($order['order_number'] ?? ''),
            'recipient_name' => (string) ($order['customer_name'] ?? ''),
            'recipient_phone' => (string) ($order['phone'] ?? ''),
            'recipient_address' => $address !== '' ? $address : 'Bangladesh',
            'cod_amount' => (float) ($order['collect_amount'] ?? $order['total'] ?? 0),
            'note' => (string) ($order['customer_note'] ?? ''),
        ];
        $response = wp_remote_post('https://portal.packzy.com/api/v1/create_order', [
            'timeout' => 20,
            'headers' => [
                'Api-Key' => (string) $secrets['steadfast_api_key'],
                'Secret-Key' => (string) $secrets['steadfast_secret_key'],
                'Content-Type' => 'application/json',
            ],
            'body' => wp_json_encode($body),
        ]);
        if (is_wp_error($response)) {
            return ['error' => 'courier_failed', 'raw' => $response->get_error_message()];
        }
        $raw = (string) wp_remote_retrieve_body($response);
        $data = json_decode($raw, true);
        if (!is_array($data) || empty($data['consignment']['consignment_id'])) {
            return ['error' => 'courier_failed', 'raw' => noksha_clip($raw, 2000)];
        }
        $consignment = $data['consignment'];
        return [
            'ok' => true,
            'consignment_id' => (string) $consignment['consignment_id'],
            'tracking_code' => (string) ($consignment['tracking_code'] ?? $consignment['consignment_id']),
            'raw' => noksha_clip($raw, 5000),
        ];
    }
}
