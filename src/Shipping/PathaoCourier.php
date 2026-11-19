<?php
/**
 * Pathao merchant order create (token + store required).
 *
 * @package Noksha
 */

namespace Noksha\Shipping;

use Noksha\Options;

final class PathaoCourier implements Courier {
    public function id(): string {
        return 'pathao';
    }

    public function ready(): bool {
        $secrets = Options::secrets();
        $settings = Options::settings();
        return !empty($settings['couriers']['pathao']['enabled'])
            && ($secrets['pathao_client_id'] ?? '') !== ''
            && ($secrets['pathao_client_secret'] ?? '') !== ''
            && ($secrets['pathao_username'] ?? '') !== ''
            && ($secrets['pathao_password'] ?? '') !== ''
            && ($settings['couriers']['pathao']['store_id'] ?? '') !== '';
    }

    public function book(array $order): array {
        if (!$this->ready()) {
            return ['error' => 'courier_not_ready'];
        }
        $token = $this->token();
        if ($token === '') {
            return ['error' => 'courier_auth_failed'];
        }
        $settings = Options::settings();
        $sandbox = !empty($settings['sandbox']);
        $base = $sandbox ? 'https://courier-api-sandbox.pathao.com' : 'https://api-hermes.pathao.com';
        $address = trim(implode(', ', array_filter([
            (string) ($order['address'] ?? ''),
            (string) ($order['upazila_name'] ?? ''),
            (string) ($order['district_name'] ?? ''),
        ])));
        $body = [
            'store_id' => (int) $settings['couriers']['pathao']['store_id'],
            'merchant_order_id' => (string) ($order['order_number'] ?? ''),
            'recipient_name' => (string) ($order['customer_name'] ?? ''),
            'recipient_phone' => (string) ($order['phone'] ?? ''),
            'recipient_address' => $address !== '' ? $address : 'Dhaka',
            'recipient_city' => 1,
            'recipient_zone' => 1,
            'delivery_type' => 48,
            'item_type' => 2,
            'item_quantity' => max(1, (int) ($order['qty'] ?? 1)),
            'item_weight' => 0.5,
            'amount_to_collect' => (int) round((float) ($order['collect_amount'] ?? $order['total'] ?? 0)),
            'item_description' => (string) ($order['order_number'] ?? 'Noksha order'),
        ];
        $response = wp_remote_post($base . '/aladdin/api/v1/orders', [
            'timeout' => 20,
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ],
            'body' => wp_json_encode($body),
        ]);
        if (is_wp_error($response)) {
            return ['error' => 'courier_failed', 'raw' => $response->get_error_message()];
        }
        $raw = (string) wp_remote_retrieve_body($response);
        $data = json_decode($raw, true);
        $consignment = (string) ($data['data']['consignment_id'] ?? $data['data']['order_id'] ?? '');
        if ($consignment === '') {
            return ['error' => 'courier_failed', 'raw' => noksha_clip($raw, 2000)];
        }
        return [
            'ok' => true,
            'consignment_id' => $consignment,
            'tracking_code' => $consignment,
            'raw' => noksha_clip($raw, 5000),
        ];
    }

    private function token(): string {
        $cached = get_transient('noksha_pathao_token');
        if (is_string($cached) && $cached !== '') {
            return $cached;
        }
        $secrets = Options::secrets();
        $settings = Options::settings();
        $sandbox = !empty($settings['sandbox']);
        $base = $sandbox ? 'https://courier-api-sandbox.pathao.com' : 'https://api-hermes.pathao.com';
        $response = wp_remote_post($base . '/aladdin/api/v1/issue-token', [
            'timeout' => 20,
            'headers' => ['Content-Type' => 'application/json', 'Accept' => 'application/json'],
            'body' => wp_json_encode([
                'client_id' => $secrets['pathao_client_id'],
                'client_secret' => $secrets['pathao_client_secret'],
                'username' => $secrets['pathao_username'],
                'password' => $secrets['pathao_password'],
                'grant_type' => 'password',
            ]),
        ]);
        if (is_wp_error($response)) {
            return '';
        }
        $data = json_decode((string) wp_remote_retrieve_body($response), true);
        $token = is_array($data) ? (string) ($data['access_token'] ?? '') : '';
        if ($token === '') {
            return '';
        }
        $expires = max(60, (int) ($data['expires_in'] ?? 3600) - 60);
        set_transient('noksha_pathao_token', $token, $expires);
        return $token;
    }
}
