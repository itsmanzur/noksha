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

        $url = 'https://graph.facebook.com/v19.0/' . rawurlencode($pixel) . '/events?access_token=' . rawurlencode($token);
        wp_remote_post($url, [
            'timeout' => 8,
            'headers' => ['Content-Type' => 'application/json'],
            'body' => wp_json_encode($payload),
            'blocking' => false,
        ]);
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
