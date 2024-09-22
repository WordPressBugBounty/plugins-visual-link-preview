<?php
/**
 * Handle the link preview shortcode.
 *
 * @link       http://bootstrapped.ventures
 * @since      1.0.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 */

/**
 * Handle the link preview shortcode.
 *
 * @since      1.0.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Shortcode {

	/**
	 * Register actions and filters.
	 *
	 * @since    1.0.0
	 */
	public static function init() {
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue' ) );
		add_action( 'init', array( __CLASS__, 'register_blocks' ) );

		add_shortcode( 'visual-link-preview', array( __CLASS__, 'link_preview_shortcode' ) );
	}

	/**
	 * Enqueue stylesheets and scripts.
	 *
	 * @since    1.0.0
	 */
	public static function enqueue() {
		wp_enqueue_style( 'vlp-public', VLP_URL . 'dist/public.css', array(), VLP_VERSION, 'all' );
	}

	/**
	 * Register blocks.
	 *
	 * @since    2.2.2
	 */
	public static function register_blocks() {
		if ( function_exists( 'register_block_type' ) ) {
			$block_settings = array(
				'attributes' => array(
					'title' => array(
						'type' => 'string',
						'default' => '',
					),
					'summary' => array(
						'type' => 'string',
						'default' => '',
					),
					'image_id' => array(
						'type' => 'number',
						'default' => 0,
					),
					'image_url' => array(
						'type' => 'string',
						'default' => '',
					),
					'type' => array(
						'type' => 'string',
						'default' => '',
					),
					'post' => array(
						'type' => 'number',
						'default' => 0,
					),
					'post_label' => array(
						'type' => 'string',
						'default' => '',
					),
					'url' => array(
						'type' => 'string',
						'default' => '',
					),
					'template' => array(
						'type' => 'string',
						'default' => 'use_default_from_settings',
					),
					'nofollow' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'new_tab' => array(
						'type' => 'boolean',
						'default' => false,
					),
					'encoded' => array(
						'type' => 'string',
						'default' => '',
					),
				),
				'render_callback' => array( __CLASS__, 'link_preview_block' ),
			);

			register_block_type( 'visual-link-preview/link', $block_settings );
		}
	}

	/**
	 * Output for the link shortcode.
	 *
	 * @since    1.0.0
	 * @param	 array $atts Options passed along with the shortcode.
	 */
	public static function link_preview_shortcode( $atts ) {
		// Allow advanced usage of shortcode.
		if ( ! isset( $atts['encoded'] ) ) {		
			$object = (object) $atts;
			$encoded = base64_encode( json_encode( $object ) );

			$atts = array(
				'encoded' => $encoded,
			);
		}

		// Normal usage of shortcode.
		$atts = shortcode_atts( array(
			'encoded' => '',
		), $atts, 'vlp_link_preview' );

		$link = new VLP_Link( $atts['encoded'] );
		return $link->output();
	}

	/**
	 * Output for the link shortcode.
	 *
	 * @since    1.0.0
	 * @param	 array $atts Options passed along with the shortcode.
	 */
	public static function link_preview_block( $atts ) {
		$encoded = isset( $atts['encoded'] ) ? trim( $atts['encoded'] ) : false;
		$output = '';

		if ( $encoded ) {
			$link = new VLP_Link( $encoded );

			// Only do this for the Gutenberg Preview.
			if ( isset( $GLOBALS['wp']->query_vars['rest_route'] ) && '/wp/v2/block-renderer/visual-link-preview/link' === $GLOBALS['wp']->query_vars['rest_route'] ) {
				$template = VLP_Template_Manager::get_template_by_slug( $link->template() );
				$output .= '<style type="text/css">' . VLP_Template_Manager::get_template_css( $template ) . VLP_Template_Style::get_css() . '</style>';
			}

			$output .= $link->output();
		}

		return $output;
	}
}

VLP_Shortcode::init();
