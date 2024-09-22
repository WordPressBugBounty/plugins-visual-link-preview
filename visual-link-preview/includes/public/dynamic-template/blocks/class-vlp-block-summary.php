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
class VLP_Block_Summary extends VLP_Dynamic_Template_Block {
	public function html( $link ) {
		$html = '';
		$summary = wp_kses_post( $link->summary() );

		if ( $summary ) {
			$html .= '<div class="' . esc_attr( $this->block_class() ) . ' vlp-link-summary">';
			$html .= $summary;
			$html .= '</div>';
		}

		return $html;
	}
}
