<?php
/**
 * Public landing markup. The editor preview uses the same HTML.
 *
 * @package Noksha
 */

namespace Noksha\Pages;

use Noksha\Brand\Tokens;
use Noksha\Catalog\WcProduct;
use Noksha\I18n\Catalog;
use Noksha\Options;

final class Renderer {
    /** @var array<int, string> */
    private static array $variant_cache = [];

    public static function article_for_post(int $id): string {
        $post = get_post($id);
        if (!$post) {
            return '';
        }
        $payload = Repository::payload($id);
        if (is_wp_error($payload)) {
            return '';
        }
        return self::article(self::apply_variant($payload), false);
    }

    public static function variant_for(int $page_id, array $ab): string {
        if (isset(self::$variant_cache[$page_id])) {
            return self::$variant_cache[$page_id];
        }
        if (empty($ab['enabled']) || empty($ab['sections'])) {
            self::$variant_cache[$page_id] = 'a';
            return 'a';
        }
        $cookie = 'noksha_ab_' . $page_id;
        $variant = isset($_COOKIE[$cookie]) ? strtolower((string) wp_unslash($_COOKIE[$cookie])) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
        if (!in_array($variant, ['a', 'b'], true)) {
            $split = max(10, min(90, (int) ($ab['split'] ?? 50)));
            $variant = (wp_rand(1, 100) <= $split) ? 'b' : 'a';
            $_COOKIE[$cookie] = $variant; // Same-request readers see the choice.
            if (!headers_sent()) {
                setcookie($cookie, $variant, time() + MONTH_IN_SECONDS, COOKIEPATH ?: '/', COOKIE_DOMAIN, is_ssl(), true);
            }
        }
        self::$variant_cache[$page_id] = $variant;
        return $variant;
    }

    public static function apply_variant(array $payload): array {
        $ab = is_array($payload['ab'] ?? null) ? $payload['ab'] : [];
        $page_id = (int) ($payload['id'] ?? 0);
        $variant = self::variant_for($page_id, $ab);
        $payload['variant'] = $variant;
        if ($variant === 'b' && !empty($ab['sections'])) {
            $order = null;
            foreach ($payload['sections'] as $section) {
                if (($section['type'] ?? '') === 'order_form') {
                    $order = $section;
                    break;
                }
            }
            $payload['sections'] = $ab['sections'];
            if ($order) {
                $payload['sections'][] = $order;
            }
        }
        return $payload;
    }

    public static function document(array $payload, bool $preview): string {
        $css = esc_url(NOKSHA_URL . 'assets/landing.css');
        $js = esc_url(NOKSHA_URL . 'assets/landing.js');
        $fonts = esc_url(NOKSHA_URL . 'assets/fonts.css');
        $tokens = Tokens::merge(is_array($payload['tokens'] ?? null) ? $payload['tokens'] : null);
        $style = Tokens::css($tokens);
        $config = wp_json_encode(self::script_config($payload, $preview));
        $seo = self::seo_tags($payload);
        $title = esc_html((string) ($seo['title'] !== '' ? $seo['title'] : ($payload['title'] ?? '')));
        $article = self::article($payload, $preview);

        return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
            . '<title>' . $title . '</title>'
            . $seo['html']
            . '<link rel="stylesheet" href="' . $fonts . '">'
            . '<link rel="stylesheet" href="' . $css . '">'
            . '<style>' . $style . '</style></head><body class="noksha-landing-body">'
            . $article
            . '<script>window.nokshaFront = ' . $config . ';</script>'
            . '<script src="' . $js . '" defer></script></body></html>';
    }

    public static function seo_tags(array $payload): array {
        $seo = is_array($payload['seo'] ?? null) ? $payload['seo'] : [];
        $title = (string) ($seo['title'] ?? '');
        if ($title === '') {
            $title = (string) ($payload['title'] ?? '');
        }
        $description = (string) ($seo['description'] ?? '');
        if ($description === '') {
            foreach (($payload['sections'] ?? []) as $section) {
                if (($section['type'] ?? '') === 'hero' && !empty($section['props']['subtitle'])) {
                    $description = (string) $section['props']['subtitle'];
                    break;
                }
            }
        }
        if ($description === '') {
            $description = (string) ($payload['offer']['productName'] ?? '');
        }
        $image = (string) ($seo['imageUrl'] ?? '');
        if ($image === '') {
            $image = (string) ($payload['offer']['imageUrl'] ?? '');
        }
        $values = self::token_values($payload, ($payload['language'] ?? 'en') === 'bn' ? 'bn' : 'en');
        $title = self::plain_text($title, $values);
        $description = self::plain_text($description, $values);
        $url = !empty($payload['link']) ? (string) $payload['link'] : '';
        $html = '';
        if ($description !== '') {
            $html .= '<meta name="description" content="' . esc_attr($description) . '">';
            $html .= '<meta property="og:description" content="' . esc_attr($description) . '">';
        }
        if ($title !== '') {
            $html .= '<meta property="og:title" content="' . esc_attr($title) . '">';
        }
        if ($image !== '') {
            $html .= '<meta property="og:image" content="' . esc_url($image) . '">';
        }
        if ($url !== '') {
            $html .= '<meta property="og:url" content="' . esc_url($url) . '">';
        }
        $html .= '<meta property="og:type" content="product">';
        $offer_price = (float) ($payload['offer']['price'] ?? 0);
        if ($offer_price > 0) {
            // Product price for Facebook and other link previews.
            $html .= '<meta property="product:price:amount" content="' . esc_attr(number_format($offer_price, 2, '.', '')) . '">';
            $html .= '<meta property="product:price:currency" content="BDT">';
        }
        $html .= Schema::tag(Schema::product($payload, $description, $url));
        return [
            'title' => $title,
            'description' => $description,
            'imageUrl' => $image,
            'html' => $html,
        ];
    }

    public static function article(array $payload, bool $preview): string {
        $lang = ($payload['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        self::$token_values = self::token_values($payload, $lang);
        $tokens = Tokens::merge(is_array($payload['tokens'] ?? null) ? $payload['tokens'] : null);
        $style = esc_attr(Tokens::declarations($tokens));
        $motion = ($payload['motion'] ?? 'simple') === 'lively' ? ' nk-motion-lively' : '';
        $html = '<article class="nk-landing' . $motion . '" lang="' . esc_attr($lang === 'bn' ? 'bn' : 'en') . '" style="' . $style . '">';
        $has_form = false;
        foreach ($payload['sections'] as $section) {
            if (!empty($section['hidden'])) {
                continue;
            }
            if (($section['type'] ?? '') === 'order_form') {
                $has_form = true;
            }
            $html .= self::section($section, $payload, $preview);
        }
        $offer_for_cta = is_array($payload['offer'] ?? null) ? $payload['offer'] : [];
        $cannot_order = isset($offer_for_cta['wc']) && empty($offer_for_cta['wc']['available']);
        if ($has_form && !$cannot_order && self::thanks($payload) === '') {
            $offer = is_array($payload['offer'] ?? null) ? $payload['offer'] : [];
            $html .= '<div class="nk-sticky-cta" role="complementary">'
                . '<div class="nk-sticky-cta-price">' . esc_html(self::money((float) ($offer['price'] ?? 0), $lang)) . '</div>'
                . '<a class="nk-btn" href="#nk-order">' . esc_html(Catalog::line($lang, 'place_order')) . '</a>'
                . '</div>';
        }
        $html .= '</article>';
        return $html;
    }

    public static function script_config(array $payload, bool $preview): array {
        $lang = ($payload['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        $offer = $payload['offer'];
        return [
            'root' => esc_url_raw(rest_url('noksha/v1/')),
            'nonce' => \Noksha\Support\PublicNonce::create(),
            'nonceCreatedAt' => time(),
            'pageId' => (int) ($payload['id'] ?? 0),
            'geoUrl' => esc_url_raw(NOKSHA_URL . 'data/bd-geo.json'),
            'lang' => $lang,
            'preview' => $preview,
            'price' => (float) $offer['price'],
            'shipping' => (float) ($offer['shippingDefault'] ?? $offer['shippingOutside'] ?? $offer['shipping'] ?? 0),
            'shippingDefault' => (float) ($offer['shippingDefault'] ?? $offer['shippingOutside'] ?? $offer['shipping'] ?? 0),
            'shippingInside' => (float) ($offer['shippingInside'] ?? $offer['shipping'] ?? 0),
            'shippingOutside' => (float) ($offer['shippingOutside'] ?? $offer['shipping'] ?? 0),
            'shippingZones' => is_array($offer['shippingZones'] ?? null) ? $offer['shippingZones'] : [],
            'shippingSource' => \Noksha\Shipping\WcRates::source($offer),
            'dhakaDistrictId' => '47',
            'productName' => (string) ($offer['productName'] ?? ''),
            // Ad-platform ids: this page's product, and each option's own.
            'contentId' => \Noksha\Analytics\ContentId::for_offer($offer, (int) ($payload['id'] ?? 0)),
            'contentIds' => (object) \Noksha\Analytics\ContentId::for_variations($offer, (int) ($payload['id'] ?? 0)),
            'variationId' => (int) ($offer['variationId'] ?? 0),
            'variations' => is_array($offer['wc']['variations'] ?? null) ? $offer['wc']['variations'] : [],
            'stockHint' => [
                'enabled' => !empty($offer['stockHint']) && WcProduct::is_wc_offer($offer),
                'max' => (int) ($offer['stockHintMax'] ?? 10),
            ],
            'tiers' => is_array($offer['tiers'] ?? null) ? $offer['tiers'] : [],
            'maxQty' => WcProduct::max_qty($offer) !== null ? max(1, min(10, (int) WcProduct::max_qty($offer))) : 10,
            'bumps' => is_array($offer['bumps'] ?? null) ? $offer['bumps'] : [],
            'variant' => (string) ($payload['variant'] ?? 'a'),
            'otpMode' => (string) (Options::settings()['sms']['otp_mode'] ?? 'risk'),
            'otpReady' => \Noksha\Notify\Otp::ready(),
            'pixels' => [
                'meta' => (string) (Options::settings()['pixels']['meta'] ?? ''),
                'ga4' => (string) (Options::settings()['pixels']['ga4'] ?? ''),
                'tiktok' => (string) (Options::settings()['pixels']['tiktok'] ?? ''),
            ],
            'purchase' => self::purchase_payload($payload),
            'whatsapp' => (string) (Options::settings()['whatsapp'] ?? ''),
            'strings' => [
                'placing' => Catalog::line($lang, 'placing'),
                'thankYou' => Catalog::line($lang, 'thank_you'),
                'thankYouText' => Catalog::line($lang, 'thank_you_text'),
                'thankYouCall' => Catalog::line($lang, 'thank_you_call'),
                'orderNumber' => Catalog::line($lang, 'order_number'),
                'previewOnly' => Catalog::line($lang, 'preview_only'),
                'free' => Catalog::line($lang, 'free'),
                'days' => Catalog::line($lang, 'days'),
                'hours' => Catalog::line($lang, 'hours'),
                'minutes' => Catalog::line($lang, 'minutes'),
                'seconds' => Catalog::line($lang, 'seconds'),
                'otpRequired' => Catalog::line($lang, 'otp_required'),
                'otpLabel' => Catalog::line($lang, 'otp_label'),
                'otpSend' => Catalog::line($lang, 'otp_send'),
                'otpSent' => Catalog::line($lang, 'otp_sent'),
                'otpResend' => Catalog::line($lang, 'otp_resend'),
                'bumpAdd' => Catalog::line($lang, 'bump_add'),
                'couponApplied' => Catalog::line($lang, 'coupon_applied'),
                'stockLeft' => Catalog::line($lang, 'stock_left'),
                'noDelivery' => Catalog::line($lang, 'no_delivery'),
                'tierLabel' => Catalog::line($lang, 'tier_label'),
                'bundleSave' => Catalog::line($lang, 'bundle_save'),
                'outOfStock' => Catalog::line($lang, 'out_of_stock'),
                'couponInvalid' => Catalog::line($lang, 'coupon_invalid'),
                'invalidPhone' => Catalog::line($lang, 'invalid_phone'),
                'copy' => Catalog::line($lang, 'copy'),
                'copied' => Catalog::line($lang, 'copied'),
                'orderCta' => Catalog::line($lang, 'place_order'),
                'howToPay' => Catalog::line($lang, 'how_to_pay'),
                'whatsapp' => Catalog::line($lang, 'whatsapp_us'),
            ],
        ];
    }

    private static function section(array $section, array $payload, bool $preview): string {
        $type = $section['type'];
        $props = $section['props'];
        $html = match ($type) {
            'hero' => self::hero($props, $payload, $preview),
            'benefits' => self::benefits($props, $preview),
            'product' => self::product($props, $payload, $preview),
            'countdown' => self::countdown($props, $payload, $preview),
            'reviews' => self::reviews($props, $preview, (string) ($payload['language'] ?? 'en')),
            'faq' => self::faq($props, $preview),
            'guarantee' => self::guarantee($props, $preview),
            'order_form' => self::order_form($props, $payload, $preview),
            'gallery' => self::gallery($props, $preview),
            'video' => self::video($props, $preview),
            'steps' => self::steps($props, $preview),
            'compare' => self::compare($props, $preview),
            'whatsapp' => self::whatsapp($props, $payload),
            'bundles' => self::bundles($props, $payload, $preview),
            'html' => ($props['html'] ?? '') !== ''
                ? '<section class="nk-section nk-html"><div class="nk-html-inner">' . Sanitizer::clean_html((string) $props['html']) . '</div></section>'
                : '',
            default => '',
        };
        $html = self::apply_style($html, is_array($section['style'] ?? null) ? $section['style'] : []);
        if ($preview && $html !== '') {
            $html = preg_replace('/^<([a-z0-9]+)/i', '<$1 data-nk-section="' . esc_attr((string) ($section['id'] ?? '')) . '"', $html, 1) ?? $html;
        }
        return $html;
    }

    /** Adds layout/background/spacing classes to the section's root element. */
    private static function apply_style(string $html, array $style): string {
        if ($html === '') {
            return $html;
        }
        $classes = [];
        $layout = sanitize_key((string) ($style['layout'] ?? ''));
        if ($layout !== '') {
            $classes[] = 'nk-layout-' . $layout;
        }
        $bg = sanitize_key((string) ($style['bg'] ?? 'none'));
        if ($bg !== '' && $bg !== 'none') {
            $classes[] = 'nk-has-band';
            $classes[] = 'nk-bg-' . $bg;
        }
        $space = sanitize_key((string) ($style['space'] ?? 'normal'));
        if ($space !== '' && $space !== 'normal') {
            $classes[] = 'nk-space-' . $space;
        }
        $show = sanitize_key((string) ($style['show'] ?? 'all'));
        if ($show === 'mobile' || $show === 'desktop') {
            $classes[] = 'nk-only-' . $show;
        }
        foreach (['size' => 'md', 'ratio' => 'auto', 'fit' => 'cover', 'round' => 'md'] as $key => $default) {
            $value = sanitize_key((string) ($style[$key] ?? $default));
            if ($value !== '' && $value !== $default) {
                $classes[] = 'nk-' . $key . '-' . $value;
            }
        }
        if ($classes === []) {
            return $html;
        }
        $add = esc_attr(implode(' ', $classes));
        $out = preg_replace('/^(<[a-z0-9]+\b[^>]*?\bclass=")([^"]*)(")/i', '${1}${2} ' . $add . '${3}', $html, 1, $count);
        if ($count === 0) {
            $out = preg_replace('/^<([a-z0-9]+)/i', '<$1 class="' . $add . '"', $html, 1);
        }
        return $out ?? $html;
    }

    private static function hero(array $props, array $payload = [], bool $preview = false): string {
        $lang = ($payload['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        $offer = is_array($payload['offer'] ?? null) ? $payload['offer'] : [];
        $media = self::image((string) ($props['imageUrl'] ?: ($offer['imageUrl'] ?? '')), $props['title'] ?? '', true);
        $price = (float) ($offer['price'] ?? 0);
        $compare = (float) ($offer['compareAt'] ?? 0);
        $price_block = '';
        if ($price > 0) {
            $save = $compare > $price ? ($compare - $price) : 0;
            $price_block = '<div class="nk-price-block">'
                . '<strong class="nk-price-now">' . esc_html(self::money($price, $lang)) . '</strong>'
                . ($compare > $price ? '<s class="nk-price-was">' . esc_html(self::money($compare, $lang)) . '</s>' : '')
                . ($save > 0 ? '<span class="nk-save-badge">' . esc_html(Catalog::line($lang, 'you_save') . ' ' . self::money($save, $lang)) . '</span>' : '')
                . '</div>';
        }
        $trust = '<ul class="nk-trust-row" aria-label="trust">'
            . '<li>' . esc_html(Catalog::line($lang, 'trust_cod')) . '</li>'
            . '<li>' . esc_html(Catalog::line($lang, 'trust_delivery')) . '</li>'
            . '<li>' . esc_html(Catalog::line($lang, 'trust_secure')) . '</li>'
            . '</ul>';
        $cta = $props['buttonLabel'] !== ''
            ? self::editable('a', 'buttonLabel', $props['buttonLabel'], 'nk-btn', $preview, ['href' => '#nk-order'])
            : '<a class="nk-btn" href="#nk-order">' . esc_html(Catalog::line($lang, 'place_order')) . '</a>';
        $thumbs = self::thumbs($offer, $lang);
        $rating = self::rating_line($offer, $lang);
        return '<header class="nk-hero">'
            . '<div class="nk-hero-media">' . $media . $thumbs . '</div>'
            . '<div class="nk-hero-copy">'
            . ($props['eyebrow'] !== '' ? self::editable('p', 'eyebrow', $props['eyebrow'], 'nk-eyebrow', $preview) : '')
            . self::editable('h1', 'title', $props['title'], '', $preview)
            . ($props['subtitle'] !== '' ? self::editable('p', 'subtitle', $props['subtitle'], 'nk-lead', $preview) : '')
            . $price_block
            . $rating
            . $cta
            . $trust
            . '</div></header>';
    }

    private static function benefits(array $props, bool $preview = false): string {
        $items = '';
        foreach ($props['items'] as $index => $item) {
            $items .= '<li class="nk-benefit-card">'
                . '<span class="nk-benefit-icon" aria-hidden="true">✓</span>'
                . '<div>'
                . self::editable('h3', 'items.' . $index . '.title', $item['title'], '', $preview)
                . self::editable('p', 'items.' . $index . '.text', $item['text'], '', $preview)
                . '</div></li>';
        }
        return '<section class="nk-section">' . self::editable('h2', 'title', $props['title'], '', $preview)
            . '<ul class="nk-benefits">' . $items . '</ul></section>';
    }

    private static function product(array $props, array $payload, bool $preview = false): string {
        $lang = $payload['language'];
        $offer = $payload['offer'];
        $bullets = '';
        foreach ($props['bullets'] as $index => $bullet) {
            $bullets .= self::editable('li', 'bullets.' . $index, $bullet, '', $preview);
        }
        $price = (float) $offer['price'];
        $compare = (float) $offer['compareAt'];
        $img = $props['imageUrl'] ?: ($offer['imageUrl'] ?? '');
        $gallery = '<div class="nk-gallery">' . self::image($img, $props['title'], false) . '</div>';
        $price_html = '<div class="nk-price-block">'
            . '<strong class="nk-price-now">' . esc_html(self::money($price, $lang)) . '</strong>'
            . ($compare > $price ? '<s class="nk-price-was">' . esc_html(Catalog::line($lang, 'was') . ' ' . self::money($compare, $lang)) . '</s>' : '')
            . '</div>';
        return '<section class="nk-section nk-product">'
            . $gallery
            . '<div>' . self::editable('h2', 'title', $props['title'], '', $preview)
            . $price_html
            . self::editable('p', 'text', $props['text'], '', $preview)
            . ($bullets !== '' ? '<ul class="nk-bullets">' . $bullets . '</ul>' : '')
            . '</div></section>';
    }

    private static function countdown(array $props, array $payload, bool $preview = false): string {
        $lang = $payload['language'];
        // A store product on sale follows its sale end date unless a time is set by hand.
        $ends_at = (string) $props['endsAt'];
        if ($ends_at === '') {
            $sale_end = (string) ($payload['offer']['wc']['saleEndsAt'] ?? '');
            if ($sale_end !== '' && strtotime($sale_end) > time()) {
                $ends_at = $sale_end;
            }
        }
        if ($ends_at === '') {
            return '';
        }
        $props['endsAt'] = $ends_at;
        $units = '';
        foreach (['days', 'hours', 'minutes', 'seconds'] as $unit) {
            $units .= '<div><strong data-unit="' . esc_attr($unit) . '">00</strong><span>' . esc_html(Catalog::line($lang, $unit)) . '</span></div>';
        }
        $count = '<div class="nk-count" data-ends="' . esc_attr($props['endsAt']) . '">' . $units . '</div>';
        return '<section class="nk-section nk-countdown" data-countdown-block>'
            . self::editable('h2', 'title', $props['title'], '', $preview)
            . '<p>' . esc_html(Catalog::line($lang, 'offer_ends')) . '</p>'
            . $count
            . '</section>'
            . '<div class="nk-countdown-bar" data-countdown-bar hidden>'
            . '<span>' . esc_html($props['title'] !== '' ? $props['title'] : Catalog::line($lang, 'offer_ends')) . '</span>'
            . '<div class="nk-count" data-ends="' . esc_attr($props['endsAt']) . '">' . $units . '</div>'
            . '</div>';
    }

    private static function reviews(array $props, bool $preview = false, string $lang = 'en'): string {
        $items = '';
        foreach ($props['items'] as $index => $item) {
            $stars = str_repeat('★', max(0, min(5, (int) $item['rating'])));
            $photo = !empty($item['imageUrl']) ? self::image((string) $item['imageUrl'], (string) $item['name'], false) : '';
            $items .= '<blockquote class="nk-review-card">'
                . $photo
                . '<div class="nk-stars" aria-hidden="true">' . esc_html($stars) . '</div>'
                . self::editable('p', 'items.' . $index . '.text', $item['text'], '', $preview)
                . '<footer>'
                . self::editable('span', 'items.' . $index . '.name', $item['name'], '', $preview)
                . (!empty($item['verified']) ? ' <span class="nk-verified">' . esc_html(Catalog::line($lang, 'verified_buyer')) . '</span>' : '')
                . '</footer></blockquote>';
        }
        return '<section class="nk-section">' . self::editable('h2', 'title', $props['title'], '', $preview)
            . '<div class="nk-reviews">' . $items . '</div></section>';
    }

    private static function faq(array $props, bool $preview = false): string {
        $items = '';
        foreach ($props['items'] as $index => $item) {
            $id = 'nk-faq-' . $index;
            $items .= '<div class="nk-faq-item">'
                . '<button type="button" id="' . esc_attr($id) . '-btn" aria-expanded="false" aria-controls="' . esc_attr($id) . '" data-nk-prop="items.' . esc_attr((string) $index) . '.q">'
                . self::text($item['q'])
                . '</button><div id="' . esc_attr($id) . '" role="region" aria-labelledby="' . esc_attr($id) . '-btn" hidden>'
                . self::editable('p', 'items.' . $index . '.a', $item['a'], '', $preview)
                . '</div></div>';
        }
        return '<section class="nk-section">' . self::editable('h2', 'title', $props['title'], '', $preview)
            . '<div class="nk-faq nk-faq-one">' . $items . '</div></section>';
    }

    private static function gallery(array $props, bool $preview): string {
        $figures = '';
        foreach ($props['images'] as $image) {
            $alt = $image['alt'] !== '' ? $image['alt'] : $props['title'];
            $figures .= '<figure class="nk-photo">' . self::image($image['url'], $alt, false) . '</figure>';
        }
        if ($figures === '' && !$preview) {
            return '';
        }
        return '<section class="nk-section nk-photos">' . self::editable('h2', 'title', $props['title'], '', $preview)
            . '<div class="nk-photo-track">' . $figures . '</div></section>';
    }

    /** @return array{0:string,1:string,2:string}|null Provider, video id and optional Vimeo privacy hash. */
    private static function video_embed(string $url): ?array {
        $parts = wp_parse_url($url);
        $host = strtolower((string) ($parts['host'] ?? ''));
        $host = preg_replace('/^(www|m)\./', '', $host) ?? '';
        $path = (string) ($parts['path'] ?? '');
        if ($host === 'youtu.be') {
            $id = trim($path, '/');
        } elseif ($host === 'youtube.com' || $host === 'youtube-nocookie.com') {
            $id = '';
            if ($path === '/watch') {
                parse_str((string) ($parts['query'] ?? ''), $query);
                $id = (string) ($query['v'] ?? '');
            } elseif (preg_match('#^/(?:embed|shorts|live)/([\w-]{6,20})#', $path, $m)) {
                $id = $m[1];
            }
        } elseif ($host === 'vimeo.com' || $host === 'player.vimeo.com') {
            if (!preg_match('#/(\d{6,12})(?:/([0-9a-f]{6,20}))?(?:/|$)#', $path, $m)) {
                return null;
            }
            $hash = $m[2] ?? '';
            if ($hash === '') {
                parse_str((string) ($parts['query'] ?? ''), $query);
                $hash = (string) ($query['h'] ?? '');
            }
            return ['vimeo', $m[1], preg_match('/^[0-9a-f]{6,20}$/', $hash) ? $hash : ''];
        } else {
            return null;
        }
        return preg_match('/^[\w-]{6,20}$/', $id) ? ['youtube', $id, ''] : null;
    }

    private static function video(array $props, bool $preview): string {
        $embed = $props['url'] !== '' ? self::video_embed($props['url']) : null;
        if ($embed === null && !$preview) {
            return '';
        }
        $title = self::editable('h2', 'title', $props['title'], '', $preview);
        if ($embed === null) {
            return '<section class="nk-section nk-video">' . $title . '<div class="nk-video-frame nk-video-empty">▶</div></section>';
        }
        [$kind, $id, $hash] = $embed;
        $thumb = $kind === 'youtube'
            ? '<img src="' . esc_url('https://i.ytimg.com/vi/' . $id . '/hqdefault.jpg') . '" alt="" loading="lazy" decoding="async" width="480" height="360">'
            : '';
        $caption = $props['caption'] !== '' ? self::editable('p', 'caption', $props['caption'], 'nk-video-caption', $preview) : '';
        return '<section class="nk-section nk-video">' . $title
            . '<div class="nk-video-frame" data-nk-video="' . esc_attr($kind) . '" data-id="' . esc_attr($id) . '"' . ($hash !== '' ? ' data-hash="' . esc_attr($hash) . '"' : '') . '>'
            . '<button type="button" class="nk-video-play" aria-label="' . esc_attr($props['title'] !== '' ? $props['title'] : 'Play video') . '">'
            . $thumb . '<span class="nk-video-icon" aria-hidden="true">▶</span></button></div>'
            . $caption . '</section>';
    }

    private static function steps(array $props, bool $preview): string {
        $items = '';
        foreach ($props['items'] as $index => $item) {
            $items .= '<li class="nk-step"><span class="nk-step-num" aria-hidden="true"></span><div>'
                . self::editable('h3', 'items.' . $index . '.title', $item['title'], '', $preview)
                . self::editable('p', 'items.' . $index . '.text', $item['text'], '', $preview)
                . '</div></li>';
        }
        return '<section class="nk-section nk-steps-section">' . self::editable('h2', 'title', $props['title'], '', $preview)
            . '<ol class="nk-steps">' . $items . '</ol></section>';
    }

    private static function compare(array $props, bool $preview): string {
        $rows = '';
        foreach ($props['rows'] as $index => $row) {
            $cells = '';
            foreach (['us' => 'nk-us', 'them' => 'nk-them'] as $key => $class) {
                $value = $row[$key];
                $mark = $value === '✓' ? ' nk-yes' : ($value === '✗' ? ' nk-no' : '');
                $cells .= self::editable('td', 'rows.' . $index . '.' . $key, $value, $class . $mark, $preview);
            }
            $rows .= '<tr>' . self::editable('th', 'rows.' . $index . '.label', $row['label'], '', $preview, ['scope' => 'row']) . $cells . '</tr>';
        }
        $head = '<thead><tr><td></td>'
            . self::editable('th', 'usLabel', $props['usLabel'], 'nk-us', $preview, ['scope' => 'col'])
            . self::editable('th', 'themLabel', $props['themLabel'], 'nk-them', $preview, ['scope' => 'col'])
            . '</tr></thead>';
        return '<section class="nk-section nk-compare">' . self::editable('h2', 'title', $props['title'], '', $preview)
            . '<div class="nk-compare-scroll"><table class="nk-compare-table">' . $head . '<tbody>' . $rows . '</tbody></table></div></section>';
    }

    private static function whatsapp(array $props, array $payload): string {
        $number = (string) ($props['number'] ?? '');
        if ($number === '') {
            $number = preg_replace('/\D+/', '', (string) (Options::settings()['whatsapp'] ?? '')) ?? '';
        }
        if (preg_match('/^01\d{9}$/', $number)) {
            $number = '88' . $number;
        }
        if ($number === '') {
            return '';
        }
        $lang = ($payload['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        $label = $props['label'] !== '' ? $props['label'] : Catalog::line($lang, 'whatsapp_us');
        $href = 'https://wa.me/' . $number . ($props['message'] !== '' ? '?text=' . rawurlencode($props['message']) : '');
        return '<a class="nk-wa-float" href="' . esc_url($href) . '" target="_blank" rel="noopener" aria-label="' . esc_attr($label) . '">'
            . '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12.04 2a9.9 9.9 0 0 0-8.43 15.1L2 22l5.05-1.32A9.9 9.9 0 1 0 12.04 2zm5.8 14.1c-.25.7-1.45 1.33-2 1.4-.52.07-1.17.1-1.89-.12-.43-.14-.98-.32-1.69-.63-2.97-1.28-4.9-4.27-5.05-4.47-.15-.2-1.2-1.6-1.2-3.05s.76-2.16 1.03-2.46c.27-.3.58-.37.78-.37h.56c.18 0 .43-.07.67.51.25.6.85 2.07.92 2.22.08.15.13.32.03.52-.1.2-.15.32-.3.5-.15.17-.31.38-.45.51-.15.15-.3.31-.13.6.17.3.77 1.27 1.65 2.05 1.13 1 2.09 1.31 2.39 1.46.3.15.47.13.65-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.08.12.08.72-.17 1.42z"/></svg>'
            . '<span>' . esc_html($label) . '</span></a>';
    }

    private static function guarantee(array $props, bool $preview = false): string {
        return '<section class="nk-guarantee">'
            . '<div class="nk-guarantee-badge" aria-hidden="true">✓</div>'
            . self::editable('h2', 'title', $props['title'], '', $preview)
            . self::editable('p', 'text', $props['text'], '', $preview)
            . '</section>';
    }

    private static function editable(string $tag, string $prop, string $value, string $class, bool $preview, array $attrs = []): string {
        $attr = '';
        foreach ($attrs as $key => $val) {
            $attr .= ' ' . $key . '="' . esc_attr((string) $val) . '"';
        }
        if ($class !== '') {
            $attr .= ' class="' . esc_attr($class) . '"';
        }
        $has_token = self::has_token($value);
        if ($preview && !$has_token) {
            $attr .= ' data-nk-prop="' . esc_attr($prop) . '"';
        }
        return '<' . $tag . $attr . '>' . self::text($value) . '</' . $tag . '>';
    }

    /** @var array<string, string> Live values for {price}, {product} and the rest, for the page being drawn. */
    private static array $token_values = [];

    public const TOKENS = ['product', 'price', 'old_price', 'save', 'save_percent', 'stock', 'sale_ends'];

    /**
     * @return array<string, string>
     */
    public static function token_values(array $payload, string $lang): array {
        $offer = is_array($payload['offer'] ?? null) ? $payload['offer'] : [];
        $price = (float) ($offer['price'] ?? 0);
        $compare = (float) ($offer['compareAt'] ?? 0);
        $on_sale = $compare > $price && $price > 0;
        $wc = is_array($offer['wc'] ?? null) ? $offer['wc'] : [];
        $stock = $wc['stock'] ?? null;
        $sale_end = (string) ($wc['saleEndsAt'] ?? '');
        return [
            'product' => (string) ($offer['productName'] ?? ''),
            'price' => $price > 0 ? self::money($price, $lang) : '',
            'old_price' => $on_sale ? self::money($compare, $lang) : '',
            'save' => $on_sale ? self::money($compare - $price, $lang) : '',
            'save_percent' => $on_sale ? (string) round((1 - $price / $compare) * 100) . '%' : '',
            'stock' => $stock === null ? '' : (string) (int) $stock,
            'sale_ends' => $sale_end !== '' && strtotime($sale_end) ? (string) date_i18n('j F', (int) strtotime($sale_end)) : '',
        ];
    }

    private static function has_token(string $value): bool {
        return (bool) preg_match('/\{(' . implode('|', self::TOKENS) . ')\}/', $value);
    }

    /**
     * Escaped text with {price} and the others as live spans the browser can update.
     * Unknown {words} stay as written.
     */
    public static function text(string $value): string {
        if (!self::has_token($value)) {
            return esc_html($value);
        }
        $parts = preg_split('/(\{(?:' . implode('|', self::TOKENS) . ')\})/', $value, -1, PREG_SPLIT_DELIM_CAPTURE) ?: [$value];
        $out = '';
        foreach ($parts as $part) {
            if (preg_match('/^\{(' . implode('|', self::TOKENS) . ')\}$/', $part, $m)) {
                $out .= '<span data-nk-token="' . esc_attr($m[1]) . '">' . esc_html(self::$token_values[$m[1]] ?? '') . '</span>';
            } else {
                $out .= esc_html($part);
            }
        }
        return $out;
    }

    /**
     * The same, as plain text (titles, descriptions).
     */
    public static function plain_text(string $value, array $values): string {
        return (string) preg_replace_callback('/\{(' . implode('|', self::TOKENS) . ')\}/', static fn($m) => $values[$m[1]] ?? '', $value);
    }

    private static function order_form(array $props, array $payload, bool $preview): string {
        $lang = ($payload['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        $checkout = $payload['checkout'];
        $offer = $payload['offer'];
        $position = $checkout['summaryPosition'];
        $thanks = self::thanks($payload);
        if ($thanks !== '') {
            return '<section class="nk-section nk-order" id="nk-order">' . $thanks . '</section>';
        }
        $notice = self::payment_notice($lang);

        $fields = '';
        $custom_by_id = array_column(is_array($checkout['customFields'] ?? null) ? $checkout['customFields'] : [], null, 'id');
        $order_keys = is_array($checkout['fieldOrder'] ?? null) ? $checkout['fieldOrder'] : Sanitizer::STANDARD_ORDER;
        foreach ($order_keys as $key) {
            if (isset($custom_by_id[$key])) {
                $fields .= self::custom_field($custom_by_id[$key]);
                continue;
            }
            // "area" is division, district and upazila, in that order.
            foreach ($key === 'area' ? ['division', 'district', 'upazila'] : [$key] as $part) {
                $field = $checkout['fields'][$part] ?? null;
                if (is_array($field) && !empty($field['enabled'])) {
                    $fields .= self::field($part, $field, $lang);
                }
            }
        }

        $methods = self::payment_methods($checkout, $lang);
        $badges = '';
        foreach ($checkout['trustBadges'] as $badge) {
            $badges .= '<li>' . esc_html(Catalog::line($lang, 'trust_' . $badge)) . '</li>';
        }

        $price = (float) $offer['price'];
        $shipping = (float) $offer['shipping'];
        $wc = is_array($offer['wc'] ?? null) ? $offer['wc'] : null;
        $sold_out = $wc !== null && empty($wc['available']);
        $button = $props['buttonLabel'] !== '' ? $props['buttonLabel'] : Catalog::line($lang, 'place_order');

        $bump_html = '';
        $bumps = is_array($offer['bumps'] ?? null) ? $offer['bumps'] : [];
        foreach ($bumps as $bump_index => $bump) {
            if (empty($bump['enabled']) || (float) ($bump['price'] ?? 0) <= 0) {
                continue;
            }
            $checked = !empty($bump['checkedDefault']) ? ' checked' : '';
            $bump_html .= '<label class="nk-bump"><input type="checkbox" name="bump" form="nk-order-form" value="1" data-bump-index="' . esc_attr((string) $bump_index) . '"' . $checked . '>'
                . '<span><strong>' . esc_html((string) ($bump['name'] ?: Catalog::line($lang, 'bump_add'))) . '</strong>'
                . '<em>+' . esc_html(self::money((float) $bump['price'], $lang)) . '</em></span></label>';
        }

        $otp_digits = '';
        for ($i = 0; $i < 6; $i++) {
            $otp_digits .= '<input class="nk-otp-box" type="text" inputmode="numeric" maxlength="1" autocomplete="' . ($i === 0 ? 'one-time-code' : 'off') . '" aria-label="' . esc_attr(Catalog::line($lang, 'otp_label') . ' ' . ($i + 1)) . '">';
        }
        $otp = '<div class="nk-otp" hidden>'
            . '<p class="nk-otp-label">' . esc_html(Catalog::line($lang, 'otp_label')) . '</p>'
            . '<div class="nk-otp-digits">' . $otp_digits . '</div>'
            . '<input type="hidden" name="otp_code" value="">'
            . '<button type="button" class="nk-btn-ghost" data-otp-send>' . esc_html(Catalog::line($lang, 'otp_send')) . '</button>'
            . '</div>';

        $form = '<form class="nk-form" id="nk-order-form" data-preview="' . ($preview ? '1' : '0') . '" novalidate>'
            . '<h2>' . self::text($props['title']) . '</h2>'
            . $notice
            . $thanks
            . '<div class="nk-form-error" hidden tabindex="-1"></div>'
            . $fields
            . $otp
            . '<fieldset class="nk-payments"><legend>' . esc_html(Catalog::line($lang, 'payment')) . '</legend>' . $methods . '</fieldset>'
            . '<div class="nk-trx" hidden>'
            . '<p class="nk-how-pay"><strong>' . esc_html(Catalog::line($lang, 'how_to_pay')) . '</strong></p>'
            . '<label>' . esc_html(Catalog::line($lang, 'trx'))
            . '<input name="trx_id" inputmode="text" autocomplete="off" maxlength="40"></label>'
            . '</div>'
            . '<div class="nk-hp" aria-hidden="true"><label>Website<input name="company_website" tabindex="-1" autocomplete="off"></label></div>'
            . '<button class="nk-btn nk-submit" type="submit"' . ($sold_out && !$preview ? ' disabled' : '') . '><span class="nk-btn-label">' . esc_html($button) . '</span><span class="nk-btn-spinner" aria-hidden="true"></span></button>'
            . '</form>';

        $max_qty = WcProduct::max_qty($offer);
        $qty_max = $max_qty !== null ? max(1, min(10, $max_qty)) : 10;
        $variation_html = '';
        if ($wc !== null && !empty($wc['variations'])) {
            $options = '';
            foreach ($wc['variations'] as $variation) {
                $label = (string) $variation['label'] . ' · ' . self::money((float) $variation['price'], $lang);
                if (empty($variation['inStock'])) {
                    $label .= ' (' . Catalog::line($lang, 'sold_out') . ')';
                }
                $options .= '<option value="' . esc_attr((string) $variation['id']) . '"'
                    . selected((int) $variation['id'], (int) $offer['variationId'], false)
                    . (empty($variation['inStock']) ? ' disabled' : '') . '>'
                    . esc_html($label) . '</option>';
            }
            $variation_html = '<label class="nk-variation">'
                . '<span>' . esc_html(Catalog::line($lang, 'choose_option')) . '</span>'
                . '<select name="variation_id" form="nk-order-form" data-variation>' . $options . '</select></label>';
        }
        $unavailable_key = ($wc['reason'] ?? '') === 'out_of_stock' ? 'out_of_stock' : 'product_unavailable';
        $sold_out_html = $sold_out
            ? '<p class="nk-form-error nk-sold-out" role="alert">' . esc_html(Catalog::line($lang, $unavailable_key)) . '</p>'
            : '';

        $coupon_html = '';
        if (!empty($checkout['coupon']) && WcProduct::is_wc_offer($offer) && !$sold_out) {
            $coupon_html = '<div class="nk-coupon">'
                . '<label for="nk-coupon-code">' . esc_html(Catalog::line($lang, 'coupon_label')) . '</label>'
                . '<div class="nk-coupon-row">'
                . '<input id="nk-coupon-code" name="coupon_code" form="nk-order-form" autocomplete="off" maxlength="64">'
                . '<button type="button" class="nk-btn-ghost" data-coupon-apply>' . esc_html(Catalog::line($lang, 'coupon_apply')) . '</button>'
                . '</div>'
                . '<p class="nk-coupon-msg" data-coupon-msg role="status" hidden></p>'
                . '</div>';
        }

        $summary = '<aside class="nk-summary"><h3>' . esc_html(Catalog::line($lang, 'summary')) . '</h3>'
            . '<p class="nk-summary-name">' . esc_html($offer['productName']) . '</p>'
            . self::stock_hint($offer, $lang)
            . $variation_html
            . $sold_out_html
            . '<div class="nk-qty">'
            . '<span>' . esc_html(Catalog::line($lang, 'qty')) . '</span>'
            . '<div class="nk-qty-stepper">'
            . '<button type="button" class="nk-qty-btn" data-qty-dec aria-label="-">−</button>'
            . '<input name="qty" form="nk-order-form" type="number" min="1" max="' . esc_attr((string) $qty_max) . '" value="1" inputmode="numeric">'
            . '<button type="button" class="nk-qty-btn" data-qty-inc aria-label="+">+</button>'
            . '</div></div>'
            . self::tiers_html($offer, $lang, $qty_max)
            . $bump_html
            . $coupon_html
            . '<dl>'
            . '<div><dt>' . esc_html(Catalog::line($lang, 'subtotal')) . '</dt><dd data-subtotal>' . esc_html(self::money($price, $lang)) . '</dd></div>'
            . '<div><dt>' . esc_html(Catalog::line($lang, 'shipping')) . '</dt><dd data-shipping>' . esc_html(self::money($shipping, $lang)) . '</dd></div>'
            . '<div class="nk-tier-row" data-tier-row hidden><dt>' . esc_html(Catalog::line($lang, 'tier_discount')) . '</dt><dd data-tier></dd></div>'
            . '<div class="nk-discount-row" data-discount-row hidden><dt>' . esc_html(Catalog::line($lang, 'discount')) . '</dt><dd data-discount></dd></div>'
            . '<div class="nk-total-row"><dt>' . esc_html(Catalog::line($lang, 'total')) . '</dt><dd data-total>' . esc_html(self::money($price + $shipping, $lang)) . '</dd></div>'
            . '</dl>'
            . ($checkout['deliveryNote'] !== '' ? '<p class="nk-note">' . esc_html($checkout['deliveryNote']) . '</p>' : '')
            . ($badges !== '' ? '<ul class="nk-trust">' . $badges . '</ul>' : '')
            . '</aside>';

        return '<section class="nk-section nk-order nk-order-' . esc_attr($position) . '" id="nk-order">'
            . '<div class="nk-order-layout">' . $form . $summary . '</div></section>';
    }

    /**
     * A field the page owner added. Its value is sent as custom[id].
     */
    private static function custom_field(array $field): string {
        $required = !empty($field['required']);
        $mark = $required ? ' <span aria-hidden="true">*</span>' : '';
        $req = $required ? ' required' : '';
        $name = 'custom[' . esc_attr((string) $field['id']) . ']';
        $input = match ($field['type']) {
            'textarea' => '<textarea name="' . $name . '" rows="3" maxlength="500"' . $req . '></textarea>',
            'date' => '<input type="date" name="' . $name . '"' . $req . '>',
            'select' => '<select name="' . $name . '"' . $req . '><option value=""></option>'
                . implode('', array_map(static fn($option) => '<option value="' . esc_attr($option) . '">' . esc_html($option) . '</option>', (array) $field['options']))
                . '</select>',
            default => '<input type="text" name="' . $name . '" maxlength="200"' . $req . '>',
        };
        return '<label class="nk-field" data-field="' . esc_attr((string) $field['id']) . '"><span class="nk-field-label">' . esc_html((string) $field['label']) . $mark . '</span>' . $input . '</label>';
    }

    private static function field(string $key, array $field, string $lang): string {
        $label = ($field['label'] ?? '') !== '' ? (string) $field['label'] : Catalog::line($lang, $key);
        $required = !empty($field['required']);
        $mark = $required ? ' <span aria-hidden="true">*</span>' : '';
        $req = $required ? ' required' : '';
        $name = esc_attr($key);
        if (in_array($key, ['division', 'district', 'upazila'], true)) {
            $input = '<select name="' . $name . '_id"' . $req . ' data-geo="' . esc_attr($key) . '"><option value="">'
                . esc_html(Catalog::line($lang, 'select')) . '</option></select>';
        } elseif ($key === 'address' || $key === 'note') {
            $input = '<textarea name="' . $name . '" rows="3"' . $req . '></textarea>';
        } else {
            $type = $key === 'email' ? 'email' : ($key === 'phone' ? 'tel' : 'text');
            $auto = $key === 'phone' ? 'tel' : ($key === 'email' ? 'email' : 'name');
            $mode = $key === 'phone' ? ' inputmode="tel"' : '';
            $input = '<input type="' . $type . '" name="' . $name . '" autocomplete="' . $auto . '"' . $mode . $req . '>';
        }
        return '<label class="nk-field" data-field="' . esc_attr($key) . '"><span class="nk-field-label">' . esc_html($label) . $mark . '</span>' . $input . '</label>';
    }

    private static function payment_methods(array $checkout, string $lang): string {
        $settings = Options::settings();
        $html = '';
        $first = true;
        foreach ($checkout['payments'] as $method) {
            $gateway = $settings['gateways'][$method] ?? null;
            if (!is_array($gateway) || empty($gateway['enabled'])) {
                continue;
            }
            if (in_array($method, ['manual_bkash', 'manual_nagad'], true) && ($gateway['number'] ?? '') === '') {
                continue;
            }
            if ($method === 'sslcommerz') {
                $secrets = Options::secrets();
                if (($secrets['sslcommerz_store_id'] ?? '') === '' || ($secrets['sslcommerz_store_passwd'] ?? '') === '') {
                    continue;
                }
            }
            $help = match ($method) {
                'manual_bkash', 'manual_nagad' => ($gateway['instructions'] ?? '') !== '' ? $gateway['instructions'] : Catalog::line($lang, 'wallet_help'),
                'sslcommerz' => Catalog::line($lang, 'ssl_help'),
                default => Catalog::line($lang, 'cod_help'),
            };
            $number = $gateway['number'] ?? '';
            $checked = $first ? ' checked' : '';
            $first = false;
            $wallet = '';
            if ($number !== '' && in_array($method, ['manual_bkash', 'manual_nagad'], true)) {
                $wallet = '<div class="nk-wallet" data-wallet="' . esc_attr($method) . '" hidden>'
                    . '<span class="nk-wallet-number">' . esc_html($number) . '</span>'
                    . '<button type="button" class="nk-btn-ghost" data-copy="' . esc_attr($number) . '">' . esc_html(Catalog::line($lang, 'copy')) . '</button>'
                    . '<p class="nk-muted">' . esc_html($help) . '</p>'
                    . '</div>';
            }
            $html .= '<label class="nk-pay"><input type="radio" name="payment_method" value="' . esc_attr($method) . '"' . $checked . '>'
                . '<span class="nk-pay-card"><strong>' . esc_html(Catalog::line($lang, 'pay_' . $method)) . '</strong>'
                . ($number !== '' ? '<small>' . esc_html($number) . '</small>' : '')
                . '<em>' . esc_html($help) . '</em></span></label>'
                . $wallet;
        }
        return $html;
    }

    private static function payment_notice(string $lang): string {
        $flag = isset($_GET['nk_payment']) ? sanitize_key(wp_unslash($_GET['nk_payment'])) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if ($flag !== 'failed' && $flag !== 'cancelled') {
            return '';
        }
        $key = $flag === 'cancelled' ? 'payment_cancelled' : 'payment_failed';
        return '<p class="nk-banner">' . esc_html(Catalog::line($lang, $key)) . '</p>';
    }

    private static function thanks(array $payload): string {
        $number = isset($_GET['nk_order']) ? sanitize_text_field(wp_unslash($_GET['nk_order'])) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $key = isset($_GET['nk_key']) ? sanitize_text_field(wp_unslash($_GET['nk_key'])) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if ($number === '' || $key === '') {
            return '';
        }
        $order = \Noksha\Orders\Repository::find_by_number($number);
        if (!$order || (int) $order['page_id'] !== (int) ($payload['id'] ?? 0)) {
            return '';
        }
        $expected = self::order_key($order);
        if (!hash_equals($expected, $key)) {
            return '';
        }
        $lang = ($payload['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        $items = \Noksha\Orders\Repository::items((int) $order['id']);
        $lines = '';
        foreach ($items as $item) {
            $lines .= '<li>' . esc_html((string) ($item['qty'] ?? 1)) . ' × ' . esc_html((string) ($item['name'] ?? ''))
                . ' · ' . esc_html(self::money((float) ($item['price'] ?? 0), $lang)) . '</li>';
        }
        $wa = preg_replace('/\D+/', '', (string) (Options::settings()['whatsapp'] ?? '')) ?? '';
        $wa_btn = $wa !== ''
            ? '<a class="nk-btn nk-btn-whatsapp" href="https://wa.me/' . esc_attr($wa) . '" target="_blank" rel="noopener">'
                . esc_html(Catalog::line($lang, 'whatsapp_us')) . '</a>'
            : '';
        $awaiting = in_array((string) ($order['status'] ?? ''), ['awaiting_payment', 'pending'], true)
            && in_array((string) ($order['payment_method'] ?? ''), ['manual_bkash', 'manual_nagad', 'sslcommerz'], true);
        return '<div class="nk-thanks" data-nk-purchase="1">'
            . '<h3>' . esc_html(Catalog::line($lang, 'thank_you')) . '</h3>'
            . '<p>' . esc_html(Catalog::line($lang, 'thank_you_text')) . '</p>'
            . '<p class="nk-thanks-order"><strong>' . esc_html(Catalog::line($lang, 'order_number')) . '</strong> '
            . '<span data-order-number>' . esc_html($number) . '</span> '
            . '<button type="button" class="nk-btn-ghost" data-copy="' . esc_attr($number) . '">' . esc_html(Catalog::line($lang, 'copy')) . '</button></p>'
            . ($lines !== '' ? '<ul class="nk-thanks-items">' . $lines . '</ul>' : '')
            . '<p class="nk-thanks-total"><strong>' . esc_html(Catalog::line($lang, 'total')) . ':</strong> '
            . esc_html(self::money((float) $order['total'], $lang)) . '</p>'
            . ($awaiting ? '<p class="nk-banner">' . esc_html(Catalog::line($lang, 'wallet_help')) . '</p>' : '')
            . '<p class="nk-thanks-call">' . esc_html(Catalog::line($lang, 'thank_you_call')) . '</p>'
            . $wa_btn
            . '</div>';
    }

    private static function purchase_payload(array $payload): ?array {
        $number = isset($_GET['nk_order']) ? sanitize_text_field(wp_unslash($_GET['nk_order'])) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $key = isset($_GET['nk_key']) ? sanitize_text_field(wp_unslash($_GET['nk_key'])) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if ($number === '' || $key === '') {
            return null;
        }
        $order = \Noksha\Orders\Repository::find_by_number($number);
        if (!$order || (int) $order['page_id'] !== (int) ($payload['id'] ?? 0)) {
            return null;
        }
        if (!hash_equals(self::order_key($order), $key)) {
            return null;
        }
        $contents = \Noksha\Analytics\ContentId::contents(\Noksha\Orders\Repository::items((int) $order['id']), (int) $order['page_id']);
        return [
            'value' => (float) $order['total'],
            'currency' => 'BDT',
            'event_id' => (string) ($order['event_id'] ?: ('nk_' . $order['order_number'])),
            'order_number' => $order['order_number'],
            'content_name' => (string) ($payload['offer']['productName'] ?? ''),
            'content_ids' => [$contents !== [] ? $contents[0]['id'] : \Noksha\Analytics\ContentId::for_ids((int) ($payload['id'] ?? 0))],
            'contents' => $contents,
            'num_items' => (int) $order['qty'],
        ];
    }

    public static function order_key(array $order): string {
        return substr(hash_hmac('sha256', $order['order_number'] . '|' . $order['phone'], wp_salt('auth')), 0, 24);
    }

    public static function money(float $amount, string $lang): string {
        if ($amount <= 0) {
            return Catalog::line($lang, 'free');
        }
        $digits = abs($amount - round($amount)) < 0.001 ? 0 : 2;
        return '৳' . number_format($amount, $digits);
    }

    /**
     * Bundle cards from the page's quantity steps: one card per step (and one for
     * a single piece), each with its total after the step's discount. A card sets
     * the quantity. Without steps the section shows nothing on the live page.
     */
    private static function bundles(array $props, array $payload, bool $preview): string {
        $lang = ($payload['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        $offer = is_array($payload['offer'] ?? null) ? $payload['offer'] : [];
        $tiers = is_array($offer['tiers'] ?? null) ? $offer['tiers'] : [];
        $price = (float) ($offer['price'] ?? 0);
        if ($tiers === [] || $price <= 0) {
            return $preview
                ? '<section class="nk-section nk-bundles"><p class="nk-note">' . esc_html(Catalog::line($lang, 'bundles_empty')) . '</p></section>'
                : '';
        }
        $max = WcProduct::max_qty($offer);
        $steps = !empty($props['showSingle']) ? [['qty' => 1, 'discount' => 0.0]] : [];
        foreach ($tiers as $tier) {
            $steps[] = ['qty' => (int) $tier['qty'], 'discount' => (float) $tier['discount']];
        }
        $cards = '';
        foreach ($steps as $step) {
            $qty = $step['qty'];
            $full = $price * $qty;
            $pay = max(0.0, $full - $step['discount']);
            $popular = (int) ($props['popular'] ?? 0) === $qty;
            $disabled = $max !== null && $qty > $max;
            $cards .= '<button type="button" class="nk-bundle' . ($popular ? ' is-popular' : '') . '" data-bundle-qty="' . esc_attr((string) $qty) . '" aria-pressed="' . ($qty === 1 ? 'true' : 'false') . '"' . ($disabled ? ' disabled' : '') . '>'
                . ($popular ? '<span class="nk-bundle-badge">' . esc_html(Catalog::line($lang, 'bundle_popular')) . '</span>' : '')
                . '<span class="nk-bundle-qty">' . esc_html($qty === 1 ? Catalog::line($lang, 'bundle_one') : sprintf(Catalog::line($lang, 'bundle_pieces'), $qty)) . '</span>'
                . '<strong class="nk-bundle-pay" data-bundle-pay>' . esc_html(self::money($pay, $lang)) . '</strong>'
                . ($step['discount'] > 0
                    ? '<s class="nk-bundle-full" data-bundle-full>' . esc_html(self::money($full, $lang)) . '</s>'
                        . '<span class="nk-bundle-save" data-bundle-save>' . esc_html(sprintf(Catalog::line($lang, 'bundle_save'), self::money($step['discount'], $lang))) . '</span>'
                    : '')
                . '</button>';
        }
        return '<section class="nk-section nk-bundles">'
            . ($props['title'] !== '' ? self::editable('h2', 'title', $props['title'], '', $preview) : '')
            . '<div class="nk-bundle-row" role="group" aria-label="' . esc_attr($props['title'] !== '' ? $props['title'] : Catalog::line($lang, 'tiers_title')) . '">' . $cards . '</div>'
            . '</section>';
    }

    /**
     * Quantity steps as buttons. landing.js rebuilds them from the live steps.
     */
    private static function tiers_html(array $offer, string $lang, int $qty_max): string {
        $tiers = is_array($offer['tiers'] ?? null) ? $offer['tiers'] : [];
        $buttons = '';
        foreach ($tiers as $tier) {
            $label = sprintf(Catalog::line($lang, 'tier_label'), (int) $tier['qty'], self::money((float) $tier['discount'], $lang));
            $buttons .= '<button type="button" class="nk-tier" data-tier-qty="' . esc_attr((string) $tier['qty']) . '" aria-pressed="false"'
                . ((int) $tier['qty'] > $qty_max ? ' disabled' : '') . '>' . esc_html($label) . '</button>';
        }
        return '<div class="nk-tiers" data-tiers role="group" aria-label="' . esc_attr(Catalog::line($lang, 'tiers_title')) . '"' . ($buttons === '' ? ' hidden' : '') . '>'
            . '<p class="nk-tiers-title">' . esc_html(Catalog::line($lang, 'tiers_title')) . '</p>'
            . '<div class="nk-tiers-row" data-tiers-row>' . $buttons . '</div></div>';
    }

    /**
     * "Only 3 left in stock", from the product's real stock, when the page asks for it.
     * The element is always there (hidden) so the browser can show it for another option.
     */
    private static function stock_hint(array $offer, string $lang): string {
        if (empty($offer['stockHint']) || !WcProduct::is_wc_offer($offer)) {
            return '';
        }
        $wc = is_array($offer['wc'] ?? null) ? $offer['wc'] : [];
        $stock = $wc['stock'] ?? null;
        $show = $stock !== null && empty($wc['backorders']) && (int) $stock > 0 && (int) $stock <= (int) ($offer['stockHintMax'] ?? 10);
        $text = $show ? sprintf(Catalog::line($lang, 'stock_left'), (int) $stock) : '';
        return '<p class="nk-stock-hint" data-stock-hint role="status"' . ($show ? '' : ' hidden') . '>' . esc_html($text) . '</p>';
    }

    /**
     * Thumbnails under the main image, from the store product's gallery.
     */
    private static function thumbs(array $offer, string $lang): string {
        $images = is_array($offer['wc']['gallery'] ?? null) ? $offer['wc']['gallery'] : [];
        if (count($images) < 2 || (array_key_exists('gallery', $offer) && empty($offer['gallery']))) {
            return '';
        }
        $html = '';
        foreach ($images as $index => $image) {
            $label = sprintf(Catalog::line($lang, 'gallery_image'), $index + 1);
            $html .= '<button type="button" class="nk-thumb' . ($index === 0 ? ' is-active' : '') . '" data-nk-image="' . esc_url($image['full']) . '"'
                . ' aria-label="' . esc_attr($label) . '"' . ($index === 0 ? ' aria-current="true"' : '') . '>'
                . '<img src="' . esc_url($image['thumb']) . '" alt="' . esc_attr((string) $image['alt']) . '" width="64" height="64" loading="lazy" decoding="async">'
                . '</button>';
        }
        return '<div class="nk-thumbs">' . $html . '</div>';
    }

    /**
     * The product's average rating and review count, when it has reviews.
     */
    private static function rating_line(array $offer, string $lang): string {
        $rating = is_array($offer['wc']['rating'] ?? null) ? $offer['wc']['rating'] : [];
        $count = (int) ($rating['count'] ?? 0);
        $average = (float) ($rating['average'] ?? 0);
        if ($count < 1 || $average <= 0) {
            return '';
        }
        $filled = (int) round($average);
        $label = sprintf(Catalog::line($lang, 'rating_summary'), (string) $average, $count);
        return '<p class="nk-rating" aria-label="' . esc_attr($label) . '">'
            . '<span class="nk-stars" aria-hidden="true">' . esc_html(str_repeat('★', $filled) . str_repeat('☆', 5 - $filled)) . '</span> '
            . '<span aria-hidden="true">' . esc_html(number_format($average, 1)) . ' (' . $count . ')</span></p>';
    }

    private static function image(string $url, string $alt, bool $priority = false): string {
        if ($url === '') {
            return '';
        }
        $attrs = 'src="' . esc_url($url) . '" alt="' . esc_attr($alt) . '" width="800" height="800"';
        if ($priority) {
            $attrs .= ' fetchpriority="high" decoding="async"';
        } else {
            $attrs .= ' loading="lazy" decoding="async"';
        }
        return '<img ' . $attrs . '>';
    }
}
