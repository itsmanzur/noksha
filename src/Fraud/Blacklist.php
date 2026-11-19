<?php
/**
 * Phone blacklist for fake COD control.
 *
 * @package Noksha
 */

namespace Noksha\Fraud;

use Noksha\Region\Phone;

final class Blacklist {
    public const OPTION = 'noksha_blacklist';

    public static function table(): string {
        global $wpdb;
        return $wpdb->prefix . 'noksha_blacklist';
    }

    public static function migrate_from_option(): void {
        global $wpdb;
        $table = self::table();
        $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table)));
        if ($found !== $table) {
            return;
        }
        $stored = get_option(self::OPTION, []);
        if (!is_array($stored) || $stored === []) {
            return;
        }
        foreach ($stored as $row) {
            $phone = Phone::normalize((string) ($row['phone'] ?? ''));
            if (Phone::error($phone)) {
                continue;
            }
            $exists = (int) $wpdb->get_var($wpdb->prepare("SELECT id FROM {$table} WHERE phone = %s", $phone));
            if ($exists) {
                continue;
            }
            $wpdb->insert($table, [
                'phone' => $phone,
                'note' => sanitize_text_field((string) ($row['note'] ?? '')),
                'created_at' => (string) ($row['created_at'] ?? current_time('mysql')),
                'created_by' => 0,
            ]);
        }
        delete_option(self::OPTION);
    }

    public static function all(): array {
        global $wpdb;
        $table = self::table();
        $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table)));
        if ($found !== $table) {
            $stored = get_option(self::OPTION, []);
            return is_array($stored) ? array_values($stored) : [];
        }
        $rows = $wpdb->get_results("SELECT phone, note, created_at, created_by FROM {$table} ORDER BY id DESC LIMIT 2000", ARRAY_A);
        return is_array($rows) ? $rows : [];
    }

    public static function has(string $phone): bool {
        $phone = Phone::normalize($phone);
        if (Phone::error($phone)) {
            return false;
        }
        global $wpdb;
        $table = self::table();
        $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table)));
        if ($found === $table) {
            return (int) $wpdb->get_var($wpdb->prepare("SELECT id FROM {$table} WHERE phone = %s LIMIT 1", $phone)) > 0;
        }
        foreach (self::all() as $row) {
            if (($row['phone'] ?? '') === $phone) {
                return true;
            }
        }
        return false;
    }

    public static function add(string $phone, string $note = ''): array|\WP_Error {
        $phone = Phone::normalize($phone);
        if (Phone::error($phone)) {
            return new \WP_Error('noksha_invalid_phone', 'Invalid phone.', ['status' => 400]);
        }
        global $wpdb;
        $table = self::table();
        $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table)));
        if ($found === $table) {
            $wpdb->replace($table, [
                'phone' => $phone,
                'note' => sanitize_text_field($note),
                'created_at' => current_time('mysql'),
                'created_by' => get_current_user_id(),
            ]);
            return self::all();
        }
        $rows = self::all();
        foreach ($rows as $row) {
            if (($row['phone'] ?? '') === $phone) {
                return $rows;
            }
        }
        $rows[] = [
            'phone' => $phone,
            'note' => sanitize_text_field($note),
            'created_at' => current_time('mysql'),
        ];
        update_option(self::OPTION, $rows, false);
        return $rows;
    }

    public static function remove(string $phone): array {
        $phone = Phone::normalize($phone);
        global $wpdb;
        $table = self::table();
        $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table)));
        if ($found === $table) {
            $wpdb->delete($table, ['phone' => $phone]);
            return self::all();
        }
        $rows = array_values(array_filter(self::all(), static fn ($row) => ($row['phone'] ?? '') !== $phone));
        update_option(self::OPTION, $rows, false);
        return $rows;
    }

    public static function score(string $phone, string $risk = 'ok'): array {
        $blocked = self::has($phone);
        $label = $blocked ? 'block' : $risk;
        $points = $blocked ? 100 : ($risk === 'review' ? 40 : 0);
        return [
            'score' => $points,
            'label' => $label,
            'blocked' => $blocked,
        ];
    }
}
