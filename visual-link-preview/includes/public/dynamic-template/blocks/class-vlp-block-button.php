<?php
/**
 * Represents a dynamic link template block.
 *
 * @link       http://bootstrapped.ventures
 * @since      2.2.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public/dynamic-template/layouts
 */

/**
 * Represents a dynamic link template block.
 *
 * @since      2.2.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Block_Button extends VLP_Dynamic_Template_Block {
	public function css() {
		$css = parent::css();

		$css['']['display'] = 'inline-block';

		return $css;
	}

	public function html( $link ) {
		$html = '';
		$text = $this->prop( 'text', _x( 'Read More', 'block title' ) );

		if ( $text ) {
			$html .= '<div class="' . esc_attr( $this->block_class() ) . ' vlp-link-button">';
			$html .= $text;
			$html .= '</div>';
		}

		return $html;
	}
}
