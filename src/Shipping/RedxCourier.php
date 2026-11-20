<?php
/**
 * RedX parcel create API.
 *
 * @package Noksha
 */

namespace Noksha\Shipping;

use Noksha\Options;

final class RedxCourier implements Courier {
    public function id(): string {
        return 'redx';
    }

    public function ready(): bool {
        $secrets = Options::secrets();
        $settings = Options::settings();
        return !empty($settings['couriers']['redx']['enabled'])
            && ($secrets['redx_api_key'] ?? '') !== '';
    }

    public function book(array $order): array {
        if (!$this->ready()) {
            return ['error' => 'courier_not_ready'];
        }
        $secrets = Options::secrets();
        $settings = Options::settings();
        $sandbox = !empty($settings['sandbox']);
        $base = $sandbox ? 'https://sandbox.redx.com.bd/v1.0.0-beta' : 'https://openapi.redx.com.bd/v1.0.0-beta';
        $address = trim(implode(', ', array_filter([
            (string) ($order['address'] ?? ''),
            (string) ($order['upazila_name'] ?? ''),
            (string) ($order['district_name'] ?? ''),
        ])));
        $area = $this->area($order, $base);
        if ($area === null) {
            return [
                'error' => 'courier_area_unmatched',
                'raw' => sprintf('No RedX delivery area matched "%s, %s".', (string) ($order['upazila_name'] ?? ''), (string) ($order['district_name'] ?? '')),
            ];
        }
        $body = [
            'customer_name' => (string) ($order['customer_name'] ?? ''),
            'customer_phone' => (string) ($order['phone'] ?? ''),
            'delivery_area' => $area['name'],
            'delivery_area_id' => $area['id'],
            'customer_address' => $address !== '' ? $address : 'Dhaka',
            'merchant_invoice_id' => (string) ($order['order_number'] ?? ''),
            'cash_collection_amount' => (int) round((float) ($order['collect_amount'] ?? $order['total'] ?? 0)),
            'parcel_weight' => 500,
            'instruction' => (string) ($order['customer_note'] ?? ''),
            'value' => (int) round((float) ($order['total'] ?? 0)),
            'pickup_store_id' => (int) ($settings['couriers']['redx']['store_id'] ?? 0),
        ];
        $response = wp_remote_post($base . '/parcel', [
            'timeout' => 20,
            'headers' => [
                'API-ACCESS-TOKEN' => 'Bearer ' . $secrets['redx_api_key'],
                'Content-Type' => 'application/json',
            ],
            'body' => wp_json_encode($body),
        ]);
        if (is_wp_error($response)) {
            return ['error' => 'courier_failed', 'raw' => $response->get_error_message()];
        }
        $raw = (string) wp_remote_retrieve_body($response);
        $data = json_decode($raw, true);
        $tracking = (string) ($data['tracking_id'] ?? $data['data']['tracking_id'] ?? '');
        if ($tracking === '') {
            return ['error' => 'courier_failed', 'raw' => noksha_clip($raw, 2000)];
        }
        return [
            'ok' => true,
            'consignment_id' => $tracking,
            'tracking_code' => $tracking,
            'raw' => noksha_clip($raw, 5000),
        ];
    }

    /** @return array{id:int,name:string}|null RedX delivery area for the order's upazila. */
    private function area(array $order, string $base): ?array {
        $district = (string) ($order['district_name'] ?? '');
        if ($district === '') {
            return null;
        }
        $key = 'noksha_redx_areas_' . substr(md5($base . strtolower($district)), 0, 16);
        $areas = get_transient($key);
        if (!is_array($areas) || $areas === []) {
            $response = wp_remote_get($base . '/areas?' . http_build_query(['district_name' => $district]), [
                'timeout' => 20,
                'headers' => ['API-ACCESS-TOKEN' => 'Bearer ' . (string) Options::secrets()['redx_api_key']],
            ]);
            if (is_wp_error($response)) {
                return null;
            }
            $data = json_decode((string) wp_remote_retrieve_body($response), true);
            $areas = [];
            foreach ((array) ($data['areas'] ?? []) as $row) {
                if (is_array($row) && !empty($row['id'])) {
                    $areas[(int) $row['id']] = (string) ($row['name'] ?? '');
                }
            }
            if ($areas === []) {
                return null;
            }
            set_transient($key, $areas, DAY_IN_SECONDS);
        }
        $id = NameMatch::find($areas, (string) ($order['upazila_name'] ?? ''));
        return $id === null ? null : ['id' => $id, 'name' => (string) $areas[$id]];
    }
}
