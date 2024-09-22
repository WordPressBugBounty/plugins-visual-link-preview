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
class VLP_Block_Url extends VLP_Dynamic_Template_Block {
	public function html( $link ) {
		$html = '';
		$url = $link->url();

		if ( $url ) {
			$url_output = $url;
			$url_parts = parse_url( $url );

			if ( $url_parts ) {
				$url_parts_output = '';

				if ( '1' === $this->prop( 'url_protocol', '1' ) ) {
					if ( isset( $url_parts['scheme'] ) && $url_parts['scheme'] ) {
						$url_parts_output .= $url_parts['scheme'] . '://';
					}
				}

				if ( isset( $url_parts['host'] ) && $url_parts['host'] ) {
					$url_parts_output .= $url_parts['host'];
				}

				if ( '1' === $this->prop( 'url_path', '1' ) ) {
					if ( isset( $url_parts['path'] ) && $url_parts['path'] ) {
						$url_parts_output .= $url_parts['path'];
					}
				}

				if ( $url_parts_output ) {
					$url_output = $url_parts_output;
				}
			}

			$tag = $this->prop( 'tag', 'div' );

			$html .= '<div class="' . esc_attr( $this->block_class() ) . ' vlp-link-url">';
			$html .= $url_output;
			$html .= '</div>';
		}

		return $html;
	}
}
