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
        $seen_whatsapp = false;
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
            if ($clean['type'] === 'whatsapp') {
                if ($seen_whatsapp) {
                    continue;
                }
                $seen_whatsapp = true;
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
        $motion = array_key_exists('motion', $input)
            ? ($input['motion'] === 'lively' ? 'lively' : 'simple')
            : (($fallback['motion'] ?? 'simple') === 'lively' ? 'lively' : 'simple');
        $seo = array_key_exists('seo', $input)
            ? self::seo(is_array($input['seo']) ? $input['seo'] : [])
            : (is_array($fallback['seo'] ?? null) ? $fallback['seo'] : self::seo([]));
        $ab = array_key_exists('ab', $input)
            ? self::ab(is_array($input['ab']) ? $input['ab'] : [], $stored)
            : (is_array($fallback['ab'] ?? null) ? $fallback['ab'] : self::ab([], $stored));

        return [
            'language' => $language,
            'motion' => $motion,
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

    /** Layout variants per section type; the first entry is the default. */
    public const LAYOUTS = [
        'hero' => ['split', 'center', 'overlay'],
        'benefits' => ['cards', 'list', 'numbers'],
        'reviews' => ['slider', 'grid'],
        'product' => ['side', 'reverse', 'stacked'],
        'gallery' => ['slider', 'grid'],
    ];

    public const BACKGROUNDS = ['none', 'soft', 'warm', 'dark', 'brand', 'gradient'];

    public const SPACINGS = ['compact', 'normal', 'roomy'];
    public const SHOWS = ['all', 'mobile', 'desktop'];
    public const SIZES = ['sm', 'md', 'lg', 'xl'];
    public const RATIOS = ['auto', 'square', '4-3', '16-9', '3-4'];
    public const FITS = ['cover', 'contain'];
    public const ROUNDS = ['none', 'md', 'lg', 'full'];
    public const IMAGE_TYPES = ['hero', 'product', 'gallery'];
    public const SINGLE_TYPES = ['order_form', 'whatsapp'];

    /**
     * Per-section look: layout variant, background band, vertical spacing.
     *
     * @param mixed $raw
     * @return array{layout:string,bg:string,space:string}
     */
    public static function style(string $type, $raw): array {
        $raw = is_array($raw) ? $raw : [];
        if (in_array($type, self::SINGLE_TYPES, true)) {
            // The order form and WhatsApp button show everywhere.
            return ['layout' => '', 'bg' => 'none', 'space' => 'normal', 'size' => 'md', 'ratio' => 'auto', 'fit' => 'cover', 'round' => 'md', 'show' => 'all'];
        }
        $layouts = self::LAYOUTS[$type] ?? [];
        $layout = sanitize_key((string) ($raw['layout'] ?? ''));
        if (!in_array($layout, $layouts, true)) {
            $layout = $layouts[0] ?? '';
        }
        $bg = sanitize_key((string) ($raw['bg'] ?? ''));
        if (!in_array($bg, self::BACKGROUNDS, true)) {
            $bg = 'none';
        }
        $space = sanitize_key((string) ($raw['space'] ?? ''));
        if (!in_array($space, self::SPACINGS, true)) {
            $space = 'normal';
        }
        $pick = static function ($key, array $allowed, string $default) use ($raw): string {
            $value = sanitize_key((string) ($raw[$key] ?? ''));
            return in_array($value, $allowed, true) ? $value : $default;
        };
        $image = in_array($type, self::IMAGE_TYPES, true);
        return [
            'layout' => $layout,
            'bg' => $bg,
            'space' => $space,
            'size' => $pick('size', self::SIZES, 'md'),
            'ratio' => $image ? $pick('ratio', self::RATIOS, 'auto') : 'auto',
            'fit' => $image ? $pick('fit', self::FITS, 'cover') : 'cover',
            'round' => $image ? $pick('round', self::ROUNDS, 'md') : 'md',
            // Where the section shows: every screen, phones only (under 768px), or larger screens only.
            'show' => $pick('show', self::SHOWS, 'all'),
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
            'gallery' => [
                'title' => self::short($props['title'] ?? ''),
                'images' => self::gallery_images($props['images'] ?? []),
            ],
            'video' => [
                'title' => self::short($props['title'] ?? ''),
                'url' => self::video_url($props['url'] ?? ''),
                'caption' => self::short($props['caption'] ?? '', 160),
            ],
            'steps' => [
                'title' => self::short($props['title'] ?? ''),
                'items' => self::pairs($props['items'] ?? [], 'title', 'text', 6),
            ],
            'compare' => [
                'title' => self::short($props['title'] ?? ''),
                'usLabel' => self::short($props['usLabel'] ?? '', 40),
                'themLabel' => self::short($props['themLabel'] ?? '', 40),
                'rows' => self::compare_rows($props['rows'] ?? []),
            ],
            // Bundle cards: the page's quantity steps as cards (1 piece, 2 pieces ...).
            'bundles' => [
                'title' => self::short($props['title'] ?? ''),
                'popular' => max(0, min(10, (int) ($props['popular'] ?? 0))),
                'showSingle' => !array_key_exists('showSingle', $props) || !empty($props['showSingle']),
            ],
            'whatsapp' => [
                'number' => substr(preg_replace('/[^0-9]/', '', (string) ($props['number'] ?? '')) ?? '', 0, 15),
                'label' => self::short($props['label'] ?? '', 40),
                'message' => self::long($props['message'] ?? '', 200),
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
            'style' => self::style($type, $section['style'] ?? []),
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
            // Delivery charge: these zones, the store's WooCommerce zones, or WooCommerce first and these when no zone matches.
            'shippingSource' => $source === 'woocommerce' && in_array($offer['shippingSource'] ?? '', ['woocommerce', 'auto'], true) ? (string) $offer['shippingSource'] : 'noksha',
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
                // The page owner's own name for the field ('' = the standard one).
                'label' => self::short($incoming['label'] ?? '', 60),
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
        $base['customFields'] = self::custom_fields($checkout['customFields'] ?? []);
        $base['fieldOrder'] = self::field_order($checkout['fieldOrder'] ?? [], $base['customFields']);
        return $base;
    }

    public const CUSTOM_TYPES = ['text', 'textarea', 'select', 'date'];
    public const STANDARD_ORDER = ['name', 'phone', 'email', 'area', 'address', 'note'];

    /**
     * Fields the page owner adds to the order form (up to 5): a label, a kind
     * (text, long text, a choice from a list, a date) and whether it is required.
     *
     * @param mixed $raw
     * @return list<array{id:string,label:string,type:string,options:list<string>,required:bool}>
     */
    public static function custom_fields($raw): array {
        $out = [];
        $seen = [];
        foreach (array_slice((array) $raw, 0, 20) as $field) {
            if (!is_array($field) || count($out) >= 5) {
                continue;
            }
            $label = self::short($field['label'] ?? '', 60);
            if ($label === '') {
                continue;
            }
            $id = sanitize_key((string) ($field['id'] ?? ''));
            if (!preg_match('/^c_[a-z0-9]{4,12}$/', $id) || isset($seen[$id])) {
                $id = 'c_' . strtolower(wp_generate_password(6, false, false));
            }
            $seen[$id] = true;
            $type = in_array($field['type'] ?? '', self::CUSTOM_TYPES, true) ? (string) $field['type'] : 'text';
            $options = [];
            if ($type === 'select') {
                foreach (array_slice((array) ($field['options'] ?? []), 0, 20) as $option) {
                    $option = self::short($option, 60);
                    if ($option !== '' && !in_array($option, $options, true)) {
                        $options[] = $option;
                    }
                }
                if ($options === []) {
                    $type = 'text';
                }
            }
            $out[] = ['id' => $id, 'label' => $label, 'type' => $type, 'options' => $options, 'required' => !empty($field['required'])];
        }
        return $out;
    }

    /**
     * The order of the form's fields. Division, district and upazila move together as "area".
     *
     * @param mixed $raw
     * @return list<string>
     */
    public static function field_order($raw, array $custom): array {
        $all = array_merge(self::STANDARD_ORDER, array_column($custom, 'id'));
        $order = [];
        foreach ((array) $raw as $key) {
            $key = sanitize_key((string) $key);
            if (in_array($key, $all, true) && !in_array($key, $order, true)) {
                $order[] = $key;
            }
        }
        foreach ($all as $key) {
            if (!in_array($key, $order, true)) {
                $order[] = $key;
            }
        }
        return $order;
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

    private static function gallery_images($items): array {
        $clean = [];
        foreach ((array) $items as $item) {
            $url = self::url(is_array($item) ? ($item['url'] ?? '') : $item);
            if ($url === '') {
                continue;
            }
            $clean[] = ['url' => $url, 'alt' => is_array($item) ? self::short($item['alt'] ?? '', 120) : ''];
            if (count($clean) >= 8) {
                break;
            }
        }
        return $clean;
    }

    /** Only YouTube and Vimeo links are kept; anything else is dropped. */
    private static function video_url($value): string {
        $url = self::url($value);
        if ($url === '') {
            return '';
        }
        $host = strtolower((string) wp_parse_url($url, PHP_URL_HOST));
        $host = preg_replace('/^(www|m)\./', '', $host) ?? '';
        $allowed = ['youtube.com', 'youtu.be', 'youtube-nocookie.com', 'vimeo.com', 'player.vimeo.com'];
        return in_array($host, $allowed, true) ? $url : '';
    }

    private static function compare_rows($items): array {
        $clean = [];
        foreach ((array) $items as $item) {
            if (!is_array($item)) {
                continue;
            }
            $row = [
                'label' => self::short($item['label'] ?? '', 80),
                'us' => self::short($item['us'] ?? '', 30),
                'them' => self::short($item['them'] ?? '', 30),
            ];
            if ($row['label'] === '' && $row['us'] === '' && $row['them'] === '') {
                continue;
            }
            $clean[] = $row;
            if (count($clean) >= 8) {
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
