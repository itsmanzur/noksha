<?php
/**
 * Inline CODE128-B barcode SVG (no external libraries).
 *
 * @package Noksha
 */

namespace Noksha\Packing;

final class Barcode {
    private const START_B = 104;

    /** @var list<string> */
    private const PATTERNS = [
        '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
        '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
        '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
        '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
        '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
        '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
        '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
        '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
        '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
        '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
        '114131', '311141', '411131', '211412', '211214', '211232', '2331112',
    ];

    /**
     * Render a CODE128 Set B barcode as inline SVG.
     */
    public static function code128_svg(string $text, int $height = 48): string {
        $text = trim($text);
        if ($text === '') {
            return '';
        }

        $symbols = self::encode_set_b($text);
        if ($symbols === []) {
            return '';
        }

        $quiet = 10;
        $module = 1;
        $x = $quiet;
        $bars = [];

        foreach ($symbols as $index => $symbol) {
            $pattern = self::PATTERNS[$symbol] ?? '';
            if ($pattern === '') {
                continue;
            }
            $is_bar = true;
            $len = strlen($pattern);
            for ($i = 0; $i < $len; $i++) {
                $w = (int) $pattern[$i] * $module;
                if ($is_bar && $w > 0) {
                    $bars[] = sprintf(
                        '<rect x="%d" y="0" width="%d" height="%d" fill="#000"/>',
                        $x,
                        $w,
                        $height
                    );
                }
                $x += $w;
                $is_bar = !$is_bar;
            }
        }

        $width = $x + $quiet;
        $bars_markup = implode('', $bars);

        return sprintf(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d" role="img" aria-label="%s"><title>%s</title>%s</svg>',
            $width,
            $height,
            $width,
            $height,
            esc_attr($text),
            esc_html($text),
            $bars_markup
        );
    }

    /**
     * @return list<int>
     */
    private static function encode_set_b(string $text): array {
        $codes = [self::START_B];
        $length = strlen($text);
        for ($i = 0; $i < $length; $i++) {
            $ord = ord($text[$i]);
            if ($ord < 32 || $ord > 126) {
                continue;
            }
            $codes[] = $ord - 32;
        }
        if (count($codes) < 2) {
            return [];
        }

        $checksum = $codes[0];
        $count = count($codes);
        for ($i = 1; $i < $count; $i++) {
            $checksum += $codes[$i] * $i;
        }
        $codes[] = $checksum % 103;
        $codes[] = 106;

        return $codes;
    }
}