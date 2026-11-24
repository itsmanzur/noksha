<?php
/**
 * Removes everything fixture.php made, and the orders the browser tests placed.
 *
 * @package Noksha
 */

if (!defined('ABSPATH')) {
    exit(1);
}

global $wpdb;
$state = get_option('noksha_e2e_state', []);

// Orders the tests placed use this phone number.
$rows = $wpdb->get_results("SELECT id, wc_order_id FROM {$wpdb->prefix}noksha_orders WHERE phone = '01999000111'", ARRAY_A);
foreach ((array) $rows as $row) {
    if ((int) $row['wc_order_id'] > 0) {
        $order = wc_get_order((int) $row['wc_order_id']);
        if ($order) {
            $order->delete(true);
        }
    }
    foreach (['order_items', 'payments', 'order_notes'] as $table) {
        $wpdb->delete($wpdb->prefix . 'noksha_' . $table, ['order_id' => (int) $row['id']]);
    }
    $wpdb->delete($wpdb->prefix . 'noksha_orders', ['id' => (int) $row['id']]);
}

if (!empty($state['pageId'])) {
    wp_delete_post((int) $state['pageId'], true);
}
foreach ((array) ($state['productIds'] ?? []) as $id) {
    $product = wc_get_product((int) $id);
    if ($product) {
        foreach ($product->get_children() as $child) {
            wp_delete_post((int) $child, true);
        }
    }
    wp_delete_post((int) $id, true);
}
if (!empty($state['couponId'])) {
    wp_delete_post((int) $state['couponId'], true);
}
if (!empty($state['userId'])) {
    require_once ABSPATH . 'wp-admin/includes/user.php';
    wp_delete_user((int) $state['userId']);
}
delete_option('noksha_e2e_state');
echo 'removed ' . count((array) $rows) . " test orders and the fixture\n";
