<?php
/**
 * SSLCommerz hosted checkout. An order is paid only after the validation API agrees.
 *
 * @package Noksha
 */

namespace Noksha\Payments;

use Noksha\Options;
use Noksha\Orders\Repository;
use Noksha\Pages\Renderer;

final class SslCommerzGateway implements Gateway {
    public function id(): string {
        return 'sslcommerz';
    }

    public function start(array $order, array $input): array {
        $secrets = Options::secrets();
        if ($secrets['sslcommerz_store_id'] === '' || $secrets['sslcommerz_store_passwd'] === '') {
            return ['error' => 'sslcommerz_not_configured'];
        }
        $settings = Options::settings();
        $base = !empty($settings['sandbox'])
            ? 'https://sandbox.sslcommerz.com'
            : 'https://securepay.sslcommerz.com';
        $return = rest_url('noksha/v1/sslcommerz/return');
        $body = [
            'store_id' => $secrets['sslcommerz_store_id'],
            'store_passwd' => $secrets['sslcommerz_store_passwd'],
            'total_amount' => number_format((float) $order['total'], 2, '.', ''),
            'currency' => 'BDT',
            'tran_id' => $order['order_number'],
            'success_url' => add_query_arg('result', 'success', $return),
            'fail_url' => add_query_arg('result', 'fail', $return),
            'cancel_url' => add_query_arg('result', 'cancel', $return),
            'ipn_url' => rest_url('noksha/v1/sslcommerz/ipn'),
            'cus_name' => $order['customer_name'],
            'cus_email' => $order['email'] !== '' ? $order['email'] : 'customer@example.com',
            'cus_add1' => $order['address'] !== '' ? $order['address'] : 'Bangladesh',
            'cus_city' => $order['district_name'] !== '' ? $order['district_name'] : 'Dhaka',
            'cus_state' => $order['division_name'] !== '' ? $order['division_name'] : 'Dhaka',
            'cus_postcode' => '1000',
            'cus_country' => 'Bangladesh',
            'cus_phone' => $order['phone'],
            'shipping_method' => 'NO',
            'product_name' => $order['product_name'],
            'product_category' => 'general',
            'product_profile' => 'physical-goods',
            'num_of_item' => (string) $order['qty'],
            'emi_option' => '0',
        ];
        $response = wp_remote_post($base . '/gwprocess/v4/api.php', [
            'timeout' => 30,
            'body' => $body,
        ]);
        if (is_wp_error($response)) {
            return ['error' => 'sslcommerz_failed'];
        }
        $decoded = json_decode((string) wp_remote_retrieve_body($response), true);
        $url = is_array($decoded) ? (string) ($decoded['GatewayPageURL'] ?? '') : '';
        $status = is_array($decoded) ? strtoupper((string) ($decoded['status'] ?? '')) : '';
        if ($status !== 'SUCCESS' || $url === '' || !wp_http_validate_url($url)) {
            return ['error' => 'sslcommerz_failed'];
        }
        return [
            'status' => 'pending',
            'payment_status' => 'pending',
            'redirect' => $url,
            'gateway_ref' => (string) ($decoded['sessionkey'] ?? ''),
            'raw_response' => wp_json_encode($decoded),
        ];
    }

    public function handle_return(\WP_REST_Request $request): string {
        $order = $this->order_from_request($request);
        $result = sanitize_key((string) $request->get_param('result'));
        if (!$order) {
            return home_url('/');
        }
        $page = get_permalink((int) $order['page_id']) ?: home_url('/');
        if ($result === 'cancel') {
            if ($order['status'] === 'pending') {
                Repository::update((int) $order['id'], ['status' => 'cancelled'], true, 'sslcommerz');
                Repository::update_payment((int) $order['id'], ['status' => 'cancelled']);
            }
            return add_query_arg('nk_payment', 'cancelled', $page);
        }
        $val_id = sanitize_text_field((string) $request->get_param('val_id'));
        if ($result === 'fail' || $val_id === '' || !$this->verify($val_id, $order)) {
            Repository::update_payment((int) $order['id'], ['status' => 'failed']);
            return add_query_arg('nk_payment', 'failed', $page);
        }
        $this->mark_paid($order, $val_id);
        return add_query_arg([
            'nk_order' => $order['order_number'],
            'nk_key' => Renderer::order_key($order),
        ], $page);
    }

    public function handle_ipn(\WP_REST_Request $request): int {
        $val_id = sanitize_text_field((string) $request->get_param('val_id'));
        $order = $this->order_from_request($request);
        if ($val_id === '' || !$order) {
            return 400;
        }
        if ($order['status'] === 'paid') {
            return 200;
        }
        if (!$this->verify($val_id, $order)) {
            return 400;
        }
        $this->mark_paid($order, $val_id);
        return 200;
    }

    private function verify(string $val_id, array $order): bool {
        $secrets = Options::secrets();
        if ($secrets['sslcommerz_store_id'] === '' || $secrets['sslcommerz_store_passwd'] === '') {
            return false;
        }
        $settings = Options::settings();
        $base = !empty($settings['sandbox'])
            ? 'https://sandbox.sslcommerz.com'
            : 'https://securepay.sslcommerz.com';
        $url = add_query_arg([
            'val_id' => $val_id,
            'store_id' => $secrets['sslcommerz_store_id'],
            'store_passwd' => $secrets['sslcommerz_store_passwd'],
            'format' => 'json',
            'v' => 1,
        ], $base . '/validator/api/validationserverAPI.php');
        $response = wp_remote_get($url, ['timeout' => 30]);
        if (is_wp_error($response)) {
            return false;
        }
        $decoded = json_decode((string) wp_remote_retrieve_body($response), true);
        if (!is_array($decoded)) {
            return false;
        }
        $status = strtoupper((string) ($decoded['status'] ?? ''));
        if (!in_array($status, ['VALID', 'VALIDATED'], true)) {
            return false;
        }
        if ((string) ($decoded['tran_id'] ?? '') !== $order['order_number']) {
            return false;
        }
        $currency = strtoupper((string) ($decoded['currency_type'] ?? $decoded['currency'] ?? 'BDT'));
        if ($currency !== '' && $currency !== 'BDT') {
            return false;
        }
        $amount = (float) ($decoded['currency_amount'] ?? $decoded['amount'] ?? 0);
        return abs($amount - (float) $order['total']) < 0.5;
    }

    private function mark_paid(array $order, string $val_id): void {
        if ($order['status'] === 'paid') {
            return;
        }
        $id = (int) $order['id'];
        if (!Repository::can_transition((string) $order['status'], 'paid')) {
            // Money arrived for a closed order (e.g. customer cancelled first). Record it and flag for refund.
            Repository::update($id, ['trx_id' => $val_id, 'trx_verified' => 1], false, 'sslcommerz');
            Repository::update_payment($id, ['status' => 'paid', 'transaction_id' => $val_id]);
            Repository::add_note($id, sprintf(
                'ALERT: SSLCommerz payment %s received for a %s order. Refund the customer or reinstate the order manually.',
                $val_id,
                (string) $order['status']
            ));
            do_action('noksha_payment_on_closed_order', $id, $val_id, (string) $order['status']);
            return;
        }
        Repository::update($id, [
            'status' => 'paid',
            'trx_id' => $val_id,
            'trx_verified' => 1,
        ], true, 'sslcommerz');
        Repository::update_payment($id, [
            'status' => 'paid',
            'transaction_id' => $val_id,
        ]);
        $fresh = Repository::find((int) $order['id']);
        if ($fresh) {
            $page = \Noksha\Pages\Repository::document((int) $fresh['page_id']);
            \Noksha\Analytics\Capi::purchase($fresh, $page['offer'] ?? []);
        }
    }

    private function order_from_request(\WP_REST_Request $request): ?array {
        $number = sanitize_text_field((string) $request->get_param('tran_id'));
        if ($number === '') {
            return null;
        }
        return Repository::find_by_number($number);
    }
}
