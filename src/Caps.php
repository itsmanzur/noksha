<?php
/**
 * Capabilities and the Noksha shop manager role.
 *
 * @package Noksha
 */

namespace Noksha;

final class Caps {
    public const MANAGE = 'noksha_manage';
    public const SETTINGS = 'noksha_manage_settings';
    public const ROLE = 'noksha_manager';

    public static function install(): void {
        $admin = get_role('administrator');
        if ($admin) {
            $admin->add_cap(self::MANAGE);
            $admin->add_cap(self::SETTINGS);
        }

        $role = get_role(self::ROLE);
        if (!$role) {
            add_role(self::ROLE, 'Noksha Manager', [
                'read' => true,
                self::MANAGE => true,
            ]);
            $role = get_role(self::ROLE);
        }
        if ($role) {
            $role->add_cap('read');
            $role->add_cap(self::MANAGE);
            $role->remove_cap(self::SETTINGS);
        }
    }

    public static function can_manage(): bool {
        return current_user_can(self::MANAGE) || current_user_can('manage_options');
    }

    public static function can_settings(): bool {
        return current_user_can(self::SETTINGS) || current_user_can('manage_options');
    }
}
