<?php
/**
 * Admin and public REST routes.
 *
 * @package Noksha
 */

namespace Noksha\Rest;

use Noksha\Admin\Prefs;
use Noksha\Analytics\Tracker;
use Noksha\Brand\Tokens;
use Noksha\Caps;
use Noksha\Fraud\Blacklist;
use Noksha\I18n\Locale;
use Noksha\Leads\Repository as Leads;
use Noksha\Options;
use Noksha\Orders\Checkout;
use Noksha\Orders\Repository as Orders;
use Noksha\Pages\PostType;
use Noksha\Pages\Renderer;
use Noksha\Pages\Repository as Pages;
use Noksha\Pages\Sanitizer;
use Noksha\Payments\SslCommerzGateway;
use Noksha\Region\Geo;
use Noksha\Region\Phone;
use Noksha\Payments\WalletVerifier;
use Noksha\Shipping\Manager as Shipping;
use Noksha\Shipping\Webhooks;
use Noksha\Support\RateLimit;

final class Controller {
    public function register(): void {
        add_action('rest_api_init', [$this, 'routes']);
    }

    public function routes(): void {
        $admin = [
            'permission_callback' => [$this, 'can_manage'],
        ];
        $public = [
            'permission_callback' => '__return_true',
        ];

        register_rest_route('noksha/v1', '/locale', [
            'methods' => 'POST',
            'callback' => [$this, 'locale'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/prefs', [
            ['methods' => 'GET', 'callback' => [$this, 'get_prefs']] + $admin,
            ['methods' => 'PUT', 'callback' => [$this, 'put_prefs']] + $admin,
        ]);
        register_rest_route('noksha/v1', '/shell', [
            'methods' => 'GET',
            'callback' => [$this, 'get_shell'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/settings', [
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_settings'],
                'permission_callback' => [$this, 'can_manage'],
            ],
            [
                'methods' => 'PUT',
                'callback' => [$this, 'put_settings'],
                'permission_callback' => [$this, 'can_settings'],
            ],
        ]);
        register_rest_route('noksha/v1', '/brand', [
            ['methods' => 'GET', 'callback' => [$this, 'get_brand']] + $admin,
            ['methods' => 'PUT', 'callback' => [$this, 'put_brand']] + $admin,
        ]);
        register_rest_route('noksha/v1', '/pages', [
            ['methods' => 'GET', 'callback' => [$this, 'list_pages']] + $admin,
            ['methods' => 'POST', 'callback' => [$this, 'create_page']] + $admin,
        ]);
        register_rest_route('noksha/v1', '/pages/(?P<id>\d+)', [
            ['methods' => 'GET', 'callback' => [$this, 'get_page']] + $admin,
            ['methods' => 'PUT', 'callback' => [$this, 'put_page']] + $admin,
            ['methods' => 'DELETE', 'callback' => [$this, 'delete_page']] + $admin,
        ]);
        register_rest_route('noksha/v1', '/wc-products', [
            ['methods' => 'GET', 'callback' => [$this, 'wc_products']] + $admin,
        ]);
        register_rest_route('noksha/v1', '/wc-products/(?P<id>\d+)/suggestions', [
            ['methods' => 'GET', 'callback' => [$this, 'wc_suggestions']] + $admin,
        ]);
        register_rest_route('noksha/v1', '/preview', [
            'methods' => 'POST',
            'callback' => [$this, 'preview'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/orders', [
            'methods' => 'GET',
            'callback' => [$this, 'list_orders'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/orders/counts', [
            'methods' => 'GET',
            'callback' => [$this, 'order_counts'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/orders/export', [
            'methods' => 'GET',
            'callback' => [$this, 'export_orders'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/orders/bulk', [
            'methods' => 'POST',
            'callback' => [$this, 'bulk_orders'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/orders/(?P<id>\d+)', [
            ['methods' => 'GET', 'callback' => [$this, 'get_order']] + $admin,
            ['methods' => 'PUT', 'callback' => [$this, 'put_order']] + $admin,
        ]);
        register_rest_route('noksha/v1', '/orders/(?P<id>\d+)/confirm-trx', [
            'methods' => 'POST',
            'callback' => [$this, 'confirm_trx'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/orders/(?P<id>\d+)/reject-trx', [
            'methods' => 'POST',
            'callback' => [$this, 'reject_trx'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/orders/(?P<id>\d+)/ship', [
            'methods' => 'POST',
            'callback' => [$this, 'ship_order'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/orders/(?P<id>\d+)/print', [
            'methods' => 'GET',
            'callback' => [$this, 'print_order'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/orders/(?P<id>\d+)/settle-cod', [
            'methods' => 'POST',
            'callback' => [$this, 'settle_cod'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/orders/(?P<id>\d+)/verify-trx', [
            'methods' => 'POST',
            'callback' => [$this, 'verify_trx'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/webhooks/(?P<courier>steadfast|pathao|redx)', [
            'methods' => 'POST',
            'callback' => [$this, 'courier_webhook'],
        ] + $public);
        register_rest_route('noksha/v1', '/live', [
            'methods' => 'GET',
            'callback' => [$this, 'live'],
        ] + $public);
        register_rest_route('noksha/v1', '/coupon', [
            'methods' => 'POST',
            'callback' => [$this, 'coupon'],
        ] + $public);
        register_rest_route('noksha/v1', '/otp/send', [
            'methods' => 'POST',
            'callback' => [$this, 'send_otp'],
        ] + $public);
        register_rest_route('noksha/v1', '/leads', [
            'methods' => 'GET',
            'callback' => [$this, 'list_leads'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/leads/capture', [
            'methods' => 'POST',
            'callback' => [$this, 'capture_lead'],
        ] + $public);
        register_rest_route('noksha/v1', '/blacklist', [
            ['methods' => 'GET', 'callback' => [$this, 'list_blacklist']] + $admin,
            ['methods' => 'POST', 'callback' => [$this, 'add_blacklist']] + $admin,
            ['methods' => 'DELETE', 'callback' => [$this, 'remove_blacklist']] + $admin,
        ]);
        register_rest_route('noksha/v1', '/onboarding', [
            ['methods' => 'GET', 'callback' => [$this, 'get_onboarding']] + $admin,
            ['methods' => 'PUT', 'callback' => [$this, 'put_onboarding']] + $admin,
        ]);
        register_rest_route('noksha/v1', '/analytics', [
            'methods' => 'GET',
            'callback' => [$this, 'analytics'],
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/geo', [
            'methods' => 'GET',
            'callback' => static function () {
                return Geo::data();
            },
            'permission_callback' => [$this, 'can_manage'],
        ]);
        register_rest_route('noksha/v1', '/events', [
            'methods' => 'POST',
            'callback' => [$this, 'event'],
        ] + $public);
        register_rest_route('noksha/v1', '/nonce', [
            'methods' => 'GET',
            'callback' => [$this, 'public_nonce'],
        ] + $public);
        register_rest_route('noksha/v1', '/checkout', [
            'methods' => 'POST',
            'callback' => [$this, 'checkout'],
        ] + $public);
        register_rest_route('noksha/v1', '/sslcommerz/return', [
            'methods' => ['GET', 'POST'],
            'callback' => [$this, 'ssl_return'],
        ] + $public);
        register_rest_route('noksha/v1', '/sslcommerz/ipn', [
            'methods' => 'POST',
            'callback' => [$this, 'ssl_ipn'],
        ] + $public);
    }

    public function can_manage(): bool {
        return Caps::can_manage();
    }

    public function can_settings(): bool {
        return Caps::can_settings();
    }

    public function locale(\WP_REST_Request $request): array {
        $locale = $request->get_param('locale') === 'bn' ? 'bn' : 'en';
        Locale::persist($locale);
        return ['locale' => $locale];
    }

    public function get_prefs(): array {
        return ['theme' => Prefs::theme()];
    }

    public function put_prefs(\WP_REST_Request $request): array {
        $params = $this->params($request);
        $theme = Prefs::persist_theme((string) ($params['theme'] ?? Prefs::theme()));
        return ['theme' => $theme];
    }

    public function get_shell(): array {
        return Prefs::shell_counts();
    }

    public function get_settings(): array {
        return Options::public_settings();
    }

    public function put_settings(\WP_REST_Request $request): array {
        $params = $request->get_json_params();
        return Options::update_settings(is_array($params) ? $params : []);
    }

    public function get_brand(): array {
        return [
            'tokens' => Tokens::current(),
            'presets' => Tokens::presets(),
            'fonts' => $this->fonts(),
        ];
    }

    public function put_brand(\WP_REST_Request $request): array {
        $params = $request->get_json_params();
        $tokens = Tokens::save(is_array($params) ? $params : []);
        return ['tokens' => $tokens];
    }

    public function list_pages(\WP_REST_Request $request): array {
        $page = max(1, (int) $request->get_param('page'));
        $per_page = max(1, min(100, (int) ($request->get_param('per_page') ?: 50)));
        $query = new \WP_Query([
            'post_type' => PostType::TYPE,
            'post_status' => ['publish', 'draft'],
            'posts_per_page' => $per_page,
            'paged' => $page,
            'orderby' => 'modified',
            'order' => 'DESC',
        ]);
        $posts = $query->posts;
        $ids = array_map(static fn ($post) => (int) $post->ID, $posts);
        $counts = Tracker::page_counts($ids);
        $pages = [];
        foreach ($posts as $post) {
            $stats = $counts[(int) $post->ID] ?? ['visits' => 0, 'orders' => 0, 'buyers' => 0];
            $visits = $stats['visits'];
            $orders = $stats['orders'];
            $pages[] = [
                'id' => (int) $post->ID,
                'title' => $post->post_title,
                'status' => $post->post_status === 'publish' ? 'publish' : 'draft',
                'link' => $post->post_status === 'publish' ? get_permalink($post) : '',
                'visits' => $visits,
                'orders' => $orders,
                'conversion' => $visits > 0 ? round(((int) $stats['buyers']) / $visits * 100, 1) : 0,
                'updatedAt' => get_post_modified_time('c', true, $post),
            ];
        }
        $total = (int) $query->found_posts;
        return [
            'pages' => $pages,
            'total' => $total,
            'page' => $page,
            'perPage' => $per_page,
            'totalPages' => max(1, (int) ceil($total / $per_page)),
        ];
    }

    public function create_page(\WP_REST_Request $request) {
        $template = sanitize_key((string) $request->get_param('template'));
        $lang = $request->get_param('language') === 'bn' ? 'bn' : 'en';
        $title = sanitize_text_field((string) $request->get_param('title'));
        $id = Pages::create($template, $lang, $title);
        if (is_wp_error($id)) {
            return $id;
        }
        return Pages::payload($id);
    }

    public function get_page(\WP_REST_Request $request) {
        return Pages::payload((int) $request['id']);
    }

    public function put_page(\WP_REST_Request $request) {
        $params = $request->get_json_params();
        return Pages::update((int) $request['id'], is_array($params) ? $params : []);
    }

    public function delete_page(\WP_REST_Request $request): array|\WP_Error {
        $post = get_post((int) $request['id']);
        if (!$post || $post->post_type !== PostType::TYPE) {
            return new \WP_Error('noksha_not_found', 'Page not found.', ['status' => 404]);
        }
        wp_delete_post($post->ID, true);
        return ['deleted' => true];
    }

    public function wc_suggestions(\WP_REST_Request $request) {
        return \Noksha\Catalog\WcSuggest::for_product((int) $request['id']);
    }

    public function wc_products(\WP_REST_Request $request): array {
        $active = \Noksha\Catalog\WcProduct::active();
        return [
            'active' => $active,
            'products' => $active
                ? \Noksha\Catalog\WcProduct::search(sanitize_text_field((string) $request->get_param('q')), 20, !empty($request->get_param('simple')))
                : [],
        ];
    }

    public function preview(\WP_REST_Request $request): array {
        $params = $request->get_json_params();
        $params = is_array($params) ? $params : [];
        $doc = Sanitizer::document($params);
        $doc['offer'] = \Noksha\Catalog\WcProduct::apply($doc['offer']);
        $doc['id'] = (int) ($params['id'] ?? 0);
        $doc['title'] = sanitize_text_field((string) ($params['title'] ?? ''));
        return ['html' => Renderer::document($doc, true)];
    }

    public function list_orders(\WP_REST_Request $request): array {
        return Orders::query([
            'search' => sanitize_text_field((string) $request->get_param('search')),
            'status' => sanitize_key((string) $request->get_param('status')),
            'page' => (int) $request->get_param('page'),
            'per_page' => (int) ($request->get_param('per_page') ?: 50),
            'from' => sanitize_text_field((string) $request->get_param('from')),
            'to' => sanitize_text_field((string) $request->get_param('to')),
            'payment_method' => sanitize_key((string) $request->get_param('payment_method')),
        ]);
    }

    public function order_counts(\WP_REST_Request $request): array {
        return Orders::counts([
            'search' => sanitize_text_field((string) $request->get_param('search')),
            'from' => sanitize_text_field((string) $request->get_param('from')),
            'to' => sanitize_text_field((string) $request->get_param('to')),
            'payment_method' => sanitize_key((string) $request->get_param('payment_method')),
        ]);
    }

    public function get_order(\WP_REST_Request $request) {
        $order = Orders::find((int) $request['id']);
        if (!$order) {
            return new \WP_Error('noksha_not_found', 'Order not found.', ['status' => 404]);
        }
        return Orders::detail($order);
    }

    public function put_order(\WP_REST_Request $request) {
        $order = Orders::find((int) $request['id']);
        if (!$order) {
            return new \WP_Error('noksha_not_found', 'Order not found.', ['status' => 404]);
        }
        $params = $this->params($request);
        $fields = [];
        $status = sanitize_key((string) ($params['status'] ?? $request->get_param('status') ?? ''));
        if ($status !== '') {
            if (!in_array($status, Orders::STATUSES, true)) {
                return new \WP_Error('noksha_invalid_status', 'Unknown status.', ['status' => 400]);
            }
            if (!Orders::can_transition((string) $order['status'], $status)) {
                return new \WP_Error('noksha_bad_transition', 'That status change is not allowed.', ['status' => 400]);
            }
            $fields['status'] = $status;
        }
        if (array_key_exists('collect_amount', $params) || $request->has_param('collect_amount')) {
            $collect = round((float) ($params['collect_amount'] ?? $request->get_param('collect_amount')), 2);
            if ($collect < 0 || $collect > (float) $order['total']) {
                return new \WP_Error('noksha_invalid_collect', 'Collect amount must be between 0 and the order total.', ['status' => 400]);
            }
            $fields['collect_amount'] = $collect;
        }
        $customer_in = [];
        foreach ([
            'name' => 'customer_name',
            'customer_name' => 'customer_name',
            'phone' => 'phone',
            'email' => 'email',
            'address' => 'address',
            'divisionId' => 'division_id',
            'division_id' => 'division_id',
            'districtId' => 'district_id',
            'district_id' => 'district_id',
            'upazilaId' => 'upazila_id',
            'upazila_id' => 'upazila_id',
            'division' => 'division_name',
            'division_name' => 'division_name',
            'district' => 'district_name',
            'district_name' => 'district_name',
            'upazila' => 'upazila_name',
            'upazila_name' => 'upazila_name',
        ] as $in => $out) {
            if (array_key_exists($in, $params)) {
                $customer_in[$out] = $params[$in];
            }
        }
        if ($customer_in !== []) {
            $customer = Orders::validate_customer_fields($customer_in);
            if (is_wp_error($customer)) {
                return $customer;
            }
            $fields = array_merge($fields, $customer);
        }
        if (array_key_exists('note', $params) && is_string($params['note']) && trim($params['note']) !== '') {
            Orders::add_note((int) $order['id'], sanitize_textarea_field($params['note']));
        }
        if ($fields === [] && !array_key_exists('note', $params)) {
            return new \WP_Error('noksha_empty', 'Nothing to update.', ['status' => 400]);
        }
        if ($fields !== []) {
            $changed = [];
            foreach ($fields as $key => $value) {
                if ((string) ($order[$key] ?? '') !== (string) $value) {
                    $changed[$key] = true;
                }
            }
            Orders::update((int) $order['id'], $fields);
            if ($customer_in !== [] && $changed !== []) {
                $bits = [];
                foreach (array_keys($customer_in) as $key) {
                    if (isset($changed[$key])) {
                        $bits[] = $key;
                    }
                }
                if ($bits !== []) {
                    Orders::add_note((int) $order['id'], 'Customer updated: ' . implode(', ', $bits));
                }
            }
        }
        return Orders::detail(Orders::find((int) $order['id']));
    }

    public function confirm_trx(\WP_REST_Request $request) {
        $order = Orders::find((int) $request['id']);
        if (!$order) {
            return new \WP_Error('noksha_not_found', 'Order not found.', ['status' => 404]);
        }
        if (!in_array($order['payment_method'], ['manual_bkash', 'manual_nagad'], true) || $order['trx_id'] === '') {
            return new \WP_Error('noksha_trx_required', 'This order has no TrxID to confirm.', ['status' => 400]);
        }
        if (Orders::trx_exists($order['trx_id'], (int) $order['id'])) {
            return new \WP_Error('noksha_trx_duplicate', 'This TrxID is already used on another order.', ['status' => 409]);
        }
        // Wallet already paid in full by default — courier must not collect the total again.
        $collect = $request->has_param('collect_amount')
            ? round((float) $request->get_param('collect_amount'), 2)
            : 0.0;
        if ($collect < 0 || $collect > (float) $order['total']) {
            return new \WP_Error('noksha_invalid_collect', 'Collect amount must be between 0 and the order total.', ['status' => 400]);
        }
        Orders::update((int) $order['id'], [
            'status' => 'paid',
            'trx_verified' => 1,
            'collect_amount' => $collect,
        ]);
        Orders::update_payment((int) $order['id'], [
            'status' => 'paid',
            'transaction_id' => $order['trx_id'],
        ]);
        return Orders::detail(Orders::find((int) $order['id']));
    }

    public function reject_trx(\WP_REST_Request $request) {
        $order = Orders::find((int) $request['id']);
        if (!$order) {
            return new \WP_Error('noksha_not_found', 'Order not found.', ['status' => 404]);
        }
        if (!in_array($order['payment_method'], ['manual_bkash', 'manual_nagad'], true) || $order['trx_id'] === '') {
            return new \WP_Error('noksha_trx_required', 'This order has no TrxID to reject.', ['status' => 400]);
        }
        Orders::update((int) $order['id'], [
            'status' => 'cancelled',
            'trx_verified' => 0,
        ]);
        Orders::update_payment((int) $order['id'], [
            'status' => 'failed',
        ]);
        return Orders::detail(Orders::find((int) $order['id']));
    }

    public function bulk_orders(\WP_REST_Request $request) {
        $params = $this->params($request);
        $ids = is_array($params['ids'] ?? null) ? $params['ids'] : [];
        $status = sanitize_key((string) ($params['status'] ?? ''));
        if (!in_array($status, Orders::STATUSES, true)) {
            return new \WP_Error('noksha_invalid_status', 'Unknown status.', ['status' => 400]);
        }
        $updated = Orders::bulk_status($ids, $status);
        return ['ok' => true, 'updated' => $updated];
    }

    public function public_nonce(): array {
        return [
            'nonce' => wp_create_nonce('noksha_public'),
            'createdAt' => time(),
        ];
    }

    public function export_orders(\WP_REST_Request $request) {
        $rows = Orders::export_rows([
            'search' => sanitize_text_field((string) $request->get_param('search')),
            'status' => sanitize_key((string) $request->get_param('status')),
            'from' => sanitize_text_field((string) $request->get_param('from')),
            'to' => sanitize_text_field((string) $request->get_param('to')),
            'payment_method' => sanitize_key((string) $request->get_param('payment_method')),
            'limit' => 5000,
        ]);
        $lines = [];
        $lines[] = 'order_number,status,name,phone,email,division,district,upazila,address,method,trx_id,trx_verified,subtotal,shipping,total,collect_amount,utm_source,utm_medium,utm_campaign,fbclid,ttclid,created_at';
        foreach ($rows as $row) {
            $attr = Orders::decode_attribution($row['attribution'] ?? '');
            $lines[] = self::csv_line([
                $row['order_number'],
                $row['status'],
                $row['customer_name'],
                $row['phone'],
                $row['email'],
                $row['division_name'],
                $row['district_name'],
                $row['upazila_name'],
                (string) $row['address'],
                $row['payment_method'],
                $row['trx_id'],
                (int) $row['trx_verified'],
                $row['subtotal'],
                $row['shipping'],
                $row['total'],
                $row['collect_amount'] ?? $row['total'],
                $attr['utm_source'] ?? '',
                $attr['utm_medium'] ?? '',
                $attr['utm_campaign'] ?? '',
                $attr['fbclid'] ?? '',
                $attr['ttclid'] ?? '',
                $row['created_at'],
            ]);
        }
        // UTF-8 BOM so Excel opens Bangla correctly.
        return [
            'filename' => 'noksha-orders.csv',
            'csv' => "\xEF\xBB\xBF" . implode("\n", $lines),
        ];
    }

    public function get_onboarding(): array {
        return Options::onboarding();
    }

    public function put_onboarding(\WP_REST_Request $request): array {
        return Options::update_onboarding($this->params($request));
    }

    public function ship_order(\WP_REST_Request $request) {
        $params = $this->params($request);
        $courier = sanitize_key((string) ($params['courier'] ?? ''));
        $force = !empty($params['force']);
        return (new Shipping())->book((int) $request['id'], $courier, $force);
    }

    public function print_order(\WP_REST_Request $request) {
        $ids = [(int) $request['id']];
        $extra = $request->get_param('ids');
        if (is_array($extra)) {
            foreach ($extra as $id) {
                $ids[] = (int) $id;
            }
        } elseif (is_string($extra) && $extra !== '') {
            foreach (explode(',', $extra) as $part) {
                $ids[] = (int) trim($part);
            }
        }
        $ids = array_values(array_unique(array_filter($ids, static fn (int $id): bool => $id > 0)));

        $details = [];
        foreach ($ids as $id) {
            $order = Orders::find($id);
            if (!$order) {
                continue;
            }
            $details[] = Orders::detail($order);
        }
        if ($details === []) {
            return new \WP_Error('noksha_not_found', 'Order not found.', ['status' => 404]);
        }

        $layout = sanitize_key((string) ($request->get_param('layout') ?: 'a4'));
        if (!in_array($layout, ['a4', 'labels'], true)) {
            $layout = 'a4';
        }

        ob_start();
        if (count($details) === 1) {
            $noksha_order = $details[0];
        } else {
            $noksha_orders = $details;
        }
        $noksha_layout = $layout;
        include NOKSHA_DIR . 'templates/packing-slip.php';
        $html = (string) ob_get_clean();
        return ['html' => $html];
    }

    public function list_leads(\WP_REST_Request $request): array {
        return Leads::query([
            'page' => (int) $request->get_param('page'),
            'per_page' => (int) ($request->get_param('per_page') ?: 50),
        ]);
    }

    public function capture_lead(\WP_REST_Request $request) {
        if ($this->limited('lead', 40)) {
            return new \WP_Error('noksha_rate', 'Too many requests.', ['status' => 429]);
        }
        $params = $this->params($request);
        if (!wp_verify_nonce((string) ($params['nonce'] ?? ''), 'noksha_public')) {
            return new \WP_Error('noksha_nonce', 'The form expired.', ['status' => 403]);
        }
        $page_id = (int) ($params['page_id'] ?? 0);
        $post = get_post($page_id);
        if (!$post || $post->post_type !== PostType::TYPE || $post->post_status !== 'publish') {
            return new \WP_Error('noksha_not_found', 'Page not found.', ['status' => 404]);
        }
        $phone = Phone::normalize((string) ($params['phone'] ?? ''));
        if (Phone::error($phone) || Blacklist::has($phone)) {
            return ['ok' => true];
        }
        $session = preg_replace('/[^A-Za-z0-9_-]/', '', (string) ($params['session_id'] ?? '')) ?? '';
        $name = sanitize_text_field((string) ($params['name'] ?? ''));
        Leads::capture($page_id, $phone, $session, $name);
        return ['ok' => true];
    }

    public function list_blacklist(): array {
        return ['phones' => Blacklist::all()];
    }

    public function add_blacklist(\WP_REST_Request $request) {
        $params = $this->params($request);
        $result = Blacklist::add((string) ($params['phone'] ?? ''), (string) ($params['note'] ?? ''));
        if (is_wp_error($result)) {
            return $result;
        }
        return ['phones' => $result];
    }

    public function remove_blacklist(\WP_REST_Request $request) {
        $phone = (string) ($request->get_param('phone') ?? '');
        if ($phone === '') {
            $params = $this->params($request);
            $phone = (string) ($params['phone'] ?? '');
        }
        return ['phones' => Blacklist::remove($phone)];
    }

    private static function csv_line(array $fields): string {
        $out = [];
        foreach ($fields as $field) {
            $value = (string) $field;
            // Formula injection guard for Excel/Sheets.
            if ($value !== '' && preg_match('/^[=+\-@\t\r]/', $value)) {
                $value = "'" . $value;
            }
            if (str_contains($value, '"') || str_contains($value, ',') || str_contains($value, "\n")) {
                $value = '"' . str_replace('"', '""', $value) . '"';
            }
            $out[] = $value;
        }
        return implode(',', $out);
    }

    public function analytics(\WP_REST_Request $request): array {
        $range = (int) $request->get_param('range');
        return Tracker::report($range);
    }

    public function event(\WP_REST_Request $request) {
        if (RateLimit::hit('event')) {
            return new \WP_Error('noksha_rate', 'Too many events.', ['status' => 429]);
        }
        $params = $this->params($request);
        if (!wp_verify_nonce((string) ($params['nonce'] ?? ''), 'noksha_public')) {
            return new \WP_Error('noksha_nonce', 'The form expired.', ['status' => 403]);
        }
        $event = sanitize_key((string) ($params['event'] ?? ''));
        if (!in_array($event, ['page_view', 'checkout_start'], true)) {
            return new \WP_Error('noksha_event', 'Unknown event.', ['status' => 400]);
        }
        $page_id = (int) ($params['page_id'] ?? 0);
        $post = get_post($page_id);
        if (!$post || $post->post_type !== PostType::TYPE) {
            return new \WP_Error('noksha_not_found', 'Page not found.', ['status' => 404]);
        }
        $session = preg_replace('/[^A-Za-z0-9_-]/', '', (string) ($params['session_id'] ?? '')) ?? '';
        if (strlen($session) < 8) {
            return ['ok' => true];
        }
        $variant = strtolower((string) ($params['variant'] ?? ''));
        $variant = in_array($variant, ['a', 'b'], true) ? $variant : '';
        Tracker::record($page_id, $event, $session, $variant);
        return ['ok' => true];
    }

    /**
     * Live price and stock for a landing page. A page cache can serve old HTML;
     * the page asks this once on load and corrects itself. Never cached.
     */
    public function live(\WP_REST_Request $request) {
        if (RateLimit::hit('live', 240)) {
            return new \WP_Error('noksha_rate', 'Too many requests.', ['status' => 429]);
        }
        $page_id = (int) $request->get_param('page_id');
        $post = get_post($page_id);
        if (!$post || $post->post_type !== \Noksha\Pages\PostType::TYPE || $post->post_status !== 'publish') {
            return new \WP_Error('noksha_page_closed', 'This page is not taking orders.', ['status' => 404]);
        }
        $offer = Pages::document($page_id)['offer'];
        $data = ['source' => 'custom', 'tiers' => $offer['tiers'] ?? []];
        if (\Noksha\Catalog\WcProduct::is_wc_offer($offer)) {
            $wc = is_array($offer['wc'] ?? null) ? $offer['wc'] : [];
            $data = [
                'source' => 'woocommerce',
                'tiers' => $offer['tiers'] ?? [],
                'price' => (float) $offer['price'],
                'compareAt' => (float) $offer['compareAt'],
                'variationId' => (int) $offer['variationId'],
                'available' => !empty($wc['available']),
                'stock' => $wc['stock'] ?? null,
                'backorders' => !empty($wc['backorders']),
                'variations' => array_map(static function (array $row): array {
                    return [
                        'id' => (int) $row['id'],
                        'price' => (float) $row['price'],
                        'regularPrice' => (float) $row['regularPrice'],
                        'stock' => $row['stock'],
                        'inStock' => !empty($row['inStock']),
                    ];
                }, is_array($wc['variations'] ?? null) ? $wc['variations'] : []),
                'bumps' => array_map(static function ($bump): array {
                    return ['enabled' => !empty($bump['enabled']), 'price' => (float) ($bump['price'] ?? 0)];
                }, is_array($offer['bumps'] ?? null) ? $offer['bumps'] : []),
            ];
        }
        $response = new \WP_REST_Response($data);
        $response->header('Cache-Control', 'no-store, max-age=0');
        return $response;
    }

    /**
     * What a coupon would take off, for the page's order summary. Saves nothing.
     */
    public function coupon(\WP_REST_Request $request) {
        if (RateLimit::hit('coupon', 30)) {
            return new \WP_Error('noksha_rate', 'Too many attempts.', ['status' => 429]);
        }
        $params = $this->params($request);
        if (!wp_verify_nonce((string) ($params['nonce'] ?? ''), 'noksha_public')) {
            return new \WP_Error('noksha_nonce', 'The form expired.', ['status' => 403]);
        }
        $page_id = (int) ($params['page_id'] ?? 0);
        $post = get_post($page_id);
        if (!$post || $post->post_type !== \Noksha\Pages\PostType::TYPE || $post->post_status !== 'publish') {
            return new \WP_Error('noksha_page_closed', 'This page is not taking orders.', ['status' => 409]);
        }
        $doc = Pages::document($page_id);
        $lang = $doc['language'];
        if (!\Noksha\Catalog\WcCoupon::enabled_for($doc)) {
            return new \WP_Error('noksha_coupon_invalid', \Noksha\I18n\Catalog::line($lang, 'coupon_invalid'), ['status' => 400]);
        }
        $offer = \Noksha\Catalog\WcProduct::apply($doc['offer'], max(0, (int) ($params['variation_id'] ?? 0)));
        $qty = max(1, min(10, (int) ($params['qty'] ?? 1)));
        $indexes = array_column(\Noksha\Orders\Pricing::chosen_bumps($offer, $params), 'index');
        $result = \Noksha\Catalog\WcCoupon::preview($offer, $qty, $indexes, (string) ($params['code'] ?? ''));
        if (is_wp_error($result)) {
            $message = $result->get_error_message();
            return new \WP_Error('noksha_coupon_invalid', $message !== '' ? $message : \Noksha\I18n\Catalog::line($lang, 'coupon_invalid'), ['status' => 400]);
        }
        return ['ok' => true, 'discount' => $result['discount'], 'code' => $result['code']];
    }

    public function send_otp(\WP_REST_Request $request) {
        if (RateLimit::hit('otp')) {
            return new \WP_Error('noksha_rate', 'Too many OTP requests.', ['status' => 429]);
        }
        $params = $this->params($request);
        if (!wp_verify_nonce((string) ($params['nonce'] ?? ''), 'noksha_public')) {
            return new \WP_Error('noksha_nonce', 'The form expired.', ['status' => 403]);
        }
        $lang = ($params['lang'] ?? '') === 'bn' ? 'bn' : 'en';
        return \Noksha\Notify\Otp::send((string) ($params['phone'] ?? ''), $lang);
    }

    public function verify_trx(\WP_REST_Request $request) {
        $result = WalletVerifier::verify_order((int) $request['id']);
        if (empty($result['ok'])) {
            return new \WP_Error('noksha_verify_failed', (string) ($result['message'] ?? 'Verify failed.'), ['status' => 400]);
        }
        $order = Orders::find((int) $request['id']);
        if (!$order) {
            return new \WP_Error('noksha_not_found', 'Order not found.', ['status' => 404]);
        }
        $detail = Orders::detail($order);
        $detail['verify'] = $result;
        return $detail;
    }

    public function courier_webhook(\WP_REST_Request $request) {
        return Webhooks::handle((string) $request['courier'], $request);
    }

    public function settle_cod(\WP_REST_Request $request) {
        $order = Orders::find((int) $request['id']);
        if (!$order) {
            return new \WP_Error('noksha_not_found', 'Order not found.', ['status' => 404]);
        }
        if (($order['payment_method'] ?? '') !== 'cod') {
            return new \WP_Error('noksha_not_cod', 'Only COD orders can be settled.', ['status' => 400]);
        }
        $params = $this->params($request);
        $expected = (float) ($order['collect_amount'] ?? $order['total']);
        $received = $request->has_param('received') || array_key_exists('received', $params)
            ? round((float) ($params['received'] ?? $request->get_param('received')), 2)
            : $expected;
        if ($received < 0 || $received > ((float) $order['total'] + 1)) {
            return new \WP_Error('noksha_invalid_collect', 'Received amount looks invalid.', ['status' => 400]);
        }
        $short = max(0, round($expected - $received, 2));
        $fields = [
            'cod_received' => $received,
            'cod_settled' => 1,
            'cod_settled_at' => current_time('mysql'),
            'cod_short' => $short,
            'collect_amount' => $received,
        ];
        // Never flip a returned order back to delivered.
        if (($order['status'] ?? '') !== 'returned' && !in_array($order['status'], ['delivered', 'paid'], true)) {
            if (Orders::can_transition((string) $order['status'], 'delivered')) {
                $fields['status'] = 'delivered';
            }
        }
        Orders::update((int) $order['id'], $fields);
        if ($short > 0) {
            Orders::add_note((int) $order['id'], sprintf('COD short: ৳%.2f (expected ৳%.2f, received ৳%.2f)', $short, $expected, $received));
        }
        return Orders::detail(Orders::find((int) $order['id']));
    }

    public function checkout(\WP_REST_Request $request) {
        $params = $this->params($request);
        return (new Checkout())->place($params);
    }

    public function ssl_return(\WP_REST_Request $request): void {
        $url = (new SslCommerzGateway())->handle_return($request);
        wp_safe_redirect($url);
        exit;
    }

    public function ssl_ipn(\WP_REST_Request $request): \WP_REST_Response {
        $code = (new SslCommerzGateway())->handle_ipn($request);
        return new \WP_REST_Response(['ok' => $code === 200], $code);
    }

    private function params(\WP_REST_Request $request): array {
        $json = $request->get_json_params();
        return is_array($json) ? $json : $request->get_params();
    }

    private function fonts(): array {
        return [
            '"Source Sans 3", "Noto Sans Bengali", sans-serif',
            '"Noto Sans", "Noto Sans Bengali", sans-serif',
            'system-ui, "Noto Sans Bengali", sans-serif',
        ];
    }

}
