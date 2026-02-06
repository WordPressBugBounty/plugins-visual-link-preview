<?php
/**
 * Elementor VLP Link Widget.
 *
 * Elementor widget for inserting Visual Link Preview links.
 *
 * @since 2.3.0
 */
class VLP_Elementor_Link_Widget extends \Elementor\Widget_Base {

	/**
	 * Get widget name.
	 *
	 * @since 2.3.0
	 */
	public function get_name() {
		return 'vlp-link-preview';
	}

	/**
	 * Get widget title.
	 *
	 * @since 2.3.0
	 */
	public function get_title() {
		return __( 'Visual Link Preview', 'visual-link-preview' );
	}

	/**
	 * Get widget icon.
	 *
	 * @since 2.3.0
	 */
	public function get_icon() {
		return 'eicon-link';
	}

	/**
	 * Get widget categories.
	 *
	 * @since 2.3.0
	 */
	public function get_categories() {
		return array( 'visual-link-preview' );
	}

	/**
	 * Get widget keywords.
	 *
	 * @since 2.3.0
	 */
	public function get_keywords() {
		return array( 'vlp', 'visual', 'link', 'preview' );
	}

	/**
	 * Register widget controls.
	 *
	 * @since 2.3.0
	 */
	protected function register_controls() {
		$this->start_controls_section(
			'content_section',
			array(
				'label' => __( 'Visual Link Preview', 'visual-link-preview' ),
				'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'vlp_create',
			array(
				'type'       => \Elementor\Controls_Manager::BUTTON,
				'text'       => __( 'Create visual link', 'visual-link-preview' ),
				'event'      => 'vlp:link:create',
				'conditions' => array(
					'terms' => array(
						array(
							'name'     => 'vlp_encoded',
							'operator' => '==',
							'value'    => '',
						),
					),
				),
			)
		);

		$this->add_control(
			'vlp_edit',
			array(
				'type'       => \Elementor\Controls_Manager::BUTTON,
				'text'       => __( 'Edit visual link', 'visual-link-preview' ),
				'event'      => 'vlp:link:edit',
				'conditions' => array(
					'terms' => array(
						array(
							'name'     => 'vlp_encoded',
							'operator' => '!=',
							'value'    => '',
						),
					),
				),
			)
		);

		$this->add_control(
			'vlp_encoded',
			array(
				'type'    => \Elementor\Controls_Manager::HIDDEN,
				'default' => '',
			)
		);

		$this->add_control(
			'vlp_link_builder',
			array(
				'type' => 'vlp-link-builder',
			)
		);

		$this->add_control(
			'vlp_unset',
			array(
				'type'       => \Elementor\Controls_Manager::BUTTON,
				'text'       => __( 'Unset visual link', 'visual-link-preview' ),
				'event'      => 'vlp:link:unset',
				'conditions' => array(
					'terms' => array(
						array(
							'name'     => 'vlp_encoded',
							'operator' => '!=',
							'value'    => '',
						),
					),
				),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Render widget output on the frontend.
	 *
	 * @since 2.3.0
	 */
	protected function render() {
		$output  = '';
		$encoded = trim( $this->get_settings_for_display( 'vlp_encoded' ) );

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			if ( '' !== $encoded ) {
				$link = new VLP_Link( $encoded );

				$template = VLP_Template_Manager::get_template_by_slug( $link->template() );
				if ( $template ) {
					$output .= '<style type="text/css">' . VLP_Template_Manager::get_template_css( $template ) . VLP_Template_Style::get_css() . '</style>';
				}

				$output .= $link->output();
			} else {
				$output = '<div style="font-family: monospace;font-style:italic;cursor:pointer;">&lt;' . esc_html__( 'Click and select a Visual Link Preview in the sidebar.', 'visual-link-preview' ) . '&gt;</div>';
			}
		} else {
			if ( '' !== $encoded ) {
				$link   = new VLP_Link( $encoded );
				$output = $link->output();
			}
		}

		echo $output;
	}
}
