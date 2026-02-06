<?php
/**
 * PHP-based self-hosted URL metadata provider.
 *
 * @link       http://bootstrapped.ventures
 * @since      2.3.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/admin/providers
 */

/**
 * PHP-based self-hosted URL metadata provider.
 *
 * @since      2.3.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/admin/providers
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Url_Provider_PHP extends VLP_Url_Provider {

	/**
	 * Get provider ID.
	 *
	 * @since    2.3.0
	 * @return   string Provider ID.
	 */
	public function get_id() {
		return 'php';
	}

	/**
	 * Get provider name.
	 *
	 * @since    2.3.0
	 * @return   string Provider name.
	 */
	public function get_name() {
		return __( 'Self-hosted (PHP)', 'visual-link-preview' );
	}

	/**
	 * Check if provider is available.
	 *
	 * @since    2.3.0
	 * @return   bool True if provider is available.
	 */
	public function is_available() {
		return class_exists( 'DOMDocument' );
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

		// Fetch HTML content.
		$response = wp_remote_get( $url, array(
			'timeout' => 10,
			'user-agent' => 'Mozilla/5.0 (compatible; Visual Link Preview; +https://bootstrapped.ventures)',
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
		if ( empty( $body ) ) {
			return new WP_Error( 'empty_response', __( 'Empty response from URL.', 'visual-link-preview' ) );
		}

		// Parse HTML.
		$metadata = $this->parse_html( $body, $url );
		return $this->normalize_response( $metadata, $url );
	}

	/**
	 * Parse HTML to extract metadata.
	 *
	 * @since    2.3.0
	 * @param    string $html HTML content.
	 * @param    string $url Original URL.
	 * @return   array Extracted metadata.
	 */
	private function parse_html( $html, $url ) {
		$metadata = array();

		// Suppress warnings for malformed HTML.
		libxml_use_internal_errors( true );

		$dom = new DOMDocument();
		@$dom->loadHTML( mb_convert_encoding( $html, 'HTML-ENTITIES', 'UTF-8' ) );

		$xpath = new DOMXPath( $dom );

		// Open Graph tags.
		$og_title = $xpath->query( '//meta[@property="og:title"]/@content' );
		if ( $og_title->length > 0 ) {
			$metadata['title'] = $og_title->item( 0 )->nodeValue;
		}

		$og_description = $xpath->query( '//meta[@property="og:description"]/@content' );
		if ( $og_description->length > 0 ) {
			$metadata['summary'] = $og_description->item( 0 )->nodeValue;
		}

		$og_image = $xpath->query( '//meta[@property="og:image"]/@content' );
		if ( $og_image->length > 0 ) {
			$metadata['image_url'] = $og_image->item( 0 )->nodeValue;
		}

		// Twitter Card tags (fallback for image).
		if ( empty( $metadata['image_url'] ) ) {
			$twitter_image = $xpath->query( '//meta[@name="twitter:image"]/@content' );
			if ( $twitter_image->length > 0 ) {
				$metadata['image_url'] = $twitter_image->item( 0 )->nodeValue;
			}
		}

		// Meta tags (fallback).
		if ( empty( $metadata['title'] ) ) {
			$meta_title = $xpath->query( '//title' );
			if ( $meta_title->length > 0 ) {
				$metadata['title'] = $meta_title->item( 0 )->nodeValue;
			}
		}

		if ( empty( $metadata['summary'] ) ) {
			$meta_description = $xpath->query( '//meta[@name="description"]/@content' );
			if ( $meta_description->length > 0 ) {
				$metadata['summary'] = $meta_description->item( 0 )->nodeValue;
			}
		}

		// H1 fallback for title.
		if ( empty( $metadata['title'] ) ) {
			$h1 = $xpath->query( '//h1' );
			if ( $h1->length > 0 ) {
				$metadata['title'] = $h1->item( 0 )->nodeValue;
			}
		}

		libxml_clear_errors();

		return $metadata;
	}
}
