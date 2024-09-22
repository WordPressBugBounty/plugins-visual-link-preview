<?php
/**
 * Represents a dynamic link template layout.
 *
 * @link       http://bootstrapped.ventures
 * @since      2.2.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 */

/**
 * Represents a dynamic link template layout.
 * 
 * @since      2.2.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
abstract class VLP_Dynamic_Template_Layout {
	/**
	 * Template data.
	 *
	 * @since    2.2.0
	 * @access   private
	 * @var      array $template Template data.
	 */
	private $template = array();

	/**
	 * Get new dynamic template.
	 *
	 * @since    2.2.0
	 * @param	 mixed $template Template data.
	 */
	public function __construct( $template ) {
		// Create blocks in this layout.
		$block_uid = 0;
		foreach ( $template['zones'] as $zone => $blocks ) {
			$block_instances = array();

			foreach ( $blocks as $block ) {
				// Block type must be set.
				if ( ! isset( $block['type'] ) ) {
					continue;
				}

				// Get class name of block.
				$classname = ucwords( str_replace( '-', ' ', str_replace( '_', ' ', $block['type'] ) ) );
				$classname = 'VLP_Block_' . str_replace( ' ', '_', $classname );

				if ( class_exists( $classname ) ) {
					$props = isset( $block['props'] ) ? $block['props'] : array();
					$props['uid'] = $block_uid;
					$block_instances[] = new $classname( $props );

					$block_uid++;
				}
			}

			// Replace block data with block objects.
			$template['zones'][ $zone ] = $block_instances;
		}

		$this->template = $template;
	}

	/**
	 * Get value for layout property.
	 *
	 * @since    2.2.0
	 * @param	 mixed $key 	Property key to get.
	 * @param	 mixed $default Default to return if property is not set.
	 */
	public function prop( $key, $default = false ) {
		if ( isset( $this->template['props'] ) ) {
			if ( isset( $this->template['props'][ $key ] ) ) {
				return $this->template['props'][ $key ];
			}
		}

		return $default;
	}

	/**
	 * Get container class for this template.
	 *
	 * @since    2.2.0
	 */
	public function container_class() {
		$slug = str_replace( ' ', '-', str_replace( '_', '-', $this->template['slug'] ) );
		return 'vlp-layout-' . $slug;
	}

	/**
	 * Get class for a specific layout zone.
	 *
	 * @since    2.2.0
	 */
	public function zone_class( $zone ) {
		$zone = str_replace( ' ', '-', str_replace( '_', '-', $zone ) );
		return 'vlp-layout-zone-' . esc_attr( $zone );
	}

	/**
	 * Get the CSS for this layout.
	 *
	 * @since    2.2.0
	 */
	public function css() {
		$css = array();

		// General container styling
		$container = '.' . $this->container_class();
		$css[ $container ] = array();

		$general_styling_fields = array(
			'background_color',
			'border_width', 'border_style', 'border_color', 'border_radius',
			'padding_left', 'padding_right', 'padding_top', 'padding_bottom',
			'margin_left', 'margin_right', 'margin_top', 'margin_bottom',
		);

		foreach( $general_styling_fields as $field ) {
			if ( $this->prop( $field ) ) {
				$css_field = str_replace( '_', '-', $field );
				$css[ $container ][ $css_field ] = $this->prop( $field );
			}
		}

		// Layout specific CSS.
		if ( method_exists( $this, 'layout_css' ) ) {
			$layout_css = $this->layout_css();

			foreach( $layout_css as $layout_selector => $properties ) {
				$selector = trim( $container . ' ' . $layout_selector );

				if ( array_key_exists( $selector, $css ) ) {
					$css[ $selector ] = array_merge( $css[ $selector ], $properties );
				} else {
					$css[ $selector ] = $properties;
				}
			}
		}

		// Get blocks CSS.
		foreach ( $this->template['zones'] as $zone => $blocks ) {
			foreach ( $blocks as $block ) {
				$block_css = $block->css();
				$block_container = '.' . $block->block_class();

				foreach( $block_css as $block_selector => $properties ) {
					$selector = trim( $container . ' ' . $block_container . ' ' . $block_selector );

					if ( array_key_exists( $selector, $css ) ) {
						$css[ $selector ] = array_merge( $css[ $selector ], $properties );
					} else {
						$css[ $selector ] = $properties;
					}
				}
			}
		}

		// Construct CSS code.
		$code = '';

		foreach ( $css as $selector => $properties ) {
			if ( 0 < count( $properties ) ) {
				$code .= ' ' . $selector . '{';
				
				foreach ( $properties as $property => $value ) {
					$code .= $property . ':' . $value . ';'; 	
				}

				$code .= '}';
			}
		}

		// Optional append code directly (for media queries, for example).
		if ( method_exists( $this, 'layout_css_code' ) ) {
			$code .= $this->layout_css_code();
		}

		return trim( $code );
	}

	/**
	 * Get the HTML output for a specific link.
	 *
	 * @since    2.2.0
	 * @param	 mixed $link Link to get the HTML output for.
	 */
	public function html( $link ) {
		$classes = array(
			'vlp-link-container',
		);
		$classes[] = $this->container_class();
		$classes[] = $link->custom_class();

		$html = '<div class="' . esc_attr( trim (implode( ' ', $classes ) ) ) . '">';
		$html .= $link->output_url(); // Outputs a tag with link.

		// Output zones for this layout.
		$zones = $this->zone_structure();

		$html .= $this->html_for_zones( $link, $zones );

		$html .= '</div>';
		return $html;
	}

	/**
	 * Get the HTML output for an array of layout zones.
	 *
	 * @since    2.2.0
	 * @param	 mixed $link 			Link to output.
	 * @param	 mixed $zones 			Zones to get the HTML output for.
	 */
	protected function html_for_zones( $link, $zones ) {
		$html = '';

		foreach ( $zones as $zone ) {
			if ( is_array( $zone ) ) {
				$inner_html = $this->html_for_zones( $link, $zone );
				
				if ( $inner_html ) {
					$html .= '<div class="vlp-layout-sub-zones">' . $inner_html . '</div>';
				}
			} else {
				$zone_html = '';
				$blocks = isset( $this->template['zones'][ $zone ] ) ? $this->template['zones'][ $zone ] : array();

				foreach ( $blocks as $block ) {
					$zone_html .= $block->html( $link );
				}

				$html .= $this->html_for_zone( $zone, $zone_html );
			}
		}

		return $html;
	}

	/**
	 * Get the HTML output for a specific layout zone.
	 *
	 * @since    2.2.0
	 * @param	 mixed $zone		Layout zone to get the HTML output for.
	 * @param	 mixed $inner_html	Inner HTML to output in this zone.
	 */
	protected function html_for_zone( $zone, $inner_html ) {
		// By default, don't output zone if there is no inner HTML.
		if ( ! $inner_html ) {
			return '';
		}

		// Default to simple div with class name. Can be overwritten be child layout class.
		return '<div class="' . $this->zone_class( $zone ) .'">' . $inner_html . '</div>';
	}

	abstract protected function zone_structure();
}
