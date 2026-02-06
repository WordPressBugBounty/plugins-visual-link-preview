<?php
/**
 * Handle compatibility with other plugins/themes.
 *
 * @link       http://bootstrapped.ventures
 * @since      2.3.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 */

/**
 * Handle compatibility with other plugins/themes.
 *
 * @since      2.3.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Compatibility {

	/**
	 * Register actions and filters.
	 *
	 * @since    2.3.0
	 */
	public static function init() {
		// Elementor.
		add_action( 'elementor/editor/before_enqueue_scripts', array( __CLASS__, 'elementor_assets' ) );
		add_action( 'elementor/controls/register', array( __CLASS__, 'elementor_controls' ) );
		add_action( 'elementor/preview/enqueue_styles', array( __CLASS__, 'elementor_styles' ) );
		add_action( 'elementor/widgets/register', array( __CLASS__, 'elementor_widgets' ) );
		add_action( 'elementor/elements/categories_registered', array( __CLASS__, 'elementor_categories' ) );
	}

	/**
	 * Enqueue Elementor editor assets.
	 *
	 * @since 2.3.0
	 */
	public static function elementor_assets() {
		if ( class_exists( 'VLP_Modal' ) ) {
			VLP_Modal::add_modal_content();
		}

		if ( class_exists( 'VLP_Assets' ) ) {
			VLP_Assets::enqueue();
		}

		// Ensure modal styles and icons are available in the Elementor editor.
		wp_enqueue_style( 'vlp-admin', VLP_URL . 'dist/admin.css', array(), VLP_VERSION, 'all' );

		wp_enqueue_script( 'vlp-elementor', VLP_URL . 'assets/js/other/elementor.js', array( 'jquery', 'vlp-admin' ), VLP_VERSION, true );
	}

	/**
	 * Register Elementor controls.
	 *
	 * @since 2.3.0
	 * @param \Elementor\Controls_Manager $controls_manager Elementor controls manager.
	 */
	public static function elementor_controls( $controls_manager ) {
		include( VLP_DIR . 'templates/elementor/control.php' );
		$controls_manager->register( new VLP_Elementor_Control() );
	}

	/**
	 * Enqueue Elementor preview styles.
	 *
	 * @since 2.3.0
	 */
	public static function elementor_styles() {
		if ( class_exists( 'VLP_Shortcode' ) ) {
			VLP_Shortcode::enqueue();
		}
	}

	/**
	 * Register Elementor widgets.
	 *
	 * @since 2.3.0
	 * @param \Elementor\Widgets_Manager $widgets_manager Elementor widgets manager.
	 */
	public static function elementor_widgets( $widgets_manager ) {
		include( VLP_DIR . 'templates/elementor/widget-link.php' );
		$widgets_manager->register( new VLP_Elementor_Link_Widget() );
	}

	/**
	 * Add custom widget categories to Elementor.
	 *
	 * @since 2.3.0
	 * @param \Elementor\Elements_Manager $elements_manager Elementor elements manager.
	 */
	public static function elementor_categories( $elements_manager ) {
		$elements_manager->add_category(
			'visual-link-preview',
			array(
				'title' => __( 'Visual Link Preview', 'visual-link-preview' ),
				'icon'  => 'fa fa-plug',
			)
		);
	}
}

VLP_Compatibility::init();
