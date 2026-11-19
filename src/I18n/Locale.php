<?php
/**
 * Per-user admin language. The rest of wp-admin stays on the site locale.
 *
 * @package Noksha
 */

namespace Noksha\I18n;

use Noksha\Options;

final class Locale {
    public function register(): void {
        add_filter('determine_locale', [$this, 'filter_locale']);
        add_action('init', [$this, 'load_textdomain']);
    }

    public function load_textdomain(): void {
        load_plugin_textdomain('noksha', false, dirname(plugin_basename(NOKSHA_FILE)) . '/languages');
    }

    public function filter_locale($locale): string {
        $locale = is_string($locale) ? $locale : 'en_US';
        if (!$this->is_noksha_request()) {
            return $locale;
        }
        $pref = isset($_COOKIE['noksha_locale']) ? sanitize_key(wp_unslash($_COOKIE['noksha_locale'])) : '';
        if ($pref === 'bn') {
            return 'bn_BD';
        }
        if ($pref === 'en') {
            return 'en_US';
        }
        return $locale;
    }

    public static function preference(): string {
        $pref = '';
        if (is_user_logged_in()) {
            $pref = (string) get_user_meta(get_current_user_id(), 'noksha_locale', true);
        }
        if ($pref !== 'en' && $pref !== 'bn') {
            $pref = Options::settings()['default_language'] === 'bn' ? 'bn' : 'en';
        }
        return $pref;
    }

    public static function persist(string $locale): void {
        $locale = $locale === 'bn' ? 'bn' : 'en';
        update_user_meta(get_current_user_id(), 'noksha_locale', $locale);
        $path = defined('COOKIEPATH') && COOKIEPATH ? COOKIEPATH : '/';
        setcookie('noksha_locale', $locale, [
            'expires' => time() + YEAR_IN_SECONDS,
            'path' => $path,
            'secure' => is_ssl(),
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        $_COOKIE['noksha_locale'] = $locale;
    }

    private function is_noksha_request(): bool {
        $uri = isset($_SERVER['REQUEST_URI']) ? (string) wp_unslash($_SERVER['REQUEST_URI']) : '';
        if (str_contains($uri, '/wp-json/noksha/')) {
            return true;
        }
        if (!is_admin()) {
            return false;
        }
        $page = isset($_GET['page']) ? sanitize_key(wp_unslash($_GET['page'])) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        return $page === 'noksha';
    }
}
