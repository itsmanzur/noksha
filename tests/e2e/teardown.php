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

foreach (['pageId', 'shipPageId'] as $key) {
    if (!empty($state[$key])) {
        wp_delete_post((int) $state[$key], true);
    }
}
// Pages the browser tests made from the fixture products.
foreach ((array) ($state['productIds'] ?? []) as $id) {
    foreach (Noksha\Front\CachePurge::pages_using((int) $id, ['publish', 'draft']) as $made_page) {
        wp_delete_post((int) $made_page, true);
    }
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
foreach ((array) ($state['attachmentIds'] ?? []) as $attachment_id) {
    wp_delete_attachment((int) $attachment_id, true);
}
if (!empty($state['couponId'])) {
    wp_delete_post((int) $state['couponId'], true);
}
if (!empty($state['userId'])) {
    require_once ABSPATH . 'wp-admin/includes/user.php';
    wp_delete_user((int) $state['userId']);
}
// "My sections" / "My templates" the tests saved, and pages made from them.
foreach (Noksha\Pages\Library::all() as $item) {
    if (str_starts_with((string) $item['name'], 'E2E ')) {
        Noksha\Pages\Library::delete((string) $item['id']);
    }
}
foreach (get_posts(['post_type' => Noksha\Pages\PostType::TYPE, 'post_status' => 'any', 'numberposts' => 50, 's' => 'E2E from template']) as $made) {
    wp_delete_post($made->ID, true);
}
delete_option('noksha_e2e_state');
echo 'removed ' . count((array) $rows) . " test orders and the fixture\n";
