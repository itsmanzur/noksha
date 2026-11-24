<?php
/**
 * Boots Noksha after WordPress has loaded.
 *
 * @package Noksha
 */

namespace Noksha;

use Noksha\Admin\Menu;
use Noksha\Front\Assets;
use Noksha\I18n\Locale;
use Noksha\Orders\Repository as Orders;
use Noksha\Pages\PostType;
use Noksha\Payments\WalletVerifier;
use Noksha\Rest\Controller;

final class Plugin {
    private static ?self $instance = null;

    public static function instance(): self {
        return self::$instance ??= new self();
    }

    public function boot(): void {
        Activator::maybe_upgrade();
        WalletVerifier::register_hooks();
        add_action('before_woocommerce_init', [\Noksha\Orders\WcBridge::class, 'declare_hpos_compat']);
        add_action('plugins_loaded', [\Noksha\Orders\WcBridge::class, 'register_hooks'], 20);
        add_action('plugins_loaded', [\Noksha\Front\CachePurge::class, 'register_hooks'], 20);
        add_action('noksha_order_status_changed', [Orders::class, 'on_status_changed'], 10, 3);
        (new Locale())->register();
        (new PostType())->register();
        (new Menu())->register();
        (new Controller())->register();
        (new Assets())->register();
    }
}
