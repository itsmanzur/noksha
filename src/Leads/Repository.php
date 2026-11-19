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

    public static function query(int $limit = 100): array {
        global $wpdb;
        $rows = $wpdb->get_results(
            $wpdb->prepare(
                'SELECT * FROM ' . self::table() . ' WHERE converted = 0 ORDER BY updated_at DESC LIMIT %d',
                $limit
            ),
            ARRAY_A
        );
        return array_map(static function (array $row): array {
            return [
                'id' => (int) $row['id'],
                'pageId' => (int) $row['page_id'],
                'phone' => $row['phone'],
                'name' => $row['name'],
                'updatedAt' => $row['updated_at'],
                'createdAt' => $row['created_at'],
            ];
        }, is_array($rows) ? $rows : []);
    }
}
