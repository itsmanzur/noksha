<?php
/**
 * Auto-verify bKash / Nagad TrxID via merchant payment search APIs.
 *
 * @package Noksha
 */

namespace Noksha\Payments;

use Noksha\Options;
use Noksha\Orders\Repository as Orders;

final class WalletVerifier {
    public static function ready(string $method): bool {
        $secrets = Options::secrets();
        $settings = Options::settings();
        if (empty($settings['gateways'][$method]['auto_verify'])) {
            return false;
        }
        if ($method === 'manual_bkash') {
            return ($secrets['bkash_app_key'] ?? '') !== ''
                && ($secrets['bkash_app_secret'] ?? '') !== ''
                && ($secrets['bkash_username'] ?? '') !== ''
                && ($secrets['bkash_password'] ?? '') !== '';
        }
        if ($method === 'manual_nagad') {
            return ($secrets['nagad_merchant_id'] ?? '') !== ''
                && ($secrets['nagad_merchant_private_key'] ?? '') !== ''
                && ($secrets['nagad_pg_public_key'] ?? '') !== '';
        }
        return false;
    }

    /**
     * @return array{ok:bool,verified?:bool,source?:string,message?:string,raw?:string}
     */
    public static function verify_order(int $order_id): array {
        $order = Orders::find($order_id);
        if (!$order) {
            return ['ok' => false, 'message' => 'Order not found.'];
        }
        $method = (string) ($order['payment_method'] ?? '');
        if (!in_array($method, ['manual_bkash', 'manual_nagad'], true)) {
            return ['ok' => false, 'message' => 'Not a wallet order.'];
        }
        $trx = strtoupper((string) preg_replace('/\s+/', '', (string) ($order['trx_id'] ?? '')));
        if ($trx === '') {
            return ['ok' => false, 'message' => 'Missing TrxID.'];
        }
        if ((int) ($order['trx_verified'] ?? 0) === 1) {
            return ['ok' => true, 'verified' => true, 'source' => 'already'];
        }
        if (!self::ready($method)) {
            return ['ok' => false, 'message' => 'Wallet API is not configured.'];
        }

        $amount = (float) ($order['total'] ?? 0);
        $result = $method === 'manual_bkash'
            ? self::bkash_search($trx, $amount)
            : self::nagad_search($trx, $amount);

        if (empty($result['verified'])) {
            Orders::update_payment($order_id, [
                'raw_response' => isset($result['raw']) ? noksha_clip((string) $result['raw'], 20000) : '',
                'status' => 'pending',
            ]);
            return [
                'ok' => true,
                'verified' => false,
                'source' => 'api',
                'message' => $result['message'] ?? 'Transaction not confirmed yet.',
                'raw' => $result['raw'] ?? '',
            ];
        }

        Orders::update($order_id, [
            'status' => 'paid',
            'trx_verified' => 1,
            'collect_amount' => 0,
        ]);
        Orders::update_payment($order_id, [
            'status' => 'paid',
            'transaction_id' => $trx,
            'raw_response' => isset($result['raw']) ? noksha_clip((string) $result['raw'], 20000) : '',
        ]);
        return ['ok' => true, 'verified' => true, 'source' => 'api', 'raw' => $result['raw'] ?? ''];
    }

    /**
     * Best-effort verify right after checkout (non-blocking for the customer path).
     */
    public static function maybe_auto_verify(int $order_id): void {
        $order = Orders::find($order_id);
        if (!$order) {
            return;
        }
        $method = (string) ($order['payment_method'] ?? '');
        if (!self::ready($method)) {
            return;
        }
        self::verify_order($order_id);
    }

    /**
     * @return array{verified:bool,message?:string,raw?:string}
     */
    private static function bkash_search(string $trx, float $amount): array {
        $token = self::bkash_token();
        if (is_wp_error($token)) {
            return ['verified' => false, 'message' => $token->get_error_message(), 'raw' => $token->get_error_message()];
        }
        $base = self::bkash_base();
        $secrets = Options::secrets();
        $response = wp_remote_post($base . '/tokenized/checkout/general/searchTransaction', [
            'timeout' => 20,
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'Authorization' => $token,
                'X-APP-Key' => (string) $secrets['bkash_app_key'],
            ],
            'body' => wp_json_encode(['trxID' => $trx]),
        ]);
        if (is_wp_error($response)) {
            return ['verified' => false, 'message' => $response->get_error_message(), 'raw' => $response->get_error_message()];
        }
        $raw = (string) wp_remote_retrieve_body($response);
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            return ['verified' => false, 'message' => 'Invalid bKash response.', 'raw' => $raw];
        }
        $status = strtolower((string) ($data['transactionStatus'] ?? $data['statusCode'] ?? ''));
        $paid = (float) ($data['amount'] ?? $data['transactionAmount'] ?? 0);
        $ok_status = in_array($status, ['completed', 'success', '0000'], true)
            || str_contains($status, 'complete');
        if (!$ok_status) {
            return ['verified' => false, 'message' => 'bKash status: ' . ($data['transactionStatus'] ?? 'unknown'), 'raw' => $raw];
        }
        if ($amount > 0 && $paid > 0 && abs($paid - $amount) > 1) {
            return ['verified' => false, 'message' => 'Amount mismatch.', 'raw' => $raw];
        }
        return ['verified' => true, 'raw' => $raw];
    }

    private static function bkash_token(): string|\WP_Error {
        $secrets = Options::secrets();
        $base = self::bkash_base();
        $response = wp_remote_post($base . '/tokenized/checkout/token/grant', [
            'timeout' => 20,
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'username' => (string) $secrets['bkash_username'],
                'password' => (string) $secrets['bkash_password'],
            ],
            'body' => wp_json_encode([
                'app_key' => (string) $secrets['bkash_app_key'],
                'app_secret' => (string) $secrets['bkash_app_secret'],
            ]),
        ]);
        if (is_wp_error($response)) {
            return $response;
        }
        $data = json_decode((string) wp_remote_retrieve_body($response), true);
        $token = is_array($data) ? (string) ($data['id_token'] ?? '') : '';
        if ($token === '') {
            return new \WP_Error('noksha_bkash_token', 'Could not get bKash token.');
        }
        return $token;
    }

    private static function bkash_base(): string {
        $sandbox = !empty(Options::settings()['sandbox']);
        return $sandbox
            ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
            : 'https://tokenized.pay.bka.sh/v1.2.0-beta';
    }

    /**
     * Nagad merchant verify is often custom; we call a configurable verify URL if set,
     * otherwise treat missing endpoint as not verified.
     *
     * @return array{verified:bool,message?:string,raw?:string}
     */
    private static function nagad_search(string $trx, float $amount): array {
        $secrets = Options::secrets();
        $url = (string) ($secrets['nagad_verify_url'] ?? '');
        if ($url === '') {
            // Without a merchant verify endpoint we cannot auto-confirm personal Send Money TrxIDs.
            return ['verified' => false, 'message' => 'Nagad verify URL is not set.', 'raw' => ''];
        }
        $sandbox = !empty(Options::settings()['sandbox']);
        $response = wp_remote_post($url, [
            'timeout' => 20,
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-KM-IP-V4' => isset($_SERVER['SERVER_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['SERVER_ADDR'])) : '127.0.0.1',
                'X-KM-Merchant-Id' => (string) $secrets['nagad_merchant_id'],
                'X-Noksha-Sandbox' => $sandbox ? '1' : '0',
            ],
            'body' => wp_json_encode([
                'merchantId' => (string) $secrets['nagad_merchant_id'],
                'trxId' => $trx,
                'amount' => $amount,
            ]),
        ]);
        if (is_wp_error($response)) {
            return ['verified' => false, 'message' => $response->get_error_message(), 'raw' => $response->get_error_message()];
        }
        $raw = (string) wp_remote_retrieve_body($response);
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            return ['verified' => false, 'message' => 'Invalid Nagad response.', 'raw' => $raw];
        }
        $status = strtolower((string) ($data['status'] ?? $data['paymentStatus'] ?? ''));
        $verified = !empty($data['verified']) || in_array($status, ['success', 'paid', 'completed'], true);
        if (!$verified) {
            return ['verified' => false, 'message' => 'Nagad status: ' . ($status ?: 'unknown'), 'raw' => $raw];
        }
        $paid = (float) ($data['amount'] ?? 0);
        if ($amount > 0 && $paid > 0 && abs($paid - $amount) > 1) {
            return ['verified' => false, 'message' => 'Amount mismatch.', 'raw' => $raw];
        }
        return ['verified' => true, 'raw' => $raw];
    }
}
