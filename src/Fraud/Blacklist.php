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

    public static function all(): array {
        $stored = get_option(self::OPTION, []);
        return is_array($stored) ? array_values($stored) : [];
    }

    public static function has(string $phone): bool {
        $phone = Phone::normalize($phone);
        if (Phone::error($phone)) {
            return false;
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
