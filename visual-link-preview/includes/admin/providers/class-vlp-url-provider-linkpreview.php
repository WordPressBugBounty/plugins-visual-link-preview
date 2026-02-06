<?php
/**
 * LinkPreview.net API URL metadata provider.
 *
 * @link       http://bootstrapped.ventures
 * @since      2.3.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/admin/providers
 */

/**
 * LinkPreview.net API URL metadata provider.
 *
 * @since      2.3.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/admin/providers
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Url_Provider_LinkPreview extends VLP_Url_Provider {

	/**
	 * Get provider ID.
	 *
	 * @since    2.3.0
	 * @return   string Provider ID.
	 */
	public function get_id() {
		return 'linkpreview';
	}

	/**
	 * Get provider name.
	 *
	 * @since    2.3.0
	 * @return   string Provider name.
	 */
	public function get_name() {
		return __( 'LinkPreview', 'visual-link-preview' );
	}

	/**
	 * Check if provider is available.
	 *
	 * @since    2.3.0
	 * @return   bool True if provider is available.
	 */
	public function is_available() {
		$api_key = VLP_Settings::get( 'linkpreview_api_key' );
		return ! empty( $api_key );
	}

	/**
	 * Get metadata for a URL.
	 *
	 * @since    2.3.0
	 * @param    string $url URL to fetch metadata for.
	 * @return   array|WP_Error Normalized metadata array or WP_Error on failure.
	 */
	public function get_metadata( $url ) {
		if ( ! $this->is_valid_url( $url ) ) {
			return new WP_Error( 'invalid_url', __( 'Invalid URL provided.', 'visual-link-preview' ) );
		}

		$api_key = VLP_Settings::get( 'linkpreview_api_key' );
		if ( empty( $api_key ) ) {
			return new WP_Error( 'no_api_key', __( 'LinkPreview API key not configured.', 'visual-link-preview' ) );
		}

		$endpoint = 'https://api.linkpreview.net';

		$body = wp_json_encode( array(
			'key' => $api_key,
			'q' => $url,
		) );

		$response = wp_remote_post( $endpoint, array(
			'timeout' => 10,
			'headers' => array(
				'Content-Type' => 'application/json',
			),
			'body' => $body,
			'sslverify' => true,
		) );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		if ( 200 !== $response_code ) {
			return new WP_Error( 'http_error', sprintf( __( 'HTTP error: %d', 'visual-link-preview' ), $response_code ) );
		}

		$response_body = wp_remote_retrieve_body( $response );
		$data = json_decode( $response_body, true );

		if ( ! is_array( $data ) || isset( $data['error'] ) ) {
			$error_message = isset( $data['error'] ) ? sanitize_text_field( $data['error'] ) : __( 'LinkPreview API returned an error.', 'visual-link-preview' );
			return new WP_Error( 'api_error', $error_message );
		}

		// Map LinkPreview response format.
		$metadata = array();
		if ( isset( $data['title'] ) ) {
			$metadata['title'] = $data['title'];
		}
		if ( isset( $data['description'] ) ) {
			$metadata['summary'] = $data['description'];
		}
		if ( isset( $data['image'] ) ) {
			$metadata['image_url'] = $data['image'];
		}

		return $this->normalize_response( $metadata, $url );
	}
}
