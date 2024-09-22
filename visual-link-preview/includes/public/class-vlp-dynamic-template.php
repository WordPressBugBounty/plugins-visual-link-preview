<?php
/**
 * Represents a dynamic link template.
 *
 * @link       http://bootstrapped.ventures
 * @since      2.2.0
 *
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 */

/**
 * Represents a dynamic link template.
 *
 * @since      2.2.0
 * @package    Visual_Link_Preview
 * @subpackage Visual_Link_Preview/includes/public
 * @author     Brecht Vandersmissen <brecht@bootstrapped.ventures>
 */
class VLP_Dynamic_Template {

	/**
	 * Layout for this template.
	 *
	 * @since    2.2.0
	 * @access   private
	 * @var      array $layout Layout for this template.
	 */
	private $layout = false;

	/**
	 * Get new dynamic template.
	 *
	 * @since    2.2.0
	 * @param	 mixed $template Template data.
	 */
	public function __construct( $template ) {
		$layout_key = isset( $template['layout'] ) ? $template['layout'] : false;

		if ( $layout_key ) {
			// Get class name of layout.
			$classname = ucwords( str_replace( '-', ' ', str_replace( '_', ' ', $layout_key ) ) );
			$classname = 'VLP_Layout_' . str_replace( ' ', '_', $classname );

			if ( class_exists( $classname ) ) {
				$this->layout = new $classname( $template );
			}
		}
	}

	/**
	 * Get the CSS for this template.
	 *
	 * @since    2.2.0
	 */
	public function css() {
		return false === $this->layout ? '' : $this->layout->css();
	}

	/**
	 * Get the HTML output for a specific link.
	 *
	 * @since    2.2.0
	 * @param	 mixed $link Link to get the HTML output for.
	 */
	public function html( $link ) {
		return false === $this->layout ? '' : $this->layout->html( $link );
	}
}
