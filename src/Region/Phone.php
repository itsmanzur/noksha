<?php
/**
 * Bangladesh mobile numbers.
 *
 * @package Noksha
 */

namespace Noksha\Region;

final class Phone {
    public static function normalize(string $raw): string {
        $digits = preg_replace('/\D+/', '', $raw) ?? '';
        if (str_starts_with($digits, '880') && strlen($digits) === 13) {
            $digits = '0' . substr($digits, 3);
        }
        return $digits;
    }

    public static function error(string $phone): ?string {
        if (!preg_match('/^01[3-9]\d{8}$/', $phone)) {
            return 'invalid_phone';
        }
        $rest = substr($phone, 3);
        if (preg_match('/^(\d)\1+$/', $rest)) {
            return 'invalid_phone';
        }
        if (str_contains($rest, '00000000')) {
            return 'invalid_phone';
        }
        return null;
    }
}
