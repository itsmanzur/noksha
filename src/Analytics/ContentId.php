<?php
/**
 * The id a landing page sends to Meta, GA4 and TikTok for a product.
 *
 * Every event (ViewContent, InitiateCheckout, Purchase in the browser and the
 * Conversions API) uses the same id, so the ad platform can join them up and
 * match its catalog: the chosen variation, else the WooCommerce product, else
 * the landing page for a custom product. A store whose catalog uses other ids
 * (SKUs, "wc_post_id_123") maps them with the noksha_content_id filter.
 *
 * @package Noksha
 */

namespace Noksha\Analytics;

use Noksha\Catalog\WcProduct;

final class ContentId {
    public static function for_ids(int $page_id, int $product_id = 0, int $variation_id = 0): string {
        $id = $variation_id > 0 ? $variation_id : $product_id;
        $value = $id > 0 ? (string) $id : (string) $page_id;
        /**
         * The content id sent to ad platforms.
         *
         * @param string $value        Default: variation id, product id, or page id.
         * @param int    $page_id      Landing page.
         * @param int    $product_id   WooCommerce product (0 for a custom product).
         * @param int    $variation_id Chosen variation (0 when none).
         */
        return (string) apply_filters('noksha_content_id', $value, $page_id, $product_id, $variation_id);
    }

    /**
     * @param array<string, mixed> $offer Resolved offer.
     */
    public static function for_offer(array $offer, int $page_id): string {
        if (!WcProduct::is_wc_offer($offer)) {
            return self::for_ids($page_id);
        }
        return self::for_ids($page_id, (int) $offer['productId'], (int) ($offer['variationId'] ?? 0));
    }

    /**
     * Content id for each option of a product with options, by variation id.
     *
     * @param array<string, mixed> $offer Resolved offer.
     * @return array<string, string>
     */
    public static function for_variations(array $offer, int $page_id): array {
        $out = [];
        foreach ((array) ($offer['wc']['variations'] ?? []) as $row) {
            $out[(string) $row['id']] = self::for_ids($page_id, (int) $offer['productId'], (int) $row['id']);
        }
        return $out;
    }

    /**
     * "contents" for a placed order: one entry per line, each with its own id.
     *
     * @param list<array<string, mixed>> $items Order lines (name, qty, price, product_id, variation_id).
     * @return list<array{id:string,quantity:int,item_price:float}>
     */
    public static function contents(array $items, int $page_id): array {
        return array_map(static function (array $item) use ($page_id): array {
            return [
                'id' => self::for_ids($page_id, (int) ($item['product_id'] ?? 0), (int) ($item['variation_id'] ?? 0)),
                'quantity' => (int) ($item['qty'] ?? 1),
                'item_price' => (float) ($item['price'] ?? 0),
            ];
        }, $items);
    }
}
