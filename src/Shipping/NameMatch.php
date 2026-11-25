<?php
/**
 * Matches Noksha district and upazila names to a courier's own place lists.
 *
 * @package Noksha
 */

namespace Noksha\Shipping;

final class NameMatch {
    /** Bangladesh district spellings that differ between Noksha and courier lists. */
    private const ALIASES = [
        'chattogram' => 'chittagong',
        'cumilla' => 'comilla',
        'barishal' => 'barisal',
        'jashore' => 'jessore',
        'bogura' => 'bogra',
    ];

    public static function normalize(string $value): string {
        $value = preg_replace('/[^a-z0-9]+/', '', strtolower($value)) ?? '';
        $value = preg_replace('/(thana|upazila|sadar)$/', '', $value) ?? $value;
        return self::ALIASES[$value] ?? $value;
    }

    /**
     * @param array<int,string> $list Courier id => place name.
     * @return int|null The id of the exact match, else a close one, else null.
     */
    public static function find(array $list, string $wanted): ?int {
        $wanted = self::normalize($wanted);
        if ($wanted === '' || $list === []) {
            return null;
        }
        $loose = null;
        foreach ($list as $id => $name) {
            $name = self::normalize($name);
            if ($name === $wanted) {
                return (int) $id;
            }
            if ($loose === null && strlen($name) >= 4 && strlen($wanted) >= 4 && (str_contains($name, $wanted) || str_contains($wanted, $name))) {
                $loose = (int) $id;
            }
        }
        return $loose;
    }
}