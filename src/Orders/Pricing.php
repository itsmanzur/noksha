<?php
/**
 * Quantity discounts set on a landing page: "buy 2 or more, save 50".
 *
 * A step takes a fixed amount off the order once the quantity reaches it.
 * The largest step that the quantity reaches is used. The same rule runs in
 * the browser (landing.js) so the page shows what checkout will charge.
 *
 * @package Noksha
 */

namespace Noksha\Orders;

final class Pricing {
    public const MAX_TIERS = 4;

    /**
     * Clean steps from the editor: 2 to 10 pieces, a positive amount, one step
     * per quantity, smallest quantity first.
     *
     * @param mixed $tiers
     * @return list<array{qty:int,discount:float}>
     */
    public static function clean_tiers($tiers): array {
        $by_qty = [];
        foreach ((array) $tiers as $tier) {
            if (!is_array($tier)) {
                continue;
            }
            $qty = (int) ($tier['qty'] ?? 0);
            $discount = round((float) ($tier['discount'] ?? 0), 2);
            if ($qty < 2 || $qty > 10 || $discount <= 0) {
                continue;
            }
            $by_qty[$qty] = $discount;
        }
        ksort($by_qty);
        $out = [];
        foreach (array_slice($by_qty, 0, self::MAX_TIERS, true) as $qty => $discount) {
            $out[] = ['qty' => (int) $qty, 'discount' => (float) $discount];
        }
        return $out;
    }

    /**
     * The add-ons the buyer chose, that are on and have a price.
     *
     * @param array<string, mixed> $offer Resolved offer.
     * @param array<string, mixed> $input Checkout input: 'bumps' (indexes) or the older 'bump' flag.
     * @return list<array{index:int,name:string,price:float,productId:int}>
     */
    public static function chosen_bumps(array $offer, array $input): array {
        $list = is_array($offer['bumps'] ?? null) ? $offer['bumps'] : (is_array($offer['bump'] ?? null) ? [$offer['bump']] : []);
        $wanted = is_array($input['bumps'] ?? null) ? array_map('intval', $input['bumps']) : (!empty($input['bump']) ? [0] : []);
        $out = [];
        foreach (array_unique($wanted) as $index) {
            $bump = $list[$index] ?? null;
            if (!is_array($bump) || empty($bump['enabled']) || (float) ($bump['price'] ?? 0) <= 0) {
                continue;
            }
            $out[] = [
                'index' => (int) $index,
                'name' => (string) (($bump['name'] ?? '') !== '' ? $bump['name'] : 'Add-on'),
                'price' => round((float) $bump['price'], 2),
                'productId' => (int) ($bump['productId'] ?? 0),
            ];
        }
        return $out;
    }

    /**
     * What the steps take off for this quantity, never more than the product lines.
     *
     * @param array<string, mixed> $offer
     */
    public static function tier_discount(array $offer, int $qty, float $lines): float {
        $best = 0.0;
        foreach (self::clean_tiers($offer['tiers'] ?? []) as $tier) {
            if ($qty >= $tier['qty']) {
                $best = $tier['discount'];
            }
        }
        return round(max(0.0, min($best, $lines)), 2);
    }
}
