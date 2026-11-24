<?php
/**
 * One-shot checks against a running WordPress. Not part of the public plugin.
 */

if (!defined('ABSPATH')) {
    fwrite(STDERR, "Run with wp eval-file\n");
    exit(1);
}

use Noksha\Brand\Tokens;
use Noksha\Front\CachePurge;
use Noksha\Options;
use Noksha\Orders\Checkout;
use Noksha\Orders\Repository as Orders;
use Noksha\Pages\Renderer;
use Noksha\Pages\Repository as Pages;

// The checks reuse a few phone numbers and are run again and again, so the
// per-phone and per-IP checkout limits must not turn a rerun into a failure.
add_filter('noksha_rate_limits', static function (array $limits): array {
    $limits['checkout'] = 100000;
    $limits['phone_checkout'] = 100000;
    return $limits;
});

$GLOBALS['noksha_fail'] = 0;
function check(bool $ok, string $message): void {
    if ($ok) {
        echo "ok  {$message}\n";
        return;
    }
    $GLOBALS['noksha_fail']++;
    echo "FAIL {$message}\n";
}

$id = Pages::create('single', 'en', 'Smoke mustard');
check(!is_wp_error($id), 'create page');
Pages::update($id, ['status' => 'publish', 'title' => 'Smoke mustard']);
$payload = Pages::payload($id);
check(!is_wp_error($payload) && $payload['status'] === 'publish', 'publish page');
check(count($payload['sections']) >= 5, 'template sections');

$checkout = new Checkout();
$bad = $checkout->place([
    'nonce' => wp_create_nonce('noksha_public'),
    'page_id' => $id,
    'name' => 'Test',
    'phone' => '01700000000',
    'division_id' => '6',
    'district_id' => '47',
    'upazila_id' => 'thana-dhanmondi',
    'address' => 'Road 4',
    'payment_method' => 'cod',
    'qty' => 1,
    'session_id' => 'smokesession1',
]);
check(is_wp_error($bad) && $bad->get_error_code() === 'noksha_invalid_phone', 'reject patterned phone');

$order = $checkout->place([
    'nonce' => wp_create_nonce('noksha_public'),
    'page_id' => $id,
    'name' => 'Nasrin',
    'phone' => '01712345678',
    'division_id' => '6',
    'district_id' => '47',
    'upazila_id' => 'thana-dhanmondi',
    'address' => 'Road 4, Dhanmondi',
    'payment_method' => 'cod',
    'qty' => 2,
    'session_id' => 'smokesession1',
]);
check(is_array($order) && $order['status'] === 'pending', 'cod order waits for the confirmation call');
check(is_array($order) && is_string($order['orderNumber']) && str_starts_with($order['orderNumber'], 'NK-'), 'order number');
if (is_array($order)) {
    $row = Orders::find_by_number($order['orderNumber']);
    check($row && (float) $row['total'] === 1020.0, 'total is price x qty + shipping');
    check($row && $row['district_name'] === 'Dhaka', 'district stored');
}

Options::update_settings([
    'sandbox' => true,
    'default_language' => 'en',
    'pixels' => ['meta' => '123', 'ga4' => 'G-TEST123', 'tiktok' => ''],
    'gateways' => [
        'cod' => ['enabled' => true],
        'manual_bkash' => ['enabled' => true, 'number' => '01711111111', 'instructions' => 'Send and share TrxID'],
        'manual_nagad' => ['enabled' => true, 'number' => '', 'instructions' => ''],
        'sslcommerz' => ['enabled' => true],
    ],
    'sslcommerz_store_id' => '',
]);

$doc = Pages::document($id);
$doc['checkout']['payments'][] = 'sslcommerz';
Pages::update($id, $doc);
$ssl = $checkout->place([
    'nonce' => wp_create_nonce('noksha_public'),
    'page_id' => $id,
    'name' => 'Imran',
    'phone' => '01812345678',
    'division_id' => '6',
    'district_id' => '47',
    'address' => 'House 2',
    'payment_method' => 'sslcommerz',
    'qty' => 1,
    'session_id' => 'smokesession2',
]);
check(is_wp_error($ssl) && $ssl->get_error_code() === 'noksha_invalid_payment', 'ssl without credentials is not offered ' . (is_wp_error($ssl) ? $ssl->get_error_code() : 'not-error'));

$wallet = $checkout->place([
    'nonce' => wp_create_nonce('noksha_public'),
    'page_id' => $id,
    'name' => 'Rupa',
    'phone' => '01612345678',
    'division_id' => '1',
    'district_id' => '8',
    'upazila_id' => '',
    'address' => 'Halishahar',
    'payment_method' => 'manual_bkash',
    'trx_id' => 'SMK' . strtoupper(wp_generate_password(8, false, false)), // TrxIDs are unique, so a rerun needs a fresh one.
    'qty' => 1,
    'session_id' => 'smokesession3',
]);
check(is_array($wallet) && $wallet['status'] === 'awaiting_payment', 'manual bkash waits for trx ' . (is_wp_error($wallet) ? $wallet->get_error_code() . ' ' . $wallet->get_error_message() : ''));
if (is_array($wallet)) {
    $row = Orders::find_by_number($wallet['orderNumber']);
    Orders::update((int) $row['id'], ['status' => 'paid', 'trx_verified' => 1]);
    $row = Orders::find((int) $row['id']);
    check($row['status'] === 'paid' && (int) $row['trx_verified'] === 1, 'trx can be marked received');
}

$tokens = Tokens::save([
    'preset' => 'custom',
    'color' => ['brand' => '#112233'],
    'font' => ['sans' => 'system-ui, "Noto Sans Bengali", sans-serif'],
    'radius' => '16px',
]);
check($tokens['color']['brand'] === '#112233' && $tokens['color']['canvas'] === '#F6F4EF', 'token override keeps the ink canvas');
check(str_contains(Tokens::css($tokens), '--noksha-color-brand:#112233'), 'css variables');

$report = Noksha\Analytics\Tracker::report(7);
check($report['funnel']['orders'] >= 1, 'analytics counts orders');

$html = Noksha\Pages\Renderer::article_for_post($id);
check(str_contains($html, 'Smoke mustard') || str_contains($html, 'Pure mustard oil'), 'renderer prints the page');
check(str_contains($html, 'data-geo="division"'), 'checkout renders address fields');

// ---- WooCommerce products on a landing page ----
if (Noksha\Catalog\WcProduct::active()) {
    $simple = new WC_Product_Simple();
    $simple->set_name('Smoke WC simple');
    $simple->set_regular_price('900');
    $simple->set_sale_price('750');
    $simple->set_manage_stock(true);
    $simple->set_stock_quantity(3);
    $simple->set_status('publish');
    $simple_id = $simple->save();

    $wc_page = Pages::create('single', 'en', 'Smoke WC page');
    $offer = Pages::payload($wc_page)['offer'];
    $offer['source'] = 'woocommerce';
    $offer['productId'] = $simple_id;
    $offer['price'] = 1; // A price sent by the browser must never win.
    Pages::update($wc_page, ['status' => 'publish', 'offer' => $offer]);
    $live = Pages::payload($wc_page)['offer'];
    check($live['source'] === 'woocommerce' && (float) $live['price'] === 750.0, 'wc offer reads the live sale price');
    check((float) $live['compareAt'] === 900.0 && $live['productName'] === 'Smoke WC simple', 'wc offer reads compare price and name');
    $stored = get_post_meta($wc_page, '_noksha_offer', true);
    check(is_array($stored) && (int) $stored['productId'] === $simple_id && !isset($stored['wc']), 'only the id is stored on the page');

    $base = [
        'nonce' => wp_create_nonce('noksha_public'),
        'page_id' => $wc_page,
        'name' => 'Rafi',
        'phone' => '01812345678',
        'division_id' => '6',
        'district_id' => '47',
        'upazila_id' => 'thana-dhanmondi',
        'address' => 'Road 9',
        'payment_method' => 'cod',
        'session_id' => 'smokesession2',
    ];
    $too_many = $checkout->place($base + ['qty' => 5]);
    check(is_wp_error($too_many) && $too_many->get_error_code() === 'noksha_stock_limit', 'qty above stock is refused');

    $placed = $checkout->place($base + ['qty' => 2]);
    check(is_array($placed), 'wc order placed');
    if (is_array($placed)) {
        $row = Orders::find_by_number($placed['orderNumber']);
        check($row && (float) $row['subtotal'] === 1500.0, 'order uses the live price, not the browser price');

        $wc_id = (int) ($row['wc_order_id'] ?? 0);
        $wo = $wc_id > 0 ? wc_get_order($wc_id) : null;
        check($wo instanceof WC_Order, 'a real WooCommerce order is created');
        if ($wo instanceof WC_Order) {
            check($wo->get_status() === 'on-hold', 'an unconfirmed COD order waits "on-hold" in WooCommerce');
            // Noksha → WooCommerce: confirming after the call moves the WC order on.
            Orders::update((int) $row['id'], ['status' => 'confirmed']);
            $wo = wc_get_order($wc_id);
            check($wo->get_status() === 'processing', 'confirmed COD order is "processing" in WooCommerce');
            check((float) $wo->get_total() === (float) $row['total'], 'WC order total matches the Noksha total');
            check((int) $wo->get_meta('_noksha_order_id') === (int) $row['id'], 'WC order carries the Noksha order id');
            $item = array_values($wo->get_items())[0] ?? null;
            check($item && $item->get_product_id() === $simple_id && $item->get_quantity() === 2, 'WC order has the product line');
            check($wo->get_billing_phone() === '01812345678' && $wo->get_billing_country() === 'BD', 'WC order carries the customer');
            check((int) wc_get_product($simple_id)->get_stock_quantity() === 1, 'stock is reduced by the order');

            // Noksha → WooCommerce: cancelling gives the stock back.
            Orders::update((int) $row['id'], ['status' => 'cancelled']);
            $wo = wc_get_order($wc_id);
            check($wo->get_status() === 'cancelled', 'cancelling in Noksha cancels the WC order');
            check((int) wc_get_product($simple_id)->get_stock_quantity() === 3, 'cancelling restores stock');
        }

        // A store product as the order bump rides on the same WooCommerce order.
        $addon = new WC_Product_Simple();
        $addon->set_name('Smoke WC addon');
        $addon->set_regular_price('200');
        $addon->set_manage_stock(true);
        $addon->set_stock_quantity(5);
        $addon->set_status('publish');
        $addon_id = $addon->save();
        $offer = Pages::payload($wc_page)['offer'];
        $offer['bump'] = ['enabled' => true, 'source' => 'woocommerce', 'productId' => $addon_id, 'name' => 'ignored', 'price' => 1, 'checkedDefault' => false];
        Pages::update($wc_page, ['offer' => $offer]);
        $live_bump = Pages::payload($wc_page)['offer']['bump'];
        check($live_bump['enabled'] && (float) $live_bump['price'] === 200.0 && $live_bump['name'] === 'Smoke WC addon', 'wc bump reads the live name and price');

        $with_bump = $checkout->place(['phone' => '01512345678'] + $base + ['qty' => 1, 'bump' => 1]);
        check(is_array($with_bump), 'order with a wc bump placed');
        if (is_array($with_bump)) {
            $row3 = Orders::find_by_number($with_bump['orderNumber']);
            $wo3 = wc_get_order((int) $row3['wc_order_id']);
            check($wo3 instanceof WC_Order && count($wo3->get_items()) === 2, 'the bump is a second product line');
            check($wo3 instanceof WC_Order && (float) $wo3->get_total() === (float) $row3['total'], 'WC total includes the bump');
            check((float) $row3['subtotal'] === 950.0, 'bump uses the live price, not the browser price');
            check((int) wc_get_product($addon_id)->get_stock_quantity() === 4, 'bump stock is reduced');
        }
        $addon->set_stock_quantity(0);
        $addon->set_stock_status('outofstock');
        $addon->save();
        // document() reads fresh; payload() is cached for the request.
        check(Pages::document($wc_page)['offer']['bump']['enabled'] === false, 'a sold-out wc bump is hidden');
        wp_delete_post($addon_id, true);

        // WooCommerce → Noksha.
        $second = $checkout->place(['phone' => '01612345678'] + $base + ['qty' => 1]);
        if (is_array($second)) {
            $row2 = Orders::find_by_number($second['orderNumber']);
            Orders::update((int) $row2['id'], ['status' => 'confirmed']);
            $wo2 = wc_get_order((int) $row2['wc_order_id']);
            $wo2->update_status('completed');
            $row2 = Orders::find((int) $row2['id']);
            check($row2['status'] === 'delivered', 'completing the WC order marks Noksha delivered');
        } else {
            check(false, 'second wc order placed');
        }
    }

    $simple->set_stock_quantity(0);
    $simple->set_stock_status('outofstock');
    $simple->save();
    $sold = $checkout->place(['phone' => '01912345678'] + $base + ['qty' => 1]);
    check(is_wp_error($sold) && $sold->get_error_code() === 'noksha_out_of_stock', 'out of stock product is refused');

    $variable = new WC_Product_Variable();
    $variable->set_name('Smoke WC variable');
    $attr = new WC_Product_Attribute();
    $attr->set_name('Size');
    $attr->set_options(['S', 'L']);
    $attr->set_visible(true);
    $attr->set_variation(true);
    $variable->set_attributes([$attr]);
    $variable->set_status('publish');
    $variable_id = $variable->save();
    $variation_ids = [];
    foreach (['S' => '500', 'L' => '650'] as $size => $amount) {
        $variation = new WC_Product_Variation();
        $variation->set_parent_id($variable_id);
        $variation->set_attributes(['size' => $size]);
        $variation->set_regular_price($amount);
        $variation->set_status('publish');
        $variation_ids[$size] = $variation->save();
    }
    WC_Product_Variable::sync($variable_id);

    $resolved = Noksha\Catalog\WcProduct::apply(['source' => 'woocommerce', 'productId' => $variable_id], $variation_ids['L']);
    check((float) $resolved['price'] === 650.0 && count($resolved['wc']['variations']) === 2, 'variable product resolves the chosen variation');
    $fallback = Noksha\Catalog\WcProduct::apply(['source' => 'woocommerce', 'productId' => $variable_id], 999999);
    check((int) $fallback['variationId'] !== 999999 && $fallback['wc']['available'], 'unknown variation falls back to a real one');
    $gone = Noksha\Catalog\WcProduct::apply(['source' => 'woocommerce', 'productId' => 99999999]);
    check($gone['wc']['available'] === false, 'deleted product is not orderable');
    $custom = Noksha\Catalog\WcProduct::apply(['source' => 'custom', 'price' => 10]);
    check(!isset($custom['wc']) && $custom['price'] === 10, 'custom offer passes through untouched');

    // ---- A stale page, page cache, sale countdown and an unavailable product ----
    $simple->set_manage_stock(true);
    $simple->set_stock_quantity(5);
    $simple->set_stock_status('instock');
    $simple->set_status('publish');
    $simple->save();

    $stale = $checkout->place(['phone' => '01712340001'] + $base + ['qty' => 1, 'expected_price' => 999]);
    $stale_data = is_wp_error($stale) ? (array) $stale->get_error_data() : [];
    check(is_wp_error($stale) && $stale->get_error_code() === 'noksha_price_changed' && (float) ($stale_data['price'] ?? 0) === 750.0, 'a stale page price is refused with the live price');
    $fresh = $checkout->place(['phone' => '01712340002'] + $base + ['qty' => 1, 'expected_price' => 750]);
    check(is_array($fresh), 'the price the buyer saw is accepted');

    $purged = [];
    add_action('noksha_page_cache_purged', static function ($page_id) use (&$purged) {
        $purged[] = (int) $page_id;
    });
    check(in_array($wc_page, CachePurge::pages_using($simple_id), true), 'the page is found from its product');
    $simple->set_sale_price('700');
    $simple->save();
    check(in_array($wc_page, $purged, true), 'changing the product clears the page cache');

    $simple->set_date_on_sale_to(gmdate('Y-m-d', time() + 3 * DAY_IN_SECONDS));
    $simple->save();
    $sale_end = (string) Pages::document($wc_page)['offer']['wc']['saleEndsAt'];
    check($sale_end !== '', 'the WooCommerce sale end date is read');
    $fest = Pages::create('festival', 'en', 'Smoke festival');
    $fest_doc = Pages::payload($fest);
    $fest_offer = $fest_doc['offer'];
    $fest_offer['source'] = 'woocommerce';
    $fest_offer['productId'] = $simple_id;
    $fest_sections = $fest_doc['sections'];
    foreach ($fest_sections as $i => $section) {
        if ($section['type'] === 'countdown') {
            $fest_sections[$i]['props']['endsAt'] = '';
        }
    }
    Pages::update($fest, ['status' => 'publish', 'offer' => $fest_offer, 'sections' => $fest_sections]);
    $fest_html = Renderer::article_for_post($fest);
    check(str_contains($fest_html, 'data-ends="' . substr($sale_end, 0, 10)), 'the countdown follows the sale end date');
    wp_delete_post($fest, true);

    // ---- Coupons: WooCommerce decides, Noksha follows ----
    $coupon = new WC_Coupon();
    $coupon->set_code('smoke10');
    $coupon->set_discount_type('percent');
    $coupon->set_amount(10);
    $coupon->set_usage_limit(5);
    $coupon_id = $coupon->save();
    $expired = new WC_Coupon();
    $expired->set_code('smokeold');
    $expired->set_discount_type('percent');
    $expired->set_amount(50);
    $expired->set_date_expires(time() - DAY_IN_SECONDS);
    $expired_id = $expired->save();

    $co_doc = Pages::payload($wc_page);
    $co_checkout = $co_doc['checkout'];
    $co_checkout['coupon'] = true;
    Pages::update($wc_page, ['checkout' => $co_checkout]);
    Pages::forget_cached($wc_page);
    check(Pages::payload($wc_page)['checkout']['coupon'] === true, 'the coupon setting is saved on the page');

    $live_offer = Pages::document($wc_page)['offer'];
    $preview = Noksha\Catalog\WcCoupon::preview($live_offer, 2, false, 'SMOKE10');
    check(!is_wp_error($preview) && (float) $preview['discount'] === round(0.10 * 2 * (float) $live_offer['price'], 2), 'the coupon preview is 10% of the lines');
    check(is_wp_error(Noksha\Catalog\WcCoupon::preview($live_offer, 1, false, 'NOPE')), 'an unknown coupon is refused');
    check(is_wp_error(Noksha\Catalog\WcCoupon::preview($live_offer, 1, false, 'smokeold')), 'an expired coupon is refused');

    $before = (int) $GLOBALS['wpdb']->get_var('SELECT COUNT(*) FROM ' . Orders::table());
    $bad_coupon = $checkout->place(['phone' => '01712340003'] + $base + ['qty' => 1, 'coupon' => 'NOPE']);
    check(is_wp_error($bad_coupon) && $bad_coupon->get_error_code() === 'noksha_coupon_invalid', 'checkout refuses an unknown coupon');
    check((int) $GLOBALS['wpdb']->get_var('SELECT COUNT(*) FROM ' . Orders::table()) === $before, 'a refused coupon leaves no order behind');

    $with = $checkout->place(['phone' => '01712340004'] + $base + ['qty' => 2, 'coupon' => 'smoke10']);
    check(is_array($with), 'order with a coupon placed');
    if (is_array($with)) {
        $co_row = Orders::find_by_number($with['orderNumber']);
        $co_wc = wc_get_order((int) $co_row['wc_order_id']);
        $gross = 2 * (float) $live_offer['price'];
        check((float) $co_row['discount'] === round($gross * 0.10, 2) && $co_row['coupon'] === 'smoke10', 'the Noksha order records the discount and coupon');
        check((float) $co_row['total'] === round($gross - $gross * 0.10 + (float) $co_row['shipping'], 2), 'total = lines - discount + delivery');
        check((float) $co_row['collect_amount'] === (float) $co_row['total'], 'the courier collects the discounted total');
        check($co_wc instanceof WC_Order && (float) $co_wc->get_total() === (float) $co_row['total'], 'the WooCommerce total matches');
        check($co_wc instanceof WC_Order && in_array('smoke10', $co_wc->get_coupon_codes(), true), 'the coupon is on the WooCommerce order');
        $used = new WC_Coupon($coupon_id);
        check((int) $used->get_usage_count() === 1, 'WooCommerce counts the coupon use');
        check((float) $with['value'] === (float) $co_row['total'], 'the page is told the discounted total');
    }
    wp_delete_post($coupon_id, true);
    wp_delete_post($expired_id, true);

    $simple->set_stock_quantity(0);
    $simple->set_stock_status('outofstock');
    $simple->save();
    Pages::forget_cached($wc_page);
    $sold_html = Renderer::article_for_post($wc_page);
    check(str_contains($sold_html, 'out of stock') && !str_contains($sold_html, 'nk-sticky-cta'), 'a sold-out page says so and has no sticky buy button');
    $simple->set_status('draft');
    $simple->save();
    Pages::forget_cached($wc_page);
    $draft_html = Renderer::article_for_post($wc_page);
    check(str_contains($draft_html, 'not available right now'), 'an unpublished product shows the unavailable message');

    wp_delete_post($wc_page, true);
    wp_delete_post($variable_id, true);
    wp_delete_post($simple_id, true);
} else {
    echo "skip WooCommerce checks (plugin not active)\n";
}

if ($GLOBALS['noksha_fail'] > 0) {
    echo $GLOBALS['noksha_fail'] . " failed\n";
    exit(1);
}
echo "all checks passed\n";
