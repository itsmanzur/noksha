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

/**
 * A small coloured picture in the media library, so the gallery has real images.
 */
function nk_e2e_image(string $name, array $rgb): int {
    require_once ABSPATH . 'wp-admin/includes/image.php';
    $upload = wp_upload_dir();
    $path = trailingslashit($upload['path']) . $name . '.png';
    $image = imagecreatetruecolor(400, 400);
    imagefill($image, 0, 0, imagecolorallocate($image, $rgb[0], $rgb[1], $rgb[2]));
    imagepng($image, $path);
    $id = wp_insert_attachment(['post_mime_type' => 'image/png', 'post_title' => $name, 'post_status' => 'inherit'], $path);
    wp_update_attachment_metadata($id, wp_generate_attachment_metadata($id, $path));
    return (int) $id;
}

$images = [
    nk_e2e_image('nk-e2e-front', [200, 60, 60]),
    nk_e2e_image('nk-e2e-back', [60, 160, 80]),
    nk_e2e_image('nk-e2e-detail', [60, 90, 200]),
    nk_e2e_image('nk-e2e-variation', [230, 190, 40]),
];

// A shirt in two sizes, both for sale, with a description, a material, three pictures and reviews.
$shirt = new WC_Product_Variable();
$shirt->set_name('E2E Shirt');
$shirt->set_status('publish');
$shirt->set_short_description('A soft everyday shirt that keeps its shape wash after wash.');
$shirt->set_description('<p>Made from combed cotton.</p><ul><li>Soft combed cotton</li><li>Machine washable</li><li>Does not shrink</li></ul>');
$shirt->set_image_id($images[0]);
$shirt->set_gallery_image_ids([$images[1], $images[2]]);
$size = new WC_Product_Attribute();
$size->set_name('Size');
$size->set_options(['S', 'L']);
$size->set_visible(true);
$size->set_variation(true);
$material = new WC_Product_Attribute();
$material->set_name('Material');
$material->set_options(['Combed cotton']);
$material->set_visible(true);
$material->set_variation(false);
$shirt->set_attributes([$size, $material]);
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
    if ($label === 'L') {
        $variation->set_image_id($images[3]);
    }
    $variations[$label] = $variation->save();
}
WC_Product_Variable::sync($shirt_id);

// Reviews: two that count (one from a verified buyer), a 3-star one and one still waiting.
foreach ([
    ['Nasrin', 'Fits well and the cotton feels great.', 5, 1, true],
    ['Imran', 'Good shirt, delivery took two days.', 4, 1, false],
    ['Rupa', 'It is fine, nothing special.', 3, 1, false],
    ['Karim', 'Waiting for approval, should not show.', 5, 0, false],
] as [$author, $text, $stars, $approved, $verified]) {
    $comment_id = wp_insert_comment([
        'comment_post_ID' => $shirt_id,
        'comment_author' => $author,
        'comment_author_email' => strtolower($author) . '@example.invalid',
        'comment_content' => $text,
        'comment_type' => 'review',
        'comment_approved' => $approved,
    ]);
    update_comment_meta($comment_id, 'rating', $stars);
    if ($verified) {
        update_comment_meta($comment_id, 'verified', 1);
    }
}
WC_Comments::clear_transients($shirt_id);

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
$offer['bumps'] = [
    ['enabled' => true, 'source' => 'woocommerce', 'productId' => $addon_id, 'checkedDefault' => false],
    ['enabled' => true, 'source' => 'custom', 'name' => 'Gift wrap', 'price' => 30, 'checkedDefault' => false],
];
$checkout = $doc['checkout'];
foreach (['division', 'district', 'upazila', 'address'] as $field) {
    $checkout['fields'][$field] = ['enabled' => false, 'required' => false];
}
$offer['tiers'] = [['qty' => 2, 'discount' => 50], ['qty' => 3, 'discount' => 100]];
$offer['stockHint'] = true;
$offer['stockHintMax'] = 10;
$checkout['payments'] = ['cod'];
$checkout['coupon'] = true;
Pages::update($page_id, ['status' => 'publish', 'slug' => 'e2e-noksha', 'offer' => $offer, 'checkout' => $checkout]);

// A second page that asks for the district and takes delivery from WooCommerce zones (Auto).
$ship_page_id = Pages::create('single', 'en', 'E2E delivery');
$ship_doc = Pages::payload($ship_page_id);
$ship_offer = $ship_doc['offer'];
$ship_offer['source'] = 'woocommerce';
$ship_offer['productId'] = $shirt_id;
$ship_offer['shippingSource'] = 'auto';
$ship_checkout = $ship_doc['checkout'];
foreach (['upazila', 'address'] as $field) {
    $ship_checkout['fields'][$field] = ['enabled' => false, 'required' => false];
}
$ship_checkout['payments'] = ['cod'];
Pages::update($ship_page_id, ['status' => 'publish', 'slug' => 'e2e-noksha-ship', 'offer' => $ship_offer, 'checkout' => $ship_checkout]);
$districts = [];
foreach (Noksha\Region\Geo::data()['divisions'] as $division) {
    foreach ($division['districts'] as $district) {
        if (in_array($district['en'], ['Dhaka', 'Gazipur', 'Sylhet'], true)) {
            $districts[strtolower($district['en'])] = ['division' => (string) $division['id'], 'district' => (string) $district['id']];
        }
    }
}

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
    'shipPageId' => $ship_page_id,
    'attachmentIds' => $images,
], false);

file_put_contents($out, wp_json_encode([
    'pageId' => $page_id,
    'url' => get_permalink($page_id),
    'adminUrl' => admin_url('admin.php?page=noksha'),
    'loginUrl' => wp_login_url(),
    'shirtId' => $shirt_id,
    'shipPageId' => $ship_page_id,
    'shipUrl' => get_permalink($ship_page_id),
    'districts' => $districts,
    'variations' => $variations,
    'addonId' => $addon_id,
    'user' => $login,
    'password' => $password,
]));
echo "fixture ready\n";
