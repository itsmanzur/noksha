<?php
/**
 * Reads a WooCommerce product live and merges it into a page offer.
 *
 * The page stores only the product id (and variation id). Name, price, image
 * and stock are read here on every render and every checkout, so the price a
 * visitor sees is always the price the order is charged.
 *
 * @package Noksha
 */

namespace Noksha\Catalog;

final class WcProduct {
    public const SOURCE_CUSTOM = 'custom';
    public const SOURCE_WC = 'woocommerce';

    public static function active(): bool {
        return class_exists('WooCommerce') && function_exists('wc_get_product');
    }

    public static function is_wc_offer(array $offer): bool {
        return ($offer['source'] ?? self::SOURCE_CUSTOM) === self::SOURCE_WC && (int) ($offer['productId'] ?? 0) > 0;
    }

    /**
     * Merge live product data into the offer. Custom offers pass through.
     *
     * The result gains a `wc` key: availability, stock and, for variable
     * products, the variation list. A product that is gone or not purchasable
     * returns `wc.available = false` so checkout can refuse it.
     *
     * @param int $variation_id Chosen variation, 0 for the default one.
     */
    public static function apply(array $offer, int $variation_id = 0): array {
        return self::apply_bump(self::apply_main($offer, $variation_id));
    }

    /**
     * A store product as the order bump. Only a simple product, and only when the
     * main product is a store product too (one WooCommerce order carries both).
     * Name, price and image are read live; a bump that cannot be bought is hidden.
     */
    private static function apply_bump(array $offer): array {
        $list = is_array($offer['bumps'] ?? null) ? $offer['bumps'] : (is_array($offer['bump'] ?? null) ? [$offer['bump']] : []);
        foreach ($list as $i => $one) {
            $list[$i] = is_array($one) ? self::apply_one_bump($offer, $one) : $one;
        }
        $offer['bumps'] = $list;
        if ($list !== []) {
            $offer['bump'] = $list[0];
        }
        return $offer;
    }

    private static function apply_one_bump(array $offer, array $bump): array {
        if (($bump['source'] ?? self::SOURCE_CUSTOM) !== self::SOURCE_WC) {
            return $bump;
        }
        $available = false;
        $product_id = (int) ($bump['productId'] ?? 0);
        if ($product_id > 0 && self::is_wc_offer($offer) && self::active()) {
            $product = wc_get_product($product_id);
            if ($product && $product->get_status() === 'publish' && $product->is_type('simple')
                && $product->is_purchasable() && $product->is_in_stock() && (float) $product->get_price() > 0) {
                $stock = self::stock_of($product);
                if ($stock === null || $stock >= 1 || $product->backorders_allowed()) {
                    $bump['name'] = $product->get_name();
                    $bump['price'] = round((float) $product->get_price(), 2);
                    $bump['imageUrl'] = self::image_url($product);
                    $available = true;
                }
            }
        }
        if (!$available) {
            $bump['enabled'] = false;
        }
        return $bump;
    }

    private static function apply_main(array $offer, int $variation_id = 0): array {
        if (!self::is_wc_offer($offer)) {
            $offer['source'] = self::SOURCE_CUSTOM;
            return $offer;
        }
        $offer['wc'] = self::unavailable('missing');
        if (!self::active()) {
            $offer['wc'] = self::unavailable('inactive');
            return $offer;
        }

        $product = wc_get_product((int) $offer['productId']);
        if (!$product || $product->get_status() !== 'publish') {
            return $offer;
        }

        if ($product->is_type('variable')) {
            return self::apply_variable($offer, $product, $variation_id);
        }
        if (!$product->is_type('simple')) {
            $offer['wc'] = self::unavailable('unsupported_type');
            return $offer;
        }
        return self::fill($offer, $product, $product, []);
    }

    private static function apply_variable(array $offer, \WC_Product $parent, int $variation_id): array {
        $variations = [];
        foreach ($parent->get_children() as $child_id) {
            $child = wc_get_product($child_id);
            if (!$child instanceof \WC_Product_Variation || $child->get_status() !== 'publish' || !$child->is_purchasable()) {
                continue;
            }
            $stock = self::stock_of($child);
            $variations[] = [
                'id' => $child->get_id(),
                'label' => self::variation_label($child),
                'price' => (float) $child->get_price(),
                'regularPrice' => (float) $child->get_regular_price(),
                'inStock' => $child->is_in_stock(),
                'stock' => $stock,
                'imageUrl' => self::image_url($child) ?: self::image_url($parent),
            ];
        }
        if ($variations === []) {
            $offer['wc'] = self::unavailable('no_variations');
            return $offer;
        }

        $chosen = (int) ($offer['variationId'] ?? 0);
        if ($variation_id > 0) {
            $chosen = $variation_id;
        }
        $ids = array_column($variations, 'id');
        if (!in_array($chosen, $ids, true)) {
            // Fall back to the first variation that can be bought.
            $chosen = 0;
            foreach ($variations as $row) {
                if ($row['inStock']) {
                    $chosen = (int) $row['id'];
                    break;
                }
            }
            if ($chosen === 0) {
                $chosen = (int) $variations[0]['id'];
            }
        }
        $variation = wc_get_product($chosen);
        if (!$variation instanceof \WC_Product_Variation) {
            $offer['wc'] = self::unavailable('missing');
            return $offer;
        }
        return self::fill($offer, $parent, $variation, $variations);
    }

    /**
     * @param list<array<string, mixed>> $variations
     */
    private static function fill(array $offer, \WC_Product $parent, \WC_Product $buy, array $variations): array {
        $price = (float) $buy->get_price();
        $regular = (float) $buy->get_regular_price();
        $stock = self::stock_of($buy);
        $in_stock = $buy->is_in_stock() && $buy->is_purchasable() && $price > 0;

        $offer['productName'] = $parent->get_name();
        $offer['price'] = round($price, 2);
        $offer['compareAt'] = ($buy->is_on_sale() && $regular > $price) ? round($regular, 2) : 0.0;
        $image = self::image_url($buy) ?: self::image_url($parent);
        if ($image !== '') {
            $offer['imageUrl'] = $image;
        }
        $offer['variationId'] = $buy->get_id() === $parent->get_id() ? 0 : $buy->get_id();
        $sale_to = $buy->is_on_sale() ? ($buy->get_date_on_sale_to() ?: $parent->get_date_on_sale_to()) : null;
        $offer['wc'] = [
            'gallery' => self::gallery($parent),
            'rating' => [
                'average' => round((float) $parent->get_average_rating(), 1),
                'count' => (int) $parent->get_review_count(),
            ],
            'saleEndsAt' => $sale_to ? $sale_to->format('c') : '',
            'available' => $in_stock,
            'reason' => $in_stock ? '' : ($price > 0 ? 'out_of_stock' : 'no_price'),
            'type' => $parent->get_type(),
            'stock' => $stock,
            'backorders' => $buy->backorders_allowed(),
            'sku' => $buy->get_sku(),
            'variations' => $variations,
        ];
        return $offer;
    }

    /**
     * Largest quantity that may be ordered, or null when stock is not limited.
     */
    public static function max_qty(array $offer): ?int {
        $wc = is_array($offer['wc'] ?? null) ? $offer['wc'] : [];
        if (!empty($wc['backorders']) || !array_key_exists('stock', $wc) || $wc['stock'] === null) {
            return null;
        }
        return max(0, (int) $wc['stock']);
    }

    /**
     * Full-name label such as "Red / Large" for a variation.
     */
    private static function variation_label(\WC_Product_Variation $variation): string {
        $parts = [];
        foreach ($variation->get_variation_attributes(false) as $key => $value) {
            if ($value === '') {
                continue;
            }
            $taxonomy = str_replace('attribute_', '', (string) $key);
            if (taxonomy_exists($taxonomy)) {
                $term = get_term_by('slug', (string) $value, $taxonomy);
                $parts[] = $term && !is_wp_error($term) ? $term->name : (string) $value;
            } else {
                $parts[] = (string) $value;
            }
        }
        return $parts !== [] ? implode(' / ', $parts) : '#' . $variation->get_id();
    }

    private static function stock_of(\WC_Product $product): ?int {
        if (!$product->managing_stock()) {
            return null;
        }
        $qty = $product->get_stock_quantity();
        return $qty === null ? null : max(0, (int) $qty);
    }

    /**
     * The product's main image and gallery, as large and thumbnail URLs.
     *
     * @return list<array{full:string,thumb:string,alt:string}>
     */
    private static function gallery(\WC_Product $product): array {
        $ids = array_merge([(int) $product->get_image_id()], array_map('intval', $product->get_gallery_image_ids()));
        $out = [];
        foreach (array_unique(array_filter($ids)) as $id) {
            $full = wp_get_attachment_image_url($id, 'large');
            if (!is_string($full) || $full === '') {
                continue;
            }
            $thumb = wp_get_attachment_image_url($id, 'thumbnail');
            $out[] = [
                'full' => $full,
                'thumb' => is_string($thumb) && $thumb !== '' ? $thumb : $full,
                'alt' => (string) get_post_meta($id, '_wp_attachment_image_alt', true),
            ];
        }
        return array_slice($out, 0, 8);
    }

    private static function image_url(\WC_Product $product): string {
        $id = (int) $product->get_image_id();
        if ($id <= 0) {
            return '';
        }
        $url = wp_get_attachment_image_url($id, 'large');
        return is_string($url) ? $url : '';
    }

    /**
     * @return array<string, mixed>
     */
    private static function unavailable(string $reason): array {
        return [
            'gallery' => [],
            'rating' => ['average' => 0.0, 'count' => 0],
            'saleEndsAt' => '',
            'available' => false,
            'reason' => $reason,
            'type' => '',
            'stock' => null,
            'backorders' => false,
            'sku' => '',
            'variations' => [],
        ];
    }

    /**
     * Search published products for the editor picker.
     *
     * @return list<array<string, mixed>>
     */
    public static function search(string $term, int $limit = 20, bool $simple_only = false): array {
        if (!self::active()) {
            return [];
        }
        $args = [
            'status' => 'publish',
            'type' => ['simple', 'variable'],
            'limit' => max(1, min(50, $limit)),
            'orderby' => 'date',
            'order' => 'DESC',
            'return' => 'objects',
        ];
        $term = trim($term);
        if ($simple_only) {
            $args['type'] = ['simple'];
        }
        if ($term !== '') {
            $args['s'] = $term;
        }
        $out = [];
        foreach ((array) wc_get_products($args) as $product) {
            if (!$product instanceof \WC_Product) {
                continue;
            }
            $out[] = [
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'type' => $product->get_type(),
                'price' => (float) $product->get_price(),
                'priceHtml' => html_entity_decode(wp_strip_all_tags($product->get_price_html()), ENT_QUOTES, 'UTF-8'),
                'sku' => $product->get_sku(),
                'inStock' => $product->is_in_stock(),
                'imageUrl' => self::image_url($product),
                // Landing pages (published or draft) already selling it.
                'pages' => count(\Noksha\Front\CachePurge::pages_using($product->get_id(), ['publish', 'draft'])),
            ];
        }
        return $out;
    }
}
