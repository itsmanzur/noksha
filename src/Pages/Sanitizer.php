<?php
/**
 * Cleans page documents before they are stored or previewed.
 *
 * @package Noksha
 */

namespace Noksha\Pages;

use Noksha\Brand\Tokens;

final class Sanitizer {
    /**
     * @param bool $stored True when the input comes from post meta, whose HTML blocks were filtered on save.
     */
    public static function document(array $input, ?array $fallback = null, bool $stored = false): array {
        $language = array_key_exists('language', $input)
            ? (($input['language'] ?? 'en') === 'bn' ? 'bn' : 'en')
            : (($fallback['language'] ?? 'en') === 'bn' ? 'bn' : 'en');
        $sections = [];
        $seen_order = false;
        $raw_sections = is_array($input['sections'] ?? null) ? $input['sections'] : [];
        foreach (array_slice($raw_sections, 0, 24) as $section) {
            if (!is_array($section)) {
                continue;
            }
            $clean = self::section($section, $stored);
            if ($clean === null) {
                continue;
            }
            if ($clean['type'] === 'order_form') {
                if ($seen_order) {
                    continue;
                }
                $seen_order = true;
            }
            $sections[] = $clean;
        }
        if (!array_key_exists('sections', $input) && is_array($fallback['sections'] ?? null)) {
            $sections = $fallback['sections'];
        }

        $offer = array_key_exists('offer', $input)
            ? self::offer(is_array($input['offer']) ? $input['offer'] : [])
            : (is_array($fallback['offer'] ?? null) ? $fallback['offer'] : self::offer([]));
        $checkout = array_key_exists('checkout', $input)
            ? self::checkout(is_array($input['checkout']) ? $input['checkout'] : [])
            : (is_array($fallback['checkout'] ?? null) ? $fallback['checkout'] : self::checkout([]));
        $tokens = array_key_exists('tokens', $input)
            ? Tokens::sanitize_override($input['tokens'])
            : ($fallback['tokens'] ?? null);
        $seo = array_key_exists('seo', $input)
            ? self::seo(is_array($input['seo']) ? $input['seo'] : [])
            : (is_array($fallback['seo'] ?? null) ? $fallback['seo'] : self::seo([]));
        $ab = array_key_exists('ab', $input)
            ? self::ab(is_array($input['ab']) ? $input['ab'] : [], $stored)
            : (is_array($fallback['ab'] ?? null) ? $fallback['ab'] : self::ab([], $stored));

        return [
            'language' => $language,
            'offer' => $offer,
            'checkout' => $checkout,
            'sections' => $sections,
            'tokens' => $tokens,
            'seo' => $seo,
            'ab' => $ab,
        ];
    }

    public static function seo(array $seo): array {
        return [
            'title' => self::short($seo['title'] ?? '', 70),
            'description' => self::long($seo['description'] ?? '', 200),
            'imageUrl' => self::url($seo['imageUrl'] ?? ''),
        ];
    }

    public static function section(array $section, bool $stored = false): ?array {
        $type = sanitize_key((string) ($section['type'] ?? ''));
        $props = is_array($section['props'] ?? null) ? $section['props'] : [];
        $clean = match ($type) {
            'hero' => [
                'eyebrow' => self::short($props['eyebrow'] ?? ''),
                'title' => self::short($props['title'] ?? '', 180),
                'subtitle' => self::long($props['subtitle'] ?? ''),
                'imageUrl' => self::url($props['imageUrl'] ?? ''),
                'buttonLabel' => self::short($props['buttonLabel'] ?? '', 40),
            ],
            'benefits' => [
                'title' => self::short($props['title'] ?? ''),
                'items' => self::pairs($props['items'] ?? [], 'title', 'text', 6),
            ],
            'product' => [
                'title' => self::short($props['title'] ?? ''),
                'text' => self::long($props['text'] ?? ''),
                'imageUrl' => self::url($props['imageUrl'] ?? ''),
                'bullets' => self::lines($props['bullets'] ?? [], 8),
            ],
            'countdown' => [
                'title' => self::short($props['title'] ?? ''),
                'endsAt' => self::datetime($props['endsAt'] ?? ''),
            ],
            'reviews' => [
                'title' => self::short($props['title'] ?? ''),
                'items' => self::reviews($props['items'] ?? []),
            ],
            'faq' => [
                'title' => self::short($props['title'] ?? ''),
                'items' => self::pairs($props['items'] ?? [], 'q', 'a', 12),
            ],
            'guarantee' => [
                'title' => self::short($props['title'] ?? ''),
                'text' => self::long($props['text'] ?? ''),
            ],
            'order_form' => [
                'title' => self::short($props['title'] ?? ''),
                'buttonLabel' => self::short($props['buttonLabel'] ?? '', 40),
            ],
            'html' => [
                'html' => self::html($props['html'] ?? '', $stored),
            ],
            default => null,
        };
        if ($clean === null) {
            return null;
        }
        $id = sanitize_key((string) ($section['id'] ?? ''));
        if ($id === '') {
            $id = 's_' . wp_generate_password(8, false, false);
        }
        return [
            'id' => $id,
            'type' => $type,
            'hidden' => !empty($section['hidden']),
            'props' => $clean,
        ];
    }

    public static function offer(array $offer): array {
        $outside = self::money($offer['shippingOutside'] ?? $offer['shipping'] ?? 0);
        $inside = array_key_exists('shippingInside', $offer)
            ? self::money($offer['shippingInside'])
            : $outside;
        $bump = is_array($offer['bump'] ?? null) ? $offer['bump'] : [];
        return [
            'productName' => self::short($offer['productName'] ?? '', 180),
            'price' => self::money($offer['price'] ?? 0),
            'compareAt' => self::money($offer['compareAt'] ?? 0),
            'shipping' => $outside,
            'shippingInside' => $inside,
            'shippingOutside' => $outside,
            'imageUrl' => self::url($offer['imageUrl'] ?? ''),
            'bump' => [
                'enabled' => !empty($bump['enabled']),
                'name' => self::short($bump['name'] ?? '', 120),
                'price' => self::money($bump['price'] ?? 0),
                'imageUrl' => self::url($bump['imageUrl'] ?? ''),
                'checkedDefault' => !empty($bump['checkedDefault']),
            ],
        ];
    }

    public static function ab(array $ab, bool $stored = false): array {
        $sections = [];
        foreach (array_slice((array) ($ab['sections'] ?? []), 0, 24) as $section) {
            if (!is_array($section)) {
                continue;
            }
            $clean = self::section($section, $stored);
            if ($clean !== null && $clean['type'] !== 'order_form') {
                $sections[] = $clean;
            }
        }
        $split = (int) ($ab['split'] ?? 50);
        return [
            'enabled' => !empty($ab['enabled']),
            'split' => max(10, min(90, $split)),
            'sections' => $sections,
        ];
    }

    public static function checkout(array $checkout): array {
        $base = Templates::checkout('en');
        $fields = is_array($checkout['fields'] ?? null) ? $checkout['fields'] : [];
        foreach ($base['fields'] as $key => $field) {
            $incoming = is_array($fields[$key] ?? null) ? $fields[$key] : [];
            $enabled = array_key_exists('enabled', $incoming) ? !empty($incoming['enabled']) : $field['enabled'];
            $required = array_key_exists('required', $incoming) ? !empty($incoming['required']) : $field['required'];
            if (!$enabled) {
                $required = false;
            }
            $base['fields'][$key] = [
                'enabled' => $enabled,
                'required' => $required,
            ];
        }
        $base['fields']['name']['enabled'] = true;
        $base['fields']['phone']['enabled'] = true;
        $base['fields']['name']['required'] = true;
        $base['fields']['phone']['required'] = true;

        $allowed = ['cod', 'manual_bkash', 'manual_nagad', 'sslcommerz'];
        $payments = [];
        foreach ((array) ($checkout['payments'] ?? []) as $method) {
            $method = sanitize_key((string) $method);
            if (in_array($method, $allowed, true) && !in_array($method, $payments, true)) {
                $payments[] = $method;
            }
        }
        $base['payments'] = $payments === [] ? ['cod'] : $payments;

        $position = (string) ($checkout['summaryPosition'] ?? 'right');
        $base['summaryPosition'] = in_array($position, ['left', 'right', 'bottom'], true) ? $position : 'right';

        $badges = [];
        foreach ((array) ($checkout['trustBadges'] ?? []) as $badge) {
            $badge = sanitize_key((string) $badge);
            if (in_array($badge, ['secure', 'cod', 'delivery'], true) && !in_array($badge, $badges, true)) {
                $badges[] = $badge;
            }
        }
        $base['trustBadges'] = $badges;
        $base['deliveryNote'] = self::long($checkout['deliveryNote'] ?? '', 300);
        return $base;
    }

    private static function short($value, int $limit = 120): string {
        $text = sanitize_text_field((string) $value);
        return noksha_clip($text, $limit);
    }

    private static function long($value, int $limit = 800): string {
        $text = sanitize_textarea_field((string) $value);
        return noksha_clip($text, $limit);
    }

    private static function html($value, bool $stored = false): string {
        unset($stored);
        $html = noksha_clip(trim((string) $value), 20000);
        if ($html === '') {
            return '';
        }
        $allowed = wp_kses_allowed_html('post');
        $allowed['iframe'] = [
            'src' => true,
            'width' => true,
            'height' => true,
            'frameborder' => true,
            'allow' => true,
            'allowfullscreen' => true,
            'loading' => true,
            'referrerpolicy' => true,
            'title' => true,
            'style' => true,
            'class' => true,
        ];
        foreach (['div', 'span', 'section', 'p', 'h1', 'h2', 'h3', 'h4', 'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th'] as $tag) {
            if (!isset($allowed[$tag])) {
                $allowed[$tag] = [];
            }
            $allowed[$tag]['style'] = true;
            $allowed[$tag]['class'] = true;
        }
        $clean = wp_kses($html, $allowed);
        return self::filter_iframes($clean);
    }

    public static function clean_html(string $html): string {
        return self::html($html, false);
    }

    private static function filter_iframes(string $html): string {
        if ($html === '' || stripos($html, '<iframe') === false) {
            return $html;
        }
        return (string) preg_replace_callback(
            '/<iframe\b[^>]*>.*?<\/iframe>/is',
            static function (array $match): string {
                if (!preg_match('/\bsrc=(["\'])(.*?)\1/i', $match[0], $src)) {
                    return '';
                }
                $url = html_entity_decode($src[2], ENT_QUOTES | ENT_HTML5);
                $host = strtolower((string) (wp_parse_url($url, PHP_URL_HOST) ?? ''));
                $ok = [
                    'www.youtube.com',
                    'youtube.com',
                    'www.youtube-nocookie.com',
                    'youtube-nocookie.com',
                    'player.vimeo.com',
                    'www.google.com',
                    'maps.google.com',
                    'www.google.com.bd',
                ];
                return in_array($host, $ok, true) ? $match[0] : '';
            },
            $html
        );
    }

    private static function url($value): string {
        $url = esc_url_raw((string) $value);
        if ($url === '' || !wp_http_validate_url($url)) {
            return '';
        }
        return $url;
    }

    private static function money($value): float {
        $number = round((float) $value, 2);
        if ($number < 0) {
            return 0.0;
        }
        if ($number > 10000000) {
            return 10000000.0;
        }
        return $number;
    }

    private static function datetime($value): string {
        $value = sanitize_text_field((string) $value);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/', $value)) {
            return '';
        }
        return substr($value, 0, 16);
    }

    private static function lines($value, int $max): array {
        $lines = is_array($value) ? $value : preg_split('/\r\n|\r|\n/', (string) $value);
        $clean = [];
        foreach ($lines as $line) {
            $line = self::short($line, 160);
            if ($line === '') {
                continue;
            }
            $clean[] = $line;
            if (count($clean) >= $max) {
                break;
            }
        }
        return $clean;
    }

    private static function pairs($items, string $a, string $b, int $max): array {
        $clean = [];
        foreach ((array) $items as $item) {
            if (!is_array($item)) {
                continue;
            }
            $left = self::short($item[$a] ?? '');
            $right = self::long($item[$b] ?? '');
            if ($left === '' && $right === '') {
                continue;
            }
            $clean[] = [$a => $left, $b => $right];
            if (count($clean) >= $max) {
                break;
            }
        }
        return $clean;
    }

    private static function reviews($items): array {
        $clean = [];
        foreach ((array) $items as $item) {
            if (!is_array($item)) {
                continue;
            }
            $name = self::short($item['name'] ?? '');
            $text = self::long($item['text'] ?? '');
            if ($name === '' && $text === '') {
                continue;
            }
            $rating = (int) ($item['rating'] ?? 5);
            $clean[] = [
                'name' => $name,
                'text' => $text,
                'rating' => max(1, min(5, $rating)),
            ];
            if (count($clean) >= 8) {
                break;
            }
        }
        return $clean;
    }
}
