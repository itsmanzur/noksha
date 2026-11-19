<?php
/**
 * Public landing markup. The editor preview uses the same HTML.
 *
 * @package Noksha
 */

namespace Noksha\Pages;

use Noksha\Brand\Tokens;
use Noksha\I18n\Catalog;
use Noksha\Options;

final class Renderer {
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

    public static function apply_variant(array $payload): array {
        $ab = is_array($payload['ab'] ?? null) ? $payload['ab'] : [];
        if (empty($ab['enabled']) || empty($ab['sections'])) {
            $payload['variant'] = 'a';
            return $payload;
        }
        $page_id = (int) ($payload['id'] ?? 0);
        $cookie = 'noksha_ab_' . $page_id;
        $variant = isset($_COOKIE[$cookie]) ? strtolower((string) wp_unslash($_COOKIE[$cookie])) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
        if (!in_array($variant, ['a', 'b'], true)) {
            $split = max(10, min(90, (int) ($ab['split'] ?? 50)));
            $variant = (wp_rand(1, 100) <= $split) ? 'b' : 'a';
            if (!headers_sent()) {
                setcookie($cookie, $variant, time() + MONTH_IN_SECONDS, COOKIEPATH ?: '/', COOKIE_DOMAIN, is_ssl(), true);
            }
        }
        $payload['variant'] = $variant;
        if ($variant === 'b') {
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
        $fonts = esc_url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&family=Source+Sans+3:wght@400;600;700&display=swap');
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
            . '<script src="' . $js . '"></script></body></html>';
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
        return [
            'title' => $title,
            'description' => $description,
            'imageUrl' => $image,
            'html' => $html,
        ];
    }

    public static function article(array $payload, bool $preview): string {
        $lang = ($payload['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        $tokens = Tokens::merge(is_array($payload['tokens'] ?? null) ? $payload['tokens'] : null);
        $style = esc_attr(Tokens::declarations($tokens));
        $html = '<article class="nk-landing" lang="' . esc_attr($lang === 'bn' ? 'bn' : 'en') . '" style="' . $style . '">';
        foreach ($payload['sections'] as $section) {
            if (!empty($section['hidden'])) {
                continue;
            }
            $html .= self::section($section, $payload, $preview);
        }
        $html .= '</article>';
        return $html;
    }

    public static function script_config(array $payload, bool $preview): array {
        $lang = ($payload['language'] ?? 'en') === 'bn' ? 'bn' : 'en';
        $offer = $payload['offer'];
        return [
            'root' => esc_url_raw(rest_url('noksha/v1/')),
            'nonce' => wp_create_nonce('noksha_public'),
            'pageId' => (int) ($payload['id'] ?? 0),
            'geoUrl' => esc_url_raw(NOKSHA_URL . 'data/bd-geo.json'),
            'lang' => $lang,
            'preview' => $preview,
            'price' => (float) $offer['price'],
            'shipping' => (float) ($offer['shippingOutside'] ?? $offer['shipping'] ?? 0),
            'shippingInside' => (float) ($offer['shippingInside'] ?? $offer['shipping'] ?? 0),
            'shippingOutside' => (float) ($offer['shippingOutside'] ?? $offer['shipping'] ?? 0),
            'dhakaDistrictId' => '47',
            'productName' => (string) ($offer['productName'] ?? ''),
            'bump' => is_array($offer['bump'] ?? null) ? $offer['bump'] : ['enabled' => false],
            'variant' => (string) ($payload['variant'] ?? 'a'),
            'otpMode' => (string) (Options::settings()['sms']['otp_mode'] ?? 'risk'),
            'otpReady' => \Noksha\Notify\Otp::ready(),
            'pixels' => [
                'meta' => (string) (Options::settings()['pixels']['meta'] ?? ''),
                'ga4' => (string) (Options::settings()['pixels']['ga4'] ?? ''),
                'tiktok' => (string) (Options::settings()['pixels']['tiktok'] ?? ''),
            ],
            'purchase' => self::purchase_payload($payload),
            'strings' => [
                'placing' => Catalog::line($lang, 'placing'),
                'thankYou' => Catalog::line($lang, 'thank_you'),
                'thankYouText' => Catalog::line($lang, 'thank_you_text'),
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
                'bumpAdd' => Catalog::line($lang, 'bump_add'),
            ],
        ];
    }

    private static function section(array $section, array $payload, bool $preview): string {
        $type = $section['type'];
        $props = $section['props'];
        $html = match ($type) {
            'hero' => self::hero($props, $preview),
            'benefits' => self::benefits($props, $preview),
            'product' => self::product($props, $payload, $preview),
            'countdown' => self::countdown($props, $payload, $preview),
            'reviews' => self::reviews($props, $preview),
            'faq' => self::faq($props, $preview),
            'guarantee' => self::guarantee($props, $preview),
            'order_form' => self::order_form($props, $payload, $preview),
            'html' => ($props['html'] ?? '') !== '' ? '<section class="nk-section nk-html">' . Sanitizer::clean_html((string) $props['html']) . '</section>' : '',
            default => '',
        };
        if ($preview && $html !== '') {
            $html = preg_replace('/^<([a-z0-9]+)/i', '<$1 data-nk-section="' . esc_attr((string) ($section['id'] ?? '')) . '"', $html, 1) ?? $html;
        }
        return $html;
    }

    private static function hero(array $props, bool $preview = false): string {
        $media = self::image($props['imageUrl'] ?? '', $props['title'] ?? '');
        return '<header class="nk-hero">'
            . ($props['eyebrow'] !== '' ? self::editable('p', 'eyebrow', $props['eyebrow'], 'nk-eyebrow', $preview) : '')
            . self::editable('h1', 'title', $props['title'], '', $preview)
            . ($props['subtitle'] !== '' ? self::editable('p', 'subtitle', $props['subtitle'], 'nk-lead', $preview) : '')
            . ($props['buttonLabel'] !== '' ? self::editable('a', 'buttonLabel', $props['buttonLabel'], 'nk-btn', $preview, ['href' => '#nk-order']) : '')
            . $media
            . '</header>';
    }

    private static function benefits(array $props, bool $preview = false): string {
        $items = '';
        foreach ($props['items'] as $index => $item) {
            $items .= '<li>'
                . self::editable('h3', 'items.' . $index . '.title', $item['title'], '', $preview)
                . self::editable('p', 'items.' . $index . '.text', $item['text'], '', $preview)
                . '</li>';
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
        $price = esc_html(self::money((float) $offer['price'], $lang));
        $compare = '';
        if ((float) $offer['compareAt'] > (float) $offer['price']) {
            $compare = '<s>' . esc_html(Catalog::line($lang, 'was') . ' ' . self::money((float) $offer['compareAt'], $lang)) . '</s>';
        }
        return '<section class="nk-section nk-product">'
            . self::image($props['imageUrl'] ?: ($offer['imageUrl'] ?? ''), $props['title'])
            . '<div>' . self::editable('h2', 'title', $props['title'], '', $preview)
            . '<p class="nk-price"><strong>' . $price . '</strong>' . $compare . '</p>'
            . self::editable('p', 'text', $props['text'], '', $preview)
            . ($bullets !== '' ? '<ul class="nk-bullets">' . $bullets . '</ul>' : '')
            . '</div></section>';
    }

    private static function countdown(array $props, array $payload, bool $preview = false): string {
        $lang = $payload['language'];
        if ($props['endsAt'] === '') {
            return '';
        }
        $units = '';
        foreach (['days', 'hours', 'minutes', 'seconds'] as $unit) {
            $units .= '<div><strong data-unit="' . esc_attr($unit) . '">00</strong><span>' . esc_html(Catalog::line($lang, $unit)) . '</span></div>';
        }
        return '<section class="nk-section nk-countdown">' . self::editable('h2', 'title', $props['title'], '', $preview)
            . '<p>' . esc_html(Catalog::line($lang, 'offer_ends')) . '</p>'
            . '<div class="nk-count" data-ends="' . esc_attr($props['endsAt']) . '">' . $units . '</div></section>';
    }

    private static function reviews(array $props, bool $preview = false): string {
        $items = '';
        foreach ($props['items'] as $index => $item) {
            $stars = str_repeat('★', (int) $item['rating']) . str_repeat('☆', 5 - (int) $item['rating']);
            $items .= '<blockquote>'
                . self::editable('p', 'items.' . $index . '.text', $item['text'], '', $preview)
                . '<footer><span aria-hidden="true">' . esc_html($stars) . '</span> '
                . self::editable('span', 'items.' . $index . '.name', $item['name'], '', $preview)
                . '</footer></blockquote>';
        }
        return '<section class="nk-section">' . self::editable('h2', 'title', $props['title'], '', $preview)
            . '<div class="nk-reviews">' . $items . '</div></section>';
    }

    private static function faq(array $props, bool $preview = false): string {
        $items = '';
        foreach ($props['items'] as $index => $item) {
            $items .= '<div class="nk-faq-item"><button type="button" aria-expanded="false" data-nk-prop="items.' . esc_attr((string) $index) . '.q">'
                . esc_html($item['q'])
                . '</button><div hidden>' . self::editable('p', 'items.' . $index . '.a', $item['a'], '', $preview) . '</div></div>';
        }
        return '<section class="nk-section">' . self::editable('h2', 'title', $props['title'], '', $preview)
            . '<div class="nk-faq">' . $items . '</div></section>';
    }

    private static function guarantee(array $props, bool $preview = false): string {
        return '<section class="nk-guarantee">'
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
        if ($preview) {
            $attr .= ' data-nk-prop="' . esc_attr($prop) . '"';
        }
        return '<' . $tag . $attr . '>' . esc_html($value) . '</' . $tag . '>';
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
        foreach ($checkout['fields'] as $key => $field) {
            if (empty($field['enabled'])) {
                continue;
            }
            $fields .= self::field($key, $field, $lang);
        }

        $methods = self::payment_methods($checkout, $lang);
        $badges = '';
        foreach ($checkout['trustBadges'] as $badge) {
            $badges .= '<li>' . esc_html(Catalog::line($lang, 'trust_' . $badge)) . '</li>';
        }

        $price = (float) $offer['price'];
        $shipping = (float) $offer['shipping'];
        $button = $props['buttonLabel'] !== '' ? $props['buttonLabel'] : Catalog::line($lang, 'place_order');

        $bump = is_array($offer['bump'] ?? null) ? $offer['bump'] : [];
        $bump_html = '';
        if (!empty($bump['enabled']) && (float) ($bump['price'] ?? 0) > 0) {
            $checked = !empty($bump['checkedDefault']) ? ' checked' : '';
            $bump_html = '<label class="nk-bump"><input type="checkbox" name="bump" form="nk-order" value="1"' . $checked . '>'
                . '<span><strong>' . esc_html((string) ($bump['name'] ?: Catalog::line($lang, 'bump_add'))) . '</strong>'
                . '<em>+' . esc_html(self::money((float) $bump['price'], $lang)) . '</em></span></label>';
        }

        $otp = '<div class="nk-otp" hidden>'
            . '<label>' . esc_html(Catalog::line($lang, 'otp_label'))
            . '<input name="otp_code" inputmode="numeric" autocomplete="one-time-code" maxlength="6"></label>'
            . '<button type="button" class="nk-btn-ghost" data-otp-send>' . esc_html(Catalog::line($lang, 'otp_send')) . '</button>'
            . '</div>';

        $form = '<form class="nk-form" id="nk-order" data-preview="' . ($preview ? '1' : '0') . '" novalidate>'
            . '<h2>' . esc_html($props['title']) . '</h2>'
            . $notice
            . $thanks
            . '<div class="nk-form-error" hidden></div>'
            . $fields
            . $otp
            . '<fieldset class="nk-payments"><legend>' . esc_html(Catalog::line($lang, 'payment')) . '</legend>' . $methods . '</fieldset>'
            . '<label class="nk-trx" hidden>' . esc_html(Catalog::line($lang, 'trx'))
            . '<input name="trx_id" inputmode="text" autocomplete="off" maxlength="40"></label>'
            . '<div class="nk-hp" aria-hidden="true"><label>Website<input name="company_website" tabindex="-1" autocomplete="off"></label></div>'
            . '<button class="nk-btn" type="submit">' . esc_html($button) . '</button>'
            . '</form>';

        $summary = '<aside class="nk-summary"><h3>' . esc_html(Catalog::line($lang, 'summary')) . '</h3>'
            . '<p class="nk-summary-name">' . esc_html($offer['productName']) . '</p>'
            . '<label class="nk-qty">' . esc_html(Catalog::line($lang, 'qty'))
            . '<input name="qty" form="nk-order" type="number" min="1" max="10" value="1"></label>'
            . $bump_html
            . '<dl>'
            . '<div><dt>' . esc_html(Catalog::line($lang, 'subtotal')) . '</dt><dd data-subtotal>' . esc_html(self::money($price, $lang)) . '</dd></div>'
            . '<div><dt>' . esc_html(Catalog::line($lang, 'shipping')) . '</dt><dd data-shipping>' . esc_html(self::money($shipping, $lang)) . '</dd></div>'
            . '<div><dt>' . esc_html(Catalog::line($lang, 'total')) . '</dt><dd data-total>' . esc_html(self::money($price + $shipping, $lang)) . '</dd></div>'
            . '</dl>'
            . ($checkout['deliveryNote'] !== '' ? '<p class="nk-note">' . esc_html($checkout['deliveryNote']) . '</p>' : '')
            . ($badges !== '' ? '<ul class="nk-trust">' . $badges . '</ul>' : '')
            . '</aside>';

        return '<section class="nk-section nk-order nk-order-' . esc_attr($position) . '">' . $form . $summary . '</section>';
    }

    private static function field(string $key, array $field, string $lang): string {
        $label = Catalog::line($lang, $key);
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
            $input = '<input type="' . $type . '" name="' . $name . '" autocomplete="' . $auto . '"' . $req . '>';
        }
        return '<label>' . esc_html($label) . $mark . $input . '</label>';
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
            $html .= '<label class="nk-pay"><input type="radio" name="payment_method" value="' . esc_attr($method) . '"' . $checked . '>'
                . '<span><strong>' . esc_html(Catalog::line($lang, 'pay_' . $method)) . '</strong>'
                . ($number !== '' ? '<small>' . esc_html($number) . '</small>' : '')
                . '<em>' . esc_html($help) . '</em></span></label>';
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
        return '<div class="nk-thanks" data-nk-purchase="1"><h3>' . esc_html(Catalog::line($lang, 'thank_you')) . '</h3><p>'
            . esc_html(Catalog::line($lang, 'thank_you_text')) . '</p><p><strong>'
            . esc_html(Catalog::line($lang, 'order_number')) . '</strong> ' . esc_html($number) . '</p></div>';
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
        return [
            'value' => (float) $order['total'],
            'currency' => 'BDT',
            'event_id' => (string) ($order['event_id'] ?: ('nk_' . $order['order_number'])),
            'order_number' => $order['order_number'],
            'content_name' => (string) ($payload['offer']['productName'] ?? ''),
            'content_ids' => [(string) ($payload['id'] ?? '')],
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

    private static function image(string $url, string $alt): string {
        if ($url === '') {
            return '';
        }
        return '<img src="' . esc_url($url) . '" alt="' . esc_attr($alt) . '">';
    }
}
