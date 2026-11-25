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
            ? self::offer(is_array($input['offer']) ? $input['offer'] : [], is_array($fallback['offer'] ?? null) ? $fallback['offer'] : null)
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

    /**
     * Whether two add-ons are the same choice. A store product's name and price are
     * read live, so only what the page owner picks is compared.
     */
    private static function same_bump(array $a, array $b): bool {
        $key = static function (array $bump): array {
            $custom = $bump['source'] !== 'woocommerce';
            return [
                (bool) $bump['enabled'],
                $bump['source'],
                (int) $bump['productId'],
                (bool) $bump['checkedDefault'],
                $custom ? $bump['name'] : '',
                $custom ? (float) $bump['price'] : 0.0,
            ];
        };
        return $key($a) === $key($b);
    }

    /**
     * One add-on. A store product only when the main product is one too.
     *
     * @return array<string, mixed>
     */
    private static function bump(array $bump, string $source): array {
        $is_wc = $source === 'woocommerce' && ($bump['source'] ?? '') === 'woocommerce' && (int) ($bump['productId'] ?? 0) > 0;
        return [
            'source' => $is_wc ? 'woocommerce' : 'custom',
            'productId' => $is_wc ? max(0, (int) $bump['productId']) : 0,
            'enabled' => !empty($bump['enabled']),
            'name' => self::short($bump['name'] ?? '', 120),
            'price' => self::money($bump['price'] ?? 0),
            'imageUrl' => self::url($bump['imageUrl'] ?? ''),
            'checkedDefault' => !empty($bump['checkedDefault']),
        ];
    }

    /**
     * @param array<string, mixed>|null $stored The page's saved offer, to tell which add-on field a client changed.
     */
    public static function offer(array $offer, ?array $stored = null): array {
        $outside = self::money($offer['shippingOutside'] ?? $offer['shipping'] ?? 0);
        $inside = array_key_exists('shippingInside', $offer)
            ? self::money($offer['shippingInside'])
            : $outside;
        $default_shipping = self::money($offer['shippingDefault'] ?? $outside);
        $zones = self::shipping_zones($offer, $inside, $outside, $default_shipping);
        $raw_bumps = is_array($offer['bumps'] ?? null) && $offer['bumps'] !== []
            ? $offer['bumps']
            : (is_array($offer['bump'] ?? null) ? [$offer['bump']] : []);
        $product_id = max(0, (int) ($offer['productId'] ?? 0));
        $source = ($offer['source'] ?? '') === 'woocommerce' && $product_id > 0 ? 'woocommerce' : 'custom';
        $bumps = [];
        foreach (array_slice($raw_bumps, 0, 3) as $raw) {
            if (is_array($raw)) {
                $bumps[] = self::bump($raw, $source);
            }
        }
        // An older client edits only 'bump' and sends back the 'bumps' it read; a newer one
        // edits 'bumps' and may send back the old 'bump'. Compared with the saved page, the
        // field that changed is the one the client meant.
        if (is_array($offer['bump'] ?? null) && is_array($offer['bumps'] ?? null)) {
            $legacy = self::bump($offer['bump'], $source);
            if ($bumps === []) {
                $bumps = [$legacy];
            } elseif ($stored !== null) {
                $saved_list = is_array($stored['bumps'] ?? null) && $stored['bumps'] !== []
                    ? $stored['bumps']
                    : (is_array($stored['bump'] ?? null) ? [$stored['bump']] : []);
                $saved_first = isset($saved_list[0]) && is_array($saved_list[0]) ? self::bump($saved_list[0], $source) : self::bump([], $source);
                if (self::same_bump($legacy, $saved_first) === false && self::same_bump($bumps[0], $saved_first)) {
                    $bumps[0] = $legacy;
                }
            }
        }
        return [
            // Show the product's gallery under the main image (store products with several images).
            'gallery' => !array_key_exists('gallery', $offer) || !empty($offer['gallery']),
            // "Only 3 left", from the real stock, when it is at or below this number.
            'stockHint' => !empty($offer['stockHint']),
            'stockHintMax' => max(1, min(50, (int) ($offer['stockHintMax'] ?? 10))),
            'source' => $source,
            'productId' => $source === 'woocommerce' ? $product_id : 0,
            'variationId' => $source === 'woocommerce' ? max(0, (int) ($offer['variationId'] ?? 0)) : 0,
            'productName' => self::short($offer['productName'] ?? '', 180),
            'price' => self::money($offer['price'] ?? 0),
            'compareAt' => self::money($offer['compareAt'] ?? 0),
            // Quantity discounts: "buy 2 or more, save 50".
            'tiers' => \Noksha\Orders\Pricing::clean_tiers($offer['tiers'] ?? []),
            'shipping' => $default_shipping,
            'shippingDefault' => $default_shipping,
            'shippingInside' => $inside,
            'shippingOutside' => $outside,
            'shippingZones' => $zones,
            'imageUrl' => self::url($offer['imageUrl'] ?? ''),
            // Add-ons beside the order summary (up to 3); 'bump' stays as the first, for older readers.
            'bumps' => $bumps,
            'bump' => $bumps[0] ?? self::bump([], 'custom'),
        ];
    }

    /**
     * @return list<array{id:string,label:string,price:float,districtIds:list<string>,upazilaIds:list<string>}>
     */
    private static function shipping_zones(array $offer, float $inside, float $outside, float $default): array {
        $zones = [];
        if (isset($offer['shippingZones']) && is_array($offer['shippingZones']) && $offer['shippingZones'] !== []) {
            foreach (array_slice($offer['shippingZones'], 0, 20) as $zone) {
                if (!is_array($zone)) {
                    continue;
                }
                $id = sanitize_key((string) ($zone['id'] ?? ''));
                if ($id === '') {
                    $id = 'z_' . wp_generate_password(6, false, false);
                }
                $districts = [];
                foreach ((array) ($zone['districtIds'] ?? []) as $did) {
                    $did = sanitize_text_field((string) $did);
                    if ($did !== '') {
                        $districts[] = $did;
                    }
                }
                $upazilas = [];
                foreach ((array) ($zone['upazilaIds'] ?? []) as $uid) {
                    $uid = sanitize_text_field((string) $uid);
                    if ($uid !== '') {
                        $upazilas[] = $uid;
                    }
                }
                $zones[] = [
                    'id' => $id,
                    'label' => self::short($zone['label'] ?? '', 80),
                    'price' => self::money($zone['price'] ?? $default),
                    'districtIds' => array_values(array_unique($districts)),
                    'upazilaIds' => array_values(array_unique($upazilas)),
                ];
            }
            return $zones;
        }
        // Migrate legacy inside/outside Dhaka into two zones.
        return [
            [
                'id' => 'inside_dhaka',
                'label' => 'Inside Dhaka',
                'price' => $inside,
                'districtIds' => ['47'],
                'upazilaIds' => [],
            ],
            [
                'id' => 'outside_dhaka',
                'label' => 'Outside Dhaka',
                'price' => $outside,
                'districtIds' => [],
                'upazilaIds' => [],
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
        // A coupon field, offered only for a WooCommerce product.
        $base['coupon'] = !empty($checkout['coupon']);
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
        $ok = [
            'www.youtube.com',
            'youtube.com',
            'www.youtube-nocookie.com',
            'youtube-nocookie.com',
            'player.vimeo.com',
        ];
        $wrapped = '<div id="noksha-html-root">' . $html . '</div>';
        $previous = libxml_use_internal_errors(true);
        $dom = new \DOMDocument('1.0', 'UTF-8');
        $loaded = $dom->loadHTML('<?xml encoding="utf-8" ?>' . $wrapped, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);
        if (!$loaded) {
            return (string) preg_replace('/<iframe\b[^>]*>.*?<\/iframe>|<iframe\b[^>]*>?/is', '', $html);
        }
        $iframes = $dom->getElementsByTagName('iframe');
        $remove = [];
        foreach ($iframes as $iframe) {
            if (!$iframe instanceof \DOMElement) {
                continue;
            }
            $src = $iframe->getAttribute('src');
            $host = strtolower((string) (wp_parse_url(html_entity_decode($src, ENT_QUOTES | ENT_HTML5), PHP_URL_HOST) ?? ''));
            if (!in_array($host, $ok, true)) {
                $remove[] = $iframe;
                continue;
            }
            $iframe->setAttribute('loading', 'lazy');
            $iframe->removeAttribute('style');
        }
        foreach ($remove as $node) {
            $node->parentNode?->removeChild($node);
        }
        $root = $dom->getElementById('noksha-html-root');
        if (!$root) {
            return '';
        }
        $out = '';
        foreach ($root->childNodes as $child) {
            $out .= $dom->saveHTML($child);
        }
        return $out;
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
                'verified' => !empty($item['verified']),
            ];
            if (count($clean) >= 8) {
                break;
            }
        }
        return $clean;
    }
}
