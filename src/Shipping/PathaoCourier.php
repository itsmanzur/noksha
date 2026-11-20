<?php
/**
 * Pathao merchant order create (token + store required).
 *
 * @package Noksha
 */

namespace Noksha\Shipping;

use Noksha\Options;

final class PathaoCourier implements Courier {
    /** Bangladesh district spellings that differ from Pathao's city and zone names. */
    private const ALIASES = [
        'chattogram' => 'chittagong',
        'cumilla' => 'comilla',
        'barishal' => 'barisal',
        'jashore' => 'jessore',
        'bogura' => 'bogra',
    ];

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
        if ($this->token() === '') {
            return ['error' => 'courier_auth_failed'];
        }
        $settings = Options::settings();
        $address = trim(implode(', ', array_filter([
            (string) ($order['address'] ?? ''),
            (string) ($order['upazila_name'] ?? ''),
            (string) ($order['district_name'] ?? ''),
        ])));
        $names = [];
        foreach (\Noksha\Orders\Repository::items((int) ($order['id'] ?? 0)) as $item) {
            $names[] = (string) ($item['name'] ?? '');
        }
        $description = trim(implode(', ', array_filter($names)));

        $body = [
            'store_id' => (int) $settings['couriers']['pathao']['store_id'],
            'merchant_order_id' => (string) ($order['order_number'] ?? ''),
            'recipient_name' => (string) ($order['customer_name'] ?? ''),
            'recipient_phone' => (string) ($order['phone'] ?? ''),
            'recipient_address' => $address !== '' ? $address : 'Dhaka',
            'delivery_type' => 48,
            'item_type' => 2,
            'item_quantity' => max(1, (int) ($order['qty'] ?? 1)),
            'item_weight' => 0.5,
            'amount_to_collect' => (int) round((float) ($order['collect_amount'] ?? $order['total'] ?? 0)),
            'item_description' => noksha_clip($description !== '' ? $description : (string) ($order['order_number'] ?? 'Noksha order'), 120),
        ];
        // Send the real city and zone; without a match Pathao reads them from the address.
        [$city, $zone] = $this->location($order);
        if ($city !== null) {
            $body['recipient_city'] = $city;
            if ($zone !== null) {
                $body['recipient_zone'] = $zone;
            }
        }

        $result = $this->request('POST', '/aladdin/api/v1/orders', $body);
        $data = $result['data'];
        $consignment = is_array($data) ? (string) ($data['data']['consignment_id'] ?? $data['data']['order_id'] ?? '') : '';
        if ($consignment === '') {
            return ['error' => 'courier_failed', 'raw' => noksha_clip((string) $result['raw'], 2000)];
        }
        return [
            'ok' => true,
            'consignment_id' => $consignment,
            'tracking_code' => $consignment,
            'raw' => noksha_clip((string) $result['raw'], 5000),
        ];
    }

    /** @return array{0:int|null,1:int|null} Pathao city and zone ids for the order's district and upazila. */
    private function location(array $order): array {
        $city = $this->match($this->names('/aladdin/api/v1/city-list', 'city'), (string) ($order['district_name'] ?? ''));
        if ($city === null) {
            return [null, null];
        }
        $zones = $this->names('/aladdin/api/v1/cities/' . $city . '/zone-list', 'zone');
        return [$city, $this->match($zones, (string) ($order['upazila_name'] ?? ''))];
    }

    /** @return array<int,string> Pathao id => name, cached for a day. */
    private function names(string $path, string $kind): array {
        $key = 'noksha_pathao_' . substr(md5($this->base() . $path), 0, 16);
        $cached = get_transient($key);
        if (is_array($cached) && $cached !== []) {
            return $cached;
        }
        $result = $this->request('GET', $path);
        $rows = is_array($result['data']) ? ($result['data']['data']['data'] ?? []) : [];
        $list = [];
        foreach ((array) $rows as $row) {
            if (is_array($row) && !empty($row[$kind . '_id'])) {
                $list[(int) $row[$kind . '_id']] = (string) ($row[$kind . '_name'] ?? '');
            }
        }
        if ($list !== []) {
            set_transient($key, $list, DAY_IN_SECONDS);
        }
        return $list;
    }

    /** @param array<int,string> $list */
    private function match(array $list, string $wanted): ?int {
        $wanted = $this->normalize($wanted);
        if ($wanted === '' || $list === []) {
            return null;
        }
        $loose = null;
        foreach ($list as $id => $name) {
            $name = $this->normalize($name);
            if ($name === $wanted) {
                return (int) $id;
            }
            if ($loose === null && strlen($name) >= 4 && strlen($wanted) >= 4 && (str_contains($name, $wanted) || str_contains($wanted, $name))) {
                $loose = (int) $id;
            }
        }
        return $loose;
    }

    private function normalize(string $value): string {
        $value = preg_replace('/[^a-z0-9]+/', '', strtolower($value)) ?? '';
        $value = preg_replace('/(thana|upazila|sadar)$/', '', $value) ?? $value;
        return self::ALIASES[$value] ?? $value;
    }

    private function base(): string {
        return !empty(Options::settings()['sandbox']) ? 'https://courier-api-sandbox.pathao.com' : 'https://api-hermes.pathao.com';
    }

    /** @return array{code:int,raw:string,data:mixed} */
    private function request(string $method, string $path, ?array $body = null, bool $retry = true): array {
        $token = $this->token();
        if ($token === '') {
            return ['code' => 0, 'raw' => 'auth failed', 'data' => null];
        }
        $args = [
            'method' => $method,
            'timeout' => 20,
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ],
        ];
        if ($body !== null) {
            $args['body'] = wp_json_encode($body);
        }
        $response = wp_remote_request($this->base() . $path, $args);
        if (is_wp_error($response)) {
            return ['code' => 0, 'raw' => $response->get_error_message(), 'data' => null];
        }
        $code = (int) wp_remote_retrieve_response_code($response);
        if ($code === 401 && $retry) {
            // Token revoked or expired early: drop it and try once with a fresh one.
            delete_transient($this->token_key());
            return $this->request($method, $path, $body, false);
        }
        $raw = (string) wp_remote_retrieve_body($response);
        return ['code' => $code, 'raw' => $raw, 'data' => json_decode($raw, true)];
    }

    /** Sandbox and live tokens, and different accounts, never share a cached token. */
    private function token_key(): string {
        $secrets = Options::secrets();
        return 'noksha_pathao_token_' . substr(md5($this->base() . (string) ($secrets['pathao_client_id'] ?? '') . (string) ($secrets['pathao_username'] ?? '')), 0, 12);
    }

    private function token(): string {
        $cached = get_transient($this->token_key());
        if (is_string($cached) && $cached !== '') {
            return $cached;
        }
        $secrets = Options::secrets();
        $response = wp_remote_post($this->base() . '/aladdin/api/v1/issue-token', [
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
        set_transient($this->token_key(), $token, $expires);
        return $token;
    }
}
