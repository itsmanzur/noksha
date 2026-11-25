<?php
/**
 * Draft landing pages made from WooCommerce products, several at once.
 *
 * Each page starts from the "single" template and takes what the product
 * has: name, short description, description and list items, attributes and
 * its own approved reviews. A template section that would only carry another
 * product's sample text (benefits or reviews the product does not have, the
 * sample guarantee) is hidden, not left in. Pages are drafts: nothing goes
 * live before someone looks at it.
 *
 * @package Noksha
 */

namespace Noksha\Pages;

use Noksha\Catalog\WcProduct;
use Noksha\Catalog\WcSuggest;

final class FromProduct {
    public const MAX = 20;

    /**
     * @return array{productId:int,pageId:int,title:string}|\WP_Error
     */
    public static function create(int $product_id, string $lang) {
        if (!WcProduct::active()) {
            return new \WP_Error('noksha_wc_inactive', 'WooCommerce is not active.', ['status' => 400]);
        }
        $product = wc_get_product($product_id);
        if (!$product || !in_array($product->get_type(), ['simple', 'variable'], true) || $product->get_status() !== 'publish') {
            return new \WP_Error('noksha_not_found', 'Product not found.', ['status' => 404]);
        }
        $suggest = WcSuggest::for_product($product_id);
        if (is_wp_error($suggest)) {
            return $suggest;
        }

        $page_id = Repository::create('single', $lang === 'bn' ? 'bn' : 'en', $product->get_name());
        if (is_wp_error($page_id)) {
            return $page_id;
        }
        $doc = Repository::payload($page_id);
        if (is_wp_error($doc)) {
            return $doc;
        }

        $offer = $doc['offer'];
        $offer['source'] = 'woocommerce';
        $offer['productId'] = $product_id;
        $offer['variationId'] = 0;

        $sections = [];
        foreach ($doc['sections'] as $section) {
            $props = $section['props'];
            switch ($section['type']) {
                case 'hero':
                    $props['eyebrow'] = '';
                    $props['title'] = $suggest['hero']['title'];
                    $props['subtitle'] = $suggest['hero']['subtitle'];
                    $props['imageUrl'] = '';
                    break;
                case 'benefits':
                    $props['items'] = $suggest['benefits'];
                    $section['hidden'] = $suggest['benefits'] === [];
                    break;
                case 'product':
                    $props['title'] = $suggest['hero']['title'];
                    $props['text'] = $suggest['info']['text'];
                    $props['bullets'] = $suggest['info']['bullets'];
                    $props['imageUrl'] = '';
                    break;
                case 'reviews':
                    $props['items'] = $suggest['reviews'];
                    $section['hidden'] = $suggest['reviews'] === [];
                    break;
                case 'guarantee':
                    // The template's guarantee is about another product.
                    $section['hidden'] = true;
                    break;
            }
            $section['props'] = $props;
            $sections[] = $section;
        }

        $saved = Repository::update($page_id, [
            'title' => $product->get_name(),
            'slug' => sanitize_title($product->get_name()),
            'status' => 'draft',
            'offer' => $offer,
            'sections' => $sections,
        ]);
        if (is_wp_error($saved)) {
            wp_delete_post($page_id, true);
            return $saved;
        }
        return ['productId' => $product_id, 'pageId' => (int) $page_id, 'title' => $product->get_name()];
    }

    /**
     * Pages already selling each product, so the screen can say so before making another.
     *
     * @param list<int> $product_ids
     * @return array<int, list<int>> product id => page ids
     */
    public static function existing(array $product_ids): array {
        $out = [];
        foreach ($product_ids as $product_id) {
            $pages = \Noksha\Front\CachePurge::pages_using((int) $product_id, ['publish', 'draft']);
            if ($pages !== []) {
                $out[(int) $product_id] = $pages;
            }
        }
        return $out;
    }
}
