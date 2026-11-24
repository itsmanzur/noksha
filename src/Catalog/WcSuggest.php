<?php
/**
 * Page content suggested from a WooCommerce product, for the editor to offer.
 *
 * Nothing here is written to a page. The editor shows these and the person
 * decides what to use, so text that does not fit never goes live by itself.
 * Reviews are the product's own approved reviews, never invented.
 *
 * @package Noksha
 */

namespace Noksha\Catalog;

final class WcSuggest {
    /**
     * @return array<string, mixed>|\WP_Error
     */
    public static function for_product(int $product_id) {
        if (!WcProduct::active()) {
            return new \WP_Error('noksha_wc_inactive', 'WooCommerce is not active.', ['status' => 400]);
        }
        $product = wc_get_product($product_id);
        if (!$product || $product->get_type() === 'variation') {
            return new \WP_Error('noksha_not_found', 'Product not found.', ['status' => 404]);
        }

        $short_html = (string) $product->get_short_description();
        $long_html = (string) $product->get_description();
        $short = self::plain($short_html);
        $long = self::plain($long_html);

        $subtitle = $short !== '' ? $short : $long;
        $bullets = self::list_items($short_html . "\n" . $long_html);
        $benefits = self::attributes($product);
        if ($benefits === []) {
            foreach (array_slice($bullets, 0, 6) as $line) {
                $benefits[] = ['title' => self::clip($line, 120), 'text' => ''];
            }
        }
        if ($bullets === []) {
            foreach ($benefits as $pair) {
                $bullets[] = self::clip($pair['text'] !== '' ? $pair['title'] . ': ' . $pair['text'] : $pair['title'], 160);
            }
        }

        return [
            'product' => [
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'type' => $product->get_type(),
            ],
            'hero' => [
                'title' => self::clip($product->get_name(), 120),
                'subtitle' => self::clip($subtitle, 160),
            ],
            'info' => [
                'text' => self::clip($long !== '' ? $long : $short, 800),
                'bullets' => array_slice($bullets, 0, 8),
            ],
            'benefits' => array_slice($benefits, 0, 6),
            'reviews' => self::reviews($product),
        ];
    }

    private static function plain(string $html): string {
        $html = preg_replace('/<\s*(br|\/p|\/li|\/h[1-6]|\/div)\s*\/?>/i', "\n", $html) ?? $html;
        $text = html_entity_decode(wp_strip_all_tags($html), ENT_QUOTES, 'UTF-8');
        $text = preg_replace('/[ \t]+/', ' ', $text) ?? $text;
        $text = preg_replace('/\s*\n\s*/', "\n", $text) ?? $text;
        return trim($text);
    }

    private static function clip(string $text, int $limit): string {
        $text = trim(preg_replace('/\s+/', ' ', $text) ?? $text);
        return noksha_clip($text, $limit);
    }

    /**
     * The bullet points in the product's description (<li> items).
     *
     * @return list<string>
     */
    private static function list_items(string $html): array {
        $out = [];
        if (preg_match_all('/<li[^>]*>(.*?)<\/li>/is', $html, $found)) {
            foreach ($found[1] as $item) {
                $line = self::clip(self::plain((string) $item), 160);
                if ($line !== '' && !in_array($line, $out, true)) {
                    $out[] = $line;
                }
            }
        }
        return $out;
    }

    /**
     * Visible attributes ("Material: Cotton") as title and text pairs.
     *
     * @return list<array{title:string,text:string}>
     */
    private static function attributes(\WC_Product $product): array {
        $out = [];
        foreach ($product->get_attributes() as $attribute) {
            if (!$attribute instanceof \WC_Product_Attribute || !$attribute->get_visible()) {
                continue;
            }
            $values = [];
            if ($attribute->is_taxonomy()) {
                foreach ($attribute->get_terms() ?: [] as $term) {
                    $values[] = $term->name;
                }
            } else {
                $values = array_map('trim', $attribute->get_options());
            }
            $values = array_values(array_filter($values, static fn($value) => $value !== ''));
            if ($values === []) {
                continue;
            }
            $out[] = [
                'title' => self::clip(wc_attribute_label($attribute->get_name()), 120),
                'text' => self::clip(implode(', ', $values), 300),
            ];
        }
        return $out;
    }

    /**
     * The product's own approved reviews with 4 stars or more, verified buyers first.
     *
     * @return list<array{id:int,name:string,text:string,rating:int,verified:bool}>
     */
    private static function reviews(\WC_Product $product): array {
        $comments = get_comments([
            'post_id' => $product->get_id(),
            'status' => 'approve',
            'type' => 'review',
            'parent' => 0,
            'number' => 40,
            'orderby' => 'comment_date_gmt',
            'order' => 'DESC',
        ]);
        $rows = [];
        foreach ((array) $comments as $comment) {
            $rating = (int) get_comment_meta((int) $comment->comment_ID, 'rating', true);
            $text = self::clip(self::plain((string) $comment->comment_content), 300);
            if ($rating < 4 || $text === '') {
                continue;
            }
            $rows[] = [
                'id' => (int) $comment->comment_ID,
                'name' => self::clip((string) $comment->comment_author, 120),
                'text' => $text,
                'rating' => min(5, $rating),
                'verified' => (bool) wc_review_is_from_verified_owner((int) $comment->comment_ID),
            ];
        }
        usort($rows, static function (array $a, array $b): int {
            return [(int) $b['verified'], $b['rating'], strlen($b['text'])] <=> [(int) $a['verified'], $a['rating'], strlen($a['text'])];
        });
        return array_slice($rows, 0, 8);
    }
}
