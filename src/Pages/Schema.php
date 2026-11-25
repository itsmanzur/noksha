<?php
/**
 * schema.org Product data for a landing page, so search engines can show the
 * price, stock and rating. Everything comes from the live offer: nothing is
 * claimed that the page does not show.
 *
 * @package Noksha
 */

namespace Noksha\Pages;

use Noksha\Catalog\WcProduct;

final class Schema {
    /**
     * @param array<string, mixed> $payload Page payload (resolved offer).
     * @return array<string, mixed>|null Null when there is no product to describe.
     */
    public static function product(array $payload, string $description, string $url): ?array {
        $offer = is_array($payload['offer'] ?? null) ? $payload['offer'] : [];
        $name = trim((string) ($offer['productName'] ?? ''));
        $price = (float) ($offer['price'] ?? 0);
        if ($name === '' || $price <= 0) {
            return null;
        }
        $wc = is_array($offer['wc'] ?? null) ? $offer['wc'] : null;
        $is_wc = WcProduct::is_wc_offer($offer) && $wc !== null;

        $images = [];
        if ($is_wc) {
            foreach ((array) ($wc['gallery'] ?? []) as $image) {
                if (!empty($image['full'])) {
                    $images[] = (string) $image['full'];
                }
            }
        }
        if ($images === [] && !empty($offer['imageUrl'])) {
            $images[] = (string) $offer['imageUrl'];
        }

        $available = $is_wc ? !empty($wc['available']) : true;
        $availability = 'https://schema.org/' . ($available ? 'InStock' : 'OutOfStock');
        $variations = $is_wc ? array_filter((array) ($wc['variations'] ?? []), static fn($row) => (float) ($row['price'] ?? 0) > 0) : [];

        if (count($variations) > 1) {
            $prices = array_map(static fn($row) => (float) $row['price'], $variations);
            $offers = [
                '@type' => 'AggregateOffer',
                'priceCurrency' => 'BDT',
                'lowPrice' => self::money(min($prices)),
                'highPrice' => self::money(max($prices)),
                'offerCount' => count($variations),
                'availability' => $availability,
            ];
        } else {
            $offers = [
                '@type' => 'Offer',
                'priceCurrency' => 'BDT',
                'price' => self::money($price),
                'availability' => $availability,
            ];
            $sale_end = $is_wc ? (string) ($wc['saleEndsAt'] ?? '') : '';
            if ($sale_end !== '' && strtotime($sale_end) !== false) {
                $offers['priceValidUntil'] = gmdate('Y-m-d', (int) strtotime($sale_end));
            }
        }
        if ($url !== '') {
            $offers['url'] = $url;
        }

        $data = [
            '@context' => 'https://schema.org',
            '@type' => 'Product',
            'name' => $name,
            'offers' => $offers,
        ];
        if ($images !== []) {
            $data['image'] = array_values(array_unique($images));
        }
        if ($description !== '') {
            $data['description'] = $description;
        }
        if ($is_wc && (string) ($wc['sku'] ?? '') !== '') {
            $data['sku'] = (string) $wc['sku'];
        }
        $rating = $is_wc && is_array($wc['rating'] ?? null) ? $wc['rating'] : [];
        if ((int) ($rating['count'] ?? 0) > 0 && (float) ($rating['average'] ?? 0) > 0) {
            $data['aggregateRating'] = [
                '@type' => 'AggregateRating',
                'ratingValue' => round((float) $rating['average'], 1),
                'reviewCount' => (int) $rating['count'],
                'bestRating' => 5,
                'worstRating' => 1,
            ];
        }

        /**
         * The Product data on a landing page. Return null to leave it out (for
         * example when an SEO plugin already prints it).
         *
         * @param array<string, mixed>|null $data
         * @param array<string, mixed>      $payload
         */
        $data = apply_filters('noksha_product_schema', $data, $payload);
        return is_array($data) ? $data : null;
    }

    /**
     * The <script> tag, safe to print in <head>.
     */
    public static function tag(?array $data): string {
        if ($data === null) {
            return '';
        }
        $json = wp_json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP);
        return is_string($json) ? '<script type="application/ld+json">' . $json . '</script>' : '';
    }

    private static function money(float $amount): string {
        return number_format($amount, 2, '.', '');
    }
}
