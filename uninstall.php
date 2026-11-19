<?php
/**
 * Remove Noksha data when the plugin is deleted from WordPress.
 *
 * @package Noksha
 */

if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

/**
 * @param int $blog_id
 */
function noksha_uninstall_site(int $blog_id = 0): void {
    if ($blog_id > 0) {
        switch_to_blog($blog_id);
    }

    global $wpdb;

    $tables = [
        'noksha_orders',
        'noksha_order_items',
        'noksha_payments',
        'noksha_events',
        'noksha_leads',
        'noksha_order_notes',
        'noksha_blacklist',
    ];
    foreach ($tables as $table) {
        $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}{$table}"); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
    }

    foreach ([
        'noksha_settings',
        'noksha_secrets',
        'noksha_tokens',
        'noksha_db_version',
        'noksha_onboarding',
        'noksha_blacklist',
        'noksha_activation_error',
    ] as $option) {
        delete_option($option);
    }

    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_noksha_%' OR option_name LIKE '_transient_timeout_noksha_%'");
    $wpdb->delete($wpdb->usermeta, ['meta_key' => 'noksha_locale']);

    if (get_role('noksha_manager')) {
        remove_role('noksha_manager');
    }
    foreach (wp_roles()->roles as $role_key => $_role) {
        $role = get_role($role_key);
        if (!$role) {
            continue;
        }
        $role->remove_cap('noksha_manage');
        $role->remove_cap('noksha_manage_settings');
    }

    $ids = $wpdb->get_col("SELECT ID FROM {$wpdb->posts} WHERE post_type = 'noksha_page'");
    foreach ($ids as $id) {
        wp_delete_post((int) $id, true);
    }

    if ($blog_id > 0) {
        restore_current_blog();
    }
}

if (is_multisite()) {
    $site_ids = get_sites(['fields' => 'ids', 'number' => 0]);
    foreach ($site_ids as $site_id) {
        noksha_uninstall_site((int) $site_id);
    }
} else {
    noksha_uninstall_site();
}
