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
use Noksha\Pages\PostType;
use Noksha\Rest\Controller;

final class Plugin {
    private static ?self $instance = null;

    public static function instance(): self {
        return self::$instance ??= new self();
    }

    public function boot(): void {
        Activator::maybe_upgrade();
        (new Locale())->register();
        (new PostType())->register();
        (new Menu())->register();
        (new Controller())->register();
        (new Assets())->register();
    }
}
