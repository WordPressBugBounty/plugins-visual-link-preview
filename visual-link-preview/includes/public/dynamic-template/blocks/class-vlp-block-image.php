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
class VLP_Block_Image extends VLP_Dynamic_Template_Block {
	public function css() {
		$css = parent::css();

		$css['']['display'] = 'flex';
		$css['']['overflow'] = 'hidden';

		$css['img'] = array(
			'width' => '100%',
		);

		return $css;
	}

	public function html( $link ) {
		$html = '';

		if ( $link->image_id() ) {
			$size = $this->prop( 'size', 'thumbnail' );

			// Check if size should be handled as array.
			preg_match( '/^(\d+)x(\d+)$/i', $size, $match );
			if ( ! empty( $match ) ) {
				$size = array( intval( $match[1] ), intval( $match[2] ) );
			}
		
			$html .= '<div class="' . esc_attr( $this->block_class() ) . ' vlp-link-image">';
			$html .= $link->image( $size );
			$html .= '</div>';
		}

		return $html;
	}
}
