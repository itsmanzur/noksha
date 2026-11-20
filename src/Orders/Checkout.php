<?php
/**
 * Validates a public order and starts the chosen gateway.
 *
 * @package Noksha
 */

namespace Noksha\Orders;

use Noksha\Analytics\Capi;
use Noksha\Analytics\Tracker;
use Noksha\Fraud\Blacklist;
use Noksha\I18n\Catalog;
use Noksha\Leads\Repository as Leads;
use Noksha\Notify\Otp;
use Noksha\Notify\Sms;
use Noksha\Pages\PostType;
use Noksha\Pages\Renderer;
use Noksha\Pages\Repository as Pages;
use Noksha\Payments\Manager;
use Noksha\Payments\WalletVerifier;
use Noksha\Support\RateLimit;
use Noksha\Region\Geo;
use Noksha\Region\Phone;

final class Checkout {
    public function place(array $input) {
        $lang = 'en';
        if (RateLimit::hit('checkout')) {
            return $this->error('rate', $lang, 429);
        }
        if (!empty($input['company_website'])) {
            return $this->error('invalid_payment', $lang, 400);
        }
        if (!\Noksha\Support\PublicNonce::verify((string) ($input['nonce'] ?? ''))) {
            return $this->error('nonce', $lang, 403);
        }

        $page_id = (int) ($input['page_id'] ?? 0);
        $post = get_post($page_id);
        if (!$post || $post->post_type !== PostType::TYPE || $post->post_status !== 'publish') {
            return $this->error('page_closed', $lang, 409);
        }
        $doc = Pages::document($page_id);
        $lang = $doc['language'];
        $fields = $doc['checkout']['fields'];

        $name = sanitize_text_field((string) ($input['name'] ?? ''));
        if ($name === '') {
            return $this->error('invalid_name', $lang, 400);
        }
        $phone = Phone::normalize((string) ($input['phone'] ?? ''));
        if (Phone::error($phone)) {
            return $this->error('invalid_phone', $lang, 400);
        }
        if (Blacklist::has($phone)) {
            return $this->error('invalid_phone', $lang, 403);
        }
        $limits = RateLimit::limits();
        if (RateLimit::hit_phone('phone_checkout', $phone, (int) $limits['phone_checkout'])) {
            return $this->error('rate', $lang, 429);
        }

        $email = sanitize_email((string) ($input['email'] ?? ''));
        if (!empty($fields['email']['enabled']) && !empty($fields['email']['required']) && $email === '') {
            return $this->error('invalid_email', $lang, 400);
        }
        if ($email !== '' && !is_email($email)) {
            return $this->error('invalid_email', $lang, 400);
        }

        $geo = [
            'division_id' => '',
            'division_name' => '',
            'district_id' => '',
            'district_name' => '',
            'upazila_id' => '',
            'upazila_name' => '',
        ];
        $needs_geo = !empty($fields['division']['enabled']) || !empty($fields['district']['enabled']);
        if ($needs_geo) {
            $resolved = Geo::resolve(
                sanitize_text_field((string) ($input['division_id'] ?? '')),
                sanitize_text_field((string) ($input['district_id'] ?? '')),
                sanitize_text_field((string) ($input['upazila_id'] ?? '')),
                !empty($fields['upazila']['enabled']) && !empty($fields['upazila']['required'])
            );
            if ($resolved === null) {
                return $this->error('invalid_geo', $lang, 400);
            }
            $geo = $resolved;
        }

        $address = sanitize_textarea_field((string) ($input['address'] ?? ''));
        if (!empty($fields['address']['enabled']) && !empty($fields['address']['required']) && $address === '') {
            return $this->error('invalid_address', $lang, 400);
        }
        $note = !empty($fields['note']['enabled'])
            ? sanitize_textarea_field((string) ($input['note'] ?? ''))
            : '';

        $method = sanitize_key((string) ($input['payment_method'] ?? ''));
        $available = (new Manager())->available($doc['checkout']['payments']);
        if (!in_array($method, $available, true)) {
            return $this->error('invalid_payment', $lang, 400);
        }
        $gateway = (new Manager())->get($method);
        if ($gateway === null) {
            return $this->error('invalid_payment', $lang, 400);
        }

        $qty = (int) ($input['qty'] ?? 1);
        $qty = max(1, min(10, $qty));
        $price = round((float) $doc['offer']['price'], 2);
        $shipping = self::shipping_for(
            $doc['offer'],
            (string) ($geo['district_id'] ?? ''),
            (string) ($geo['upazila_id'] ?? '')
        );
        $bump = is_array($doc['offer']['bump'] ?? null) ? $doc['offer']['bump'] : [];
        $want_bump = !empty($input['bump']) && !empty($bump['enabled']) && (float) ($bump['price'] ?? 0) > 0;
        $bump_price = $want_bump ? round((float) $bump['price'], 2) : 0.0;
        $subtotal = round(($price * $qty) + $bump_price, 2);
        $total = round($subtotal + $shipping, 2);
        $event_id = self::event_id((string) ($input['event_id'] ?? ''), $number = Repository::next_number());
        $attribution = self::attribution($input);
        $variant = self::variant((string) ($input['variant'] ?? ''));

        $since = wp_date('Y-m-d H:i:s', current_time('timestamp') - 7 * DAY_IN_SECONDS);
        $repeat = Repository::phone_count($phone, $since);
        $risk = $repeat >= 2 ? 'review' : 'ok';
        $fraud = Blacklist::score($phone, $risk);
        if ($fraud['blocked']) {
            return $this->error('invalid_phone', $lang, 403);
        }
        $otp_verified = 0;
        if (Otp::required($risk)) {
            if (!Otp::verify($phone, (string) ($input['otp_code'] ?? ''))) {
                return new \WP_Error('noksha_otp_required', Catalog::line($lang, 'otp_required'), [
                    'status' => 403,
                    'otp_required' => true,
                ]);
            }
            $otp_verified = 1;
        }
        $session = $this->session((string) ($input['session_id'] ?? ''));

        // Validate wallet TrxID before insert so bad attempts do not create junk rows.
        $trx_pre = '';
        if (in_array($method, ['manual_bkash', 'manual_nagad'], true)) {
            $trx_pre = strtoupper((string) preg_replace('/\s+/', '', (string) ($input['trx_id'] ?? '')));
            if (!preg_match('/^[A-Z0-9]{6,40}$/', $trx_pre)) {
                return $this->error('trx_required', $lang, 400);
            }
            if (Repository::trx_exists($trx_pre)) {
                return $this->error('trx_required', $lang, 400);
            }
        }

        $items = [[
            'name' => $doc['offer']['productName'] !== '' ? $doc['offer']['productName'] : $post->post_title,
            'qty' => $qty,
            'price' => $price,
        ]];
        if ($want_bump) {
            $items[] = [
                'name' => (string) ($bump['name'] !== '' ? $bump['name'] : 'Add-on'),
                'qty' => 1,
                'price' => $bump_price,
            ];
        }

        global $wpdb;
        $wpdb->query('START TRANSACTION');
        $id = Repository::insert([
            'page_id' => $page_id,
            'order_number' => $number,
            'status' => 'pending',
            'customer_name' => $name,
            'phone' => $phone,
            'email' => $email,
            'division_id' => $geo['division_id'],
            'division_name' => $geo['division_name'],
            'district_id' => $geo['district_id'],
            'district_name' => $geo['district_name'],
            'upazila_id' => $geo['upazila_id'],
            'upazila_name' => $geo['upazila_name'],
            'address' => $address,
            'payment_method' => $method,
            'currency' => 'BDT',
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'total' => $total,
            'collect_amount' => $total,
            'cod_settled' => 0,
            'qty' => $qty,
            'risk' => $risk,
            'trx_id' => '',
            'trx_verified' => 0,
            'otp_verified' => $otp_verified,
            'variant' => $variant,
            'attribution' => wp_json_encode($attribution),
            'event_id' => $event_id,
            'customer_note' => $note,
            'session_id' => $session,
            'language' => $lang,
        ], $items);

        if ($id <= 0) {
            $wpdb->query('ROLLBACK');
            return $this->error('page_closed', $lang, 500);
        }

        $order = Repository::find($id);
        if (!$order) {
            $wpdb->query('ROLLBACK');
            return $this->error('page_closed', $lang, 500);
        }
        $order['product_name'] = $doc['offer']['productName'] !== '' ? $doc['offer']['productName'] : $post->post_title;

        // Network gateways: commit insert first so row locks are not held during HTTP.
        $network_gateway = ($method === 'sslcommerz');
        if ($network_gateway) {
            $wpdb->query('COMMIT');
        }

        try {
            $result = $gateway->start($order, $input);
        } catch (\Throwable $e) {
            // Never leave a committed order dangling as "pending" when the gateway blows up.
            if ($network_gateway) {
                Repository::update($id, ['status' => 'cancelled'], true, 'sslcommerz');
                Repository::add_note($id, 'Gateway exception: ' . noksha_clip($e->getMessage(), 300));
            } else {
                $wpdb->query('ROLLBACK');
            }
            return $this->error('payment_failed', $lang, 500);
        }

        Repository::add_payment([
            'order_id' => $id,
            'gateway' => $method,
            'amount' => $total,
            'status' => $result['payment_status'] ?? 'failed',
            'transaction_id' => $result['transaction_id'] ?? '',
            'gateway_ref' => isset($result['gateway_ref']) ? noksha_clip((string) $result['gateway_ref'], 191) : '',
            'raw_response' => isset($result['raw_response']) ? noksha_clip((string) $result['raw_response'], 20000) : '',
        ]);

        if ($network_gateway) {
            if (!empty($result['error'])) {
                Repository::update($id, ['status' => 'cancelled'], true, 'sslcommerz');
                Repository::add_note($id, 'Gateway failed: ' . (string) $result['error']);
                return $this->error((string) $result['error'], $lang, 422);
            }
            Repository::update($id, [
                'status' => $result['status'],
                'trx_id' => $result['transaction_id'] ?? '',
            ], true, 'sslcommerz');
        } else {
            if (!empty($result['error'])) {
                $wpdb->query('ROLLBACK');
                return $this->error((string) $result['error'], $lang, 422);
            }
            Repository::update($id, [
                'status' => $result['status'],
                'trx_id' => $result['transaction_id'] ?? '',
            ]);
            $wpdb->query('COMMIT');
        }
        if (in_array($method, ['manual_bkash', 'manual_nagad'], true)) {
            WalletVerifier::maybe_auto_verify($id);
        }
        Tracker::record($page_id, 'order_placed', $session, $variant);
        Tracker::ensure($page_id, 'checkout_start', $session, $variant);
        $order = Repository::find($id) ?: $order;
        if ($method !== 'sslcommerz' && ($order['status'] ?? '') !== 'cancelled') {
            Capi::purchase($order, $doc['offer']);
        }
        Leads::mark_converted($page_id, $phone);
        if (($order['status'] ?? '') !== 'cancelled') {
            Sms::order_placed($order);
        }
        $onboarding = \Noksha\Options::onboarding();
        if (empty($onboarding['test_order'])) {
            \Noksha\Options::update_onboarding(['test_order' => true]);
        }
        $permalink = get_permalink($page_id);
        $thanks = add_query_arg([
            'nk_order' => $order['order_number'],
            'nk_key' => Renderer::order_key($order),
        ], $permalink ?: home_url('/'));

        $payload = [
            'ok' => true,
            'orderNumber' => $order['order_number'],
            'status' => $order['status'],
            'redirect' => $result['redirect'] ?? '',
            'thanksUrl' => $thanks,
            'eventId' => $order['event_id'],
            'value' => (float) $order['total'],
            'currency' => 'BDT',
            'heading' => Catalog::line($lang, 'thank_you'),
            'message' => Catalog::line($lang, 'thank_you_text'),
            'key' => Renderer::order_key($order),
        ];
        // Do not fire Purchase before an external payment redirect completes.
        if (empty($result['redirect'])) {
            $payload['purchase'] = [
                'value' => (float) $order['total'],
                'currency' => 'BDT',
                'event_id' => $order['event_id'],
                'order_number' => $order['order_number'],
                'content_name' => $doc['offer']['productName'],
                'content_ids' => [(string) $page_id],
                'num_items' => (int) $order['qty'],
                'contents' => array_map(static function (array $item) use ($page_id): array {
                    return [
                        'id' => (string) $page_id,
                        'quantity' => (int) ($item['qty'] ?? 1),
                        'item_price' => (float) ($item['price'] ?? 0),
                    ];
                }, Repository::items($id)),
            ];
        }
        return $payload;
    }

    public static function shipping_for(array $offer, string $district_id, string $upazila_id = ''): float {
        $default = round((float) ($offer['shippingDefault'] ?? $offer['shippingOutside'] ?? $offer['shipping'] ?? 0), 2);
        $zones = is_array($offer['shippingZones'] ?? null) ? $offer['shippingZones'] : [];
        if ($zones !== []) {
            foreach ($zones as $zone) {
                if (!is_array($zone)) {
                    continue;
                }
                $upazilas = array_map('strval', (array) ($zone['upazilaIds'] ?? []));
                if ($upazila_id !== '' && in_array($upazila_id, $upazilas, true)) {
                    return round((float) ($zone['price'] ?? $default), 2);
                }
            }
            foreach ($zones as $zone) {
                if (!is_array($zone)) {
                    continue;
                }
                $districts = array_map('strval', (array) ($zone['districtIds'] ?? []));
                if ($district_id !== '' && in_array($district_id, $districts, true)) {
                    return round((float) ($zone['price'] ?? $default), 2);
                }
            }
            // Catch-all zone with empty district/upazila lists (e.g. outside Dhaka).
            foreach ($zones as $zone) {
                if (!is_array($zone)) {
                    continue;
                }
                $districts = (array) ($zone['districtIds'] ?? []);
                $upazilas = (array) ($zone['upazilaIds'] ?? []);
                if ($districts === [] && $upazilas === []) {
                    return round((float) ($zone['price'] ?? $default), 2);
                }
            }
            return $default;
        }
        $outside = round((float) ($offer['shippingOutside'] ?? $offer['shipping'] ?? 0), 2);
        $inside = round((float) ($offer['shippingInside'] ?? $outside), 2);
        return $district_id === '47' ? $inside : $outside;
    }

    private static function attribution(array $input): array {
        $keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid', 'gclid', 'fbp', 'fbc'];
        $out = [];
        $source = is_array($input['attribution'] ?? null) ? $input['attribution'] : $input;
        foreach ($keys as $key) {
            $value = sanitize_text_field((string) ($source[$key] ?? ''));
            if ($value !== '') {
                $out[$key] = noksha_clip($value, 191);
            }
        }
        // Customer IP and browser, kept so server-side events (Meta CAPI) can match the buyer.
        $ip = \Noksha\Support\RateLimit::client_ip();
        if ($ip !== '' && filter_var($ip, FILTER_VALIDATE_IP)) {
            $out['cip'] = $ip;
        }
        $agent = sanitize_text_field(wp_unslash((string) ($_SERVER['HTTP_USER_AGENT'] ?? '')));
        if ($agent !== '') {
            $out['cua'] = noksha_clip($agent, 300);
        }
        return $out;
    }

    private static function event_id(string $incoming, string $order_number): string {
        $incoming = preg_replace('/[^A-Za-z0-9_-]/', '', $incoming) ?? '';
        if (strlen($incoming) >= 8 && strlen($incoming) <= 64) {
            return $incoming;
        }
        return 'nk_' . preg_replace('/[^A-Za-z0-9]/', '', $order_number);
    }

    private static function variant(string $value): string {
        $value = strtolower($value);
        return in_array($value, ['a', 'b'], true) ? $value : '';
    }

    private function error(string $code, string $lang, int $status): \WP_Error {
        return new \WP_Error('noksha_' . $code, Catalog::line($lang, $code), ['status' => $status]);
    }

    private function session(string $value): string {
        $value = preg_replace('/[^A-Za-z0-9_-]/', '', $value) ?? '';
        if (strlen($value) < 8 || strlen($value) > 64) {
            return '';
        }
        return $value;
    }
}
