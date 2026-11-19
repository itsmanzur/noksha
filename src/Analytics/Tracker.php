<?php
/**
 * First-party page views, checkout starts, and order totals.
 *
 * @package Noksha
 */

namespace Noksha\Analytics;

use Noksha\Orders\Repository as Orders;

final class Tracker {
    public static function table(): string {
        global $wpdb;
        return $wpdb->prefix . 'noksha_events';
    }

    public static function record(int $page_id, string $event, string $session, string $variant = ''): void {
        global $wpdb;
        if (!in_array($event, ['page_view', 'checkout_start', 'order_placed'], true)) {
            return;
        }
        $variant = in_array($variant, ['a', 'b'], true) ? $variant : '';
        $row = [
            'page_id' => $page_id,
            'event_name' => $event,
            'session_id' => noksha_clip($session, 64),
            'created_at' => current_time('mysql'),
        ];
        if (self::has_variant_column()) {
            $row['variant'] = $variant;
        }
        $wpdb->insert(self::table(), $row);
    }

    public static function ensure(int $page_id, string $event, string $session, string $variant = ''): void {
        global $wpdb;
        $session = noksha_clip($session, 64);
        if ($session === '' || !in_array($event, ['page_view', 'checkout_start', 'order_placed'], true)) {
            return;
        }
        $found = $wpdb->get_var($wpdb->prepare(
            'SELECT id FROM ' . self::table() . ' WHERE page_id = %d AND event_name = %s AND session_id = %s LIMIT 1',
            $page_id,
            $event,
            $session
        ));
        if ($found) {
            return;
        }
        self::record($page_id, $event, $session, $variant);
    }

    private static function has_variant_column(): bool {
        static $has = null;
        if ($has !== null) {
            return $has;
        }
        global $wpdb;
        $has = (bool) $wpdb->get_var("SHOW COLUMNS FROM " . self::table() . " LIKE 'variant'");
        return $has;
    }

    public static function report(int $days): array {
        $days = in_array($days, [7, 14, 30], true) ? $days : 7;
        $now = current_time('timestamp');
        $start = wp_date('Y-m-d 00:00:00', $now - ($days - 1) * DAY_IN_SECONDS);
        $today = wp_date('Y-m-d 00:00:00', $now);

        return [
            'range' => $days,
            'today' => self::totals($today),
            'funnel' => self::funnel($start),
            'series' => self::series($start, $days),
            'topPages' => self::top_pages($start),
            'recentOrders' => Orders::query('', '', 8)['orders'],
            'ab' => self::ab_split($start),
            'codReconcile' => self::cod_reconcile($start),
            'byDistrict' => self::ops_by('district_name', $start),
            'byPage' => self::ops_by_page($start),
        ];
    }

    private static function ops_by(string $column, string $start): array {
        global $wpdb;
        $allowed = ['district_name', 'upazila_name', 'division_name'];
        if (!in_array($column, $allowed, true)) {
            return [];
        }
        $table = Orders::table();
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT
                CASE WHEN {$column} = '' OR {$column} IS NULL THEN '—' ELSE {$column} END AS label,
                COUNT(*) placed,
                SUM(CASE WHEN status IN ('confirmed','paid','shipped','delivered') THEN 1 ELSE 0 END) confirmed,
                SUM(CASE WHEN status IN ('shipped','delivered','returned') THEN 1 ELSE 0 END) shipped,
                SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END) returned
             FROM {$table}
             WHERE created_at >= %s AND status <> 'cancelled'
             GROUP BY label
             ORDER BY placed DESC
             LIMIT 12",
            $start
        ), ARRAY_A);
        $out = [];
        foreach ((array) $rows as $row) {
            $placed = (int) $row['placed'];
            $confirmed = (int) $row['confirmed'];
            $shipped = (int) $row['shipped'];
            $returned = (int) $row['returned'];
            $out[] = [
                'label' => (string) $row['label'],
                'placed' => $placed,
                'confirmed' => $confirmed,
                'returned' => $returned,
                'confirmRate' => $placed > 0 ? round($confirmed / $placed * 100, 1) : 0,
                'returnRate' => $shipped > 0 ? round($returned / $shipped * 100, 1) : 0,
            ];
        }
        return $out;
    }

    private static function ops_by_page(string $start): array {
        global $wpdb;
        $table = Orders::table();
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT page_id,
                COUNT(*) placed,
                SUM(CASE WHEN status IN ('confirmed','paid','shipped','delivered') THEN 1 ELSE 0 END) confirmed,
                SUM(CASE WHEN status IN ('shipped','delivered','returned') THEN 1 ELSE 0 END) shipped,
                SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END) returned
             FROM {$table}
             WHERE created_at >= %s AND status <> 'cancelled'
             GROUP BY page_id
             ORDER BY placed DESC
             LIMIT 12",
            $start
        ), ARRAY_A);
        $out = [];
        foreach ((array) $rows as $row) {
            $id = (int) $row['page_id'];
            $post = get_post($id);
            $placed = (int) $row['placed'];
            $confirmed = (int) $row['confirmed'];
            $shipped = (int) $row['shipped'];
            $returned = (int) $row['returned'];
            $out[] = [
                'id' => $id,
                'title' => $post ? $post->post_title : '#' . $id,
                'placed' => $placed,
                'confirmed' => $confirmed,
                'returned' => $returned,
                'confirmRate' => $placed > 0 ? round($confirmed / $placed * 100, 1) : 0,
                'returnRate' => $shipped > 0 ? round($returned / $shipped * 100, 1) : 0,
            ];
        }
        return $out;
    }

    private static function ab_split(string $start): array {
        if (!self::has_variant_column()) {
            return ['a' => ['visits' => 0, 'orders' => 0], 'b' => ['visits' => 0, 'orders' => 0]];
        }
        global $wpdb;
        $out = ['a' => ['visits' => 0, 'orders' => 0], 'b' => ['visits' => 0, 'orders' => 0]];
        $visits = $wpdb->get_results($wpdb->prepare(
            "SELECT variant, COUNT(DISTINCT session_id) visits FROM " . self::table() . " WHERE event_name = 'page_view' AND created_at >= %s AND variant IN ('a','b') GROUP BY variant",
            $start
        ), ARRAY_A);
        $orders = $wpdb->get_results($wpdb->prepare(
            "SELECT variant, COUNT(*) orders FROM " . Orders::table() . " WHERE created_at >= %s AND status <> 'cancelled' AND variant IN ('a','b') GROUP BY variant",
            $start
        ), ARRAY_A);
        foreach ((array) $visits as $row) {
            $out[$row['variant']]['visits'] = (int) $row['visits'];
        }
        foreach ((array) $orders as $row) {
            $out[$row['variant']]['orders'] = (int) $row['orders'];
        }
        return $out;
    }

    private static function cod_reconcile(string $start): array {
        global $wpdb;
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT COUNT(*) open_count,
                COALESCE(SUM(collect_amount),0) expected,
                COALESCE(SUM(CASE WHEN cod_settled = 1 THEN COALESCE(cod_received, collect_amount) ELSE 0 END),0) received,
                COALESCE(SUM(CASE WHEN cod_settled = 0 THEN collect_amount ELSE 0 END),0) unsettled
             FROM " . Orders::table() . "
             WHERE payment_method = 'cod' AND created_at >= %s AND status IN ('shipped','delivered','paid','confirmed')",
            $start
        ), ARRAY_A);
        return [
            'expected' => (float) ($row['expected'] ?? 0),
            'received' => (float) ($row['received'] ?? 0),
            'unsettled' => (float) ($row['unsettled'] ?? 0),
            'open' => (int) ($row['open_count'] ?? 0),
        ];
    }

    public static function page_counts(array $ids): array {
        global $wpdb;
        $ids = array_values(array_filter(array_map('intval', $ids)));
        $empty = [];
        foreach ($ids as $id) {
            $empty[$id] = ['visits' => 0, 'orders' => 0, 'buyers' => 0];
        }
        if ($ids === []) {
            return $empty;
        }
        $placeholders = implode(',', array_fill(0, count($ids), '%d'));
        $visits = $wpdb->get_results($wpdb->prepare(
            'SELECT page_id, COUNT(*) visits FROM ('
            . 'SELECT page_id, session_id FROM ' . self::table() . " WHERE event_name = 'page_view' AND session_id <> '' AND page_id IN ($placeholders) "
            . 'UNION SELECT page_id, session_id FROM ' . Orders::table() . " WHERE status <> 'cancelled' AND session_id <> '' AND page_id IN ($placeholders)"
            . ') AS sessions GROUP BY page_id',
            ...array_merge($ids, $ids)
        ), ARRAY_A);
        $orders = $wpdb->get_results($wpdb->prepare(
            'SELECT page_id, COUNT(*) orders FROM ' . Orders::table() . " WHERE status <> 'cancelled' AND page_id IN ($placeholders) GROUP BY page_id",
            ...$ids
        ), ARRAY_A);
        $buyers = $wpdb->get_results($wpdb->prepare(
            'SELECT page_id, COUNT(DISTINCT session_id) buyers FROM ' . Orders::table() . " WHERE status <> 'cancelled' AND session_id <> '' AND page_id IN ($placeholders) GROUP BY page_id",
            ...$ids
        ), ARRAY_A);
        foreach ((array) $visits as $row) {
            $empty[(int) $row['page_id']]['visits'] = (int) $row['visits'];
        }
        foreach ((array) $orders as $row) {
            $empty[(int) $row['page_id']]['orders'] = (int) $row['orders'];
        }
        foreach ((array) $buyers as $row) {
            $empty[(int) $row['page_id']]['buyers'] = (int) $row['buyers'];
        }
        return $empty;
    }

    private static function totals(string $start): array {
        global $wpdb;
        $statuses = self::status_sql();
        $row = $wpdb->get_row($wpdb->prepare(
            'SELECT COUNT(*) orders, COALESCE(SUM(total),0) revenue, SUM(CASE WHEN payment_method = %s THEN 1 ELSE 0 END) cod FROM ' . Orders::table() . " WHERE created_at >= %s AND status IN ($statuses)",
            'cod',
            $start
        ), ARRAY_A);
        $orders = (int) ($row['orders'] ?? 0);
        $visits = self::stage_sessions('page_view', $start);
        $buyers = self::buyer_sessions($start);
        return [
            'orders' => $orders,
            'revenue' => (float) ($row['revenue'] ?? 0),
            'visits' => $visits,
            'conversion' => $visits > 0 ? round($buyers / $visits * 100, 1) : 0,
            'codShare' => $orders > 0 ? round(((int) $row['cod']) / $orders * 100) : 0,
        ];
    }

    private static function funnel(string $start): array {
        global $wpdb;
        $statuses = self::status_sql();
        $row = $wpdb->get_row($wpdb->prepare(
            'SELECT COUNT(*) orders, COALESCE(SUM(total),0) revenue, SUM(CASE WHEN payment_method = %s THEN 1 ELSE 0 END) cod FROM ' . Orders::table() . " WHERE created_at >= %s AND status IN ($statuses)",
            'cod',
            $start
        ), ARRAY_A);
        $orders = (int) ($row['orders'] ?? 0);
        $cod = (int) ($row['cod'] ?? 0);
        $visits = self::stage_sessions('page_view', $start);
        $buyers = self::buyer_sessions($start);
        return [
            'visits' => $visits,
            'checkouts' => self::stage_sessions('checkout_start', $start),
            'orders' => $orders,
            'revenue' => (float) ($row['revenue'] ?? 0),
            'cod' => $cod,
            'prepaid' => max(0, $orders - $cod),
            'conversion' => $visits > 0 ? round($buyers / $visits * 100, 1) : 0,
        ];
    }

    private static function series(string $start, int $days): array {
        global $wpdb;
        $statuses = self::status_sql();
        $rows = $wpdb->get_results($wpdb->prepare(
            'SELECT DATE(created_at) day, COALESCE(SUM(total),0) revenue FROM ' . Orders::table() . " WHERE created_at >= %s AND status IN ($statuses) GROUP BY DATE(created_at)",
            $start
        ), ARRAY_A);
        $map = [];
        foreach ((array) $rows as $row) {
            $map[$row['day']] = (float) $row['revenue'];
        }
        $series = [];
        $stamp = strtotime($start);
        for ($i = 0; $i < $days; $i++) {
            $day = wp_date('Y-m-d', $stamp + $i * DAY_IN_SECONDS);
            $series[] = [
                'date' => $day,
                'revenue' => $map[$day] ?? 0,
            ];
        }
        return $series;
    }

    private static function top_pages(string $start): array {
        global $wpdb;
        $statuses = self::status_sql();
        $rows = $wpdb->get_results($wpdb->prepare(
            'SELECT page_id, COUNT(*) orders, COALESCE(SUM(total),0) revenue FROM ' . Orders::table() . " WHERE created_at >= %s AND status IN ($statuses) GROUP BY page_id ORDER BY revenue DESC LIMIT 5",
            $start
        ), ARRAY_A);
        $pages = [];
        foreach ((array) $rows as $row) {
            $id = (int) $row['page_id'];
            $post = get_post($id);
            $pages[] = [
                'id' => $id,
                'title' => $post ? $post->post_title : '#' . $id,
                'orders' => (int) $row['orders'],
                'revenue' => (float) $row['revenue'],
                'visits' => self::stage_sessions('page_view', $start, $id),
            ];
        }
        return $pages;
    }

    private static function stage_sessions(string $event, string $start, int $page_id = 0): int {
        global $wpdb;
        $statuses = self::status_sql();
        $sql = 'SELECT session_id FROM ' . self::table() . ' WHERE event_name = %s AND created_at >= %s AND session_id <> %s';
        $args = [$event, $start, ''];
        if ($page_id > 0) {
            $sql .= ' AND page_id = %d';
            $args[] = $page_id;
        }
        $sql .= ' UNION SELECT session_id FROM ' . Orders::table() . " WHERE created_at >= %s AND session_id <> %s AND status IN ($statuses)";
        $args[] = $start;
        $args[] = '';
        if ($page_id > 0) {
            $sql .= ' AND page_id = %d';
            $args[] = $page_id;
        }
        return (int) $wpdb->get_var($wpdb->prepare('SELECT COUNT(*) FROM (' . $sql . ') AS sessions', $args));
    }

    private static function buyer_sessions(string $start, int $page_id = 0): int {
        global $wpdb;
        $statuses = self::status_sql();
        $sql = 'SELECT COUNT(DISTINCT session_id) FROM ' . Orders::table() . " WHERE created_at >= %s AND session_id <> %s AND status IN ($statuses)";
        $args = [$start, ''];
        if ($page_id > 0) {
            $sql .= ' AND page_id = %d';
            $args[] = $page_id;
        }
        return (int) $wpdb->get_var($wpdb->prepare($sql, $args));
    }

    private static function status_sql(): string {
        return "'" . implode("','", Orders::COUNTABLE) . "'";
    }
}
