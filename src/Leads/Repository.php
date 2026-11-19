<?php
/**
 * Incomplete checkout phone captures.
 *
 * @package Noksha
 */

namespace Noksha\Leads;

final class Repository {
    public static function table(): string {
        global $wpdb;
        return $wpdb->prefix . 'noksha_leads';
    }

    public static function capture(int $page_id, string $phone, string $session, string $name = ''): void {
        global $wpdb;
        $now = current_time('mysql');
        $existing = $wpdb->get_var($wpdb->prepare(
            'SELECT id FROM ' . self::table() . ' WHERE page_id = %d AND phone = %s AND converted = 0 ORDER BY id DESC LIMIT 1',
            $page_id,
            $phone
        ));
        if ($existing) {
            $wpdb->update(self::table(), [
                'session_id' => $session,
                'name' => $name,
                'updated_at' => $now,
            ], ['id' => (int) $existing]);
            return;
        }
        $wpdb->insert(self::table(), [
            'page_id' => $page_id,
            'phone' => $phone,
            'name' => $name,
            'session_id' => $session,
            'converted' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public static function mark_converted(int $page_id, string $phone): void {
        global $wpdb;
        $wpdb->query($wpdb->prepare(
            'UPDATE ' . self::table() . ' SET converted = 1, updated_at = %s WHERE page_id = %d AND phone = %s AND converted = 0',
            current_time('mysql'),
            $page_id,
            $phone
        ));
    }

    /**
     * @param array{page?:int,per_page?:int}|int $args
     */
    public static function query($args = 100): array {
        global $wpdb;
        if (is_int($args)) {
            $args = ['per_page' => $args, 'page' => 1];
        }
        $page = max(1, (int) ($args['page'] ?? 1));
        $per_page = max(1, min(100, (int) ($args['per_page'] ?? 50)));
        $offset = ($page - 1) * $per_page;
        $total = (int) $wpdb->get_var('SELECT COUNT(*) FROM ' . self::table() . ' WHERE converted = 0');
        $rows = $wpdb->get_results(
            $wpdb->prepare(
                'SELECT * FROM ' . self::table() . ' WHERE converted = 0 ORDER BY updated_at DESC LIMIT %d OFFSET %d',
                $per_page,
                $offset
            ),
            ARRAY_A
        );
        $leads = array_map(static function (array $row): array {
            return [
                'id' => (int) $row['id'],
                'pageId' => (int) $row['page_id'],
                'phone' => $row['phone'],
                'name' => $row['name'],
                'updatedAt' => $row['updated_at'],
                'createdAt' => $row['created_at'],
            ];
        }, is_array($rows) ? $rows : []);
        return [
            'leads' => $leads,
            'total' => $total,
            'page' => $page,
            'perPage' => $per_page,
            'totalPages' => max(1, (int) ceil($total / $per_page)),
        ];
    }
}
