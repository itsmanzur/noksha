<?php
/**
 * Meta Conversions API Purchase events.
 *
 * @package Noksha
 */

namespace Noksha\Analytics;

use Noksha\Options;

final class Capi {
    public static function purchase(array $order, array $offer = []): void {
        $settings = Options::settings();
        $pixel = preg_replace('/\D+/', '', (string) ($settings['pixels']['meta'] ?? '')) ?? '';
        $token = (string) (Options::secrets()['meta_capi_token'] ?? '');
        if ($pixel === '' || $token === '') {
            return;
        }

        $event_id = (string) ($order['event_id'] ?? '');
        if ($event_id === '') {
            $event_id = 'nk_' . (string) ($order['order_number'] ?? $order['id'] ?? wp_generate_uuid4());
        }

        $phone = preg_replace('/\D+/', '', (string) ($order['phone'] ?? '')) ?? '';
        if (str_starts_with($phone, '0') && strlen($phone) === 11) {
            $phone = '880' . substr($phone, 1);
        }
        $user = [];
        if ($phone !== '') {
            $user['ph'] = [hash('sha256', $phone)];
        }
        $email = strtolower(trim((string) ($order['email'] ?? '')));
        if ($email !== '' && is_email($email)) {
            $user['em'] = [hash('sha256', $email)];
        }
        $attr = self::attribution($order);
        $user['country'] = [hash('sha256', 'bd')];
        if ($phone !== '') {
            $user['external_id'] = [hash('sha256', $phone)];
        }
        $parts = preg_split('/\s+/u', mb_strtolower(trim((string) ($order['customer_name'] ?? '')))) ?: [];
        $parts = array_values(array_filter($parts, static fn ($part) => $part !== ''));
        if ($parts !== []) {
            $user['fn'] = [hash('sha256', $parts[0])];
            if (count($parts) > 1) {
                $user['ln'] = [hash('sha256', $parts[count($parts) - 1])];
            }
        }
        foreach (['ct' => 'district_name', 'st' => 'division_name'] as $key => $column) {
            $value = preg_replace('/[^\p{L}\p{N}]+/u', '', mb_strtolower((string) ($order[$column] ?? ''))) ?? '';
            if ($value !== '') {
                $user[$key] = [hash('sha256', $value)];
            }
        }
        if (filter_var((string) ($attr['cip'] ?? ''), FILTER_VALIDATE_IP)) {
            $user['client_ip_address'] = (string) $attr['cip'];
        }
        if (($attr['cua'] ?? '') !== '') {
            $user['client_user_agent'] = (string) $attr['cua'];
        }
        if (($attr['fbp'] ?? '') !== '') {
            $user['fbp'] = $attr['fbp'];
        }
        if (($attr['fbc'] ?? '') !== '') {
            $user['fbc'] = $attr['fbc'];
        }

        $custom = [
            'currency' => 'BDT',
            'value' => (float) ($order['total'] ?? 0),
            'content_type' => 'product',
            'order_id' => (string) ($order['order_number'] ?? ''),
        ];
        $name = (string) ($offer['productName'] ?? '');
        if ($name !== '') {
            $custom['content_name'] = $name;
        }
        $items = \Noksha\Orders\Repository::items((int) ($order['id'] ?? 0));
        if ($items !== []) {
            $custom['contents'] = array_map(static function (array $item) use ($order): array {
                return [
                    'id' => (string) ($order['page_id'] ?? ''),
                    'quantity' => (int) ($item['qty'] ?? 1),
                    'item_price' => (float) ($item['price'] ?? 0),
                ];
            }, $items);
            $custom['num_items'] = (int) ($order['qty'] ?? array_sum(array_map(static fn ($item) => (int) ($item['qty'] ?? 1), $items)));
        } elseif ($name !== '') {
            $custom['contents'] = [[
                'id' => (string) ($order['page_id'] ?? ''),
                'quantity' => (int) ($order['qty'] ?? 1),
                'item_price' => (float) ($order['subtotal'] ?? 0) / max(1, (int) ($order['qty'] ?? 1)),
            ]];
            $custom['num_items'] = (int) ($order['qty'] ?? 1);
        }

        $payload = [
            'data' => [[
                'event_name' => 'Purchase',
                'event_time' => time(),
                'event_id' => $event_id,
                'event_source_url' => get_permalink((int) ($order['page_id'] ?? 0)) ?: home_url('/'),
                'action_source' => 'website',
                'user_data' => $user,
                'custom_data' => $custom,
            ]],
        ];

        // With a test event code the call is synchronous and its result lands in the order notes.
        $test = preg_replace('/[^A-Za-z0-9]/', '', (string) ($settings['pixels']['meta_test'] ?? '')) ?? '';
        if ($test !== '') {
            $payload['test_event_code'] = $test;
        }

        $url = 'https://graph.facebook.com/v23.0/' . rawurlencode($pixel) . '/events?access_token=' . rawurlencode($token);
        $response = wp_remote_post($url, [
            'timeout' => $test !== '' ? 10 : 8,
            'headers' => ['Content-Type' => 'application/json'],
            'body' => wp_json_encode($payload),
            'blocking' => $test !== '',
        ]);
        if ($test !== '' && !empty($order['id'])) {
            if (is_wp_error($response)) {
                $note = 'Meta CAPI test: ' . $response->get_error_message();
            } else {
                $code = (int) wp_remote_retrieve_response_code($response);
                $body = json_decode((string) wp_remote_retrieve_body($response), true);
                $note = $code === 200
                    ? 'Meta CAPI test: Purchase accepted (events received: ' . (int) ($body['events_received'] ?? 0) . ').'
                    : 'Meta CAPI test failed (' . $code . '): ' . noksha_clip((string) ($body['error']['message'] ?? 'unknown error'), 200);
            }
            \Noksha\Orders\Repository::add_note((int) $order['id'], $note);
        }
    }

    private static function attribution(array $order): array {
        $raw = $order['attribution'] ?? '';
        if (is_array($raw)) {
            return $raw;
        }
        if (!is_string($raw) || $raw === '') {
            return [];
        }
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }
}
