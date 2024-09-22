<?php
/**
 * Open up link block in the WordPress REST API.
 *
 * @link       https://bootstrapped.ventures
 * @since      2.2.4
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public/api
 */

/**
 * Open up link block in the WordPress REST API.
 *
 * @since      2.2.4
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public/api
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Api_Block {

	/**
	 * Register actions and filters.
	 *
	 * @since    2.2.4
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'api_register_data' ) );
	}

	/**
	 * Register data for the REST API.
	 *
	 * @since    2.2.4
	 */
	public static function api_register_data() {
		if ( function_exists( 'register_rest_field' ) ) { // Prevent issue with Jetpack.
			register_rest_route( 'visual-link-preview/v1', '/search', array(
				'callback' => array( __CLASS__, 'api_search' ),
                'methods' => 'GET',
                'args' => array(
					'keyword' => array(
						'type' => 'string',
					),
                ),
                'permission_callback' => array( __CLASS__, 'api_required_permissions' ),
			));
		}
	}

	/**
	 * Required permissions for the API.
	 *
	 * @since 2.2.4
	 */
	public static function api_required_permissions() {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Handle search call to the REST API.
	 *
	 * @since 2.2.4
	 * @param WP_REST_Request $request Current request.
	 */
	public static function api_search( $request ) {
		$post_type = sanitize_key( $request['post_type'] );
        $keyword = sanitize_text_field( $request['keyword'] );

        // Sanitize Post Type.
		$all_post_types = get_post_types( array(
			'public' => true,
		), 'objects' );
		unset( $all_post_types['attachment'] );
		unset( $all_post_types['elementor_library'] );

		$post_types = array_keys( $all_post_types );

        if ( ! in_array( $post_type, $post_types ) ) {
            $post_type = $post_types;
        }

        $args = array(
            's' => $keyword,
            'post_type' => $post_type,
            'post_status' => 'any',
            'posts_per_page' => 50,
        );

        $args = apply_filters( 'vlp_search_args', $args );
        $query = new WP_Query( $args );

        $posts = array();
        if ( $query->have_posts() ) {
            $query_posts = $query->posts;

            foreach( $query_posts as $post ) {
                $post_type = get_post_type_object( $post->post_type );

                $posts[] = array(
                    'id' => $post->ID,
                    'title' => $post->post_title,
                    'permalink' => get_permalink( $post ),
                    'status' => $post->post_status,
                    'date' => $post->post_date,
                    'date_display' => mysql2date( "j M 'y", $post->post_date ),
                    'post_type' => $post_type->labels->singular_name,
                    'label' => $post_type->labels->singular_name . ' ' . $post->ID . ' - ' . $post->post_title,
                );
            }
        }

        return $posts;
	}
}

VLP_Api_Block::init();
