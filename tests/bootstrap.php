<?php
/**
 * Lightweight bootstrap for pure unit tests (no full WP stack required).
 *
 * @package Noksha
 */

declare(strict_types=1);

define('ABSPATH', __DIR__ . '/');
define('NOKSHA_DIR', dirname(__DIR__) . '/');
define('NOKSHA_URL', 'http://example.test/wp-content/plugins/noksha/');
define('NOKSHA_VERSION', '0.1.3');
define('DAY_IN_SECONDS', 86400);
define('MINUTE_IN_SECONDS', 60);

if (!function_exists('sanitize_text_field')) {
    function sanitize_text_field($value) {
        return trim(strip_tags((string) $value));
    }
}
if (!function_exists('sanitize_textarea_field')) {
    function sanitize_textarea_field($value) {
        return trim(strip_tags((string) $value));
    }
}
if (!function_exists('esc_url_raw')) {
    function esc_url_raw($value) {
        return filter_var((string) $value, FILTER_SANITIZE_URL) ?: '';
    }
}
if (!function_exists('wp_http_validate_url')) {
    function wp_http_validate_url($value) {
        return (bool) filter_var((string) $value, FILTER_VALIDATE_URL);
    }
}
if (!function_exists('wp_kses')) {
    function wp_kses($content, $allowed) {
        return preg_replace('#<script\b[^>]*>.*?</script>#is', '', (string) $content) ?? '';
    }
}
if (!function_exists('wp_kses_allowed_html')) {
    function wp_kses_allowed_html($context) {
        return ['p' => [], 'h2' => [], 'div' => ['style' => true], 'iframe' => ['src' => true]];
    }
}
if (!function_exists('wp_parse_url')) {
    function wp_parse_url($url, $component = -1) {
        return parse_url($url, $component);
    }
}
if (!function_exists('current_user_can')) {
    function current_user_can($cap) {
        return false;
    }
}
if (!function_exists('noksha_clip')) {
    function noksha_clip(string $text, int $limit): string {
        return substr($text, 0, $limit);
    }
}

require_once NOKSHA_DIR . 'src/Region/Phone.php';
require_once NOKSHA_DIR . 'src/Brand/Tokens.php';
require_once NOKSHA_DIR . 'src/Pages/Sanitizer.php';
