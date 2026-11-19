<?php
/**
 * One-shot checks against a running WordPress. Not part of the public plugin.
 */

if (!defined('ABSPATH')) {
    fwrite(STDERR, "Run with wp eval-file\n");
    exit(1);
}

use Noksha\Brand\Tokens;
use Noksha\Options;
use Noksha\Orders\Checkout;
use Noksha\Orders\Repository as Orders;
use Noksha\Pages\Repository as Pages;

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
check(is_array($order) && $order['status'] === 'confirmed', 'cod order confirmed');
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
check(is_wp_error($ssl) && $ssl->get_error_code() === 'noksha_sslcommerz_not_configured', 'ssl without credentials is not paid ' . (is_wp_error($ssl) ? $ssl->get_error_code() : 'not-error'));

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
    'trx_id' => 'ABC123XYZ',
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

if ($GLOBALS['noksha_fail'] > 0) {
    echo $GLOBALS['noksha_fail'] . " failed\n";
    exit(1);
}
echo "all checks passed\n";
