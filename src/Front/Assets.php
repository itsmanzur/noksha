<?php
/**
 * Public landing styles, pixels, and the order form script.
 *
 * @package Noksha
 */

namespace Noksha\Front;

use Noksha\Brand\Tokens;
use Noksha\Options;
use Noksha\Pages\PostType;
use Noksha\Pages\Renderer;
use Noksha\Pages\Repository;

final class Assets {
    public function register(): void {
        add_action('wp_enqueue_scripts', [$this, 'enqueue']);
        add_action('wp_print_styles', [$this, 'dequeue_theme'], 100);
        add_action('wp_head', [$this, 'seo'], 5);
        add_action('wp_head', [$this, 'pixels'], 20);
        add_filter('pre_get_document_title', [$this, 'document_title']);
        add_filter('rocket_cache_reject_uri', [$this, 'exclude_cache']);
        add_filter('sgo_javascript_combine_exclude_js_files', [$this, 'exclude_js']);
        add_filter('template_include', [$this, 'template']);
    }

    public function template(string $template): string {
        if (is_singular(PostType::TYPE)) {
            return NOKSHA_DIR . 'templates/landing.php';
        }
        return $template;
    }

    public function enqueue(): void {
        if (!is_singular(PostType::TYPE)) {
            return;
        }
        $id = (int) get_queried_object_id();
        $payload = Repository::payload($id);
        if (is_wp_error($payload)) {
            return;
        }
        $payload = Renderer::apply_variant($payload);
        wp_enqueue_style(
            'noksha-fonts',
            'https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&family=Source+Sans+3:wght@400;600;700&display=swap',
            [],
            null
        );
        wp_enqueue_style('noksha-landing', NOKSHA_URL . 'assets/landing.css', ['noksha-fonts'], NOKSHA_VERSION);
        $tokens = Tokens::merge(is_array($payload['tokens']) ? $payload['tokens'] : null);
        wp_add_inline_style('noksha-landing', Tokens::css($tokens));
        wp_enqueue_script('noksha-landing', NOKSHA_URL . 'assets/landing.js', [], NOKSHA_VERSION, true);
        wp_add_inline_script(
            'noksha-landing',
            'window.nokshaFront = ' . wp_json_encode(Renderer::script_config($payload, false)) . ';',
            'before'
        );
    }

    public function dequeue_theme(): void {
        if (!is_singular(PostType::TYPE)) {
            return;
        }
        global $wp_styles;
        if (!$wp_styles instanceof \WP_Styles) {
            return;
        }
        foreach ((array) $wp_styles->queue as $handle) {
            if (in_array($handle, ['admin-bar', 'noksha-landing', 'noksha-fonts'], true)) {
                continue;
            }
            wp_dequeue_style($handle);
        }
    }

    public function document_title(string $title): string {
        if (!is_singular(PostType::TYPE)) {
            return $title;
        }
        $payload = Repository::payload((int) get_queried_object_id());
        if (is_wp_error($payload)) {
            return $title;
        }
        $seo = Renderer::seo_tags($payload);
        return $seo['title'] !== '' ? $seo['title'] : $title;
    }

    public function seo(): void {
        if (!is_singular(PostType::TYPE)) {
            return;
        }
        $payload = Repository::payload((int) get_queried_object_id());
        if (is_wp_error($payload)) {
            return;
        }
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- seo_tags escapes attributes.
        echo Renderer::seo_tags($payload)['html'];
    }

    /**
     * Keep offer pages out of full-page caches that break checkout/thank-you.
     *
     * @param array<int, string> $uris
     * @return array<int, string>
     */
    public function exclude_cache(array $uris): array {
        $uris[] = '/offer/(.*)';
        $uris[] = '/wp-json/noksha/v1/(.*)';
        return $uris;
    }

    /**
     * @param array<int, string> $files
     * @return array<int, string>
     */
    public function exclude_js(array $files): array {
        $files[] = 'noksha-landing';
        return $files;
    }

    public function pixels(): void {
        if (!is_singular(PostType::TYPE)) {
            return;
        }
        $pixels = Options::settings()['pixels'];
        $meta = preg_replace('/\D+/', '', (string) ($pixels['meta'] ?? '')) ?? '';
        if ($meta !== '') {
            echo "<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','" . esc_js($meta) . "');fbq('track','PageView');</script>\n";
        }
        $ga = (string) ($pixels['ga4'] ?? '');
        if (preg_match('/^G-[A-Z0-9]+$/', $ga)) {
            echo '<script async src="https://www.googletagmanager.com/gtag/js?id=' . esc_attr($ga) . '"></script>';
            echo "<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','" . esc_js($ga) . "');</script>\n";
        }
        $tiktok = preg_replace('/[^A-Za-z0-9]/', '', (string) ($pixels['tiktok'] ?? '')) ?? '';
        if ($tiktok !== '') {
            echo "<script>!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e){var n=d.createElement('script');n.async=!0;n.src='https://analytics.tiktok.com/i18n/pixel/events.js';var a=d.getElementsByTagName('script')[0];a.parentNode.insertBefore(n,a);ttq._i=ttq._i||{};ttq._i[e]=[];ttq._t=ttq._t||{};ttq._t[e]=+new Date};}(window,document,'ttq');ttq.load('" . esc_js($tiktok) . "');ttq.page();</script>\n";
        }
    }
}
