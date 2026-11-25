<?php
/**
 * Clears cached landing pages when the WooCommerce product behind them changes.
 *
 * The price on a page is read live, but a page cache can keep the old HTML.
 * Checkout also refuses a stale price (see Checkout), so this only keeps the
 * page itself fresh.
 *
 * @package Noksha
 */

namespace Noksha\Front;

use Noksha\Pages\PostType;

final class CachePurge {
    public static function register_hooks(): void {
        add_action('woocommerce_update_product', [self::class, 'product_changed'], 20, 1);
        add_action('woocommerce_update_product_variation', [self::class, 'variation_changed'], 20, 1);
        // Stock counts change on every order; only a switch to or from "out of stock" matters.
        add_action('woocommerce_product_set_stock_status', [self::class, 'product_changed'], 20, 1);
        add_action('woocommerce_variation_set_stock_status', [self::class, 'variation_changed'], 20, 1);
    }

    public static function variation_changed($variation_id): void {
        $parent = (int) wp_get_post_parent_id((int) $variation_id);
        self::product_changed($parent > 0 ? $parent : (int) $variation_id);
    }

    public static function product_changed($product_id): void {
        foreach (self::pages_using((int) $product_id) as $page_id) {
            self::purge($page_id);
        }
    }

    /**
     * Published landing pages that sell, or bump, this product.
     *
     * @return list<int>
     */
    public static function pages_using(int $product_id, array $statuses = ['publish']): array {
        if ($product_id <= 0) {
            return [];
        }
        global $wpdb;
        $like = '%' . $wpdb->esc_like('"productId";i:' . $product_id . ';') . '%';
        $ids = $wpdb->get_col($wpdb->prepare(
            "SELECT m.post_id FROM {$wpdb->postmeta} m
             INNER JOIN {$wpdb->posts} p ON p.ID = m.post_id
             WHERE m.meta_key = '_noksha_offer' AND m.meta_value LIKE %s
               AND p.post_type = %s AND p.post_status IN ('" . implode("','", array_map('sanitize_key', $statuses)) . "')",
            $like,
            PostType::TYPE
        ));
        return array_map('intval', (array) $ids);
    }

    public static function purge(int $page_id): void {
        if (!(bool) apply_filters('noksha_purge_page_cache', true, $page_id)) {
            return;
        }
        clean_post_cache($page_id);
        $url = (string) get_permalink($page_id);
        // The common page caches. Each call is skipped when that plugin is absent.
        if (function_exists('rocket_clean_post')) {
            rocket_clean_post($page_id);
        }
        if (function_exists('w3tc_flush_post')) {
            w3tc_flush_post($page_id);
        }
        if (function_exists('wp_cache_post_change')) {
            wp_cache_post_change($page_id);
        }
        if (function_exists('sg_cachepress_purge_cache') && $url !== '') {
            sg_cachepress_purge_cache($url);
        }
        do_action('litespeed_purge_post', $page_id);
        /**
         * For any other cache: purge the landing page with this id.
         *
         * @param int    $page_id Landing page id.
         * @param string $url     Its public URL.
         */
        do_action('noksha_page_cache_purged', $page_id, $url);
    }
}
