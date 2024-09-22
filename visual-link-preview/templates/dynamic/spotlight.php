<?php
$template = array(
    'layout' => '2-columns',
    'props' => array(
        'background_color' => 'white',
        'text_color' => 'white',
        'border_width' => '1px',
        'border_style' => 'solid',
        'border_color' => 'black',
        'border_radius' => '5px',
        'padding_left' => '',
        'padding_right' => '',
        'padding_top' => '',
        'padding_bottom' => '0px',
        'margin_left' => '',
        'margin_right' => '',
        'margin_top' => '10px',
        'margin_bottom' => '10px',
        'side_position' => 'top',
    ),
    'zones' => array(
        'main' => array(
            array (
                'type' => 'title',
                'props' => array (
                    'text_style' => 'bold',
                    'text_size' => '1.2em',
                    'text_height' => '2em',
                    'margin_left' => '10px',
                    'margin_right' => '10px',
                    'padding_top' => '',
                ),
            ),
            array(
                'type' => 'summary',
                'props' => array (
                    'margin_left' => '10px',
                    'margin_right' => '10px',
                    'margin_bottom' => '10px',
                ),
            ),
            array(
                'type' => 'button',
                'props' => array (
                    'margin_left' => '10px',
                    'margin_right' => '10px',
                    'margin_top' => '10px',
                    'margin_bottom' => '10px',
                    'border_style' => 'solid',
                    'border_width' => '1px',
                    'border_color' => '#000000',
                    'border_radius' => '5px',
                    'padding_left' => '7px',
                    'padding_top' => '5px',
                    'padding_right' => '7px',
                    'padding_bottom' => '5px',
                    'background_color' => '#000000',
                    'text_color' => '#ffffff',
                    'text_style' => 'normal',
                    'text_align' => 'inherit',
                ),
            ),
            array(
                'type' => 'url',
                'props' => array (
                    'url_protocol' => '0',
                    'url_path' => '0',
                    'text_size' => '0.8em',
                    'margin_left' => '10px',
                    'margin_right' => '10px',
                    'margin_top' => '',
                    'margin_bottom' => '5px',
                ),
            ),
        ),
        'side' => array(
            array (
                'type' => 'image',
                'props' => array (
                    'size' => 'large',
                ),
            ),
        ),
    ),
);