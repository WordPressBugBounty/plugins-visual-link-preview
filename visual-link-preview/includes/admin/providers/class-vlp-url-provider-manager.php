<?php
/**
 * Manager for URL metadata providers.
 *
 * @link       http://bootstrapped.ventures
 * @since      2.3.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/admin/providers
 */

/**
 * Manager for URL metadata providers.
 *
 * @since      2.3.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/admin/providers
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Url_Provider_Manager {

	/**
	 * Registered providers.
	 *
	 * @since    2.3.0
	 * @var      array
	 */
	private static $providers = array();

	/**
	 * Whether providers have been initialized.
	 *
	 * @since    2.3.0
	 * @var      bool
	 */
	private static $initialized = false;

	/**
	 * Initialize the provider system.
	 *
	 * @since    2.3.0
	 */
	public static function init() {
		// Prevent re-initialization.
		if ( self::$initialized ) {
			return;
		}

		// Load provider classes.
		require_once( VLP_DIR . 'includes/admin/providers/class-vlp-url-provider.php' );
		require_once( VLP_DIR . 'includes/admin/providers/class-vlp-url-provider-php.php' );
		require_once( VLP_DIR . 'includes/admin/providers/class-vlp-url-provider-microlink.php' );
		require_once( VLP_DIR . 'includes/admin/providers/class-vlp-url-provider-linkpreview.php' );

		// Register default providers.
		self::register_provider( new VLP_Url_Provider_PHP() );
		self::register_provider( new VLP_Url_Provider_Microlink() );
		self::register_provider( new VLP_Url_Provider_LinkPreview() );

		// Allow filtering providers.
		self::$providers = apply_filters( 'vlp_url_providers', self::$providers );

		self::$initialized = true;
	}

	/**
	 * Register a provider.
	 *
	 * @since    2.3.0
	 * @param    VLP_Url_Provider $provider Provider instance.
	 */
	public static function register_provider( $provider ) {
		if ( $provider instanceof VLP_Url_Provider ) {
			self::$providers[ $provider->get_id() ] = $provider;
		}
	}

	/**
	 * Get metadata for a URL using providers with fallback.
	 *
	 * @since    2.3.0
	 * @param    string $url URL to fetch metadata for.
	 * @param    string $provider_id Optional. Specific provider ID to use. If not provided, tries providers in order.
	 * @return   array|WP_Error Normalized metadata array with 'provider_used' key, or WP_Error on failure.
	 */
	public static function get_metadata( $url, $provider_id = null ) {
		// Ensure providers are initialized.
		if ( empty( self::$providers ) ) {
			self::init();
		}
		// Validate URL.
		$parsed_url = wp_parse_url( $url );
		if ( ! $parsed_url || ! isset( $parsed_url['scheme'] ) || ! in_array( $parsed_url['scheme'], array( 'http', 'https' ), true ) ) {
			return new WP_Error( 'invalid_url', __( 'Invalid URL provided.', 'visual-link-preview' ) );
		}

		// If specific provider requested, try only that provider (no fallback).
		if ( ! empty( $provider_id ) ) {
			if ( ! isset( self::$providers[ $provider_id ] ) ) {
				return new WP_Error( 'invalid_provider', __( 'Invalid provider specified.', 'visual-link-preview' ) );
			}

			$provider = self::$providers[ $provider_id ];
			if ( ! $provider->is_available() ) {
				return new WP_Error( 'provider_unavailable', sprintf( __( 'Provider "%s" is not available.', 'visual-link-preview' ), $provider->get_name() ) );
			}

			$result = $provider->get_metadata( $url );
			if ( is_wp_error( $result ) ) {
				// When manually selecting a provider, return the error directly without fallback.
				// Enhance error message to indicate which provider failed.
				$error_message = $result->get_error_message();
				$provider_name = $provider->get_name();
				return new WP_Error( 
					$result->get_error_code(), 
					sprintf( __( '%s: %s', 'visual-link-preview' ), $provider_name, $error_message ),
					$result->get_error_data()
				);
			}

			$result['provider_used'] = $provider_id;
			return $result;
		}

		// Get provider order from settings.
		$provider_order = self::get_provider_order();

		$last_error = null;

		// Try providers in order until one succeeds.
		foreach ( $provider_order as $pid ) {
			if ( ! isset( self::$providers[ $pid ] ) ) {
				continue;
			}

			$provider = self::$providers[ $pid ];
			if ( ! $provider->is_available() ) {
				continue;
			}

			$result = $provider->get_metadata( $url );
			if ( is_wp_error( $result ) ) {
				$last_error = $result;
				continue;
			}

			// Success! Add provider ID to result.
			$result['provider_used'] = $pid;
			return $result;
		}

		// All providers failed.
		if ( $last_error ) {
			return $last_error;
		}

		return new WP_Error( 'no_providers', __( 'No available providers to fetch metadata.', 'visual-link-preview' ) );
	}

	/**
	 * Get provider order from settings.
	 *
	 * @since    2.3.0
	 * @return   array Array of provider IDs in order.
	 */
	private static function get_provider_order() {
		// Ensure providers are initialized before parsing order.
		if ( empty( self::$providers ) ) {
			self::init();
		}

		$order_setting = VLP_Settings::get( 'url_provider_order' );
		$default_order = array( 'php', 'microlink', 'linkpreview' );

		if ( empty( $order_setting ) ) {
			return $default_order;
		}

		// Parse textarea value (one provider per line).
		$lines = explode( "\n", $order_setting );
		$order = array();

		foreach ( $lines as $line ) {
			$provider_id = trim( $line );
			// Sanitize provider ID to prevent injection.
			$provider_id = sanitize_key( $provider_id );
			if ( ! empty( $provider_id ) && isset( self::$providers[ $provider_id ] ) ) {
				$order[] = $provider_id;
			}
		}

		// If no valid providers found, use default.
		if ( empty( $order ) ) {
			return $default_order;
		}

		return $order;
	}

	/**
	 * Get list of available providers.
	 *
	 * @since    2.3.0
	 * @return   array Array of provider info arrays with 'id', 'name', and 'available' keys.
	 */
	public static function get_available_providers() {
		// Ensure providers are initialized.
		if ( empty( self::$providers ) ) {
			self::init();
		}

		$providers = array();

		foreach ( self::$providers as $provider_id => $provider ) {
			$providers[] = array(
				'id' => $provider_id,
				'name' => $provider->get_name(),
				'available' => $provider->is_available(),
			);
		}

		return $providers;
	}
}
