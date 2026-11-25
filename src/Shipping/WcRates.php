<?php
/**
 * The delivery charge from the store's WooCommerce shipping zones.
 *
 * A landing page has no WooCommerce cart, so this builds the same "package"
 * WooCommerce checkout would (products, quantities, the buyer's district) and
 * asks the matching zone's methods for their rates. Free shipping reads the
 * cart in WooCommerce itself, so its rules (minimum amount, free-shipping
 * coupon) are checked here against this order instead. Local pickup is left
 * out: the page always delivers. The cheapest rate wins.
 *
 * @package Noksha
 */

namespace Noksha\Shipping;

use Noksha\Catalog\WcProduct;
use Noksha\Region\WcStates;

final class WcRates {
    public const SOURCE_NOKSHA = 'noksha';
    public const SOURCE_WC = 'woocommerce';
    public const SOURCE_AUTO = 'auto';

    /**
     * @param array<string, mixed>                          $offer        Resolved offer (WcProduct::apply).
     * @param list<array{productId:int,price:float}>         $bumps        Chosen add-ons.
     * @param float                                         $discount     Coupon and quantity discounts, for free-shipping minimums.
     * @return array{cost:float,id:string,label:string}|null Null when no zone or method gives a rate.
     */
    public static function quote(array $offer, int $qty, array $bumps, string $district_id, string $district_name, string $upazila_name, float $discount = 0.0, string $coupon = ''): ?array {
        if (!WcProduct::active() || !WcProduct::is_wc_offer($offer) || $district_id === '' || !class_exists('WC_Shipping_Zones')) {
            return null;
        }
        $state = WcStates::code($district_id);
        if ($state === '') {
            return null;
        }

        $contents = [];
        $cost = 0.0;
        $main_id = (int) ($offer['variationId'] ?? 0) ?: (int) $offer['productId'];
        $main = wc_get_product($main_id);
        if (!$main) {
            return null;
        }
        $line = (float) $offer['price'] * max(1, $qty);
        $contents[] = self::item($main, max(1, $qty), $line);
        $cost += $line;
        foreach ($bumps as $bump) {
            $product = (int) ($bump['productId'] ?? 0) > 0 ? wc_get_product((int) $bump['productId']) : null;
            if ($product) {
                $contents[] = self::item($product, 1, (float) $bump['price']);
                $cost += (float) $bump['price'];
            }
        }

        $package = [
            'contents' => [],
            'contents_cost' => round($cost, 2),
            'applied_coupons' => $coupon !== '' ? [$coupon] : [],
            'user' => ['ID' => 0],
            'destination' => [
                'country' => 'BD',
                'state' => $state,
                'postcode' => '',
                'city' => $district_name,
                'address' => $upazila_name,
                'address_1' => $upazila_name,
                'address_2' => '',
            ],
        ];
        foreach ($contents as $i => $item) {
            $package['contents']['noksha_' . $i] = $item;
        }

        $zone = \WC_Shipping_Zones::get_zone_matching_package($package);
        $best = null;
        foreach ($zone->get_shipping_methods(true) as $method) {
            if (in_array($method->id, ['local_pickup', 'pickup_location'], true)) {
                continue;
            }
            $rates = $method->id === 'free_shipping'
                ? self::free_shipping($method, $package, $discount, $coupon)
                : $method->get_rates_for_package($package);
            foreach ((array) $rates as $rate) {
                if (!$rate instanceof \WC_Shipping_Rate) {
                    continue;
                }
                $value = round((float) $rate->get_cost(), 2);
                if ($best === null || $value < $best['cost']) {
                    $best = ['cost' => max(0.0, $value), 'id' => (string) $rate->get_id(), 'label' => (string) $rate->get_label()];
                }
            }
        }
        return $best;
    }

    /**
     * @return array<string, mixed>
     */
    private static function item(\WC_Product $product, int $qty, float $total): array {
        $is_variation = $product->is_type('variation');
        return [
            'key' => 'noksha_' . $product->get_id(),
            'product_id' => $is_variation ? $product->get_parent_id() : $product->get_id(),
            'variation_id' => $is_variation ? $product->get_id() : 0,
            'variation' => [],
            'quantity' => $qty,
            'data' => $product,
            'line_total' => $total,
            'line_tax' => 0,
            'line_subtotal' => $total,
            'line_subtotal_tax' => 0,
        ];
    }

    /**
     * WooCommerce's free shipping rules, checked against this order (WooCommerce reads its cart).
     *
     * @return list<\WC_Shipping_Rate>
     */
    private static function free_shipping(\WC_Shipping_Method $method, array $package, float $discount, string $coupon): array {
        $requires = (string) $method->get_option('requires', '');
        $min = (float) $method->get_option('min_amount', 0);
        $total = (float) $package['contents_cost'];
        if ($method->get_option('ignore_discounts', 'no') !== 'yes') {
            $total -= $discount;
        }
        $has_coupon = false;
        if ($coupon !== '' && class_exists('WC_Coupon')) {
            $has_coupon = (new \WC_Coupon($coupon))->get_free_shipping();
        }
        $enough = $min <= 0 || $total >= $min;
        $ok = match ($requires) {
            'coupon' => $has_coupon,
            'min_amount' => $enough,
            'either' => $has_coupon || $enough,
            'both' => $has_coupon && $enough,
            default => true,
        };
        if (!$ok) {
            return [];
        }
        return [new \WC_Shipping_Rate($method->get_rate_id(), $method->get_title() ?: __('Free shipping', 'noksha'), 0, [], $method->id, $method->get_instance_id())];
    }

    public static function source(array $offer): string {
        $source = (string) ($offer['shippingSource'] ?? self::SOURCE_NOKSHA);
        if (!WcProduct::is_wc_offer($offer) || !in_array($source, [self::SOURCE_WC, self::SOURCE_AUTO], true)) {
            return self::SOURCE_NOKSHA;
        }
        return $source;
    }
}
