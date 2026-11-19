<?php
/**
 * Remove Noksha data when the plugin is deleted from WordPress.
 *
 * @package Noksha
 */

if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

global $wpdb;

$tables = ['noksha_orders', 'noksha_order_items', 'noksha_payments', 'noksha_events'];
foreach ($tables as $table) {
    $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}{$table}"); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
}

delete_option('noksha_settings');
delete_option('noksha_secrets');
delete_option('noksha_tokens');
delete_option('noksha_db_version');

$wpdb->delete($wpdb->usermeta, ['meta_key' => 'noksha_locale']);

$ids = $wpdb->get_col("SELECT ID FROM {$wpdb->posts} WHERE post_type = 'noksha_page'");
foreach ($ids as $id) {
    wp_delete_post((int) $id, true);
}
