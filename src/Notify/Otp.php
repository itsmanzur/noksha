<?php
/**
 * Risk-based SMS OTP for checkout.
 *
 * @package Noksha
 */

namespace Noksha\Notify;

use Noksha\Options;
use Noksha\Region\Phone;

final class Otp {
    public static function mode(): string {
        $mode = (string) (Options::settings()['sms']['otp_mode'] ?? 'risk');
        return in_array($mode, ['off', 'risk', 'always'], true) ? $mode : 'risk';
    }

    public static function required(string $risk): bool {
        $mode = self::mode();
        if ($mode === 'off') {
            return false;
        }
        if ($mode === 'always') {
            return self::ready();
        }
        return $risk === 'review' && self::ready();
    }

    public static function ready(): bool {
        $settings = Options::settings();
        return !empty($settings['sms']['enabled']) && (Options::secrets()['sms_api_key'] ?? '') !== '';
    }

    public static function send(string $phone, string $lang = 'en'): array|\WP_Error {
        $phone = Phone::normalize($phone);
        if (Phone::error($phone)) {
            return new \WP_Error('noksha_invalid_phone', 'Invalid phone.', ['status' => 400]);
        }
        if (!self::ready()) {
            return new \WP_Error('noksha_otp_unavailable', 'SMS OTP is not configured.', ['status' => 400]);
        }
        $key = self::key($phone);
        $existing = get_transient($key);
        if (is_array($existing) && !empty($existing['sent_at']) && (time() - (int) $existing['sent_at']) < 45) {
            return new \WP_Error('noksha_otp_wait', 'Wait before requesting another code.', ['status' => 429]);
        }
        $code = (string) wp_rand(100000, 999999);
        $ttl = max(120, min(900, (int) (Options::settings()['sms']['otp_ttl'] ?? 300)));
        set_transient($key, [
            'hash' => wp_hash_password($code),
            'attempts' => 0,
            'sent_at' => time(),
        ], $ttl);
        $message = $lang === 'bn'
            ? "আপনার Noksha OTP: {$code}. কাউকে বলবেন না।"
            : "Your Noksha OTP: {$code}. Do not share it.";
        Sms::send($phone, $message);
        return ['ok' => true, 'ttl' => $ttl];
    }

    public static function verify(string $phone, string $code): bool {
        $phone = Phone::normalize($phone);
        $code = preg_replace('/\D+/', '', $code) ?? '';
        if (Phone::error($phone) || strlen($code) !== 6) {
            return false;
        }
        $key = self::key($phone);
        $stored = get_transient($key);
        if (!is_array($stored) || empty($stored['hash'])) {
            return false;
        }
        $attempts = (int) ($stored['attempts'] ?? 0);
        if ($attempts >= 5) {
            delete_transient($key);
            return false;
        }
        $stored['attempts'] = $attempts + 1;
        set_transient($key, $stored, 300);
        if (!wp_check_password($code, (string) $stored['hash'])) {
            return false;
        }
        delete_transient($key);
        return true;
    }

    private static function key(string $phone): string {
        return 'noksha_otp_' . md5($phone);
    }
}
