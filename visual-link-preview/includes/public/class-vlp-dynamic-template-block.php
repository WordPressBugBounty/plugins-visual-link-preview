<?php
/**
 * Represents a dynamic link template block.
 *
 * @link       http://bootstrapped.ventures
 * @since      2.2.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 */

/**
 * Represents a dynamic link template block.
 * 
 * @since      2.2.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
abstract class VLP_Dynamic_Template_Block {
	/**
	 * Block properties.
	 *
	 * @since    2.2.0
	 * @access   private
	 * @var      array $props Block properties.
	 */
	private $props = array();

	/**
	 * Get new dynamic template.
	 *
	 * @since    2.2.0
	 * @param	 mixed $template Template data.
	 */
	public function __construct( $props ) {
		$this->props = $props;
	}

	/**
	 * Get value for block property.
	 *
	 * @since    2.2.0
	 * @param	 mixed $key 	Property key to get.
	 * @param	 mixed $default Default to return if property is not set.
	 */
	public function prop( $key, $default = false ) {
		if ( isset( $this->props[ $key ] ) ) {
			return $this->props[ $key ];
		}

		return $default;
	}

	/**
	 * Get class for this block.
	 *
	 * @since    2.2.0
	 */
	public function block_class() {
		return 'vlp-block-' . $this->props['uid'];
	}

	/**
	 * Get CSS for this block.
	 *
	 * @since    2.2.0
	 */
	public function css() {
		$css = array();
		$props = $this->props;
		
		// Container CSS.
		$css[''] = array();
		
		// Common props.
		if ( isset( $props['text_style'] ) ) {
			switch ( $props['text_style'] ) {
				case 'bold':
					$css['']['font-weight'] = 'bold';
					break;
				case 'italic':
					$css['']['font-style'] = 'italic';
					break;
			}
		}

		if ( isset( $props['text_size'] ) ) { $css['']['font-size'] = $props['text_size']; }
		if ( isset( $props['text_height'] ) ) { $css['']['line-height'] = $props['text_height']; }
		if ( isset( $props['text_color'] ) ) { $css['']['color'] = $props['text_color']; }

		// Common props that match CSS name.
		$general_styling_fields = array(
			'text_align', 'font_family',
			'background_color', 'border_width', 'border_style', 'border_color', 'border_radius',
			'padding_left', 'padding_right', 'padding_top', 'padding_bottom',
			'margin_left', 'margin_right', 'margin_top', 'margin_bottom',
		);

		foreach( $general_styling_fields as $field ) {
			if ( isset( $props[ $field ] ) && $props[ $field ] ) {
				$css_field = str_replace( '_', '-', $field );
				$css[''][ $css_field ] = $props[ $field ];
			}
		}


		return $css;
	}

	abstract public function html( $link );
}
