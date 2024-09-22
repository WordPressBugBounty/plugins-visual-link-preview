<?php
/**
 * Responsible for the custom template styling.
 *
 * @link       http://bootstrapped.ventures
 * @since      2.0.0
 *
 * @package    Visual_Link_Preview
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Template_Style {

	/**
	 * Add CSS to footer for all templates used on this page.
	 *
	 * @since	2.0.0
	 */
	public static function get_css() {
		$style = '';

		if ( VLP_Settings::get( 'template_use_custom_style' ) ) {
			$default_template = VLP_Settings::get( 'template_default' );
			$template = VLP_Template_Manager::get_template_by_slug( $default_template );

			if ( $template && 'static' === $template['type'] ) {
				ob_start();
				require_once( VLP_DIR . 'templates/settings/template-style.php' );
				$style .= ob_get_contents();
				ob_end_clean();
			}
		}

		return $style;
	}

}
