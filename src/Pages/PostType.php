<?php
/**
 * Landing pages are a public post type with our own editor.
 *
 * @package Noksha
 */

namespace Noksha\Pages;

final class PostType {
    public const TYPE = 'noksha_page';

    public function register(): void {
        add_action('init', [$this, 'register_type']);
        if (did_action('init')) {
            $this->register_type();
        }
    }

    public function register_type(): void {
        register_post_type(self::TYPE, [
            'labels' => [
                'name' => 'Noksha Pages',
                'singular_name' => 'Noksha Page',
            ],
            'public' => true,
            'show_ui' => false,
            'show_in_menu' => false,
            'show_in_rest' => false,
            'publicly_queryable' => true,
            'exclude_from_search' => true,
            'has_archive' => false,
            'rewrite' => [
                'slug' => 'offer',
                'with_front' => false,
            ],
            'supports' => ['title'],
            'capability_type' => 'post',
            'map_meta_cap' => true,
        ]);
    }
}
