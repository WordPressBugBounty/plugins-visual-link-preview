<?php
/**
 * Open up link templates in the WordPress REST API.
 *
 * @link       https://bootstrapped.ventures
 * @since      2.2.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public/api
 */

/**
 * Open up link templates in the WordPress REST API.
 *
 * @since      2.2.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public/api
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Api_Template {

	/**
	 * Register actions and filters.
	 *
	 * @since    2.2.0
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'api_register_data' ) );
	}

	/**
	 * Register data for the REST API.
	 *
	 * @since    2.2.0
	 */
	public static function api_register_data() {
		if ( function_exists( 'register_rest_field' ) ) { // Prevent issue with Jetpack.
			register_rest_route( 'visual-link-preview/v1', '/template', array(
				'callback' => array( __CLASS__, 'api_get_templates' ),
				'methods' => 'GET',
				'permission_callback' => array( __CLASS__, 'api_required_permissions' ),
			));
			register_rest_route( 'visual-link-preview/v1', '/template', array(
				'callback' => array( __CLASS__, 'api_update_template' ),
				'methods' => 'POST',
				'permission_callback' => array( __CLASS__, 'api_required_permissions' ),
			));
			register_rest_route( 'visual-link-preview/v1', '/template', array(
				'callback' => array( __CLASS__, 'api_delete_template' ),
				'methods' => 'DELETE',
				'permission_callback' => array( __CLASS__, 'api_required_permissions' ),
			));
			register_rest_route( 'visual-link-preview/v1', '/template/preview', array(
				'callback' => array( __CLASS__, 'api_preview_template' ),
				'methods' => 'POST',
				'permission_callback' => array( __CLASS__, 'api_required_permissions' ),
			));
		}
	}

	/**
	 * Required permissions for the API.
	 *
	 * @since 2.2.0
	 */
	public static function api_required_permissions() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Handle get template call to the REST API.
	 *
	 * @since 2.2.0
	 * @param WP_REST_Request $request Current request.
	 */
	public static function api_get_templates( $request ) {
		return VLP_Template_Manager::get_templates();
	}

	/**
	 * Handle update template call to the REST API.
	 *
	 * @since 2.2.0
	 * @param WP_REST_Request $request Current request.
	 */
	public static function api_update_template( $request ) {
		$params = $request->get_params();
		$template = isset( $params['template'] ) ? $params['template'] : array();

		return VLP_Template_Editor::prepare_template_for_editor( VLP_Template_Manager::save_template( $template ) );
	}
	
	/**
	 * Handle delete template call to the REST API.
	 *
	 * @since 2.2.0
	 * @param WP_REST_Request $request Current request.
	 */
	public static function api_delete_template( $request ) {
		$params = $request->get_params();
		$slug = isset( $params['slug'] ) ? $params['slug'] : false;
		return VLP_Template_Manager::delete_template( $slug );
	}

	/**
	 * Handle preview template call to the REST API.
	 *
	 * @since 2.2.0
	 * @param WP_REST_Request $request Current request.
	 */
	public static function api_preview_template( $request ) {
		$params = $request->get_params();
		$template = isset( $params['template'] ) ? $params['template'] : false;

		$preview = false;
		if ( $template ) {
			$preview = VLP_Template_Editor::get_preview_link_output( $template );
		}

		return array(
			'preview' => $preview,
			'template' => $template,
		);
	}
}

VLP_Api_Template::init();
