<?php
/**
 * Represents a dynamic link template layout.
 *
 * @link       http://bootstrapped.ventures
 * @since      2.2.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public/dynamic-template/layouts
 */

/**
 * Represents a dynamic link template layout.
 *
 * @since      2.2.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Layout_2_Columns extends VLP_Dynamic_Template_Layout {
	protected function zone_structure() {
		return array(
			'side',
			'main',
		);
	}

	protected function layout_css() {
		$css = array(
			'' => array(),
		);

		$css['']['display'] = 'flex';

		// Main zone.
		$main = '.' . $this->zone_class( 'main' );

		$css[ $main ] = array(
			'flex' => '1',
		);

		// Side zone.
		$side = '.' . $this->zone_class( 'side' );

		$css[ $side ] = array(
			'flex-shrink' => 0,
			'max-width' => '100%',
		);

		switch ( $this->prop( 'side_position', 'left' ) ) {
			case 'left':
				$css[ $side ]['padding-right'] = '10px';
				break;
			case 'right':
				$css['']['flex-direction'] = 'row-reverse';
				$css[ $side ]['padding-left'] = '10px';
				break;
			case 'top':
				$css['']['flex-direction'] = 'column';
				$css[ $side ]['margin'] = '0 auto';
				$css[ $side ]['padding-bottom'] = '10px';
				break;
			case 'bottom':
				$css['']['flex-direction'] = 'column-reverse';
				$css[ $side ]['margin'] = '0 auto';
				$css[ $side ]['padding-top'] = '10px';
				break;
		}

		return $css;
	}

	protected function layout_css_code() {
		$container = '.' . $this->container_class();
		$side = '.' . $this->zone_class( 'side' );

		$code = '@media all and (max-width: 450px) {';
		$code .= $container . '{flex-wrap: wrap;}';
		$code .= $container . ' ' . $side . '{margin: 0 auto;padding:0;}';
		$code .= '}';

		return $code;
	}
}
