<?php
/**
 * Responsible for the link template editor.
 *
 * @link       http://bootstrapped.ventures
 * @since      2.2.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 */

/**
 * Responsible for the link template editor.
 *
 * @since      2.2.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Template_Editor {
	/**
	 * Register actions and filters.
	 *
	 * @since    2.2.0
	 */
	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'add_submenu_page' ), 20 );
	}

	/**
	 * Add the template editor submenu page.
	 *
	 * @since	2.2.0
	 */
	public static function add_submenu_page() {
		add_submenu_page( '', __( 'VLP Template Editor', 'visual-link-preview' ), __( 'Template Editor', 'visual-link-preview' ), 'manage_options', 'vlp_template_editor', array( __CLASS__, 'template_editor_page_template' ) );
	}

	/**
	 * Get the template for the template editor page.
	 *
	 * @since	2.2.0
	 */
	public static function template_editor_page_template() {
		self::localize_admin_template();
		echo '<div id="vlp-template-editor" class="wrap">Loading...</div>';
	}

	/**
	 * Localize JS for the template editor page.
	 *
	 * @since	2.2.0
	 */
	public static function localize_admin_template() {
		wp_localize_script( 'vlp-admin-template', 'vlp_admin_template', array(
			'templates' => self::get_templates_for_editor(),
			'thumbnail_sizes' => get_intermediate_image_sizes(),
			'blocks' => self::get_all_blocks(),
		) );
	}

	/**
	 * Get templates for Template Editor with preview.
	 *
	 * @since	2.2.0
	 */
	public static function get_templates_for_editor() {
		$templates = VLP_Template_Manager::get_dynamic_templates();

		foreach ( $templates as $slug => $template ) {
			$templates[ $slug ] = self::prepare_template_for_editor( $template );
		}

		return $templates;
	}

	/**
	 * Prepare a template for the template editor.
	 *
	 * @since	2.2.0
	 * @param	mixed $template Template to prepare.
	 */
	public static function prepare_template_for_editor( $template ) {
		$template['preview'] = self::get_preview_link_output( $template );

		// Add unused blocks.
		$used_blocks = array();

		foreach ( $template['zones'] as $zone => $blocks ) {
			if ( 'unused' !== $zone ) {
				foreach ( $blocks as $block ) {
					$used_blocks[] = $block['type'];
				}
			}
		}

		// Add any unused blocks to template.
		$template['zones']['unused'] = array();

		$all_blocks = self::get_all_blocks();
		foreach ( $all_blocks as $block => $label ) {
			if ( ! in_array( $block, $used_blocks ) ) {
				$template['zones']['unused'][] = array(
					'type' => $block,
				);
			}
		}

		return $template;
	}

	/**
	 * Get all blocks that can be used in the Template Editor.
	 *
	 * @since	2.2.0
	 */
	public static function get_all_blocks() {
		$blocks = array(
			'button' => __( 'Button', 'visual-link-preview' ),
			'image' => __( 'Image', 'visual-link-preview' ),
			'title' => __( 'Title', 'visual-link-preview' ),
			'summary' => __( 'Summary', 'visual-link-preview' ),
			'url' => __( 'URL', 'visual-link-preview' ),
		);

		return $blocks;
	}

	/**
	 * Get a preview link object.
	 *
	 * @since    2.2.0
	 */
	public static function get_preview_link() {
		$properties = array(
			'type' => 'external',
			'url' => 'https://wordpress.org/plugins/visual-link-preview/',
			'image_id' => -1,
			'image_url' => VLP_URL . 'assets/images/logo.png',
			'title' => 'Visual Link Preview',
			'summary' => 'A great WordPress plugin made in Belgium. Built with love by Bootstrapped Ventures.',
		);

		$encoded = base64_encode( json_encode( $properties ) );
		return new VLP_Link( $encoded );
	}

	/**
	 * Get the preview for a link.
	 *
	 * @since    2.2.0
	 */
	public static function get_preview_link_output( $template ) {
		$link = self::get_preview_link();

		$css = VLP_Template_Manager::get_template_css( $template );
		$html = VLP_Template_Manager::get_template_html( $template, $link );

		$output = '<style type="text/css">' . $css . '</style>' . $html;
		return $output;
	}
}

VLP_Template_Editor::init();
