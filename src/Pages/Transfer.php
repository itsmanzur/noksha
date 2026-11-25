<?php
/**
 * Page export and import: one JSON file that holds a whole page.
 *
 * Shared blocks are written out as normal sections (the other site does not
 * have them). Images are kept as their URLs. The store product travels by id
 * and SKU: on the same site the id is used, elsewhere the SKU is looked up,
 * and without a match the page imports without the product.
 *
 * @package Noksha
 */

namespace Noksha\Pages;

final class Transfer {
    public const FORMAT = 'noksha-page';
    public const VERSION = 1;
    public const MAX_BYTES = 2000000;

    /**
     * @return array<string, mixed>|\WP_Error
     */
    public static function export(int $page_id) {
        $post = get_post($page_id);
        if (!$post || $post->post_type !== PostType::TYPE) {
            return new \WP_Error('noksha_not_found', 'Page not found.', ['status' => 404]);
        }
        $doc = Repository::document($page_id);
        $offer = $doc['offer'];
        unset($offer['wc']);
        $offer['productSku'] = self::sku((int) ($offer['productId'] ?? 0));
        $sections = [];
        foreach ($doc['sections'] as $section) {
            if (($section['type'] ?? '') === 'shared') {
                $inner = Library::shared_section((string) ($section['props']['ref'] ?? ''));
                if ($inner === null) {
                    continue;
                }
                $inner['id'] = $section['id'];
                $inner['hidden'] = !empty($section['hidden']);
                $section = $inner;
            }
            $sections[] = $section;
        }
        return [
            'format' => self::FORMAT,
            'version' => self::VERSION,
            'site' => self::site(),
            'exportedAt' => gmdate('c'),
            'title' => $post->post_title,
            'language' => $doc['language'],
            'motion' => $doc['motion'],
            'sections' => $sections,
            'offer' => $offer,
            'checkout' => $doc['checkout'],
            'tokens' => $doc['tokens'],
            'seo' => $doc['seo'],
        ];
    }

    /**
     * A new draft page from an exported file.
     *
     * @return array{id:int,productKept:bool,productDropped:bool}|\WP_Error
     */
    public static function import($data, string $title = '') {
        if (!is_array($data) || ($data['format'] ?? '') !== self::FORMAT || !is_array($data['sections'] ?? null)) {
            return new \WP_Error('noksha_bad_file', 'This is not a Noksha page file.', ['status' => 400]);
        }
        if ((int) ($data['version'] ?? 0) > self::VERSION) {
            return new \WP_Error('noksha_bad_file', 'This file is from a newer Noksha. Update the plugin first.', ['status' => 400]);
        }
        if (strlen((string) wp_json_encode($data)) > self::MAX_BYTES) {
            return new \WP_Error('noksha_bad_file', 'The file is too large.', ['status' => 400]);
        }
        $offer = is_array($data['offer'] ?? null) ? $data['offer'] : [];
        [$offer, $kept, $dropped] = self::match_product($offer, ($data['site'] ?? '') === self::site());
        $sections = array_values(array_filter($data['sections'], static fn($section) => is_array($section) && ($section['type'] ?? '') !== 'shared'));

        $title = $title !== '' ? $title : (string) ($data['title'] ?? '');
        $page_id = Repository::create('blank', ($data['language'] ?? 'en') === 'bn' ? 'bn' : 'en', $title !== '' ? $title : 'Imported page');
        if (is_wp_error($page_id)) {
            return $page_id;
        }
        $saved = Repository::update($page_id, [
            'status' => 'draft',
            'motion' => (string) ($data['motion'] ?? 'simple'),
            'sections' => Library::fresh_ids($sections),
            'offer' => $offer,
            'checkout' => is_array($data['checkout'] ?? null) ? $data['checkout'] : [],
            'tokens' => is_array($data['tokens'] ?? null) ? $data['tokens'] : null,
            'seo' => is_array($data['seo'] ?? null) ? $data['seo'] : [],
        ]);
        if (is_wp_error($saved)) {
            wp_delete_post($page_id, true);
            return $saved;
        }
        return ['id' => (int) $page_id, 'productKept' => $kept, 'productDropped' => $dropped];
    }

    /**
     * Keep the store product when it can be found here; otherwise sell nothing from the store.
     *
     * @return array{0:array,1:bool,2:bool} Offer, product kept, product dropped.
     */
    private static function match_product(array $offer, bool $same_site): array {
        $sku = sanitize_text_field((string) ($offer['productSku'] ?? ''));
        unset($offer['productSku'], $offer['wc']);
        if (($offer['source'] ?? '') !== 'woocommerce') {
            return [$offer, false, false];
        }
        $id = (int) ($offer['productId'] ?? 0);
        $found = 0;
        if ($same_site && $id > 0 && function_exists('wc_get_product') && wc_get_product($id)) {
            $found = $id;
        } elseif ($sku !== '' && function_exists('wc_get_product_id_by_sku')) {
            $found = (int) wc_get_product_id_by_sku($sku);
        }
        if ($found > 0) {
            if ($found !== $id) {
                // Another site: the option ids differ too, so start from the product's default.
                $offer['variationId'] = 0;
            }
            $offer['productId'] = $found;
            if (!$same_site) {
                $offer['bumps'] = self::local_bumps($offer['bumps'] ?? []);
                $offer['bump'] = $offer['bumps'][0] ?? ['enabled' => false];
            }
            return [$offer, true, false];
        }
        return [Library::without_product($offer), false, true];
    }

    /**
     * On another site, store-product add-ons point at the wrong ids: keep only the page's own.
     *
     * @return list<array<string, mixed>>
     */
    private static function local_bumps($bumps): array {
        return array_values(array_filter((array) $bumps, static fn($bump) => is_array($bump) && ($bump['source'] ?? '') !== 'woocommerce'));
    }

    private static function sku(int $product_id): string {
        if ($product_id <= 0 || !function_exists('wc_get_product')) {
            return '';
        }
        $product = wc_get_product($product_id);
        return $product ? (string) $product->get_sku() : '';
    }

    /** A short mark for "this site", without writing the address into the file. */
    private static function site(): string {
        return substr(hash('sha256', (string) home_url('/') . wp_salt('auth')), 0, 16);
    }
}
