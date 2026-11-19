<?php
/**
 * Standalone landing document. Theme chrome stays out of the ad page.
 *
 * @package Noksha
 */

if (!defined('ABSPATH')) {
    exit;
}

use Noksha\Pages\Renderer;

remove_action('wp_head', '_wp_render_title_tag', 1);
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php echo esc_html(wp_get_document_title()); ?></title>
<?php wp_head(); ?>
</head>
<body <?php body_class('noksha-landing-body'); ?>>
<?php wp_body_open(); ?>
<?php
echo Renderer::article_for_post((int) get_queried_object_id()); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
wp_footer();
?>
</body>
</html>
