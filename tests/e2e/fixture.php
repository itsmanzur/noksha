<?php
/**
 * Creates the store data the browser tests need, and writes where it is to
 * the JSON file named in the NK_E2E_OUT environment variable.
 *
 * Run with: wp eval-file wp-content/plugins/noksha/tests/e2e/fixture.php
 * Remove with: wp eval-file wp-content/plugins/noksha/tests/e2e/teardown.php
 *
 * @package Noksha
 */

use Noksha\Pages\Repository as Pages;

if (!defined('ABSPATH')) {
    exit(1);
}

$out = getenv('NK_E2E_OUT');
if (!$out) {
    fwrite(STDERR, "Set NK_E2E_OUT to the JSON file to write.\n");
    exit(1);
}

// A shirt in two sizes, both for sale.
$shirt = new WC_Product_Variable();
$shirt->set_name('E2E Shirt');
$shirt->set_status('publish');
$size = new WC_Product_Attribute();
$size->set_name('Size');
$size->set_options(['S', 'L']);
$size->set_visible(true);
$size->set_variation(true);
$shirt->set_attributes([$size]);
$shirt_id = $shirt->save();
$variations = [];
foreach (['S' => ['500', 5], 'L' => ['650', 3]] as $label => [$price, $stock]) {
    $variation = new WC_Product_Variation();
    $variation->set_parent_id($shirt_id);
    $variation->set_attributes(['size' => $label]);
    $variation->set_regular_price($price);
    $variation->set_manage_stock(true);
    $variation->set_stock_quantity($stock);
    $variation->set_status('publish');
    $variations[$label] = $variation->save();
}
WC_Product_Variable::sync($shirt_id);

$addon = new WC_Product_Simple();
$addon->set_name('E2E Addon');
$addon->set_regular_price('200');
$addon->set_manage_stock(true);
$addon->set_stock_quantity(10);
$addon->set_status('publish');
$addon_id = $addon->save();

$coupon = new WC_Coupon();
$coupon->set_code('e2e10');
$coupon->set_discount_type('percent');
$coupon->set_amount(10);
$coupon_id = $coupon->save();

// A page that asks only for a name and a phone, so the browser test stays short.
$page_id = Pages::create('single', 'en', 'E2E landing');
$doc = Pages::payload($page_id);
$offer = $doc['offer'];
$offer['source'] = 'woocommerce';
$offer['productId'] = $shirt_id;
$offer['bump'] = ['enabled' => true, 'source' => 'woocommerce', 'productId' => $addon_id, 'checkedDefault' => false];
$checkout = $doc['checkout'];
foreach (['division', 'district', 'upazila', 'address'] as $field) {
    $checkout['fields'][$field] = ['enabled' => false, 'required' => false];
}
$checkout['payments'] = ['cod'];
$checkout['coupon'] = true;
Pages::update($page_id, ['status' => 'publish', 'slug' => 'e2e-noksha', 'offer' => $offer, 'checkout' => $checkout]);

// An administrator to open the editor with.
$login = 'nk_e2e';
$password = wp_generate_password(24, false);
$user = get_user_by('login', $login);
if ($user) {
    wp_set_password($password, $user->ID);
    $user_id = $user->ID;
} else {
    $user_id = wp_insert_user(['user_login' => $login, 'user_pass' => $password, 'user_email' => 'nk-e2e@example.invalid', 'role' => 'administrator']);
}

// Earlier runs may have used up the checkout and coupon limits for this address.
global $wpdb;
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '\\_transient\\_noksha\\_rl\\_%' OR option_name LIKE '\\_transient\\_timeout\\_noksha\\_rl\\_%'");

update_option('noksha_e2e_state', [
    'pageId' => $page_id,
    'productIds' => [$shirt_id, $addon_id],
    'couponId' => $coupon_id,
    'userId' => (int) $user_id,
], false);

file_put_contents($out, wp_json_encode([
    'pageId' => $page_id,
    'url' => get_permalink($page_id),
    'adminUrl' => admin_url('admin.php?page=noksha'),
    'loginUrl' => wp_login_url(),
    'shirtId' => $shirt_id,
    'variations' => $variations,
    'addonId' => $addon_id,
    'user' => $login,
    'password' => $password,
]));
echo "fixture ready\n";
