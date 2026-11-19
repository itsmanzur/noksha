<?php
/**
 * Reads and writes landing page documents.
 *
 * @package Noksha
 */

namespace Noksha\Pages;

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

    public static function payload(int $id): array|\WP_Error {
        $post = get_post($id);
        if (!$post || $post->post_type !== PostType::TYPE) {
            return new \WP_Error('noksha_not_found', 'Page not found.', ['status' => 404]);
        }
        $doc = self::document($id);
        return [
            'id' => $id,
            'title' => $post->post_title,
            'slug' => $post->post_name,
            'status' => $post->post_status === 'publish' ? 'publish' : 'draft',
            'link' => $post->post_status === 'publish' ? get_permalink($id) : '',
            'previewLink' => get_preview_post_link($post),
            'updatedAt' => get_post_modified_time('c', true, $post),
            'language' => $doc['language'],
            'offer' => $doc['offer'],
            'checkout' => $doc['checkout'],
            'sections' => $doc['sections'],
            'tokens' => $doc['tokens'],
            'seo' => $doc['seo'],
            'ab' => $doc['ab'],
        ];
    }

    public static function document(int $id): array {
        $language = get_post_meta($id, '_noksha_language', true);
        $sections = get_post_meta($id, '_noksha_sections', true);
        $checkout = get_post_meta($id, '_noksha_checkout', true);
        $offer = get_post_meta($id, '_noksha_offer', true);
        $tokens = get_post_meta($id, '_noksha_tokens', true);
        $seo = get_post_meta($id, '_noksha_seo', true);
        $ab = get_post_meta($id, '_noksha_ab', true);
        return Sanitizer::document([
            'language' => is_string($language) ? $language : 'en',
            'sections' => is_array($sections) ? $sections : [],
            'checkout' => is_array($checkout) ? $checkout : [],
            'offer' => is_array($offer) ? $offer : [],
            'tokens' => is_array($tokens) ? $tokens : null,
            'seo' => is_array($seo) ? $seo : [],
            'ab' => is_array($ab) ? $ab : [],
        ], null, true);
    }

    private static function write_meta(int $id, array $doc): void {
        update_post_meta($id, '_noksha_language', $doc['language']);
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
