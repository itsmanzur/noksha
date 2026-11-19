<?php
/**
 * WordPress admin screen that mounts the Noksha app.
 *
 * @package Noksha
 */

namespace Noksha\Admin;

use Noksha\Brand\Tokens;
use Noksha\Caps;
use Noksha\I18n\Locale;
use Noksha\Options;
// Prefs lives in this namespace.

final class Menu {
    public function register(): void {
        add_action('admin_menu', [$this, 'menu']);
        add_action('admin_enqueue_scripts', [$this, 'assets']);
        add_filter('admin_body_class', [$this, 'body_class']);
    }

    public function menu(): void {
        add_menu_page(
            'Noksha',
            'Noksha',
            Caps::MANAGE,
            'noksha',
            [$this, 'render'],
            'dashicons-welcome-widgets-menus',
            56
        );
    }

    public function render(): void {
        echo '<div id="noksha-root"></div>';
    }

    public function body_class(string $classes): string {
        $screen = function_exists('get_current_screen') ? get_current_screen() : null;
        if ($screen && $screen->id === 'toplevel_page_noksha') {
            $classes .= ' noksha-screen';
        }
        return $classes;
    }

    public function assets(string $hook): void {
        if ($hook !== 'toplevel_page_noksha') {
            return;
        }
        wp_enqueue_media();
        wp_enqueue_style(
            'noksha-fonts',
            NOKSHA_URL . 'assets/fonts.css',
            [],
            NOKSHA_VERSION
        );

        $asset_path = NOKSHA_DIR . 'build/admin.asset.php';
        $script_path = NOKSHA_DIR . 'build/admin.js';
        if (!is_file($asset_path) || !is_file($script_path)) {
            wp_add_inline_style('wp-admin', '');
            add_action('admin_notices', static function (): void {
                echo '<div class="notice notice-error"><p>' . esc_html__('Noksha admin assets are missing. Run npm run build inside the plugin folder.', 'noksha') . '</p></div>';
            });
            return;
        }

        $asset = require $asset_path;
        $dependencies = array_values(array_filter(
            (array) ($asset['dependencies'] ?? []),
            static function ($handle): bool {
                return is_string($handle) && wp_script_is($handle, 'registered');
            }
        ));
        wp_enqueue_script(
            'noksha-admin',
            NOKSHA_URL . 'build/admin.js',
            $dependencies,
            $asset['version'],
            true
        );
        $style_deps = ['noksha-fonts'];
        if (is_file(NOKSHA_DIR . 'build/admin.css')) {
            wp_enqueue_style(
                'noksha-admin-app',
                NOKSHA_URL . 'build/admin.css',
                $style_deps,
                $asset['version']
            );
            wp_style_add_data('noksha-admin-app', 'rtl', 'replace');
            $style_deps[] = 'noksha-admin-app';
        }
        if (is_file(NOKSHA_DIR . 'build/style-admin.css')) {
            wp_enqueue_style(
                'noksha-admin',
                NOKSHA_URL . 'build/style-admin.css',
                $style_deps,
                $asset['version']
            );
            wp_style_add_data('noksha-admin', 'rtl', 'replace');
        }
        $locale = Locale::preference();
        $user = wp_get_current_user();
        $settings = Options::settings();
        $store = trim((string) ($settings['store_name'] ?? ''));
        if ($store === '') {
            $store = trim((string) get_bloginfo('name')) ?: 'Noksha';
        }
        wp_add_inline_script(
            'noksha-admin',
            'window.nokshaBoot = ' . wp_json_encode([
                'root' => esc_url_raw(rest_url('noksha/v1/')),
                'nonce' => wp_create_nonce('wp_rest'),
                'locale' => $locale,
                'theme' => Prefs::theme(),
                'tokens' => Tokens::current(),
                'sandbox' => (bool) $settings['sandbox'],
                'user' => $user->display_name,
                'userInitial' => strtoupper(substr((string) ($user->display_name ?: $user->user_login), 0, 1)),
                'storeName' => $store,
                'counts' => Prefs::shell_counts(),
                'debug' => defined('WP_DEBUG') && WP_DEBUG,
                'unfilteredHtml' => current_user_can('unfiltered_html'),
                'version' => NOKSHA_VERSION,
            ]) . ';',
            'before'
        );
    }
}
