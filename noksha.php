<?php
/**
 * Plugin Name: Noksha
 * Description: Bangladesh-first landing pages with checkout, payments, and analytics.
 * Version: 0.1.4
 * Requires at least: 6.6
 * Requires PHP: 8.1
 * Author: Noksha
 * Text Domain: noksha
 * Domain Path: /languages
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 *
 * @package Noksha
 */

if (!defined('ABSPATH')) {
    exit;
}

define('NOKSHA_VERSION', '0.1.4');
define('NOKSHA_FILE', __FILE__);
define('NOKSHA_DIR', plugin_dir_path(__FILE__));
define('NOKSHA_URL', plugin_dir_url(__FILE__));

if (version_compare(PHP_VERSION, '8.1', '<')) {
    add_action('admin_notices', static function () {
        echo '<div class="notice notice-error"><p>' . esc_html(sprintf(
            'Noksha needs PHP 8.1 or newer. This site is running PHP %s.',
            PHP_VERSION
        )) . '</p></div>';
    });
    return;
}

spl_autoload_register(static function (string $class): void {
    $prefix = 'Noksha\\';
    if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
        return;
    }
    $relative = substr($class, strlen($prefix));
    $path = NOKSHA_DIR . 'src/' . str_replace('\\', '/', $relative) . '.php';
    if (function_exists('wp_normalize_path')) {
        $path = wp_normalize_path($path);
    }
    if (is_file($path)) {
        require_once $path;
    }
});

/**
 * Shorten text when the mbstring extension is turned off.
 */
function noksha_clip(string $text, int $limit): string {
    if (function_exists('mb_substr')) {
        return mb_substr($text, 0, $limit);
    }
    return substr($text, 0, $limit);
}

/**
 * Activation stays inside WordPress even when table setup fails.
 */
function noksha_activate(): void {
    try {
        if (!is_file(NOKSHA_DIR . 'src/Activator.php')) {
            update_option(
                'noksha_activation_error',
                'Noksha is missing src/Activator.php. Copy the whole noksha folder into wp-content/plugins/noksha.',
                false
            );
            return;
        }
        \Noksha\Activator::activate();
        delete_option('noksha_activation_error');
    } catch (\Throwable $error) {
        update_option('noksha_activation_error', $error->getMessage(), false);
    }
}

function noksha_activation_notice(): void {
    $message = get_option('noksha_activation_error');
    if (!is_string($message) || $message === '') {
        return;
    }
    echo '<div class="notice notice-error"><p>' . esc_html($message) . '</p></div>';
}

register_activation_hook(NOKSHA_FILE, 'noksha_activate');
register_deactivation_hook(NOKSHA_FILE, ['Noksha\\Activator', 'deactivate']);
add_action('admin_notices', 'noksha_activation_notice');

add_action('plugins_loaded', static function (): void {
    try {
        Noksha\Plugin::instance()->boot();
    } catch (\Throwable $error) {
        update_option('noksha_activation_error', $error->getMessage(), false);
    }
});
