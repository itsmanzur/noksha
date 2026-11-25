<?php
/**
 * Creates the real WooCommerce order for a WooCommerce product sold on a
 * landing page, and keeps both orders' statuses in step.
 *
 * WooCommerce owns the items, totals and stock. The Noksha row stays as the
 * page-level record (risk, OTP, courier, COD, funnel) and points at the WC
 * order through `wc_order_id`.
 *
 * @package Noksha
 */

namespace Noksha\Orders;

use Noksha\Catalog\WcProduct;

final class WcBridge {
    /** True while one side is writing to the other, so the hooks do not echo. */
    private static bool $syncing = false;

    /** WooCommerce emails that a status change can send. */
    private const EMAIL_IDS = [
        'new_order',
        'cancelled_order',
        'failed_order',
        'customer_on_hold_order',
        'customer_processing_order',
        'customer_completed_order',
        'customer_refunded_order',
    ];

    /**
     * Turn WooCommerce's order emails off while Noksha moves an order, when the
     * store asked for that (Settings > General).
     */
    private static function mute_emails(): void {
        if (!empty(\Noksha\Options::settings()['woocommerce']['emails'])) {
            return;
        }
        foreach (self::EMAIL_IDS as $id) {
            add_filter('woocommerce_email_enabled_' . $id, '__return_false', 99);
        }
    }

    private static function unmute_emails(): void {
        foreach (self::EMAIL_IDS as $id) {
            remove_filter('woocommerce_email_enabled_' . $id, '__return_false', 99);
        }
    }

    public static function register_hooks(): void {
        if (!WcProduct::active()) {
            return;
        }
        add_action('noksha_order_status_changed', [self::class, 'push'], 20, 3);
        add_action('woocommerce_order_status_changed', [self::class, 'pull'], 20, 4);
    }

    /**
     * Declare compatibility with High-Performance Order Storage.
     */
    public static function declare_hpos_compat(): void {
        if (class_exists('\Automattic\WooCommerce\Utilities\FeaturesUtil')) {
            \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', NOKSHA_FILE, true);
        }
    }

    /**
     * Noksha status → WooCommerce status (without the "wc-" prefix).
     *
     * `shipped` stays "processing" unless a site registers a status for it
     * (filter `noksha_wc_shipped_status`), so WooCommerce's "completed" email
     * is not sent before the parcel arrives.
     */
    public static function wc_status_for(string $status): string {
        $shipped = (string) apply_filters('noksha_wc_shipped_status', 'processing');
        return match ($status) {
            'pending', 'no_answer' => 'on-hold',
            'awaiting_payment' => 'pending',
            'confirmed', 'paid' => 'processing',
            'shipped' => $shipped,
            'delivered' => 'completed',
            'returned' => 'refunded',
            'cancelled', 'fake' => 'cancelled',
            default => 'on-hold',
        };
    }

    /**
     * WooCommerce status → Noksha status, or '' when nothing should change.
     */
    public static function noksha_status_for(string $wc_status, string $current): string {
        $shipped = (string) apply_filters('noksha_wc_shipped_status', 'processing');
        if ($shipped !== 'processing' && $wc_status === $shipped) {
            return 'shipped';
        }
        return match ($wc_status) {
            'processing' => in_array($current, ['pending', 'no_answer', 'awaiting_payment'], true) ? 'confirmed' : '',
            'completed' => 'delivered',
            'cancelled', 'failed' => 'cancelled',
            'refunded' => 'returned',
            default => '',
        };
    }

    /**
     * Create the WooCommerce order for a Noksha order row.
     *
     * @param array<string, mixed>      $row   Noksha order row (already inserted).
     * @param array<string, mixed>      $offer Resolved offer (WcProduct::apply).
     * @param list<array{name:string,price:float,productId:int}> $bumps Paid add-ons chosen.
     * @param string                    $coupon WooCommerce coupon code, or ''.
     * @return array{id:int,discount:float,total:float}|\WP_Error
     */
    public static function create(array $row, array $offer, int $qty, array $bumps, string $method, string $coupon = '', float $tier = 0.0, array $rate = []) {
        if (!WcProduct::active()) {
            return new \WP_Error('noksha_wc_inactive', 'WooCommerce is not active.');
        }
        $buy_id = (int) ($offer['variationId'] ?? 0) ?: (int) ($offer['productId'] ?? 0);
        $product = wc_get_product($buy_id);
        if (!$product) {
            return new \WP_Error('noksha_out_of_stock', 'Product not found.');
        }

        self::$syncing = true;
        self::mute_emails();
        try {
            $order = wc_create_order([
                'status' => 'pending',
                'customer_note' => (string) ($row['customer_note'] ?? ''),
                'created_via' => 'noksha',
            ]);
            if (is_wp_error($order)) {
                return $order;
            }

            $line = (float) $offer['price'] * $qty;
            $order->add_product($product, $qty, ['subtotal' => $line, 'total' => $line]);

            foreach ($bumps as $bump) {
            $bump_product = (int) ($bump['productId'] ?? 0) > 0 ? wc_get_product((int) $bump['productId']) : null;
            if ($bump_product) {
                $order->add_product($bump_product, 1, ['subtotal' => (float) $bump['price'], 'total' => (float) $bump['price']]);
            } elseif ((float) $bump['price'] > 0) {
                $fee = new \WC_Order_Item_Fee();
                $fee->set_name((string) $bump['name']);
                $fee->set_amount((float) $bump['price']);
                $fee->set_total((float) $bump['price']);
                $fee->set_tax_status('none');
                $order->add_item($fee);
            }
            }

            $shipping = (float) ($row['shipping'] ?? 0);
            $ship_item = new \WC_Order_Item_Shipping();
            // A WooCommerce zone rate keeps its own name and id; otherwise it is the page's delivery charge.
            $rate_id = (string) ($rate['id'] ?? '');
            $ship_item->set_method_title((string) ($rate['label'] ?? '') !== '' ? (string) $rate['label'] : __('Delivery', 'noksha'));
            $ship_item->set_method_id($rate_id !== '' ? (string) strtok($rate_id, ':') : 'noksha_delivery');
            if ($rate_id !== '' && str_contains($rate_id, ':')) {
                $ship_item->set_instance_id((string) substr($rate_id, strpos($rate_id, ':') + 1));
            }
            $ship_item->set_total($shipping);
            $order->add_item($ship_item);

            if ($tier > 0) {
                $saving = new \WC_Order_Item_Fee();
                $saving->set_name(__('Quantity discount', 'noksha'));
                $saving->set_amount(-$tier);
                $saving->set_total(-$tier);
                $saving->set_tax_status('none');
                $order->add_item($saving);
            }

            $address = self::address($row);
            $order->set_address($address, 'billing');
            $order->set_address($address, 'shipping');

            $order->set_currency('BDT');
            $order->set_payment_method($method === 'cod' ? 'cod' : 'noksha_' . $method);
            $order->set_payment_method_title(self::method_title($method));
            if (($row['trx_id'] ?? '') !== '') {
                $order->set_transaction_id((string) $row['trx_id']);
            }

            $order->update_meta_data('_noksha_order_id', (int) $row['id']);
            $order->update_meta_data('_noksha_order_number', (string) $row['order_number']);
            $order->update_meta_data('_noksha_page_id', (int) $row['page_id']);
            $order->update_meta_data('_noksha_risk', (string) $row['risk']);
            $order->update_meta_data('_noksha_otp_verified', (int) $row['otp_verified']);
            $order->update_meta_data('_noksha_variant', (string) $row['variant']);
            $order->update_meta_data('_noksha_attribution', (string) ($row['attribution'] ?? ''));

            $order->calculate_totals(false);
            if ($coupon !== '') {
                // WooCommerce checks the coupon again on the real order (usage, dates, emails).
                $applied = $order->apply_coupon($coupon);
                if (is_wp_error($applied)) {
                    return new \WP_Error('noksha_coupon_invalid', wp_strip_all_tags($applied->get_error_message()));
                }
                $order->calculate_totals(false);
            }
            $order->set_status(self::wc_status_for((string) ($row['status'] ?? 'pending')));
            $order->add_order_note(sprintf(
                /* translators: %s: Noksha order number. */
                __('Placed on a Noksha landing page. Order %s.', 'noksha'),
                (string) $row['order_number']
            ));
            $order->save();

            // Hold the stock now, whatever the status, so two buyers cannot take the last unit.
            wc_reduce_stock_levels($order->get_id());

            return [
                'id' => $order->get_id(),
                'discount' => round((float) $order->get_discount_total(), 2),
                'total' => round((float) $order->get_total(), 2),
            ];
        } catch (\Throwable $error) {
            return new \WP_Error('noksha_wc_order_failed', $error->getMessage());
        } finally {
            self::unmute_emails();
            self::$syncing = false;
        }
    }

    /**
     * Noksha changed status → move the WooCommerce order.
     */
    public static function push(int $id, string $old, string $new): void {
        if (self::$syncing) {
            return;
        }
        $row = Repository::find($id);
        $wc_id = (int) ($row['wc_order_id'] ?? 0);
        if ($wc_id <= 0) {
            return;
        }
        $order = wc_get_order($wc_id);
        if (!$order) {
            return;
        }
        $target = self::wc_status_for($new);
        if ($order->get_status() === $target) {
            return;
        }
        self::$syncing = true;
        self::mute_emails();
        try {
            /**
             * Fires before the WooCommerce order follows a Noksha status change.
             * A store can copy the courier and tracking code onto the order here.
             *
             * @param \WC_Order            $order WooCommerce order.
             * @param array<string, mixed> $row   Noksha order row.
             * @param string               $new   New Noksha status.
             */
            do_action('noksha_wc_before_push', $order, $row, $new);
            $order->update_status($target, sprintf('Noksha: %s → %s. ', $old, $new));
            if ($new === 'paid' && !$order->get_date_paid()) {
                $order->set_date_paid(time());
                $order->save();
            }
            if (in_array($new, ['returned', 'fake'], true)) {
                wc_increase_stock_levels($order->get_id());
            }
        } finally {
            self::unmute_emails();
            self::$syncing = false;
        }
    }

    /**
     * WooCommerce changed status → move the Noksha order.
     *
     * @param \WC_Order $order
     */
    public static function pull(int $wc_id, string $from, string $to, $order): void {
        if (self::$syncing || !$order instanceof \WC_Order) {
            return;
        }
        $noksha_id = (int) $order->get_meta('_noksha_order_id');
        if ($noksha_id <= 0) {
            return;
        }
        $row = Repository::find($noksha_id);
        if (!$row) {
            return;
        }
        $target = self::noksha_status_for($to, (string) $row['status']);
        if ($target === '' || $target === $row['status']) {
            return;
        }
        self::$syncing = true;
        try {
            // Completing in WooCommerce means the parcel arrived. Noksha only allows
            // confirmed/paid → shipped → delivered, so take the shipped step first.
            if ($target === 'delivered' && in_array((string) $row['status'], ['confirmed', 'paid'], true)) {
                Repository::update($noksha_id, ['status' => 'shipped'], true, 'wc');
            }
            Repository::update($noksha_id, ['status' => $target], true, 'wc');
        } finally {
            self::$syncing = false;
        }
    }

    /**
     * Link for the Noksha order screen.
     */
    public static function edit_url(int $wc_id): string {
        if ($wc_id <= 0 || !WcProduct::active()) {
            return '';
        }
        $order = wc_get_order($wc_id);
        return $order ? html_entity_decode($order->get_edit_order_url()) : '';
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, string>
     */
    private static function address(array $row): array {
        $name = trim((string) $row['customer_name']);
        $parts = explode(' ', $name, 2);
        $district = (string) ($row['district_name'] ?? '');
        $upazila = (string) ($row['upazila_name'] ?? '');
        return [
            'first_name' => $parts[0],
            'last_name' => $parts[1] ?? '',
            'company' => '',
            'address_1' => (string) ($row['address'] ?? ''),
            'address_2' => $upazila,
            'city' => $district !== '' ? $district : $upazila,
            'state' => \Noksha\Region\WcStates::code((string) ($row['district_id'] ?? '')),
            'postcode' => '',
            'country' => 'BD',
            'email' => (string) ($row['email'] ?? ''),
            'phone' => (string) ($row['phone'] ?? ''),
        ];
    }

    private static function method_title(string $method): string {
        return match ($method) {
            'cod' => __('Cash on delivery', 'noksha'),
            'manual_bkash' => 'bKash',
            'manual_nagad' => 'Nagad',
            'sslcommerz' => 'SSLCommerz',
            default => $method,
        };
    }
}
