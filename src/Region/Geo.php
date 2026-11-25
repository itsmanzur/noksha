<?php
/**
 * Division, district, and upazila lookup.
 *
 * @package Noksha
 */

namespace Noksha\Region;

final class Geo {
    private static ?array $data = null;

    public static function data(): array {
        if (self::$data === null) {
            $path = NOKSHA_DIR . 'data/bd-geo.json';
            $decoded = [];
            if (is_file($path)) {
                $decoded = json_decode((string) file_get_contents($path), true);
            }
            self::$data = is_array($decoded) ? $decoded : ['divisions' => []];
        }
        return self::$data;
    }

    /**
     * @return array<string, string>|null
     */
    /**
     * A district by id, wherever it is.
     *
     * @return array{id:string,name:string}|null
     */
    public static function district(string $district_id): ?array {
        foreach (self::data()['divisions'] ?? [] as $division) {
            foreach ($division['districts'] ?? [] as $district) {
                if ((string) ($district['id'] ?? '') === $district_id) {
                    return ['id' => $district_id, 'name' => (string) ($district['en'] ?? '')];
                }
            }
        }
        return null;
    }

    public static function resolve(string $division_id, string $district_id, string $upazila_id, bool $upazila_required): ?array {
        $division = null;
        foreach (self::data()['divisions'] ?? [] as $candidate) {
            if (($candidate['id'] ?? '') === $division_id) {
                $division = $candidate;
                break;
            }
        }
        if (!is_array($division)) {
            return null;
        }
        $district = null;
        foreach ($division['districts'] ?? [] as $candidate) {
            if (($candidate['id'] ?? '') === $district_id) {
                $district = $candidate;
                break;
            }
        }
        if (!is_array($district)) {
            return null;
        }
        $upazila = null;
        if ($upazila_id !== '') {
            foreach ($district['upazilas'] ?? [] as $candidate) {
                if (($candidate['id'] ?? '') === $upazila_id) {
                    $upazila = $candidate;
                    break;
                }
            }
            if (!is_array($upazila)) {
                return null;
            }
        } elseif ($upazila_required) {
            return null;
        }

        return [
            'division_id' => (string) $division['id'],
            'division_name' => (string) ($division['en'] ?? ''),
            'district_id' => (string) $district['id'],
            'district_name' => (string) ($district['en'] ?? ''),
            'upazila_id' => is_array($upazila) ? (string) $upazila['id'] : '',
            'upazila_name' => is_array($upazila) ? (string) ($upazila['en'] ?? '') : '',
        ];
    }
}
