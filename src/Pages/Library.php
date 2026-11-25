<?php
/**
 * "My sections" and "My templates": sections and whole pages kept to reuse.
 *
 * Stored in one option (not autoloaded), up to MAX items. A section keeps its
 * content and look. A page keeps its sections, order form, colors and offer
 * settings, but not the WooCommerce product it sold, so it can start a page
 * for any product.
 *
 * @package Noksha
 */

namespace Noksha\Pages;

final class Library {
    public const OPTION = 'noksha_library';
    public const MAX = 60;

    /**
     * What the editor and the pages screen list. Sections carry their content,
     * so they can be inserted without another request; pages do not.
     *
     * @return list<array<string, mixed>>
     */
    public static function all(): array {
        $out = [];
        foreach (self::items() as $item) {
            $row = [
                'id' => $item['id'],
                'kind' => $item['kind'],
                'name' => $item['name'],
                'language' => $item['language'],
                'createdAt' => $item['createdAt'],
            ];
            if ($item['kind'] === 'section') {
                $row['type'] = $item['data']['type'];
                $row['section'] = $item['data'];
            } else {
                $row['sections'] = count($item['data']['sections'] ?? []);
            }
            $out[] = $row;
        }
        return $out;
    }

    /**
     * @return array<string, mixed>|\WP_Error
     */
    public static function save_section(array $section, string $name) {
        $clean = Sanitizer::section($section);
        if ($clean === null) {
            return new \WP_Error('noksha_invalid_section', 'This section cannot be saved.', ['status' => 400]);
        }
        unset($clean['id']);
        $clean['hidden'] = false;
        return self::add('section', $name, $clean, '');
    }

    /**
     * @return array<string, mixed>|\WP_Error
     */
    public static function save_page(int $page_id, string $name, ?array $current = null) {
        $post = get_post($page_id);
        if (!$post || $post->post_type !== PostType::TYPE) {
            return new \WP_Error('noksha_not_found', 'Page not found.', ['status' => 404]);
        }
        // What the editor shows now (unsaved changes included), else the saved page.
        $doc = $current !== null
            ? Sanitizer::document($current, Repository::document($page_id))
            : Repository::document($page_id);
        return self::add('page', $name, [
            'sections' => $doc['sections'],
            'checkout' => $doc['checkout'],
            'offer' => self::without_product($doc['offer']),
            'tokens' => $doc['tokens'],
        ], (string) $doc['language']);
    }

    /**
     * A new draft page from a saved page.
     *
     * @return int|\WP_Error Page id.
     */
    public static function create_page(string $id, string $title) {
        $item = self::find($id);
        if ($item === null || $item['kind'] !== 'page') {
            return new \WP_Error('noksha_not_found', 'Template not found.', ['status' => 404]);
        }
        $page_id = Repository::create('blank', $item['language'] === 'bn' ? 'bn' : 'en', $title !== '' ? $title : $item['name']);
        if (is_wp_error($page_id)) {
            return $page_id;
        }
        $saved = Repository::update($page_id, [
            'status' => 'draft',
            'sections' => self::fresh_ids($item['data']['sections'] ?? []),
            'checkout' => $item['data']['checkout'] ?? [],
            'offer' => $item['data']['offer'] ?? [],
            'tokens' => $item['data']['tokens'] ?? null,
        ]);
        if (is_wp_error($saved)) {
            wp_delete_post($page_id, true);
            return $saved;
        }
        return (int) $page_id;
    }

    public static function delete(string $id): bool {
        $items = self::items();
        $kept = array_values(array_filter($items, static fn($item) => $item['id'] !== $id));
        if (count($kept) === count($items)) {
            return false;
        }
        update_option(self::OPTION, $kept, false);
        return true;
    }

    /**
     * The offer without the store product, so the template fits any product.
     */
    public static function without_product(array $offer): array {
        unset($offer['wc']);
        $offer['source'] = 'custom';
        $offer['productId'] = 0;
        $offer['variationId'] = 0;
        $offer['shippingSource'] = 'noksha';
        $bumps = [];
        foreach ((array) ($offer['bumps'] ?? []) as $bump) {
            if (is_array($bump) && ($bump['source'] ?? '') !== 'woocommerce') {
                $bumps[] = $bump;
            }
        }
        $offer['bumps'] = $bumps;
        $offer['bump'] = $bumps[0] ?? ['enabled' => false];
        return $offer;
    }

    /**
     * New ids, so two pages made from one template never share section ids.
     *
     * @param list<array<string, mixed>> $sections
     * @return list<array<string, mixed>>
     */
    public static function fresh_ids(array $sections): array {
        return array_map(static function ($section) {
            $section['id'] = 's_' . wp_generate_password(8, false, false);
            return $section;
        }, array_values(array_filter($sections, 'is_array')));
    }

    /**
     * @return array<string, mixed>|\WP_Error
     */
    private static function add(string $kind, string $name, array $data, string $language) {
        $items = self::items();
        if (count($items) >= self::MAX) {
            return new \WP_Error('noksha_library_full', sprintf('The library holds %d items. Delete one first.', self::MAX), ['status' => 409]);
        }
        $name = noksha_clip(sanitize_text_field($name), 80);
        if ($name === '') {
            return new \WP_Error('noksha_invalid_name', 'Give it a name.', ['status' => 400]);
        }
        $item = [
            'id' => 'l_' . strtolower(wp_generate_password(10, false, false)),
            'kind' => $kind,
            'name' => $name,
            'language' => $language === 'bn' ? 'bn' : ($language === '' ? '' : 'en'),
            'createdAt' => current_time('mysql'),
            'data' => $data,
        ];
        $items[] = $item;
        update_option(self::OPTION, $items, false);
        return $item;
    }

    /**
     * @return array<string, mixed>|null
     */
    private static function find(string $id): ?array {
        foreach (self::items() as $item) {
            if ($item['id'] === $id) {
                return $item;
            }
        }
        return null;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private static function items(): array {
        $stored = get_option(self::OPTION, []);
        $out = [];
        foreach (is_array($stored) ? $stored : [] as $item) {
            if (is_array($item) && isset($item['id'], $item['kind'], $item['name'], $item['data']) && in_array($item['kind'], ['section', 'page'], true)) {
                $item['language'] = (string) ($item['language'] ?? '');
                $item['createdAt'] = (string) ($item['createdAt'] ?? '');
                $out[] = $item;
            }
        }
        return $out;
    }
}
