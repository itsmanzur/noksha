<?php
/**
 * Installs tables and flushes rewrite rules.
 *
 * @package Noksha
 */

namespace Noksha;

final class Activator {
    public const DB_VERSION = '10';

    /** @var array<string, int> Table suffix → minimum DB version that created it. */
    private const TABLE_SINCE = [
        'orders' => 1,
        'order_items' => 1,
        'payments' => 1,
        'events' => 1,
        'leads' => 2,
        'order_notes' => 7,
        'blacklist' => 7,
    ];

    /**
     * Cached table-existence check based on DB version (avoids SHOW TABLES).
     */
    public static function has_table(string $suffix): bool {
        static $memo = [];
        if (array_key_exists($suffix, $memo)) {
            return $memo[$suffix];
        }
        $need = self::TABLE_SINCE[$suffix] ?? null;
        if ($need === null) {
            return $memo[$suffix] = false;
        }
        $installed = (float) get_option('noksha_db_version', '0');
        return $memo[$suffix] = ($installed >= $need);
    }

    public static function activate(): void {
        Caps::install();
        self::migrate_event_column();
        self::install_tables();
        self::migrate_event_column();
        self::migrate_order_columns();
        self::migrate_v8_wallet_collect();
        $type = new Pages\PostType();
        $type->register();
        if (did_action('init')) {
            $type->register_type();
        }
        flush_rewrite_rules(false);
        update_option('noksha_db_version', self::DB_VERSION, true);
        if (get_option('noksha_settings') === false) {
            add_option('noksha_settings', Options::default_settings(), '', false);
        }
        if (get_option('noksha_secrets') === false) {
            add_option('noksha_secrets', Options::default_secrets(), '', false);
        }
        if (get_option('noksha_tokens') === false) {
            add_option('noksha_tokens', Brand\Tokens::preset('ink'), '', false);
        }
        if (get_option('noksha_onboarding') === false) {
            add_option('noksha_onboarding', [
                'dismissed' => false,
                'payments' => false,
                'test_order' => false,
                'pixels' => false,
            ], '', false);
        }
    }

    public static function deactivate(): void {
        flush_rewrite_rules(false);
    }

    public static function maybe_upgrade(): void {
        $installed = (string) get_option('noksha_db_version', '');
        if ($installed === self::DB_VERSION) {
            // Expensive SHOW COLUMNS only in admin, at most once per day.
            if (!is_admin()) {
                return;
            }
            if (get_transient('noksha_schema_ok') === '1') {
                return;
            }
            if (self::schema_ready()) {
                set_transient('noksha_schema_ok', '1', DAY_IN_SECONDS);
                return;
            }
        }
        Caps::install();
        self::migrate_event_column();
        self::install_tables();
        self::migrate_event_column();
        self::migrate_order_columns();
        self::migrate_v8_wallet_collect();
        \Noksha\Fraud\Blacklist::migrate_from_option();
        if (get_option('noksha_onboarding') === false) {
            add_option('noksha_onboarding', [
                'dismissed' => false,
                'payments' => false,
                'test_order' => false,
                'pixels' => false,
            ], '', false);
        }
        update_option('noksha_db_version', self::DB_VERSION, true);
        set_transient('noksha_schema_ok', '1', DAY_IN_SECONDS);
    }

    /**
     * Wallet orders already verified must not collect full COD at courier.
     */
    private static function migrate_v8_wallet_collect(): void {
        global $wpdb;
        $table = $wpdb->prefix . 'noksha_orders';
        $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table)));
        if ($found !== $table) {
            return;
        }
        $rows = $wpdb->get_results(
            "SELECT id FROM {$table}
             WHERE payment_method IN ('manual_bkash','manual_nagad')
               AND trx_verified = 1
               AND status IN ('paid','confirmed')
               AND (consignment_id = '' OR consignment_id IS NULL)
               AND collect_amount > 0",
            ARRAY_A
        );
        if (!is_array($rows) || $rows === []) {
            return;
        }
        foreach ($rows as $row) {
            $id = (int) ($row['id'] ?? 0);
            if ($id <= 0) {
                continue;
            }
            $wpdb->update($table, ['collect_amount' => 0, 'updated_at' => current_time('mysql')], ['id' => $id]);
            \Noksha\Orders\Repository::add_note($id, 'collect amount reset to 0 (wallet already paid)');
        }
    }

    private static function schema_ready(): bool {
        global $wpdb;
        $orders = $wpdb->prefix . 'noksha_orders';
        $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($orders)));
        if ($found !== $orders) {
            return false;
        }
        foreach (['otp_verified', 'variant', 'cod_settled', 'call_attempts', 'cod_short', 'wc_order_id', 'discount', 'coupon'] as $column) {
            if (!$wpdb->get_var("SHOW COLUMNS FROM {$orders} LIKE '{$column}'")) {
                return false;
            }
        }
        foreach (['noksha_leads', 'noksha_order_notes', 'noksha_blacklist'] as $suffix) {
            $table = $wpdb->prefix . $suffix;
            if ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table))) !== $table) {
                return false;
            }
        }
        $events = $wpdb->prefix . 'noksha_events';
        $events_found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($events)));
        if ($events_found === $events && !$wpdb->get_var("SHOW COLUMNS FROM {$events} LIKE 'variant'")) {
            return false;
        }
        return true;
    }

    private static function migrate_order_columns(): void {
        global $wpdb;
        $table = $wpdb->prefix . 'noksha_orders';
        $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table)));
        if ($found !== $table) {
            return;
        }
        $columns = [
            'collect_amount' => 'decimal(12,2) NOT NULL DEFAULT 0.00',
            'attribution' => 'longtext NULL',
            'event_id' => 'varchar(64) NOT NULL DEFAULT \'\'',
            'courier' => 'varchar(32) NOT NULL DEFAULT \'\'',
            'consignment_id' => 'varchar(64) NOT NULL DEFAULT \'\'',
            'tracking_code' => 'varchar(64) NOT NULL DEFAULT \'\'',
            'courier_status' => 'varchar(32) NOT NULL DEFAULT \'\'',
            'otp_verified' => 'tinyint(1) NOT NULL DEFAULT 0',
            'variant' => 'char(1) NOT NULL DEFAULT \'\'',
            'cod_received' => 'decimal(12,2) NULL',
            'cod_settled' => 'tinyint(1) NOT NULL DEFAULT 0',
            'cod_settled_at' => 'datetime NULL',
            'cod_short' => 'decimal(12,2) NOT NULL DEFAULT 0.00',
            'call_attempts' => 'int(11) unsigned NOT NULL DEFAULT 0',
            'last_call_at' => 'datetime NULL',
            'wc_order_id' => 'bigint(20) unsigned NOT NULL DEFAULT 0',
            'discount' => 'decimal(12,2) NOT NULL DEFAULT 0.00',
            'coupon' => 'varchar(64) NOT NULL DEFAULT \'\'',
        ];
        foreach ($columns as $name => $definition) {
            $exists = $wpdb->get_var("SHOW COLUMNS FROM {$table} LIKE '{$name}'");
            if (!$exists) {
                $wpdb->query("ALTER TABLE {$table} ADD COLUMN {$name} {$definition}");
            }
        }
        $wpdb->query("UPDATE {$table} SET collect_amount = total WHERE collect_amount = 0 AND total > 0");
        $wpdb->query("UPDATE {$table} SET cod_settled = 0 WHERE cod_settled IS NULL");

        $items = $wpdb->prefix . 'noksha_order_items';
        if ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($items))) === $items) {
            foreach (['product_id', 'variation_id'] as $name) {
                if (!$wpdb->get_var("SHOW COLUMNS FROM {$items} LIKE '{$name}'")) {
                    $wpdb->query("ALTER TABLE {$items} ADD COLUMN {$name} bigint(20) unsigned NOT NULL DEFAULT 0");
                }
            }
        }

        $events = $wpdb->prefix . 'noksha_events';
        $events_found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($events)));
        if ($events_found === $events) {
            $has_variant = $wpdb->get_var("SHOW COLUMNS FROM {$events} LIKE 'variant'");
            if (!$has_variant) {
                $wpdb->query("ALTER TABLE {$events} ADD COLUMN variant char(1) NOT NULL DEFAULT ''");
            }
        }
    }

    /**
     * MySQL 8 reserves EVENT, so the old column name aborts CREATE TABLE.
     */
    private static function migrate_event_column(): void {
        global $wpdb;
        $table = $wpdb->prefix . 'noksha_events';
        $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table)));
        if ($found !== $table) {
            return;
        }
        $has_old = $wpdb->get_var("SHOW COLUMNS FROM {$table} LIKE 'event'");
        $has_new = $wpdb->get_var("SHOW COLUMNS FROM {$table} LIKE 'event_name'");
        if ($has_old && !$has_new) {
            $wpdb->query("ALTER TABLE {$table} CHANGE COLUMN `event` `event_name` varchar(32) NOT NULL DEFAULT ''");
            return;
        }
        if ($has_old && $has_new) {
            $wpdb->query("UPDATE {$table} SET `event_name` = `event` WHERE `event_name` = '' AND `event` <> ''");
            $wpdb->query("ALTER TABLE {$table} DROP COLUMN `event`");
        }
    }

    public static function install_tables(): void {
        global $wpdb;

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $charset = $wpdb->get_charset_collate();
        $orders = $wpdb->prefix . 'noksha_orders';
        $items = $wpdb->prefix . 'noksha_order_items';
        $payments = $wpdb->prefix . 'noksha_payments';
        $events = $wpdb->prefix . 'noksha_events';
        $leads = $wpdb->prefix . 'noksha_leads';
        $notes = $wpdb->prefix . 'noksha_order_notes';
        $blacklist = $wpdb->prefix . 'noksha_blacklist';

        $sql = "CREATE TABLE {$orders} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            page_id bigint(20) unsigned NOT NULL DEFAULT 0,
            order_number varchar(32) NOT NULL DEFAULT '',
            status varchar(32) NOT NULL DEFAULT 'pending',
            customer_name varchar(191) NOT NULL DEFAULT '',
            phone varchar(20) NOT NULL DEFAULT '',
            email varchar(191) NOT NULL DEFAULT '',
            division_id varchar(32) NOT NULL DEFAULT '',
            division_name varchar(191) NOT NULL DEFAULT '',
            district_id varchar(32) NOT NULL DEFAULT '',
            district_name varchar(191) NOT NULL DEFAULT '',
            upazila_id varchar(32) NOT NULL DEFAULT '',
            upazila_name varchar(191) NOT NULL DEFAULT '',
            address text NULL,
            payment_method varchar(32) NOT NULL DEFAULT '',
            currency char(3) NOT NULL DEFAULT 'BDT',
            subtotal decimal(12,2) NOT NULL DEFAULT 0.00,
            shipping decimal(12,2) NOT NULL DEFAULT 0.00,
            total decimal(12,2) NOT NULL DEFAULT 0.00,
            qty int(11) unsigned NOT NULL DEFAULT 1,
            risk varchar(16) NOT NULL DEFAULT 'ok',
            trx_id varchar(64) NOT NULL DEFAULT '',
            trx_verified tinyint(1) NOT NULL DEFAULT 0,
            collect_amount decimal(12,2) NOT NULL DEFAULT 0.00,
            attribution longtext NULL,
            event_id varchar(64) NOT NULL DEFAULT '',
            courier varchar(32) NOT NULL DEFAULT '',
            consignment_id varchar(64) NOT NULL DEFAULT '',
            tracking_code varchar(64) NOT NULL DEFAULT '',
            courier_status varchar(32) NOT NULL DEFAULT '',
            otp_verified tinyint(1) NOT NULL DEFAULT 0,
            variant char(1) NOT NULL DEFAULT '',
            cod_received decimal(12,2) NULL,
            cod_settled tinyint(1) NOT NULL DEFAULT 0,
            cod_settled_at datetime NULL,
            cod_short decimal(12,2) NOT NULL DEFAULT 0.00,
            call_attempts int(11) unsigned NOT NULL DEFAULT 0,
            last_call_at datetime NULL,
            wc_order_id bigint(20) unsigned NOT NULL DEFAULT 0,
            discount decimal(12,2) NOT NULL DEFAULT 0.00,
            coupon varchar(64) NOT NULL DEFAULT '',
            customer_note text NULL,
            session_id varchar(64) NOT NULL DEFAULT '',
            language varchar(8) NOT NULL DEFAULT 'en',
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY order_number (order_number),
            KEY page_id (page_id),
            KEY status (status),
            KEY phone (phone),
            KEY wc_order_id (wc_order_id),
            KEY created_at (created_at)
        ) {$charset};
        CREATE TABLE {$items} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            order_id bigint(20) unsigned NOT NULL DEFAULT 0,
            name varchar(191) NOT NULL DEFAULT '',
            qty int(11) unsigned NOT NULL DEFAULT 1,
            price decimal(12,2) NOT NULL DEFAULT 0.00,
            product_id bigint(20) unsigned NOT NULL DEFAULT 0,
            variation_id bigint(20) unsigned NOT NULL DEFAULT 0,
            PRIMARY KEY  (id),
            KEY order_id (order_id)
        ) {$charset};
        CREATE TABLE {$payments} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            order_id bigint(20) unsigned NOT NULL DEFAULT 0,
            gateway varchar(32) NOT NULL DEFAULT '',
            amount decimal(12,2) NOT NULL DEFAULT 0.00,
            status varchar(32) NOT NULL DEFAULT 'pending',
            transaction_id varchar(64) NOT NULL DEFAULT '',
            gateway_ref varchar(191) NOT NULL DEFAULT '',
            raw_response longtext NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY order_id (order_id)
        ) {$charset};
        CREATE TABLE {$events} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            page_id bigint(20) unsigned NOT NULL DEFAULT 0,
            event_name varchar(32) NOT NULL DEFAULT '',
            session_id varchar(64) NOT NULL DEFAULT '',
            variant char(1) NOT NULL DEFAULT '',
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY page_event (page_id, event_name, created_at),
            KEY session_id (session_id)
        ) {$charset};
        CREATE TABLE {$leads} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            page_id bigint(20) unsigned NOT NULL DEFAULT 0,
            phone varchar(20) NOT NULL DEFAULT '',
            name varchar(191) NOT NULL DEFAULT '',
            session_id varchar(64) NOT NULL DEFAULT '',
            converted tinyint(1) NOT NULL DEFAULT 0,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY page_phone (page_id, phone),
            KEY converted (converted, updated_at)
        ) {$charset};
        CREATE TABLE {$notes} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            order_id bigint(20) unsigned NOT NULL DEFAULT 0,
            user_id bigint(20) unsigned NOT NULL DEFAULT 0,
            note text NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY order_id (order_id)
        ) {$charset};
        CREATE TABLE {$blacklist} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            phone varchar(20) NOT NULL DEFAULT '',
            note varchar(191) NOT NULL DEFAULT '',
            created_at datetime NOT NULL,
            created_by bigint(20) unsigned NOT NULL DEFAULT 0,
            PRIMARY KEY  (id),
            UNIQUE KEY phone (phone)
        ) {$charset};";

        $wpdb->hide_errors();
        foreach (explode(';', $sql) as $statement) {
            $statement = trim($statement);
            if ($statement === '') {
                continue;
            }
            dbDelta($statement . ';');
        }

        $missing = [];
        foreach (['noksha_orders', 'noksha_order_items', 'noksha_payments', 'noksha_events', 'noksha_leads', 'noksha_order_notes', 'noksha_blacklist'] as $suffix) {
            $name = $wpdb->prefix . $suffix;
            $found = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($name)));
            if ($found !== $name) {
                $missing[] = $name . ($wpdb->last_error !== '' ? ' (' . $wpdb->last_error . ')' : '');
            }
        }
        if ($missing !== []) {
            throw new \RuntimeException('Noksha could not create ' . implode(', ', $missing) . '.');
        }
    }
}
