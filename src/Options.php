<?php
/**
 * Plugin settings and secrets.
 *
 * Secrets are stored in a separate option with autoload disabled.
 *
 * @package Noksha
 */

namespace Noksha;

final class Options {
    public const SETTINGS = 'noksha_settings';
    public const SECRETS = 'noksha_secrets';

    public static function default_settings(): array {
        return [
            'region' => 'bd',
            'default_language' => 'en',
            'store_name' => '',
            'sandbox' => true,
            'pixels' => [
                'meta' => '',
                'ga4' => '',
                'tiktok' => '',
            ],
            'gateways' => [
                'cod' => ['enabled' => true],
                'manual_bkash' => [
                    'enabled' => true,
                    'number' => '',
                    'instructions' => '',
                    'auto_verify' => false,
                ],
                'manual_nagad' => [
                    'enabled' => true,
                    'number' => '',
                    'instructions' => '',
                    'auto_verify' => false,
                ],
                'sslcommerz' => ['enabled' => false],
            ],
            'sms' => [
                'enabled' => false,
                'sender' => 'Noksha',
                'otp_mode' => 'risk',
                'otp_ttl' => 300,
            ],
            'woocommerce' => [
                // Send WooCommerce's own emails for orders placed on a landing page.
                'emails' => true,
            ],
            'couriers' => [
                'steadfast' => ['enabled' => false],
                'pathao' => ['enabled' => false, 'store_id' => ''],
                'redx' => ['enabled' => false, 'store_id' => ''],
            ],
        ];
    }

    public static function default_secrets(): array {
        return [
            'sslcommerz_store_id' => '',
            'sslcommerz_store_passwd' => '',
            'meta_capi_token' => '',
            'sms_api_key' => '',
            'steadfast_api_key' => '',
            'steadfast_secret_key' => '',
            'pathao_client_id' => '',
            'pathao_client_secret' => '',
            'pathao_username' => '',
            'pathao_password' => '',
            'redx_api_key' => '',
            'courier_webhook_secret' => '',
            'bkash_app_key' => '',
            'bkash_app_secret' => '',
            'bkash_username' => '',
            'bkash_password' => '',
            'nagad_merchant_id' => '',
            'nagad_merchant_private_key' => '',
            'nagad_pg_public_key' => '',
            'nagad_verify_url' => '',
        ];
    }

    public static function onboarding(): array {
        $stored = get_option('noksha_onboarding', []);
        if (!is_array($stored)) {
            $stored = [];
        }
        $board = array_merge([
            'dismissed' => false,
            'payments' => false,
            'test_order' => false,
            'pixels' => false,
        ], $stored);
        if (!$board['payments']) {
            $gateways = self::settings()['gateways'];
            if (!empty($gateways['cod']['enabled'])
                || (!empty($gateways['manual_bkash']['enabled']) && ($gateways['manual_bkash']['number'] ?? '') !== '')
                || (!empty($gateways['manual_nagad']['enabled']) && ($gateways['manual_nagad']['number'] ?? '') !== '')) {
                $board['payments'] = true;
            }
        }
        if (!$board['pixels']) {
            $pixels = self::settings()['pixels'];
            if (($pixels['meta'] ?? '') !== '' || ($pixels['ga4'] ?? '') !== '' || ($pixels['tiktok'] ?? '') !== '') {
                $board['pixels'] = true;
            }
        }
        if (!$board['test_order']) {
            global $wpdb;
            $table = $wpdb->prefix . 'noksha_orders';
            $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table)));
            if ($found === $table) {
                $count = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$table}");
                if ($count > 0) {
                    $board['test_order'] = true;
                }
            }
        }
        return $board;
    }

    public static function update_onboarding(array $input): array {
        $current = self::onboarding();
        $next = [
            'dismissed' => array_key_exists('dismissed', $input) ? !empty($input['dismissed']) : !empty($current['dismissed']),
            'payments' => array_key_exists('payments', $input) ? !empty($input['payments']) : !empty($current['payments']),
            'test_order' => array_key_exists('test_order', $input) ? !empty($input['test_order']) : !empty($current['test_order']),
            'pixels' => array_key_exists('pixels', $input) ? !empty($input['pixels']) : !empty($current['pixels']),
        ];
        update_option('noksha_onboarding', $next, false);
        return $next;
    }

    public static function settings(): array {
        $stored = get_option(self::SETTINGS, []);
        if (!is_array($stored)) {
            $stored = [];
        }
        return self::merge_settings(self::default_settings(), $stored);
    }

    public static function secrets(): array {
        $stored = get_option(self::SECRETS, []);
        if (!is_array($stored)) {
            $stored = [];
        }
        $secrets = array_merge(self::default_secrets(), $stored);
        foreach (self::secret_constants() as $key => $constant) {
            if (defined($constant)) {
                $secrets[$key] = (string) constant($constant);
            }
        }
        return $secrets;
    }

    /**
     * @return array<string, string>
     */
    public static function secret_constants(): array {
        return [
            'sslcommerz_store_id' => 'NOKSHA_SSLCOMMERZ_STORE_ID',
            'sslcommerz_store_passwd' => 'NOKSHA_SSLCOMMERZ_PASS',
            'meta_capi_token' => 'NOKSHA_META_CAPI_TOKEN',
            'sms_api_key' => 'NOKSHA_SMS_API_KEY',
            'steadfast_api_key' => 'NOKSHA_STEADFAST_API_KEY',
            'steadfast_secret_key' => 'NOKSHA_STEADFAST_SECRET_KEY',
            'pathao_client_id' => 'NOKSHA_PATHAO_CLIENT_ID',
            'pathao_client_secret' => 'NOKSHA_PATHAO_CLIENT_SECRET',
            'pathao_username' => 'NOKSHA_PATHAO_USERNAME',
            'pathao_password' => 'NOKSHA_PATHAO_PASSWORD',
            'redx_api_key' => 'NOKSHA_REDX_API_KEY',
            'courier_webhook_secret' => 'NOKSHA_COURIER_WEBHOOK_SECRET',
            'bkash_app_key' => 'NOKSHA_BKASH_APP_KEY',
            'bkash_app_secret' => 'NOKSHA_BKASH_APP_SECRET',
            'bkash_username' => 'NOKSHA_BKASH_USERNAME',
            'bkash_password' => 'NOKSHA_BKASH_PASSWORD',
            'nagad_merchant_id' => 'NOKSHA_NAGAD_MERCHANT_ID',
            'nagad_merchant_private_key' => 'NOKSHA_NAGAD_MERCHANT_PRIVATE_KEY',
            'nagad_pg_public_key' => 'NOKSHA_NAGAD_PG_PUBLIC_KEY',
            'nagad_verify_url' => 'NOKSHA_NAGAD_VERIFY_URL',
        ];
    }

    public static function locked_secrets(): array {
        $locked = [];
        foreach (self::secret_constants() as $key => $constant) {
            if (defined($constant)) {
                $locked[$key] = true;
            }
        }
        return $locked;
    }

    public static function update_settings(array $input): array {
        $current = self::settings();
        $language = array_key_exists('default_language', $input)
            ? (($input['default_language'] ?? '') === 'bn' ? 'bn' : 'en')
            : (($current['default_language'] ?? 'en') === 'bn' ? 'bn' : 'en');
        $pixels = is_array($input['pixels'] ?? null) ? $input['pixels'] : $current['pixels'];
        $gateways = is_array($input['gateways'] ?? null) ? $input['gateways'] : $current['gateways'];
        $sms = is_array($input['sms'] ?? null) ? $input['sms'] : $current['sms'];
        $couriers = is_array($input['couriers'] ?? null) ? $input['couriers'] : $current['couriers'];
        $woocommerce = is_array($input['woocommerce'] ?? null) ? $input['woocommerce'] : [];

        $store_name = array_key_exists('store_name', $input)
            ? sanitize_text_field((string) $input['store_name'])
            : sanitize_text_field((string) ($current['store_name'] ?? ''));

        $next = [
            'region' => 'bd',
            'default_language' => $language,
            'store_name' => $store_name,
            'sandbox' => array_key_exists('sandbox', $input) ? !empty($input['sandbox']) : !empty($current['sandbox']),
            'pixels' => [
                'meta' => preg_replace('/\D+/', '', (string) ($pixels['meta'] ?? '')) ?? '',
                'ga4' => self::ga4((string) ($pixels['ga4'] ?? '')),
                'tiktok' => preg_replace('/[^A-Za-z0-9]/', '', (string) ($pixels['tiktok'] ?? '')) ?? '',
            ],
            'gateways' => [
                'cod' => [
                    'enabled' => !empty($gateways['cod']['enabled']),
                ],
                'manual_bkash' => self::wallet($gateways['manual_bkash'] ?? [], $current['gateways']['manual_bkash']),
                'manual_nagad' => self::wallet($gateways['manual_nagad'] ?? [], $current['gateways']['manual_nagad']),
                'sslcommerz' => [
                    'enabled' => !empty($gateways['sslcommerz']['enabled']),
                ],
            ],
            'sms' => [
                'enabled' => array_key_exists('enabled', $sms) ? !empty($sms['enabled']) : !empty($current['sms']['enabled']),
                'sender' => sanitize_text_field((string) ($sms['sender'] ?? $current['sms']['sender'] ?? 'Noksha')),
                'otp_mode' => in_array(($sms['otp_mode'] ?? $current['sms']['otp_mode'] ?? 'risk'), ['off', 'risk', 'always'], true)
                    ? (string) ($sms['otp_mode'] ?? $current['sms']['otp_mode'] ?? 'risk')
                    : 'risk',
                'otp_ttl' => max(120, min(900, (int) ($sms['otp_ttl'] ?? $current['sms']['otp_ttl'] ?? 300))),
            ],
            'woocommerce' => [
                'emails' => array_key_exists('emails', $woocommerce)
                    ? !empty($woocommerce['emails'])
                    : !empty($current['woocommerce']['emails']),
            ],
            'couriers' => [
                'steadfast' => [
                    'enabled' => !empty($couriers['steadfast']['enabled']),
                ],
                'pathao' => [
                    'enabled' => !empty($couriers['pathao']['enabled']),
                    'store_id' => preg_replace('/\D+/', '', (string) ($couriers['pathao']['store_id'] ?? '')) ?? '',
                ],
                'redx' => [
                    'enabled' => !empty($couriers['redx']['enabled']),
                    'store_id' => preg_replace('/\D+/', '', (string) ($couriers['redx']['store_id'] ?? '')) ?? '',
                ],
            ],
        ];

        update_option(self::SETTINGS, $next, false);

        $secrets = get_option(self::SECRETS, []);
        if (!is_array($secrets)) {
            $secrets = [];
        }
        $secrets = array_merge(self::default_secrets(), $secrets);
        $locked = self::locked_secrets();
        $clear = [];
        if (isset($input['clear_secrets']) && is_array($input['clear_secrets'])) {
            foreach ($input['clear_secrets'] as $key) {
                $clear[(string) $key] = true;
            }
        }
        $secret_keys = array_keys(self::default_secrets());
        foreach ($secret_keys as $secret_key) {
            if (!empty($locked[$secret_key])) {
                continue;
            }
            if (!empty($clear[$secret_key]) || (array_key_exists($secret_key, $input) && $input[$secret_key] === null)) {
                $secrets[$secret_key] = '';
                continue;
            }
            if (!array_key_exists($secret_key, $input)) {
                continue;
            }
            $value = trim((string) $input[$secret_key]);
            if ($value === '') {
                continue;
            }
            $secrets[$secret_key] = $secret_key === 'nagad_verify_url'
                ? esc_url_raw($value)
                : sanitize_text_field($value);
        }
        update_option(self::SECRETS, $secrets, false);

        $onboarding = self::onboarding();
        if (!empty($next['gateways']['cod']['enabled'])
            || !empty($next['gateways']['manual_bkash']['enabled'])
            || !empty($next['gateways']['manual_nagad']['enabled'])) {
            $onboarding['payments'] = true;
        }
        if (($next['pixels']['meta'] ?? '') !== '' || ($next['pixels']['ga4'] ?? '') !== '' || ($next['pixels']['tiktok'] ?? '') !== '') {
            $onboarding['pixels'] = true;
        }
        update_option('noksha_onboarding', $onboarding, false);

        return self::public_settings();
    }

    public static function public_settings(): array {
        $settings = self::settings();
        $secrets = self::secrets();
        $settings['sslcommerz_store_id'] = $secrets['sslcommerz_store_id'];
        $settings['has_ssl_password'] = $secrets['sslcommerz_store_passwd'] !== '';
        $settings['ssl_ready'] = $settings['has_ssl_password'] && $settings['sslcommerz_store_id'] !== '';
        $settings['has_meta_capi_token'] = ($secrets['meta_capi_token'] ?? '') !== '';
        $settings['has_sms_key'] = ($secrets['sms_api_key'] ?? '') !== '';
        $settings['has_bkash_api'] = ($secrets['bkash_app_key'] ?? '') !== '' && ($secrets['bkash_app_secret'] ?? '') !== '';
        $settings['has_nagad_api'] = ($secrets['nagad_merchant_id'] ?? '') !== '';
        $settings['has_courier_webhook_secret'] = ($secrets['courier_webhook_secret'] ?? '') !== '';
        $settings['walletVerify'] = [
            'bkash' => \Noksha\Payments\WalletVerifier::ready('manual_bkash'),
            'nagad' => \Noksha\Payments\WalletVerifier::ready('manual_nagad'),
        ];
        $settings['webhookUrls'] = [
            'steadfast' => rest_url('noksha/v1/webhooks/steadfast'),
            'pathao' => rest_url('noksha/v1/webhooks/pathao'),
            'redx' => rest_url('noksha/v1/webhooks/redx'),
        ];
        $settings['shipping'] = \Noksha\Shipping\Manager::public_status();
        $settings['onboarding'] = self::onboarding();
        $settings['can_settings'] = Caps::can_settings();
        $settings['locked_by_constant'] = self::locked_secrets();
        $settings['has_secrets'] = [];
        foreach (array_keys(self::default_secrets()) as $key) {
            if (str_contains($key, 'passwd') || str_contains($key, 'password') || str_contains($key, 'secret') || str_contains($key, 'token') || str_contains($key, 'private') || str_contains($key, 'key')) {
                $settings['has_secrets'][$key] = (self::secrets()[$key] ?? '') !== '';
            }
        }
        return $settings;
    }

    private static function wallet(array $input, array $current): array {
        $number = preg_replace('/\D+/', '', (string) ($input['number'] ?? $current['number'] ?? '')) ?? '';
        if (str_starts_with($number, '880') && strlen($number) === 13) {
            $number = '0' . substr($number, 3);
        }
        return [
            'enabled' => array_key_exists('enabled', $input)
                ? !empty($input['enabled'])
                : !empty($current['enabled']),
            'number' => $number,
            'instructions' => sanitize_textarea_field((string) ($input['instructions'] ?? ($current['instructions'] ?? ''))),
            'auto_verify' => array_key_exists('auto_verify', $input)
                ? !empty($input['auto_verify'])
                : !empty($current['auto_verify']),
        ];
    }

    private static function ga4(string $value): string {
        $value = strtoupper(trim($value));
        return preg_match('/^G-[A-Z0-9]+$/', $value) ? $value : '';
    }

    private static function merge_settings(array $defaults, array $stored): array {
        foreach ($defaults as $key => $value) {
            if (!array_key_exists($key, $stored)) {
                continue;
            }
            if (is_array($value) && is_array($stored[$key])) {
                $defaults[$key] = self::merge_settings($value, $stored[$key]);
            } else {
                $defaults[$key] = $stored[$key];
            }
        }
        return $defaults;
    }
}
