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
                ],
                'manual_nagad' => [
                    'enabled' => true,
                    'number' => '',
                    'instructions' => '',
                ],
                'sslcommerz' => ['enabled' => false],
            ],
            'sms' => [
                'enabled' => false,
                'sender' => 'Noksha',
                'otp_mode' => 'risk',
                'otp_ttl' => 300,
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
        return array_merge(self::default_secrets(), $stored);
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

        $next = [
            'region' => 'bd',
            'default_language' => $language,
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

        $secrets = self::secrets();
        if (isset($input['sslcommerz_store_id'])) {
            $secrets['sslcommerz_store_id'] = sanitize_text_field((string) $input['sslcommerz_store_id']);
        }
        $password = (string) ($input['sslcommerz_store_passwd'] ?? '');
        if ($password !== '') {
            $secrets['sslcommerz_store_passwd'] = $password;
        }
        foreach ([
            'meta_capi_token',
            'sms_api_key',
            'steadfast_api_key',
            'steadfast_secret_key',
            'pathao_client_id',
            'pathao_client_secret',
            'pathao_username',
            'pathao_password',
            'redx_api_key',
        ] as $secret_key) {
            if (!array_key_exists($secret_key, $input)) {
                continue;
            }
            $value = trim((string) $input[$secret_key]);
            if ($value !== '') {
                $secrets[$secret_key] = sanitize_text_field($value);
            }
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
        $settings['shipping'] = \Noksha\Shipping\Manager::public_status();
        $settings['onboarding'] = self::onboarding();
        $settings['can_settings'] = Caps::can_settings();
        return $settings;
    }

    private static function wallet(array $input, array $current): array {
        $number = preg_replace('/\D+/', '', (string) ($input['number'] ?? $current['number'] ?? '')) ?? '';
        if (str_starts_with($number, '880') && strlen($number) === 13) {
            $number = '0' . substr($number, 3);
        }
        return [
            'enabled' => !empty($input['enabled']),
            'number' => $number,
            'instructions' => sanitize_textarea_field((string) ($input['instructions'] ?? '')),
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
