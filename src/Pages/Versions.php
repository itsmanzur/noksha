<?php
/**
 * Version history: earlier states of a page, to look back and restore.
 *
 * Each version is a hidden post (child of the page) with the page document in
 * its meta, so a page view never loads them. Saves while editing are grouped:
 * one version per 10 minutes of editing, plus one before going live and one
 * before a restore (so a restore can be undone). The newest 20 are kept.
 *
 * @package Noksha
 */

namespace Noksha\Pages;

final class Versions {
    public const TYPE = 'noksha_version';
    public const KEEP = 20;
    public const GAP = 600;
    private const META = '_noksha_doc';
    private const FIELDS = ['language', 'motion', 'sections', 'offer', 'checkout', 'tokens', 'seo', 'ab'];

    public static function register_type(): void {
        register_post_type(self::TYPE, [
            'public' => false,
            'show_ui' => false,
            'show_in_rest' => false,
            'rewrite' => false,
            'query_var' => false,
            'supports' => [],
        ]);
    }

    /**
     * The parts of a page document a version keeps (live store data left out).
     *
     * @return array<string, mixed>
     */
    public static function snapshot(array $doc, string $title): array {
        $out = ['title' => $title];
        foreach (self::FIELDS as $key) {
            $out[$key] = $doc[$key] ?? null;
        }
        if (is_array($out['offer'])) {
            unset($out['offer']['wc']);
        }
        return $out;
    }

    /**
     * Called before a page is saved, with the state it had and the state it gets.
     * Keeps the old state when it differs and the last version is old enough.
     */
    public static function before_save(int $page_id, array $before, array $after, string $reason): void {
        if (wp_json_encode($before) === wp_json_encode($after)) {
            return;
        }
        if ($reason === 'auto') {
            $latest = self::latest_time($page_id);
            if ($latest > 0 && time() - $latest < (int) apply_filters('noksha_version_gap', self::GAP)) {
                return;
            }
        }
        self::record($page_id, $before, $reason);
    }

    public static function record(int $page_id, array $snapshot, string $reason): int {
        $reason = in_array($reason, ['auto', 'publish', 'restore'], true) ? $reason : 'auto';
        $id = wp_insert_post([
            'post_type' => self::TYPE,
            'post_status' => 'private',
            'post_parent' => $page_id,
            'post_title' => $reason,
            'post_author' => get_current_user_id(),
        ], true);
        if (is_wp_error($id) || !$id) {
            return 0;
        }
        update_post_meta((int) $id, self::META, wp_slash($snapshot));
        self::prune($page_id);
        return (int) $id;
    }

    /**
     * @return list<array{id:int,time:string,user:string,reason:string,title:string,sections:int}>
     */
    public static function all(int $page_id): array {
        $rows = [];
        foreach (self::posts($page_id, self::KEEP) as $post) {
            $doc = get_post_meta($post->ID, self::META, true);
            $user = get_userdata((int) $post->post_author);
            $rows[] = [
                'id' => (int) $post->ID,
                'time' => (string) get_post_time('c', true, $post),
                'user' => $user ? (string) $user->display_name : '',
                'reason' => (string) $post->post_title,
                'title' => is_array($doc) ? (string) ($doc['title'] ?? '') : '',
                'sections' => is_array($doc) && is_array($doc['sections'] ?? null) ? count($doc['sections']) : 0,
            ];
        }
        return $rows;
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function get(int $page_id, int $version_id): ?array {
        $post = get_post($version_id);
        if (!$post || $post->post_type !== self::TYPE || (int) $post->post_parent !== $page_id) {
            return null;
        }
        $doc = get_post_meta($version_id, self::META, true);
        return is_array($doc) ? $doc : null;
    }

    /**
     * Put the page back to a version. The state before it is kept as a version first.
     *
     * @return array<string, mixed>|\WP_Error The page payload.
     */
    public static function restore(int $page_id, int $version_id) {
        $doc = self::get($page_id, $version_id);
        if ($doc === null) {
            return new \WP_Error('noksha_not_found', 'Version not found.', ['status' => 404]);
        }
        $post = get_post($page_id);
        if (!$post) {
            return new \WP_Error('noksha_not_found', 'Page not found.', ['status' => 404]);
        }
        self::record($page_id, self::snapshot(Repository::document($page_id), $post->post_title), 'restore');
        $input = [];
        foreach (self::FIELDS as $key) {
            if (array_key_exists($key, $doc) && $doc[$key] !== null) {
                $input[$key] = $doc[$key];
            }
        }
        if (!array_key_exists('tokens', $input)) {
            $input['tokens'] = null;
        }
        if (($doc['title'] ?? '') !== '') {
            $input['title'] = (string) $doc['title'];
        }
        $result = Repository::update($page_id, $input, 'none');
        if (!is_wp_error($result)) {
            \Noksha\Front\CachePurge::purge($page_id);
        }
        return $result;
    }

    /** Remove a page's versions when the page is deleted. */
    public static function delete_for(int $post_id): void {
        if (get_post_type($post_id) !== PostType::TYPE) {
            return;
        }
        foreach (self::posts($post_id, -1) as $post) {
            wp_delete_post($post->ID, true);
        }
    }

    private static function latest_time(int $page_id): int {
        $posts = self::posts($page_id, 1);
        return $posts ? (int) get_post_time('U', true, $posts[0]) : 0;
    }

    private static function prune(int $page_id): void {
        $posts = self::posts($page_id, -1);
        foreach (array_slice($posts, self::KEEP) as $post) {
            wp_delete_post($post->ID, true);
        }
    }

    /**
     * @return list<\WP_Post>
     */
    private static function posts(int $page_id, int $limit): array {
        return get_posts([
            'post_type' => self::TYPE,
            'post_status' => 'private',
            'post_parent' => $page_id,
            'numberposts' => $limit,
            'orderby' => ['date' => 'DESC', 'ID' => 'DESC'],
            'suppress_filters' => true,
            'no_found_rows' => true,
        ]);
    }
}
