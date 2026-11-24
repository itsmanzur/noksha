<?php
/**
 * Checks a WooCommerce coupon for a landing page order.
 *
 * WooCommerce decides what a coupon allows (dates, usage limits, minimum
 * spend, products, emails). This only asks it, on an order that is not saved.
 *
 * @package Noksha
 */

namespace Noksha\Catalog;

final class WcCoupon {
    /**
     * The coupon field is offered only for a store product, when the page asks for it.
     *
     * @param array<string, mixed> $doc Page document.
     */
    public static function enabled_for(array $doc): bool {
        return !empty($doc['checkout']['coupon'])
            && WcProduct::is_wc_offer($doc['offer'] ?? [])
            && WcProduct::active();
    }

    public static function clean(string $code): string {
        return function_exists('wc_format_coupon_code') ? wc_format_coupon_code(wc_clean($code)) : '';
    }

    /**
     * What this coupon takes off the order, without saving anything.
     *
     * @param array<string, mixed> $offer Resolved offer (WcProduct::apply).
     * @return array{discount:float,code:string}|\WP_Error
     */
    public static function preview(array $offer, int $qty, bool $with_bump, string $code) {
        $code = self::clean($code);
        if ($code === '' || !WcProduct::active()) {
            return new \WP_Error('noksha_coupon_invalid', '');
        }
        $coupon = new \WC_Coupon($code);
        if (!$coupon->get_id()) {
            return new \WP_Error('noksha_coupon_invalid', '');
        }
        $buy_id = (int) ($offer['variationId'] ?? 0) ?: (int) ($offer['productId'] ?? 0);
        $product = wc_get_product($buy_id);
        if (!$product) {
            return new \WP_Error('noksha_coupon_invalid', '');
        }

        $order = new \WC_Order();
        $line = (float) $offer['price'] * max(1, $qty);
        $order->add_product($product, max(1, $qty), ['subtotal' => $line, 'total' => $line]);
        $bump = is_array($offer['bump'] ?? null) ? $offer['bump'] : [];
        if ($with_bump && !empty($bump['enabled']) && (int) ($bump['productId'] ?? 0) > 0) {
            $bump_product = wc_get_product((int) $bump['productId']);
            if ($bump_product) {
                $order->add_product($bump_product, 1, ['subtotal' => (float) $bump['price'], 'total' => (float) $bump['price']]);
            }
        }

        $discounts = new \WC_Discounts($order);
        $valid = $discounts->is_coupon_valid($coupon);
        if (is_wp_error($valid)) {
            return new \WP_Error('noksha_coupon_invalid', wp_strip_all_tags($valid->get_error_message()));
        }
        $applied = $discounts->apply_coupon($coupon);
        if (is_wp_error($applied)) {
            return new \WP_Error('noksha_coupon_invalid', wp_strip_all_tags($applied->get_error_message()));
        }
        $by_coupon = $discounts->get_discounts_by_coupon();
        $amount = (float) ($by_coupon[$coupon->get_code()] ?? 0);
        if ($amount <= 0) {
            return new \WP_Error('noksha_coupon_invalid', '');
        }
        return ['discount' => round($amount, 2), 'code' => $coupon->get_code()];
    }
}
