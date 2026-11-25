<?php
/**
 * Bilingual pages: an English page and a Bangla page linked to each other.
 *
 * Each page keeps its own sections, offer and orders; the link only adds a
 * language switch on both pages and hreflang tags for search engines.
 *
 * @package Noksha
 */

namespace Noksha\Pages;

final class Translation {
    private const META = '_noksha_translation';

    /**
     * The linked page in the other language, when the link holds both ways.
     *
     * @return array{id:int,title:string,language:string,status:string,link:string}|null
     */
    public static function of(int $page_id): ?array {
        $other_id = (int) get_post_meta($page_id, self::META, true);
        if ($other_id <= 0 || (int) get_post_meta($other_id, self::META, true) !== $page_id) {
            return null;
        }
        $other = get_post($other_id);
        if (!$other || $other->post_type !== PostType::TYPE || $other->post_status === 'trash') {
            return null;
        }
        $published = $other->post_status === 'publish';
        return [
            'id' => $other_id,
            'title' => $other->post_title,
            'language' => self::language($other_id),
            'status' => $published ? 'publish' : 'draft',
            'link' => $published ? (string) get_permalink($other) : '',
        ];
    }

    /**
     * Link two pages in different languages (0 unlinks). Old partners are unlinked.
     *
     * @return true|\WP_Error
     */
    public static function link(int $page_id, int $other_id) {
        if (!self::is_page($page_id)) {
            return new \WP_Error('noksha_not_found', 'Page not found.', ['status' => 404]);
        }
        if ($other_id !== 0) {
            if ($other_id === $page_id || !self::is_page($other_id)) {
                return new \WP_Error('noksha_not_found', 'Page not found.', ['status' => 404]);
            }
            if (self::language($other_id) === self::language($page_id)) {
                return new \WP_Error('noksha_same_language', 'Pick a page in the other language.', ['status' => 400]);
            }
        }
        $touched = [$page_id];
        foreach (array_filter([$page_id, $other_id]) as $id) {
            $old = (int) get_post_meta($id, self::META, true);
            if ($old > 0 && (int) get_post_meta($old, self::META, true) === $id) {
                delete_post_meta($old, self::META);
                $touched[] = $old;
            }
            delete_post_meta($id, self::META);
        }
        if ($other_id !== 0) {
            update_post_meta($page_id, self::META, $other_id);
            update_post_meta($other_id, self::META, $page_id);
            $touched[] = $other_id;
        }
        foreach (array_unique($touched) as $id) {
            Repository::forget_cached($id);
            \Noksha\Front\CachePurge::purge($id);
        }
        return true;
    }

    /**
     * A draft copy of the page in the other language, linked to it. The text stays
     * as it is (translate it in the editor); the order form's words follow the language.
     *
     * @return int|\WP_Error The new page id.
     */
    public static function create_copy(int $page_id) {
        $post = get_post($page_id);
        if (!self::is_page($page_id) || !$post) {
            return new \WP_Error('noksha_not_found', 'Page not found.', ['status' => 404]);
        }
        $other_lang = self::language($page_id) === 'bn' ? 'en' : 'bn';
        $copy = Repository::duplicate($page_id, $post->post_title . ($other_lang === 'bn' ? ' (বাংলা)' : ' (English)'));
        if (is_wp_error($copy)) {
            return $copy;
        }
        $saved = Repository::update($copy, ['language' => $other_lang], 'none');
        if (is_wp_error($saved)) {
            wp_delete_post($copy, true);
            return $saved;
        }
        $linked = self::link($page_id, $copy);
        return is_wp_error($linked) ? $linked : (int) $copy;
    }

    /**
     * A page going live or offline changes its partner's switch, so the partner's
     * cached copy is cleared.
     *
     * @param \WP_Post $post
     */
    public static function status_changed(string $new_status, string $old_status, $post): void {
        if ($new_status === $old_status || !($post instanceof \WP_Post) || $post->post_type !== PostType::TYPE) {
            return;
        }
        $other = self::of((int) $post->ID);
        if ($other !== null) {
            Repository::forget_cached($other['id']);
            \Noksha\Front\CachePurge::purge($other['id']);
        }
    }

    /** When a page is deleted, its partner loses the link. */
    public static function delete_for(int $post_id): void {
        if (get_post_type($post_id) !== PostType::TYPE) {
            return;
        }
        $other = (int) get_post_meta($post_id, self::META, true);
        if ($other > 0 && (int) get_post_meta($other, self::META, true) === $post_id) {
            delete_post_meta($other, self::META);
            \Noksha\Front\CachePurge::purge($other);
        }
    }

    /**
     * The language switch drawn at the top of the page.
     */
    public static function switcher(array $payload, bool $preview): string {
        $other = is_array($payload['translation'] ?? null) ? $payload['translation'] : null;
        if ($other === null || ($other['link'] === '' && !$preview)) {
            return '';
        }
        $current = ($payload['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        $names = ['en' => 'English', 'bn' => 'বাংলা'];
        $href = $other['link'] !== '' ? $other['link'] : '#';
        return '<nav class="nk-lang-switch" aria-label="' . esc_attr($current === 'bn' ? 'ভাষা' : 'Language') . '">'
            . '<span class="is-current" lang="' . $current . '" aria-current="true">' . esc_html($names[$current]) . '</span>'
            . '<a href="' . esc_url($href) . '" lang="' . esc_attr($other['language']) . '" hreflang="' . esc_attr($other['language']) . '">' . esc_html($names[$other['language']] ?? $other['language']) . '</a>'
            . '</nav>';
    }

    /**
     * hreflang tags for both published pages.
     */
    public static function head_links(array $payload): string {
        $other = is_array($payload['translation'] ?? null) ? $payload['translation'] : null;
        $self = (string) ($payload['link'] ?? '');
        if ($other === null || $other['link'] === '' || $self === '') {
            return '';
        }
        $lang = ($payload['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        return '<link rel="alternate" hreflang="' . $lang . '" href="' . esc_url($self) . '">'
            . '<link rel="alternate" hreflang="' . esc_attr($other['language']) . '" href="' . esc_url($other['link']) . '">';
    }

    private static function is_page(int $id): bool {
        $post = $id > 0 ? get_post($id) : null;
        return $post !== null && $post->post_type === PostType::TYPE;
    }

    private static function language(int $id): string {
        return get_post_meta($id, '_noksha_language', true) === 'bn' ? 'bn' : 'en';
    }
}
