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
class VLP_Block_Title extends VLP_Dynamic_Template_Block {
	public function html( $link ) {
		$html = '';
		$title = wp_kses_post( $link->title() );

		if ( $title ) {
			$tag = $this->prop( 'tag', 'div' );

			$html .= '<' . $tag . ' class="' . esc_attr( $this->block_class() ) . ' vlp-link-title">';
			$html .= $title;
			$html .= '</' . $tag . '>';
		}

		return $html;
	}
}
