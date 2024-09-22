<?php
/**
 * Responsible for the link preview template.
 *
 * @link       http://bootstrapped.ventures
 * @since      1.1.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 */

/**
 * Responsible for the link preview template.
 *
 * @since      1.1.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Template_Manager {
	/**
	 * Cached version of all the available templates.
	 *
	 * @since    1.1.0
	 * @access   private
	 * @var      array    $templates    Array containing all templates that have been loaded.
	 */
	private static $templates = array();

	/**
	 * Templates used in the output.
	 *
	 * @since    2.0.0
	 * @access   private
	 * @var      array    $used_templates    Array containing all templates that have been used in the output.
	 */
	private static $used_templates = array();

	/**
	 * Register actions and filters.
	 *
	 * @since    1.1.0
	 */
	public static function init() {
		add_action( 'wp_footer', array( __CLASS__, 'templates_css' ) );

		add_action( 'wp_ajax_vlp_get_template', array( __CLASS__, 'ajax_get_template' ) );
	}

	/**
	 * Add CSS to footer for all templates used on this page.
	 *
	 * @since	2.0.0
	 */
	public static function templates_css() {
		if ( count( self::$used_templates ) ) {
			$style = '';
			
			foreach ( self::$used_templates as $slug => $template ) {
				$style .= self::get_template_css( $template );
			}

			$style .= VLP_Template_Style::get_css();

			if ( $style ) {
				echo '<style type="text/css">' . $style . '</style>';
			}
		}
	}

	/**
	 * Get template for a specific link.
	 *
	 * @since    1.1.0
	 * @param	 object $link Link object to get the template for.
	 * @param    mixed  $slug Slug of the specific template we want.
	 */
	public static function get_template( $link, $slug ) {
		$template = self::get_template_by_slug( $slug );

		if ( ! $template ) {
			return '';
		}

		// Make sure we'll load CSS later.
		if ( ! array_key_exists( $template['slug'], self::$used_templates ) ) {
			self::$used_templates[ $template['slug'] ] = $template;
		}

		// Get HTML, filter and return.
		$html = self::get_template_html( $template, $link );
		return apply_filters( 'vlp_get_template', $html, $link, $slug );
	}

	/**
	 * Get template HTML for a specific link.
	 *
	 * @since    2.2.0
	 * @param	 object $link Link object to get the template for.
	 * @param    mixed  $slug Slug of the specific template we want.
	 */
	public static function get_template_html( $template, $link ) {
		if ( isset( $template['type'] ) && 'dynamic' === $template['type'] ) {
			$dynamic_template = new VLP_Dynamic_Template( $template );
			$html = $dynamic_template->html( $link );
		} else {
			ob_start();
			require( $template['dir'] . '/' . $template['slug'] . '.php' );
			$html = ob_get_contents();
			ob_end_clean();

			$html = do_shortcode( $html );
		}

		return $html;
	}

	/**
	 * Get CSS for a specific template.
	 *
	 * @since	2.0.0
	 * @param	object $template Template to get the CSS for.
	 */
	public static function get_template_css( $template ) {
		$css = '';

		if ( ! $template ) {
			return $css;
		}

		if ( isset( $template['type'] ) && 'dynamic' === $template['type'] ) {
			$dynamic_template = new VLP_Dynamic_Template( $template );
			$css = $dynamic_template->css();
		} else {
			// Get CSS from stylesheet.
			if ( $template['stylesheet'] ) {
				ob_start();
				include( $template['dir'] . '/' . $template['stylesheet'] );
				$css .= ob_get_contents();
				ob_end_clean();
			}
		}

		return $css;
	}

	/**
	 * Search for posts by keyword.
	 *
	 * @since    1.0.0
	 */
	public static function ajax_get_template() {
		if ( check_ajax_referer( 'vlp', 'security', false ) ) {
			$encoded = isset( $_POST['encoded'] ) ? sanitize_text_field( wp_unslash( $_POST['encoded'] ) ) : ''; // Input var okay.
			$link = new VLP_Link( $encoded );

			$template = VLP_Template_Manager::get_template_by_slug( $link->template() );

			$output = '<style type="text/css">' . VLP_Template_Manager::get_template_css( $template ) . VLP_Template_Style::get_css() . '</style>';
			$output .= $link->output();

			wp_send_json_success( array(
				'template' => $output,
			) );
		}

		wp_die();
	}

	/**
	 * Get template by name.
	 *
	 * @since    1.1.0
	 * @param		 mixed $slug Slug of the template we want to get.
	 */
	public static function get_template_by_slug( $slug ) {
		$templates = self::get_templates();

		$template = isset( $templates[ $slug ] ) ? $templates[ $slug ] : false;

		// Use default template if none found.
		if ( ! $template ) {
			$slug = VLP_Settings::get( 'template_default' );
			$template = isset( $templates[ $slug ] ) ? $templates[ $slug ] : false;
		}

		// Use default for setting if none found.
		if ( ! $template ) {
			$slug = VLP_Settings::get_default( 'template_default' );
			$template = isset( $templates[ $slug ] ) ? $templates[ $slug ] : false;
		}

		return $template;
	}

	/**
	 * Get all available templates.
	 *
	 * @since    1.1.0
	 */
	public static function get_templates() {
		if ( empty( self::$templates ) ) {
			self::load_templates();
		}

		return self::$templates;
	}

	/**
	 * Save a template.
	 *
	 * @since	2.2.0
	 * @param	mixed $template Template to save.
	 */
	public static function save_template( $template ) {
		$templates = self::get_templates();
		$slug = isset( $template['slug'] ) ? sanitize_title( $template['slug'] ) : false;

		// New slug needed.
		if ( ! $slug || ( array_key_exists( $slug, $templates ) && ! $template['custom'] ) ) {
			$slug_base = sanitize_title( $template['name'], 'template' );

			$slug = $slug_base;
			$i = 2;
			while ( array_key_exists( $slug, $templates ) ) {
				$slug = $slug_base . '-' . $i;
				$i++;
			}
		}

		// Sanitize template.
		$sanitized_template['type'] = 'dynamic';
		$sanitized_template['custom'] = true;
		$sanitized_template['dir'] = false;
		$sanitized_template['url'] = false;
		$sanitized_template['stylesheet'] = false;
		$sanitized_template['slug'] = $slug;
		$sanitized_template['name'] = sanitize_text_field( $template['name'] );

		// Template fields itself.
		$sanitized_template['layout'] = $template['layout'];
		$sanitized_template['props'] = $template['props'];
		$sanitized_template['zones'] = $template['zones'];

		// Make sure list of templates is up to date.
		$templates = get_option( 'vlp_templates', array() );
		if ( ! in_array( $slug, $templates ) ) {
			$templates[] = $slug;
			update_option( 'vlp_templates', $templates );
		}

		// Save template in cache and database.
		self::$templates[$slug] = $sanitized_template;
		update_option( 'vlp_template_' . $slug, $sanitized_template );

		return $sanitized_template;
	}

	/**
	 * Delete a template.
	 *
	 * @since	2.2.0
	 * @param	mixed $slug Slug of the template to delete.
	 */
	public static function delete_template( $slug ) {
		$slug = sanitize_title( $slug );

		// Make sure list of templates is up to date.
		$templates = get_option( 'vlp_templates', array() );
		if ( false !== ( $index = array_search( $slug, $templates ) ) ) {
			unset( $templates[ $index ] );
		}
		update_option( 'vlp_templates', $templates );
		delete_option( 'vlp_template_' . $slug );

		return $slug;
	}

	/**
	 * Get all available dynamic templates.
	 *
	 * @since    2.2.0
	 */
	public static function get_dynamic_templates() {
		$dynamic_templates = array();
		$templates = self::get_templates();

		foreach ( $templates as $slug => $template ) {
			if ( 'dynamic' === $template['type'] ) {
				$dynamic_templates[ $slug ] = $template;
			}
		}

		return $dynamic_templates;
	}

	/**
	 * Load all available templates.
	 *
	 * @since    1.1.0
	 */
	private static function load_templates() {
		$static_templates = self::load_static_templates();
		$dynamic_templates = self::load_dynamic_templates();

		// Later slugs will overwrite, so dynamic templates will take over static ones.
		self::$templates = array_merge( $static_templates, $dynamic_templates );
	}

	/**
	 * Load all dynamic templates.
	 *
	 * @since    2.2.0
	 */
	private static function load_dynamic_templates() {
		$templates = array();

		// Default dynamic templates.
		$dir = VLP_DIR . 'templates/dynamic';
		if ( $handle = opendir( $dir ) ) {
			while ( false !== ( $file = readdir( $handle ) ) ) {
				preg_match( '/^(.*?).php/', $file, $match );
				if ( isset( $match[1] ) ) {
					$slug = $match[1];
					$file = $match[0];
					
					$template = false;
					require_once( $dir . '/' . $file );

					if ( false !== $template ) {
						$templates[ $match[1] ] = array_merge( $template, array(
							'type' => 'dynamic',
							'custom' => false,
							'slug' => $slug,
							'name' => ucfirst( str_replace( '-', ' ', str_replace( '_', ' ', $slug ) ) ),
						) );
					}
				}
			}
		}

		// Load edited templates from database.
		$db_templates = get_option( 'vlp_templates', array() );

		foreach ( $db_templates as $slug ) {
			$template = get_option( 'vlp_template_' . $slug, false );

			if ( $template ) {
				$template['type'] = 'dynamic';
				$template['custom'] = true;

				$templates[ $slug ] = array_merge( $template, array(
					'type' => 'dynamic',
					'custom' => true,
					'slug' => $slug,
				) );
			}
		}
		
		return $templates;
	}

	/**
	 * Load all static templates.
	 *
	 * @since    1.1.0
	 */
	private static function load_static_templates() {
		$templates = array();

		// Load included templates.
		$dirs = array_filter( glob( VLP_DIR . 'templates/link/*' ), 'is_dir' );
		$url = VLP_URL . 'templates/link/';

		foreach ( $dirs as $dir ) {
			$template = self::load_static_template( $dir, $url, false );
			$templates[ $template['slug'] ] = $template;
		}

		// Load custom templates from parent theme.
		$theme_dir = get_template_directory();

		if ( file_exists( $theme_dir . '/vlp-templates' ) && file_exists( $theme_dir . '/vlp-templates/link' ) ) {
			$url = get_template_directory_uri() . '/vlp-templates/link/';

			$dirs = array_filter( glob( $theme_dir . '/vlp-templates/link/*' ), 'is_dir' );

			foreach ( $dirs as $dir ) {
				$template = self::load_static_template( $dir, $url, true );
				$templates[ $template['slug'] ] = $template;
			}
		}

		// Load custom templates from child theme (if present).
		if ( get_stylesheet_directory() !== $theme_dir ) {
			$theme_dir = get_stylesheet_directory();

			if ( file_exists( $theme_dir . '/vlp-templates' ) && file_exists( $theme_dir . '/vlp-templates/link' ) ) {
				$url = get_stylesheet_directory_uri() . '/vlp-templates/link/';

				$dirs = array_filter( glob( $theme_dir . '/vlp-templates/link/*' ), 'is_dir' );

				foreach ( $dirs as $dir ) {
					$template = self::load_static_template( $dir, $url, true );
					$templates[ $template['slug'] ] = $template;
				}
			}
		}

		return $templates;
	}

	/**
	 * Load template from directory.
	 *
	 * @since    1.1.0
	 * @param    mixed 	 $dir 	 Directory to load the template from.
	 * @param	 mixed 	 $url 	 URL to load the template from.
	 * @param	 boolean $custom Wether or not this is a custom template included by the user.
	 */
	private static function load_static_template( $dir, $url, $custom = false ) {
		$slug = basename( $dir );
		$name = ucwords( str_replace( '-', ' ', $slug ) );

		// Allow both .min.css and .css as extension.
		$stylesheet = file_exists( $dir . '/' . $slug . '.min.css' ) ? $slug . '.min.css' : $slug . '.css';

		return array(
			'type' => 'static',
			'custom' => $custom,
			'name' => $name,
			'slug' => $slug,
			'dir' => $dir,
			'url' => $url . $slug,
			'stylesheet' => $stylesheet,
		);
	}
}

VLP_Template_Manager::init();
