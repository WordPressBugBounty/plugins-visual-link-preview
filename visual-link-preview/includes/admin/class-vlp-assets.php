<?php
/**
 * Handle the admin assets.
 *
 * @link       http://bootstrapped.ventures
 * @since      1.2.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/admin
 */

/**
 * Handle the admin assets.
 *
 * @since      1.2.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/admin
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Assets {

	/**
	 * Register actions and filters.
	 *
	 * @since    1.2.0
	 */
	public static function init() {
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue' ) );
		add_action( 'enqueue_block_editor_assets', array( __CLASS__, 'enqueue_blocks' ) );
	}

	/**
	 * Enqueue stylesheets and scripts.
	 *
	 * @since    1.2.0
	 */
	public static function enqueue() {
		$screen = get_current_screen();
		if ( 'admin_page_vlp_template_editor' === $screen->id ) {
			wp_enqueue_style( 'vlp-admin-template', VLP_URL . 'dist/admin-template.css', array(), VLP_VERSION, 'all' );
			wp_enqueue_script( 'vlp-admin-template', VLP_URL . 'dist/admin-template.js', array( 'vlp-admin' ), VLP_VERSION, true );
		}

		wp_enqueue_style( 'vlp-admin', VLP_URL . 'dist/admin.css', array(), VLP_VERSION, 'all' );
		wp_enqueue_script( 'vlp-admin', VLP_URL . 'dist/admin.js', array(), VLP_VERSION, true );

		// Get post types.
		$all_post_types = get_post_types( array(
			'public' => true,
		), 'objects' );
		unset( $all_post_types['attachment'] );
		unset( $all_post_types['elementor_library'] );

		$post_types = wp_list_pluck( $all_post_types, 'label' );

		wp_localize_script( 'vlp-admin', 'vlp_admin', array(
			'ajax_url' => admin_url( 'admin-ajax.php' ),
			'nonce' => wp_create_nonce( 'vlp' ),
			'api_nonce' => wp_create_nonce( 'wp_rest' ),
			'endpoints' => array(
				'template' => rtrim( get_rest_url( null, 'visual-link-preview/v1/template' ), '/' ),
			),
			'templates' => VLP_Template_Manager::get_templates(),
			'text' => array(
				'media_title' => __( 'Select or Upload Image', 'visual-link-preview' ),
				'media_button' => __( 'Use Image', 'visual-link-preview' ),
			),
			'post_types' => $post_types,
			'settings_link' => admin_url( 'options-general.php?page=bv_settings_vlp' ),
			'microlink_api_key' => VLP_Settings::get( 'microlink_api_key' ),
		));
	}

	/**
	 * Enqueue assets for Gutenberg blocks.
	 *
	 * @since    1.2.0
	 */
	public static function enqueue_blocks() {
		wp_enqueue_script( 'vlp-blocks', VLP_URL . 'dist/blocks.js', array( 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-data', 'wp-edit-post' ), VLP_VERSION );
		wp_enqueue_style( 'vlp-blocks', VLP_URL . 'dist/blocks.css', array( 'wp-edit-blocks' ), VLP_VERSION );

		wp_localize_script( 'vlp-blocks', 'vlp_blocks', array(
			'ajax_url' => admin_url( 'admin-ajax.php' ),
			'nonce' => wp_create_nonce( 'vlp' ),
			'templates' => VLP_Template_Manager::get_templates(),
			'edit_link' => admin_url( 'post.php?action=edit&post='),
			'settings_link' => admin_url( 'options-general.php?page=bv_settings_vlp' ),
		));
	}
}

VLP_Assets::init();
