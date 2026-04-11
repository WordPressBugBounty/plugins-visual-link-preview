<?php
/**
 * Base class for URL metadata providers.
 *
 * @link       http://bootstrapped.ventures
 * @since      2.3.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/admin/providers
 */

/**
 * Base class for URL metadata providers.
 *
 * @since      2.3.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/admin/providers
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
abstract class VLP_Url_Provider {

	/**
	 * Get metadata for a URL.
	 *
	 * @since    2.3.0
	 * @param    string $url URL to fetch metadata for.
	 * @return   array|WP_Error Normalized metadata array or WP_Error on failure.
	 */
	abstract public function get_metadata( $url );

	/**
	 * Check if provider is available.
	 *
	 * @since    2.3.0
	 * @return   bool True if provider is available.
	 */
	abstract public function is_available();

	/**
	 * Get provider name.
	 *
	 * @since    2.3.0
	 * @return   string Provider name.
	 */
	abstract public function get_name();

	/**
	 * Get provider ID.
	 *
	 * @since    2.3.0
	 * @return   string Provider ID.
	 */
	abstract public function get_id();

	/**
	 * Normalize metadata response.
	 *
	 * @since    2.3.0
	 * @param    array $data Raw metadata data.
	 * @param    string $url Original URL.
	 * @return   array Normalized metadata array.
	 */
	protected function normalize_response( $data, $url ) {
		$normalized = array(
			'title' => '',
			'summary' => '',
			'image_url' => '',
		);

		// Title.
		if ( isset( $data['title'] ) && ! empty( $data['title'] ) ) {
			$normalized['title'] = sanitize_text_field( $data['title'] );
		}

		// Summary/Description.
		if ( isset( $data['summary'] ) && ! empty( $data['summary'] ) ) {
			$normalized['summary'] = sanitize_textarea_field( $data['summary'] );
		} elseif ( isset( $data['description'] ) && ! empty( $data['description'] ) ) {
			$normalized['summary'] = sanitize_textarea_field( $data['description'] );
		}

		// Image URL.
		if ( isset( $data['image_url'] ) && ! empty( $data['image_url'] ) ) {
			$normalized['image_url'] = esc_url_raw( $data['image_url'] );
		} elseif ( isset( $data['image'] ) && is_array( $data['image'] ) && isset( $data['image']['url'] ) ) {
			$normalized['image_url'] = esc_url_raw( $data['image']['url'] );
		} elseif ( isset( $data['image'] ) && is_string( $data['image'] ) ) {
			$normalized['image_url'] = esc_url_raw( $data['image'] );
		}

		// Resolve relative image URLs to absolute URLs.
		if ( ! empty( $normalized['image_url'] ) ) {
			$normalized['image_url'] = $this->resolve_image_url( $normalized['image_url'], $url );
		}

		return $normalized;
	}

	/**
	 * Resolve relative image URL to absolute URL.
	 *
	 * @since    2.3.0
	 * @param    string $image_url Image URL (may be relative).
	 * @param    string $base_url Base URL to resolve against.
	 * @return   string Absolute image URL.
	 */
	protected function resolve_image_url( $image_url, $base_url ) {
		// Already absolute.
		if ( preg_match( '/^https?:\/\//', $image_url ) ) {
			return $image_url;
		}

		// Parse base URL.
		$parsed_base = wp_parse_url( $base_url );
		if ( ! $parsed_base || ! isset( $parsed_base['scheme'] ) || ! isset( $parsed_base['host'] ) ) {
			return $image_url;
		}

		$base_scheme = $parsed_base['scheme'];
		$base_host = $parsed_base['host'];
		$base_path = isset( $parsed_base['path'] ) ? $parsed_base['path'] : '/';

		// Protocol-relative URL.
		if ( preg_match( '/^\/\//', $image_url ) ) {
			return $base_scheme . ':' . $image_url;
		}

		// Absolute path.
		if ( preg_match( '/^\//', $image_url ) ) {
			return $base_scheme . '://' . $base_host . $image_url;
		}

		// Relative path.
		$base_dir = dirname( $base_path );
		if ( '/' === $base_dir ) {
			$base_dir = '';
		}
		return $base_scheme . '://' . $base_host . $base_dir . '/' . $image_url;
	}

	/**
	 * Validate URL.
	 *
	 * @since    2.3.0
	 * @param    string $url URL to validate.
	 * @return   bool True if valid URL.
	 */
	protected function is_valid_url( $url ) {
		// Use centralized SSRF-safe validation when available.
		if ( class_exists( 'VLP_Url_Provider_Manager' ) && is_callable( array( 'VLP_Url_Provider_Manager', 'is_safe_remote_url' ) ) ) {
			return VLP_Url_Provider_Manager::is_safe_remote_url( $url );
		}

		$parsed_url = wp_parse_url( $url );
		return $parsed_url && isset( $parsed_url['scheme'] ) && isset( $parsed_url['host'] ) && in_array( $parsed_url['scheme'], array( 'http', 'https' ), true );
	}
}
