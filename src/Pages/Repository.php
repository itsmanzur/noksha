<?php
/**
 * Reads and writes landing page documents.
 *
 * @package Noksha
 */

namespace Noksha\Pages;

use Noksha\Catalog\WcProduct;

final class Repository {
    public static function create(string $template, string $lang, string $title = ''): int|\WP_Error {
        $doc = Templates::make($template, $lang);
        if ($title !== '') {
            $doc['title'] = sanitize_text_field($title);
        }
        $id = wp_insert_post([
            'post_type' => PostType::TYPE,
            'post_status' => 'draft',
            'post_title' => $doc['title'],
            'post_name' => sanitize_title($doc['title']),
        ], true);
        if (is_wp_error($id)) {
            return $id;
        }
        self::write_meta((int) $id, $doc);
        return (int) $id;
    }

    public static function update(int $id, array $input): array|\WP_Error {
        $post = get_post($id);
        if (!$post || $post->post_type !== PostType::TYPE) {
            return new \WP_Error('noksha_not_found', 'Page not found.', ['status' => 404]);
        }
        $current = self::document($id);
        $doc = Sanitizer::document($input, $current);
        $title = sanitize_text_field((string) ($input['title'] ?? $post->post_title));
        if ($title === '') {
            $title = $post->post_title;
        }
        $status = ($input['status'] ?? $post->post_status) === 'publish' ? 'publish' : 'draft';
        $slug = sanitize_title((string) ($input['slug'] ?? $post->post_name));
        if ($slug === '') {
            $slug = sanitize_title($title);
        }
        $result = wp_update_post([
            'ID' => $id,
            'post_title' => $title,
            'post_status' => $status,
            'post_name' => $slug,
        ], true);
        if (is_wp_error($result)) {
            return $result;
        }
        self::write_meta($id, $doc);
        return self::payload($id);
    }

    /** @var array<int, array|\WP_Error> */
    private static array $payload_cache = [];

    /**
     * Drop the payload kept for this request, so the next read is fresh.
     * A request reads each page once; this is for code that changes a product
     * and then reads the page again (long scripts, tests).
     */
    public static function forget_cached(int $id): void {
        unset(self::$payload_cache[$id]);
    }

    public static function payload(int $id): array|\WP_Error {
        if (array_key_exists($id, self::$payload_cache)) {
            return self::$payload_cache[$id];
        }
        $post = get_post($id);
        if (!$post || $post->post_type !== PostType::TYPE) {
            self::$payload_cache[$id] = new \WP_Error('noksha_not_found', 'Page not found.', ['status' => 404]);
            return self::$payload_cache[$id];
        }
        $doc = self::document($id);
        self::$payload_cache[$id] = [
            'id' => $id,
            'title' => $post->post_title,
            'slug' => $post->post_name,
            'status' => $post->post_status === 'publish' ? 'publish' : 'draft',
            'link' => $post->post_status === 'publish' ? get_permalink($id) : '',
            'previewLink' => get_preview_post_link($post),
            'updatedAt' => get_post_modified_time('c', true, $post),
            'language' => $doc['language'],
            'motion' => $doc['motion'],
            'offer' => $doc['offer'],
            'checkout' => $doc['checkout'],
            'sections' => $doc['sections'],
            'tokens' => $doc['tokens'],
            'seo' => $doc['seo'],
            'ab' => $doc['ab'],
        ];
        return self::$payload_cache[$id];
    }

    public static function document(int $id): array {
        $language = get_post_meta($id, '_noksha_language', true);
        $motion = get_post_meta($id, '_noksha_motion', true);
        $sections = get_post_meta($id, '_noksha_sections', true);
        $checkout = get_post_meta($id, '_noksha_checkout', true);
        $offer = get_post_meta($id, '_noksha_offer', true);
        $tokens = get_post_meta($id, '_noksha_tokens', true);
        $seo = get_post_meta($id, '_noksha_seo', true);
        $ab = get_post_meta($id, '_noksha_ab', true);
        $doc = Sanitizer::document([
            'language' => is_string($language) ? $language : 'en',
            'motion' => is_string($motion) ? $motion : 'simple',
            'sections' => is_array($sections) ? $sections : [],
            'checkout' => is_array($checkout) ? $checkout : [],
            'offer' => is_array($offer) ? $offer : [],
            'tokens' => is_array($tokens) ? $tokens : null,
            'seo' => is_array($seo) ? $seo : [],
            'ab' => is_array($ab) ? $ab : [],
        ], null, true);
        // WooCommerce offers read name, price, image and stock live.
        $doc['offer'] = WcProduct::apply($doc['offer']);
        return $doc;
    }

    private static function write_meta(int $id, array $doc): void {
        // Live WooCommerce data is never stored on the page; only the ids are.
        unset($doc['offer']['wc']);
        // A saved page must not be answered from a payload cached before the save.
        unset(self::$payload_cache[$id]);
        update_post_meta($id, '_noksha_language', $doc['language']);
        update_post_meta($id, '_noksha_motion', $doc['motion'] ?? 'simple');
        update_post_meta($id, '_noksha_sections', $doc['sections']);
        update_post_meta($id, '_noksha_checkout', $doc['checkout']);
        update_post_meta($id, '_noksha_offer', $doc['offer']);
        update_post_meta($id, '_noksha_seo', $doc['seo'] ?? Sanitizer::seo([]));
        update_post_meta($id, '_noksha_ab', $doc['ab'] ?? Sanitizer::ab([]));
        if (is_array($doc['tokens'])) {
            update_post_meta($id, '_noksha_tokens', $doc['tokens']);
        } else {
            delete_post_meta($id, '_noksha_tokens');
        }
    }
}
