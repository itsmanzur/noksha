<?php
/**
 * One-shot checks against a running WordPress. Not part of the public plugin.
 */

if (!defined('ABSPATH')) {
    fwrite(STDERR, "Run with wp eval-file\n");
    exit(1);
}

use Noksha\Brand\Tokens;
use Noksha\Catalog\WcSuggest;
use Noksha\Front\CachePurge;
use Noksha\Support\PublicNonce;
use Noksha\Options;
use Noksha\Orders\Checkout;
use Noksha\Orders\Pricing;
use Noksha\Region\WcStates;
use Noksha\Shipping\WcRates;
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
    'nonce' => PublicNonce::create(),
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
    'nonce' => PublicNonce::create(),
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
    'nonce' => PublicNonce::create(),
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
    'nonce' => PublicNonce::create(),
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

// A visitor who types a phone and leaves is kept as a lead.
$lead_req = new WP_REST_Request('POST', '/noksha/v1/leads/capture');
$lead_req->set_header('content-type', 'application/json');
$lead_req->set_body(wp_json_encode(['nonce' => PublicNonce::create(), 'page_id' => $id, 'phone' => '01712340099', 'session_id' => 'smokelead1', 'name' => 'Lead']));
$lead_res = rest_do_request($lead_req);
check($lead_res->get_status() === 200 && !empty($lead_res->get_data()['ok']), 'lead capture answers (it used to fail on a missing method)');

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
        'nonce' => PublicNonce::create(),
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
        // ---- Several add-ons: a store product and a custom one ----
        $legacy = Pages::payload($wc_page)['offer'];
        check(count($legacy['bumps']) === 1 && $legacy['bumps'][0]['productId'] === $addon_id, 'an older page with one add-on reads as a list of one');
        $many = Noksha\Pages\Sanitizer::offer(['source' => 'woocommerce', 'productId' => $simple_id, 'bumps' => [
            ['enabled' => true, 'name' => 'A', 'price' => 1], ['enabled' => true, 'name' => 'B', 'price' => 2],
            ['enabled' => true, 'name' => 'C', 'price' => 3], ['enabled' => true, 'name' => 'D', 'price' => 4],
        ]]);
        check(count($many['bumps']) === 3 && $many['bump']['name'] === 'A', 'at most three add-ons; "bump" is the first');
        $two = $legacy;
        $two['bumps'] = [
            ['enabled' => true, 'source' => 'woocommerce', 'productId' => $addon_id],
            ['enabled' => true, 'source' => 'custom', 'name' => 'Gift wrap', 'price' => 30],
        ];
        Pages::update($wc_page, ['offer' => $two]);
        Pages::forget_cached($wc_page);
        $two_html = Renderer::article_for_post($wc_page);
        check(substr_count($two_html, 'data-bump-index=') === 2 && str_contains($two_html, 'Gift wrap'), 'the page shows both add-ons');
        $simple->set_stock_quantity(10);
        $simple->save();
        $both_bumps = $checkout->place(['phone' => '01712340008'] + $base + ['qty' => 1, 'bumps' => [0, 1], 'expected_bumps_total' => 230]);
        check(is_array($both_bumps), 'order with two add-ons placed ' . (is_wp_error($both_bumps) ? $both_bumps->get_error_code() : ''));
        if (is_array($both_bumps)) {
            $bb_row = Orders::find_by_number($both_bumps['orderNumber']);
            $bb_wc = wc_get_order((int) $bb_row['wc_order_id']);
            $unit_now = (float) Pages::document($wc_page)['offer']['price'];
            check((float) $bb_row['subtotal'] === round($unit_now + 200 + 30, 2), 'subtotal = product + both add-ons');
            check(count(Orders::items((int) $bb_row['id'])) === 3, 'the Noksha order has three lines');
            check($bb_wc instanceof WC_Order && count($bb_wc->get_items()) === 2 && count($bb_wc->get_fees()) === 1, 'WooCommerce: the store add-on is a product line, the custom one a fee');
            check($bb_wc instanceof WC_Order && (float) $bb_wc->get_total() === (float) $bb_row['total'], 'the WooCommerce total matches');
            // Ad-platform ids: the product for the order, each line its own.
            check(($both_bumps['purchase']['content_ids'] ?? null) === [(string) $simple_id], 'Purchase uses the product id, like ViewContent');
            check(array_column($both_bumps['purchase']['contents'] ?? [], 'id') === [(string) $simple_id, (string) $addon_id, (string) $wc_page], 'each line has its own id (a custom add-on falls back to the page)');
        }
        $one_only = $checkout->place(['phone' => '01712340009'] + $base + ['qty' => 1, 'bumps' => [1]]);
        if (is_array($one_only)) {
            $oo_row = Orders::find_by_number($one_only['orderNumber']);
            check(count(Orders::items((int) $oo_row['id'])) === 2 && Orders::items((int) $oo_row['id'])[1]['name'] === 'Gift wrap', 'choosing only the second add-on adds only that one');
        } else {
            check(false, 'order with the second add-on placed');
        }
        $old_flag = $checkout->place(['phone' => '01712340010'] + $base + ['qty' => 1, 'bump' => 1]);
        check(is_array($old_flag) && count(Orders::items((int) Orders::find_by_number($old_flag['orderNumber'])['id'])) === 2, 'the older single "bump" flag still adds the first add-on');
        $stale_bumps = $checkout->place(['phone' => '01712340011'] + $base + ['qty' => 1, 'bumps' => [0, 1], 'expected_bumps_total' => 999]);
        check(is_wp_error($stale_bumps) && $stale_bumps->get_error_code() === 'noksha_price_changed' && count((array) ($stale_bumps->get_error_data()['bump_prices'] ?? [])) === 2, 'old add-on prices on the page are caught, with each current price');

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
    $agg = Noksha\Pages\Schema::product(['offer' => $resolved], '', '');
    check(is_array($agg) && $agg['offers']['@type'] === 'AggregateOffer' && $agg['offers']['lowPrice'] === '500.00' && $agg['offers']['highPrice'] === '650.00', 'a product with options gives a price range');
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

    // ---- Suggestions, rating and the verified mark come from the product itself ----
    $material = new WC_Product_Attribute();
    $material->set_name('Material');
    $material->set_options(['Cotton']);
    $material->set_visible(true);
    $simple->set_attributes([$material]);
    $simple->set_short_description('A very comfortable shirt for daily wear.');
    $simple->set_description('<ul><li>Soft cotton</li><li>Machine washable</li></ul>');
    $simple->save();
    foreach ([
        ['Nasrin', 'Fits well and feels great.', 5, 1, true],
        ['Imran', 'Good shirt, quick delivery.', 4, 1, false],
        ['Rupa', 'Fine, nothing special.', 3, 1, false],
        ['Karim', 'Not approved yet.', 5, 0, false],
    ] as [$who, $said, $stars, $approved, $verified]) {
        $cid = wp_insert_comment(['comment_post_ID' => $simple_id, 'comment_author' => $who, 'comment_content' => $said, 'comment_type' => 'review', 'comment_approved' => $approved]);
        update_comment_meta($cid, 'rating', $stars);
        if ($verified) {
            update_comment_meta($cid, 'verified', 1);
        }
    }
    WC_Comments::clear_transients($simple_id);

    $suggest = WcSuggest::for_product($simple_id);
    check(!is_wp_error($suggest) && $suggest['hero']['subtitle'] === 'A very comfortable shirt for daily wear.', 'the short description becomes the subtitle suggestion');
    check(!is_wp_error($suggest) && in_array('Soft cotton', $suggest['info']['bullets'], true), 'list items become key points');
    check(!is_wp_error($suggest) && ($suggest['benefits'][0]['title'] ?? '') === 'Material' && ($suggest['benefits'][0]['text'] ?? '') === 'Cotton', 'attributes become benefits');
    check(!is_wp_error($suggest) && count($suggest['reviews']) === 2, 'only approved reviews of 4 stars or more are suggested');
    check(!is_wp_error($suggest) && $suggest['reviews'][0]['name'] === 'Nasrin' && $suggest['reviews'][0]['verified'] === true, 'a verified buyer comes first');
    check(is_wp_error(WcSuggest::for_product(99999999)), 'a missing product gives an error, not a guess');

    Pages::forget_cached($wc_page);
    $rated = Pages::document($wc_page)['offer']['wc']['rating'];
    check($rated['count'] === 3 || $rated['count'] === 2, 'the review count comes from the product (' . $rated['count'] . ')');
    $rated_html = Renderer::article_for_post($wc_page);
    check(str_contains($rated_html, 'nk-rating'), 'the page shows the rating line');
    $verified_payload = Pages::payload($wc_page);
    foreach ($verified_payload['sections'] as $i => $section) {
        if ($section['type'] === 'reviews') {
            $verified_payload['sections'][$i]['props']['items'] = [['name' => 'Nasrin', 'text' => 'Fits well.', 'rating' => 5, 'verified' => true]];
        }
    }
    check(str_contains(Renderer::article($verified_payload, false), 'nk-verified'), 'a verified review shows the verified buyer mark');
    $kept = Noksha\Pages\Sanitizer::document(['sections' => $verified_payload['sections']], Pages::document($wc_page))['sections'];
    $kept_review = null;
    foreach ($kept as $section) {
        if ($section['type'] === 'reviews') {
            $kept_review = $section['props']['items'][0] ?? null;
        }
    }
    check(is_array($kept_review) && $kept_review['verified'] === true, 'the verified mark survives saving');

    // ---- One content id for every ad event ----
    check(Noksha\Analytics\ContentId::for_ids(10, 5, 7) === '7' && Noksha\Analytics\ContentId::for_ids(10, 5) === '5' && Noksha\Analytics\ContentId::for_ids(10) === '10', 'content id: option, else product, else page');
    $sku_ids = static fn($value, $page, $product, $variation) => $product > 0 ? 'sku_' . ($variation ?: $product) : $value;
    add_filter('noksha_content_id', $sku_ids, 10, 4);
    check(Noksha\Analytics\ContentId::for_ids(10, 5, 7) === 'sku_7', 'a store can map content ids to its catalog');
    remove_filter('noksha_content_id', $sku_ids, 10);
    Pages::forget_cached($wc_page);
    $cfg = Renderer::script_config(Pages::payload($wc_page), false);
    check($cfg['contentId'] === (string) $simple_id, 'the page tells the browser the product id for its events');

    // ---- Product structured data (JSON-LD) ----
    Pages::forget_cached($wc_page);
    $seo_payload = Pages::payload($wc_page);
    $seo = Renderer::seo_tags($seo_payload);
    $ld = null;
    if (preg_match('#<script type="application/ld\+json">(.*?)</script>#s', $seo['html'], $found)) {
        $ld = json_decode($found[1], true);
    }
    check(is_array($ld) && $ld['@type'] === 'Product' && $ld['name'] === 'Smoke WC simple', 'the page has Product data with the product name');
    check(is_array($ld) && $ld['offers']['@type'] === 'Offer' && $ld['offers']['priceCurrency'] === 'BDT' && (float) $ld['offers']['price'] === (float) $seo_payload['offer']['price'], 'the offer has the live price in BDT');
    check(is_array($ld) && $ld['offers']['availability'] === 'https://schema.org/' . (!empty($seo_payload['offer']['wc']['available']) ? 'InStock' : 'OutOfStock'), 'availability follows the stock');
    check(is_array($ld) && (int) ($ld['aggregateRating']['reviewCount'] ?? 0) === (int) $seo_payload['offer']['wc']['rating']['count'], 'the rating uses the real review count');
    check(str_contains($seo['html'], 'product:price:amount'), 'the price is in the link-preview tags');
    $no_ld = static fn() => null;
    add_filter('noksha_product_schema', $no_ld);
    check(!str_contains(Renderer::seo_tags($seo_payload)['html'], 'ld+json'), 'a filter can leave the Product data out');
    remove_filter('noksha_product_schema', $no_ld);
    $variable_ld = Noksha\Pages\Schema::product(['offer' => Noksha\Catalog\WcProduct::apply(['source' => 'woocommerce', 'productId' => 0] + Pages::document($wc_page)['offer'])], '', '');
    check($variable_ld === null || $variable_ld['@type'] === 'Product', 'a missing product never breaks the page head');

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

    // ---- Live price and stock for a cached page; the low-stock line ----
    $live_res = rest_do_request(new WP_REST_Request('GET', '/noksha/v1/live'));
    check($live_res->get_status() === 404, 'live answers only for a published page');
    $live_req = new WP_REST_Request('GET', '/noksha/v1/live');
    $live_req->set_param('page_id', $wc_page);
    $live_res = rest_do_request($live_req);
    $live_data = $live_res->get_data();
    Pages::forget_cached($wc_page);
    $live_offer_now = Pages::document($wc_page)['offer'];
    check(($live_data['source'] ?? '') === 'woocommerce' && (float) $live_data['price'] === (float) $live_offer_now['price'], 'live gives the current price');
    check(($live_res->get_headers()['Cache-Control'] ?? '') === 'no-store, max-age=0', 'live is never cached');
    $live_stock = (int) wc_get_product($simple_id)->get_stock_quantity();
    check((int) $live_data['stock'] === $live_stock, 'live gives the current stock');

    $hint_offer = Pages::payload($wc_page)['offer'];
    $hint_offer['stockHint'] = true;
    $hint_offer['stockHintMax'] = 10;
    Pages::update($wc_page, ['offer' => $hint_offer]);
    Pages::forget_cached($wc_page);
    $hint_html = Renderer::article_for_post($wc_page);
    check(str_contains($hint_html, 'Only ' . $live_stock . ' left in stock'), 'the low-stock line shows the real stock (' . $live_stock . ')');
    $hint_offer['stockHintMax'] = max(1, $live_stock - 1);
    Pages::update($wc_page, ['offer' => $hint_offer]);
    Pages::forget_cached($wc_page);
    check(!str_contains(Renderer::article_for_post($wc_page), 'left in stock</p>'), 'the line stays hidden above the chosen number');

    // ---- Delivery from WooCommerce shipping zones (hybrid) ----
    $find_district = static function (string $name): array {
        foreach (Noksha\Region\Geo::data()['divisions'] as $division) {
            foreach ($division['districts'] as $district) {
                if ($district['en'] === $name) {
                    return ['division_id' => (string) $division['id'], 'district_id' => (string) $district['id']];
                }
            }
        }
        return [];
    };
    $all_codes = [];
    foreach (Noksha\Region\Geo::data()['divisions'] as $division) {
        foreach ($division['districts'] as $district) {
            $all_codes[] = WcStates::code((string) $district['id']);
        }
    }
    check(count(array_filter($all_codes)) === 64 && count(array_unique($all_codes)) === 64, 'all 64 districts have their own WooCommerce state code');
    check(WcStates::code('47') === 'BD-13', 'Dhaka is BD-13');

    $sylhet = $find_district('Sylhet');
    $rangpur = $find_district('Rangpur');
    $make_zone = static function (string $name, string $state, int $order): WC_Shipping_Zone {
        $zone = new WC_Shipping_Zone();
        $zone->set_zone_name($name);
        $zone->set_zone_order($order);
        $zone->add_location('BD:' . $state, 'state');
        $zone->save();
        return $zone;
    };
    $set_method = static function (WC_Shipping_Zone $zone, string $type, array $settings): void {
        $instance = $zone->add_shipping_method($type);
        update_option('woocommerce_' . $type . '_' . $instance . '_settings', $settings + ['enabled' => 'yes']);
    };
    // New zones sort after the site's own (WooCommerce has no negative order), so while these
    // checks run the site's zones are left out of matching. Nothing is changed in the database.
    $site_zone_ids = array_map(static fn($z) => (int) $z['id'], WC_Shipping_Zones::get_zones());
    $hide_site_zones = static function ($criteria) use ($site_zone_ids) {
        if ($site_zone_ids !== []) {
            $criteria[] = 'AND zones.zone_id NOT IN (' . implode(',', $site_zone_ids) . ')';
        }
        return $criteria;
    };
    add_filter('woocommerce_get_zone_criteria', $hide_site_zones);
    $zone_s = $make_zone('Smoke Sylhet', 'BD-60', 0);
    $set_method($zone_s, 'flat_rate', ['title' => 'Smoke flat', 'cost' => '90', 'tax_status' => 'none']);
    $set_method($zone_s, 'free_shipping', ['title' => 'Smoke free', 'requires' => 'min_amount', 'min_amount' => '3000', 'ignore_discounts' => 'no']);
    $zone_r = $make_zone('Smoke Rangpur', 'BD-55', 1);
    $set_method($zone_r, 'flat_rate', ['title' => 'Smoke per piece', 'cost' => '50 + 10 * [qty]', 'tax_status' => 'none']);
    $set_method($zone_r, 'local_pickup', ['title' => 'Smoke pickup', 'cost' => '0']);
    WC_Cache_Helper::invalidate_cache_group('shipping_zones');

    $simple->set_stock_quantity(20);
    $simple->save();
    Pages::forget_cached($wc_page);
    $ship_offer = Pages::document($wc_page)['offer'];
    $unit_price = (float) $ship_offer['price'];
    $q = WcRates::quote($ship_offer, 1, [], $sylhet['district_id'], 'Sylhet', '');
    check($q !== null && $q['cost'] === 90.0 && $q['label'] === 'Smoke flat', 'Sylhet zone: flat rate 90');
    $big = (int) ceil(3000 / max(1, $unit_price));
    $q_free = WcRates::quote($ship_offer, $big, [], $sylhet['district_id'], 'Sylhet', '');
    check($q_free !== null && $q_free['cost'] === 0.0, 'free shipping once the lines reach the minimum (' . $big . ' pieces)');
    $q_disc = WcRates::quote($ship_offer, $big, [], $sylhet['district_id'], 'Sylhet', '', $big * $unit_price);
    check($q_disc !== null && $q_disc['cost'] === 90.0, 'discounts count against the free-shipping minimum');
    $q_r = WcRates::quote($ship_offer, 2, [], $rangpur['district_id'], 'Rangpur', '');
    check($q_r !== null && $q_r['cost'] === 70.0, 'a [qty] formula works (50 + 10 x 2) and local pickup is left out');
    check(WcRates::quote($ship_offer, 1, [], '', '', '') === null, 'no district, no WooCommerce quote');

    $ship_offer_save = Pages::payload($wc_page)['offer'];
    $ship_offer_save['shippingSource'] = 'woocommerce';
    Pages::update($wc_page, ['offer' => $ship_offer_save]);
    Pages::forget_cached($wc_page);
    check(Pages::document($wc_page)['offer']['shippingSource'] === 'woocommerce', 'the page keeps its delivery source');
    $custom_try = Noksha\Pages\Sanitizer::offer(['source' => 'custom', 'shippingSource' => 'woocommerce']);
    check($custom_try['shippingSource'] === 'noksha', 'a custom product always uses the page charges');

    $sylhet_input = ['phone' => '01712340012', 'division_id' => $sylhet['division_id'], 'district_id' => $sylhet['district_id'], 'upazila_id' => ''] + $base + ['qty' => 1];
    $ship_order = $checkout->place($sylhet_input);
    check(is_array($ship_order), 'order to Sylhet placed ' . (is_wp_error($ship_order) ? $ship_order->get_error_code() : ''));
    if (is_array($ship_order)) {
        $s_row = Orders::find_by_number($ship_order['orderNumber']);
        $s_wc = wc_get_order((int) $s_row['wc_order_id']);
        check((float) $s_row['shipping'] === 90.0, 'the Noksha order charges the zone rate');
        $lines = $s_wc instanceof WC_Order ? array_values($s_wc->get_shipping_methods()) : [];
        check(count($lines) === 1 && $lines[0]->get_method_title() === 'Smoke flat' && $lines[0]->get_method_id() === 'flat_rate', 'the WooCommerce order names the zone rate');
        check($s_wc instanceof WC_Order && $s_wc->get_shipping_state() === 'BD-60' && (float) $s_wc->get_total() === (float) $s_row['total'], 'state code and total are right on the WooCommerce order');
    }
    $stale_ship = $checkout->place(['phone' => '01712340013', 'expected_shipping' => 60] + $sylhet_input);
    check(is_wp_error($stale_ship) && $stale_ship->get_error_code() === 'noksha_price_changed' && (float) ($stale_ship->get_error_data()['shipping'] ?? 0) === 90.0, 'a page showing another delivery charge is told the right one');

    $ship_req = new WP_REST_Request('GET', '/noksha/v1/shipping');
    $ship_req->set_param('page_id', $wc_page);
    $ship_req->set_param('district_id', $sylhet['district_id']);
    $ship_res = rest_do_request($ship_req);
    check(($ship_res->get_data()['cost'] ?? null) === 90.0 && ($ship_res->get_headers()['Cache-Control'] ?? '') === 'no-store, max-age=0', 'the page can ask for a district\'s charge');

    // No zone delivers there: "WooCommerce" refuses, "Auto" falls back to the page charges.
    $no_methods = static fn() => [];
    add_filter('woocommerce_shipping_zone_shipping_methods', $no_methods);
    $refused = $checkout->place(['phone' => '01712340014'] + $sylhet_input);
    check(is_wp_error($refused) && $refused->get_error_code() === 'noksha_no_delivery', 'with WooCommerce zones only, an area without delivery is refused');
    $ship_offer_save['shippingSource'] = 'auto';
    Pages::update($wc_page, ['offer' => $ship_offer_save]);
    Pages::forget_cached($wc_page);
    $fallback = $checkout->place(['phone' => '01712340015'] + $sylhet_input);
    check(is_array($fallback) && (float) Orders::find_by_number($fallback['orderNumber'])['shipping'] === Checkout::shipping_for(Pages::document($wc_page)['offer'], $sylhet['district_id']), 'with Auto, an area without a zone uses the page charges');
    remove_filter('woocommerce_shipping_zone_shipping_methods', $no_methods);

    $ship_offer_save['shippingSource'] = 'noksha';
    Pages::update($wc_page, ['offer' => $ship_offer_save]);
    Pages::forget_cached($wc_page);
    $zone_s->delete();
    $zone_r->delete();
    remove_filter('woocommerce_get_zone_criteria', $hide_site_zones);
    WC_Cache_Helper::invalidate_cache_group('shipping_zones');

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
    // ---- Quantity steps: "buy 2 or more, save 50" ----
    $clean = Pricing::clean_tiers([
        ['qty' => 3, 'discount' => 120], ['qty' => 2, 'discount' => 50], ['qty' => 2, 'discount' => 60],
        ['qty' => 1, 'discount' => 5], ['qty' => 11, 'discount' => 5], ['qty' => 4, 'discount' => 0],
        ['qty' => 5, 'discount' => 1], ['qty' => 6, 'discount' => 1], ['qty' => 7, 'discount' => 1],
    ]);
    check(array_column($clean, 'qty') === [2, 3, 5, 6] && $clean[0]['discount'] === 60.0, 'steps are cleaned: 2-10 pieces, one per quantity, at most 4, smallest first');
    $tier_offer = ['tiers' => [['qty' => 2, 'discount' => 50], ['qty' => 3, 'discount' => 100]]];
    check(Pricing::tier_discount($tier_offer, 1, 700) === 0.0 && Pricing::tier_discount($tier_offer, 2, 1400) === 50.0 && Pricing::tier_discount($tier_offer, 5, 3500) === 100.0, 'the largest step reached is used');
    check(Pricing::tier_discount($tier_offer, 3, 80) === 80.0, 'a step never takes more than the product lines');

    // On a custom product page.
    $custom_doc = Pages::payload($id);
    $custom_offer = $custom_doc['offer'];
    $custom_offer['tiers'] = [['qty' => 2, 'discount' => 50]];
    Pages::update($id, ['offer' => $custom_offer]);
    $tiered = $checkout->place([
        'nonce' => PublicNonce::create(), 'page_id' => $id, 'name' => 'Tier Buyer', 'phone' => '01712340005',
        'division_id' => '6', 'district_id' => '47', 'upazila_id' => 'thana-dhanmondi', 'address' => 'Road 7',
        'payment_method' => 'cod', 'qty' => 2, 'session_id' => 'smoketier1', 'expected_tier_discount' => 50,
    ]);
    check(is_array($tiered), 'custom order with a step placed');
    if (is_array($tiered)) {
        $t_row = Orders::find_by_number($tiered['orderNumber']);
        check((float) $t_row['discount'] === 50.0 && (float) $t_row['total'] === round((float) $t_row['subtotal'] - 50 + (float) $t_row['shipping'], 2), 'custom order: total = lines - step + delivery');
        check((float) $t_row['collect_amount'] === (float) $t_row['total'], 'the courier collects the total after the step');
    }
    $stale_tier = $checkout->place([
        'nonce' => PublicNonce::create(), 'page_id' => $id, 'name' => 'Tier Buyer', 'phone' => '01712340006',
        'division_id' => '6', 'district_id' => '47', 'upazila_id' => 'thana-dhanmondi', 'address' => 'Road 7',
        'payment_method' => 'cod', 'qty' => 2, 'session_id' => 'smoketier2', 'expected_tier_discount' => 30,
    ]);
    $stale_tier_data = is_wp_error($stale_tier) ? (array) $stale_tier->get_error_data() : [];
    check(is_wp_error($stale_tier) && $stale_tier->get_error_code() === 'noksha_price_changed' && ($stale_tier_data['tiers'][0]['discount'] ?? 0) === 50.0, 'a page showing an old step is told the current steps');

    // On a WooCommerce product page, with a coupon too.
    $wc_tier_offer = Pages::payload($wc_page)['offer'];
    $wc_tier_offer['tiers'] = [['qty' => 2, 'discount' => 50], ['qty' => 3, 'discount' => 100]];
    Pages::update($wc_page, ['offer' => $wc_tier_offer]);
    Pages::forget_cached($wc_page);
    $live_req = new WP_REST_Request('GET', '/noksha/v1/live');
    $live_req->set_param('page_id', $wc_page);
    check(count(rest_do_request($live_req)->get_data()['tiers'] ?? []) === 2, 'live gives the steps');
    // Earlier checks used up some stock; this one needs three.
    $simple->set_stock_quantity(10);
    $simple->save();
    Pages::forget_cached($wc_page);
    $unit = (float) Pages::document($wc_page)['offer']['price'];
    $both = $checkout->place(['phone' => '01712340007'] + $base + ['qty' => 3, 'coupon' => 'smoke10', 'expected_tier_discount' => 100]);
    check(is_array($both), 'WooCommerce order with a step and a coupon placed ' . (is_wp_error($both) ? $both->get_error_code() : ''));
    if (is_array($both)) {
        $b_row = Orders::find_by_number($both['orderNumber']);
        $b_wc = wc_get_order((int) $b_row['wc_order_id']);
        $coupon_part = round(3 * $unit * 0.10, 2);
        check((float) $b_row['discount'] === round(100 + $coupon_part, 2), 'the Noksha order records step + coupon (' . $b_row['discount'] . ')');
        check((float) $b_row['total'] === round(3 * $unit - 100 - $coupon_part + (float) $b_row['shipping'], 2), 'total = lines - step - coupon + delivery');
        check($b_wc instanceof WC_Order && (float) $b_wc->get_total() === (float) $b_row['total'], 'the WooCommerce total matches');
        $fees = $b_wc instanceof WC_Order ? array_values($b_wc->get_fees()) : [];
        check(count($fees) === 1 && (float) $fees[0]->get_total() === -100.0, 'the step is a "Quantity discount" line on the WooCommerce order');
        check($b_wc instanceof WC_Order && (float) $b_wc->get_discount_total() === $coupon_part, 'the coupon is worked out on the full lines');
    }
    $wc_tier_offer['tiers'] = [];
    Pages::update($wc_page, ['offer' => $wc_tier_offer]);
    Pages::forget_cached($wc_page);

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

    // ---- Draft pages from store products ----
    $simple->set_status('publish');
    $simple->set_stock_quantity(10);
    $simple->set_stock_status('instock');
    $simple->save();
    $admin_user = get_users(['role' => 'administrator', 'number' => 1])[0] ?? null;
    $previous_user = get_current_user_id();
    if ($admin_user) {
        wp_set_current_user($admin_user->ID);
    }
    $bulk_req = new WP_REST_Request('POST', '/noksha/v1/pages/from-products');
    $bulk_req->set_header('content-type', 'application/json');
    $bulk_req->set_body(wp_json_encode(['productIds' => [$simple_id, 99999999], 'language' => 'en']));
    $bulk = rest_do_request($bulk_req)->get_data();
    check(count($bulk['made'] ?? []) === 1 && count($bulk['failed'] ?? []) === 1, 'one page made, a missing product reported');
    $made_id = (int) ($bulk['made'][0]['pageId'] ?? 0);
    if ($made_id > 0) {
        $made_post = get_post($made_id);
        $made = Pages::payload($made_id);
        check($made_post->post_status === 'draft' && $made_post->post_title === 'Smoke WC simple', 'the page is a draft named after the product');
        check($made['offer']['source'] === 'woocommerce' && (int) $made['offer']['productId'] === $simple_id, 'the page sells the store product');
        $by_type = [];
        foreach ($made['sections'] as $section) {
            $by_type[$section['type']] = $section;
        }
        check($by_type['hero']['props']['title'] === 'Smoke WC simple' && $by_type['hero']['props']['subtitle'] === 'A very comfortable shirt for daily wear.', 'the top banner has the product name and short description');
        check(in_array('Soft cotton', $by_type['product']['props']['bullets'], true), 'key points come from the description');
        check(($by_type['benefits']['props']['items'][0]['title'] ?? '') === 'Material' && empty($by_type['benefits']['hidden']), 'benefits come from the attributes');
        $review_names = array_column($by_type['reviews']['props']['items'], 'name');
        check(in_array('Nasrin', $review_names, true) && !in_array('Nasrin, Mirpur', $review_names, true), 'reviews are the product\'s own, not the samples');
        check(!empty($by_type['guarantee']['hidden']), 'the sample guarantee is hidden');
        Pages::forget_cached($made_id);
        $made_html = strtolower(Renderer::article_for_post($made_id));
        check(!str_contains($made_html, 'mustard') && !str_contains($made_html, 'broken seal') && !str_contains($made_html, 'ghani'), 'no sample text from the template is left on the page');
        $search_req = new WP_REST_Request('GET', '/noksha/v1/wc-products');
        $search_req->set_param('q', 'Smoke WC simple');
        $found = rest_do_request($search_req)->get_data()['products'][0] ?? [];
        check(($found['pages'] ?? 0) >= 1, 'the product search says the product already has a page');
        wp_delete_post($made_id, true);
    }
    wp_set_current_user($previous_user);

    // ---- Sales by product ----
    $by_product = Noksha\Analytics\Tracker::by_product(wp_date('Y-m-d 00:00:00', current_time('timestamp') - DAY_IN_SECONDS), 1000);
    $rows_by_key = array_column($by_product, null, 'key');
    $main_row = $rows_by_key['p' . $simple_id] ?? null;
    check(is_array($main_row) && $main_row['orders'] >= 3 && $main_row['units'] >= $main_row['orders'] && $main_row['revenue'] > 0, 'sales by product: the store product has orders, pieces and sales');
    check(is_array($main_row) && $main_row['name'] === 'Smoke WC simple', 'the row uses the product name');
    $addon_row = $rows_by_key['p' . $addon_id] ?? null;
    check(is_array($addon_row) && $addon_row['addonUnits'] >= 1 && $addon_row['addonUnits'] === $addon_row['units'], 'an add-on product counts as sold as an add-on ' . wp_json_encode($addon_row));
    $sum_units = array_sum(array_column(Orders::items((int) Orders::find_by_number($both_bumps['orderNumber'])['id']), 'qty'));
    check($sum_units === 3, 'an order with two add-ons has three lines to count');

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
