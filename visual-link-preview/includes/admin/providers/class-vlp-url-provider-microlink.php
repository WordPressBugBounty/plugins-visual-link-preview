<?php
/**
 * Microlink API URL metadata provider.
 *
 * @link       http://bootstrapped.ventures
 * @since      2.3.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/admin/providers
 */

/**
 * Microlink API URL metadata provider.
 *
 * @since      2.3.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/admin/providers
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Url_Provider_Microlink extends VLP_Url_Provider {

	/**
	 * Get provider ID.
	 *
	 * @since    2.3.0
	 * @return   string Provider ID.
	 */
	public function get_id() {
		return 'microlink';
	}

	/**
	 * Get provider name.
	 *
	 * @since    2.3.0
	 * @return   string Provider name.
	 */
	public function get_name() {
		return __( 'Microlink', 'visual-link-preview' );
	}

	/**
	 * Check if provider is available.
	 *
	 * @since    2.3.0
	 * @return   bool True if provider is available.
	 */
	public function is_available() {
		return true; // Microlink free tier is always available.
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

		$api_key = VLP_Settings::get( 'microlink_api_key' );
		$endpoint = empty( $api_key ) ? 'https://api.microlink.io' : 'https://pro.microlink.io';

		$request_url = add_query_arg( 'url', urlencode( $url ), $endpoint );

		$headers = array();
		if ( ! empty( $api_key ) ) {
			$headers['x-api-key'] = $api_key;
		}

		$response = wp_remote_get( $request_url, array(
			'timeout' => 10,
			'headers' => $headers,
			'sslverify' => true,
		) );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		if ( 200 !== $response_code ) {
			return new WP_Error( 'http_error', sprintf( __( 'HTTP error: %d', 'visual-link-preview' ), $response_code ) );
		}

		$body = wp_remote_retrieve_body( $response );
		$data = json_decode( $body, true );

		if ( ! is_array( $data ) || 'success' !== $data['status'] ) {
			return new WP_Error( 'api_error', __( 'Microlink API returned an error.', 'visual-link-preview' ) );
		}

		// Map Microlink response format.
		$metadata = array();
		if ( isset( $data['data']['title'] ) ) {
			$metadata['title'] = $data['data']['title'];
		}
		if ( isset( $data['data']['description'] ) ) {
			$metadata['summary'] = $data['data']['description'];
		}
		if ( isset( $data['data']['image'] ) && is_array( $data['data']['image'] ) && isset( $data['data']['image']['url'] ) ) {
			$metadata['image_url'] = $data['data']['image']['url'];
		}

		return $this->normalize_response( $metadata, $url );
	}
}
