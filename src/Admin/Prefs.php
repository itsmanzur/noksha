<?php
/**
 * Per-user admin UI preferences (theme).
 *
 * @package Noksha
 */

namespace Noksha\Admin;

final class Prefs {
    public const THEME_META = 'noksha_theme';

    public static function theme(): string {
        $theme = 'system';
        if (is_user_logged_in()) {
            $stored = (string) get_user_meta(get_current_user_id(), self::THEME_META, true);
            if (in_array($stored, ['light', 'dark', 'system'], true)) {
                $theme = $stored;
            }
        }
        return $theme;
    }

    public static function persist_theme(string $theme): string {
        $theme = in_array($theme, ['light', 'dark', 'system'], true) ? $theme : 'system';
        update_user_meta(get_current_user_id(), self::THEME_META, $theme);
        return $theme;
    }

    public static function shell_counts(): array {
        global $wpdb;
        $needs = 0;
        $leads_today = 0;
        if (\Noksha\Activator::has_table('orders')) {
            $needs = (int) $wpdb->get_var(
                'SELECT COUNT(*) FROM ' . $wpdb->prefix . "noksha_orders WHERE status IN ('pending','no_answer')"
            );
        }
        if (\Noksha\Activator::has_table('leads')) {
            $today = wp_date('Y-m-d');
            $leads_today = (int) $wpdb->get_var($wpdb->prepare(
                'SELECT COUNT(*) FROM ' . $wpdb->prefix . 'noksha_leads WHERE converted = 0 AND updated_at >= %s',
                $today . ' 00:00:00'
            ));
        }
        return [
            'needsCall' => $needs,
            'leadsToday' => $leads_today,
        ];
    }
}
