<?php
/**
 * Style tokens. Admin and public pages both read these CSS variables.
 *
 * @package Noksha
 */

namespace Noksha\Brand;

final class Tokens {
    public const OPTION = 'noksha_tokens';

    public static function presets(): array {
        return [
            'ink' => self::pack('ink', [
                'canvas' => '#F6F4EF',
                'card' => '#FFFFFF',
                'text' => '#1C1917',
                'muted' => '#57534E',
                'border' => '#E7E5E4',
                'brand' => '#0F6E56',
                'brandForeground' => '#FFFFFF',
                'accent' => '#C4841D',
                'success' => '#15803D',
                'warning' => '#B45309',
                'danger' => '#B91C1C',
            ]),
            'eid' => self::pack('eid', [
                'canvas' => '#FBF6EA',
                'card' => '#FFFCF5',
                'text' => '#2A2118',
                'muted' => '#6B5E4E',
                'border' => '#E7D7B8',
                'brand' => '#8C3A1E',
                'brandForeground' => '#FFFFFF',
                'accent' => '#C4841D',
                'success' => '#3F6B2A',
                'warning' => '#A16207',
                'danger' => '#9F1239',
            ]),
            'minimal' => self::pack('minimal', [
                'canvas' => '#F7F7F5',
                'card' => '#FFFFFF',
                'text' => '#1C1917',
                'muted' => '#57534E',
                'border' => '#D6D3D1',
                'brand' => '#1C1917',
                'brandForeground' => '#FFFFFF',
                'accent' => '#1C1917',
                'success' => '#166534',
                'warning' => '#A16207',
                'danger' => '#B91C1C',
            ]),
        ];
    }

    public static function preset(string $name): array {
        $presets = self::presets();
        return $presets[$name] ?? $presets['ink'];
    }

    public static function current(): array {
        $stored = get_option(self::OPTION, null);
        if (!is_array($stored)) {
            return self::preset('ink');
        }
        return self::sanitize($stored);
    }

    public static function save(array $input): array {
        $tokens = self::sanitize($input);
        update_option(self::OPTION, $tokens, false);
        return $tokens;
    }

    public static function sanitize(array $input): array {
        $preset = sanitize_key((string) ($input['preset'] ?? 'custom'));
        $base = self::preset($preset === 'custom' ? 'ink' : $preset);
        if (!isset(self::presets()[$preset])) {
            $preset = 'custom';
        }
        $colors = is_array($input['color'] ?? null) ? $input['color'] : [];
        foreach ($base['color'] as $key => $fallback) {
            $base['color'][$key] = self::hex((string) ($colors[$key] ?? $fallback), $fallback);
        }
        $font = (string) ($input['font']['sans'] ?? $base['font']['sans']);
        $font = preg_replace('/[^a-zA-Z0-9 ,"\'\-]/', '', $font) ?? '';
        $font = trim($font);
        if ($font === '') {
            $font = self::preset('ink')['font']['sans'];
        }
        $radius = (string) ($input['radius'] ?? $base['radius']);
        if (!in_array($radius, ['6px', '10px', '16px'], true)) {
            $radius = '10px';
        }
        $shadow = (string) ($input['shadow'] ?? $base['shadow']);
        if (!preg_match('/^none$|^0 \d{1,2}px \d{1,2}px rgba\(\d{1,3},\d{1,3},\d{1,3},(?:0|1|0?\.\d+)\)$/', $shadow)) {
            $shadow = self::preset('ink')['shadow'];
        }
        return [
            'preset' => $preset,
            'color' => $base['color'],
            'font' => ['sans' => $font],
            'radius' => $radius,
            'shadow' => $shadow,
            'space' => '16px',
        ];
    }

    /**
     * Page overrides replace colors only. Null means inherit the global brand.
     */
    public static function merge(?array $override, ?array $base = null): array {
        $tokens = $base ?? self::current();
        if (!is_array($override) || empty($override['enabled'])) {
            return $tokens;
        }
        $colors = is_array($override['color'] ?? null) ? $override['color'] : [];
        foreach ($tokens['color'] as $key => $fallback) {
            if (!isset($colors[$key])) {
                continue;
            }
            $tokens['color'][$key] = self::hex((string) $colors[$key], $fallback);
        }
        $tokens['preset'] = 'custom';
        return $tokens;
    }

    public static function sanitize_override($input): ?array {
        if (!is_array($input) || empty($input['enabled'])) {
            return null;
        }
        $colors = [];
        $fallback = self::current()['color'];
        $incoming = is_array($input['color'] ?? null) ? $input['color'] : [];
        foreach ($fallback as $key => $hex) {
            $colors[$key] = self::hex((string) ($incoming[$key] ?? $hex), $hex);
        }
        return [
            'enabled' => true,
            'color' => $colors,
        ];
    }

    public static function declarations(array $tokens): string {
        $vars = [
            '--noksha-color-canvas' => $tokens['color']['canvas'],
            '--noksha-color-card' => $tokens['color']['card'],
            '--noksha-color-text' => $tokens['color']['text'],
            '--noksha-color-muted' => $tokens['color']['muted'],
            '--noksha-color-border' => $tokens['color']['border'],
            '--noksha-color-brand' => $tokens['color']['brand'],
            '--noksha-color-brand-foreground' => $tokens['color']['brandForeground'],
            '--noksha-color-accent' => $tokens['color']['accent'],
            '--noksha-color-success' => $tokens['color']['success'],
            '--noksha-color-warning' => $tokens['color']['warning'],
            '--noksha-color-danger' => $tokens['color']['danger'],
            '--noksha-font-sans' => $tokens['font']['sans'],
            '--noksha-radius' => $tokens['radius'],
            '--noksha-shadow' => $tokens['shadow'],
            '--noksha-space' => $tokens['space'],
        ];
        $body = [];
        foreach ($vars as $name => $value) {
            $body[] = $name . ':' . $value;
        }
        return implode(';', $body);
    }

    public static function css(array $tokens, string $scope = ':root'): string {
        return $scope . '{' . self::declarations($tokens) . '}';
    }

    private static function pack(string $name, array $colors): array {
        return [
            'preset' => $name,
            'color' => $colors,
            'font' => [
                'sans' => '"Source Sans 3", "Noto Sans Bengali", sans-serif',
            ],
            'radius' => '10px',
            'shadow' => '0 1px 2px rgba(28,25,23,.06)',
            'space' => '16px',
        ];
    }

    private static function hex(string $value, string $fallback): string {
        $value = strtoupper(trim($value));
        return preg_match('/^#[0-9A-F]{6}$/', $value) ? $value : strtoupper($fallback);
    }
}
