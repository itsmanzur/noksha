<?php
/**
 * Request rate limits keyed by real client IP (Cloudflare-aware).
 *
 * @package Noksha
 */

namespace Noksha\Support;

final class RateLimit {
    /**
     * @return array{checkout:int,otp:int,event:int,window:int,phone_checkout:int,phone_otp_day:int}
     */
    public static function limits(): array {
        $defaults = [
            'checkout' => 20,
            'otp' => 8,
            'event' => 60,
            'window' => 10 * MINUTE_IN_SECONDS,
            'phone_checkout' => 5,
            'phone_otp_day' => 5,
        ];
        $filtered = apply_filters('noksha_rate_limits', $defaults);
        return is_array($filtered) ? array_merge($defaults, $filtered) : $defaults;
    }

    public static function hit(string $bucket, int $max = 0): bool {
        $limits = self::limits();
        if ($max <= 0) {
            $max = (int) ($limits[$bucket] ?? 20);
        }
        $window = (int) ($limits['window'] ?? 600);
        $ip = self::client_ip();
        $key = 'noksha_rl_' . md5($bucket . '|' . $ip);
        $count = (int) get_transient($key);
        if ($count >= $max) {
            return true;
        }
        set_transient($key, $count + 1, $window);
        return false;
    }

    public static function hit_phone(string $bucket, string $phone, int $max = 0, int $window = 0): bool {
        $limits = self::limits();
        $phone = preg_replace('/\D+/', '', $phone) ?? '';
        if (strlen($phone) < 11) {
            return false;
        }
        if ($max <= 0) {
            $max = (int) ($limits[$bucket] ?? 5);
        }
        if ($window <= 0) {
            $window = $bucket === 'phone_otp_day' ? DAY_IN_SECONDS : (int) ($limits['window'] ?? 600);
        }
        $key = 'noksha_rl_' . md5($bucket . '|' . $phone);
        $count = (int) get_transient($key);
        if ($count >= $max) {
            return true;
        }
        set_transient($key, $count + 1, $window);
        return false;
    }

    public static function client_ip(): string {
        $remote = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '0';
        $trusted = apply_filters('noksha_trusted_proxies', self::trusted_proxies());
        if (!is_array($trusted)) {
            $trusted = [];
        }
        if (!self::ip_in_list($remote, $trusted)) {
            return $remote !== '' ? $remote : '0';
        }

        $cf_ranges = apply_filters('noksha_cloudflare_cidrs', self::cloudflare_cidrs());
        if (!is_array($cf_ranges)) {
            $cf_ranges = [];
        }
        // CF-Connecting-IP only when the immediate peer is a Cloudflare edge.
        if (self::ip_in_list($remote, $cf_ranges) && !empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            $cf = sanitize_text_field(wp_unslash($_SERVER['HTTP_CF_CONNECTING_IP']));
            if (filter_var($cf, FILTER_VALIDATE_IP)) {
                return $cf;
            }
        }

        // Walk X-Forwarded-For from right to left; first IP that is not a trusted proxy.
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $parts = array_reverse(array_map('trim', explode(',', (string) wp_unslash($_SERVER['HTTP_X_FORWARDED_FOR']))));
            foreach ($parts as $part) {
                $ip = sanitize_text_field($part);
                if (!filter_var($ip, FILTER_VALIDATE_IP)) {
                    continue;
                }
                if (!self::ip_in_list($ip, $trusted)) {
                    return $ip;
                }
            }
        }

        return $remote !== '' ? $remote : '0';
    }

    /**
     * Trusted reverse proxies (Cloudflare + local). Filterable via noksha_trusted_proxies.
     *
     * @return array<int, string>
     */
    private static function trusted_proxies(): array {
        return array_merge(self::cloudflare_cidrs(), ['127.0.0.1/32', '::1/128']);
    }

    /**
     * Cloudflare published IPv4/IPv6 ranges (filterable via noksha_cloudflare_cidrs).
     *
     * @return array<int, string>
     * @see https://www.cloudflare.com/ips/
     */
    private static function cloudflare_cidrs(): array {
        return [
            '173.245.48.0/20',
            '103.21.244.0/22',
            '103.22.200.0/22',
            '103.31.4.0/22',
            '141.101.64.0/18',
            '108.162.192.0/18',
            '190.93.240.0/20',
            '188.114.96.0/20',
            '197.234.240.0/22',
            '198.41.128.0/17',
            '162.158.0.0/15',
            '104.16.0.0/13',
            '104.24.0.0/14',
            '172.64.0.0/13',
            '131.0.72.0/22',
            '2400:cb00::/32',
            '2606:4700::/32',
            '2803:f800::/32',
            '2405:b500::/32',
            '2405:8100::/32',
            '2a06:98c0::/29',
            '2c0f:f248::/32',
        ];
    }

    /**
     * @param array<int, string> $list
     */
    private static function ip_in_list(string $ip, array $list): bool {
        if ($ip === '' || !filter_var($ip, FILTER_VALIDATE_IP)) {
            return false;
        }
        foreach ($list as $cidr) {
            if (self::ip_in_cidr($ip, (string) $cidr)) {
                return true;
            }
        }
        return false;
    }

    private static function ip_in_cidr(string $ip, string $cidr): bool {
        if (!str_contains($cidr, '/')) {
            return $ip === $cidr;
        }
        [$subnet, $mask] = explode('/', $cidr, 2);
        $mask = (int) $mask;
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) && filter_var($subnet, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            $ip_long = ip2long($ip);
            $sub_long = ip2long($subnet);
            if ($ip_long === false || $sub_long === false) {
                return false;
            }
            $mask_long = -1 << (32 - max(0, min(32, $mask)));
            return ($ip_long & $mask_long) === ($sub_long & $mask_long);
        }
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6) && filter_var($subnet, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            $ip_bin = inet_pton($ip);
            $sub_bin = inet_pton($subnet);
            if ($ip_bin === false || $sub_bin === false) {
                return false;
            }
            $mask = max(0, min(128, $mask));
            $bytes = intdiv($mask, 8);
            $bits = $mask % 8;
            if ($bytes && substr($ip_bin, 0, $bytes) !== substr($sub_bin, 0, $bytes)) {
                return false;
            }
            if ($bits === 0) {
                return true;
            }
            $mask_byte = (~(0xff >> $bits)) & 0xff;
            return (ord($ip_bin[$bytes]) & $mask_byte) === (ord($sub_bin[$bytes]) & $mask_byte);
        }
        return false;
    }
}
