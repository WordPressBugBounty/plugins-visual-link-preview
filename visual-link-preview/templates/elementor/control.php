<?php
/**
 * Elementor control for Visual Link Preview.
 *
 * @link       http://bootstrapped.ventures
 * @since      2.3.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/templates/elementor
 */

/**
 * Elementor control for Visual Link Preview.
 *
 * @since 2.3.0
 */
class VLP_Elementor_Control extends \Elementor\Base_Data_Control {

	/**
	 * Get control type.
	 *
	 * @since 2.3.0
	 */
	public function get_type() {
		return 'vlp-link-builder';
	}

	/**
	 * Enqueue control assets.
	 *
	 * @since 2.3.0
	 */
	public function enqueue() {
		wp_enqueue_script( 'vlp-elementor-control', VLP_URL . 'templates/elementor/control.min.js', array( 'jquery' ), VLP_VERSION, true );
	}

	/**
	 * Get default value.
	 *
	 * @since 2.3.0
	 */
	public function get_default_value() {
		return '';
	}

	/**
	 * Output control template.
	 *
	 * @since 2.3.0
	 */
	public function content_template() {
		?>
		<div class="vlp-elementor-control-placeholder">
			<?php esc_html_e( 'Use the buttons above to create or edit a visual link preview.', 'visual-link-preview' ); ?>
		</div>
		<?php
	}
}
