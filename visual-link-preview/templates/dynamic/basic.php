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
        'padding_left' => '10px',
        'padding_right' => '10px',
        'padding_top' => '10px',
        'padding_bottom' => '10px',
        'margin_left' => '',
        'margin_right' => '',
        'margin_top' => '10px',
        'margin_bottom' => '10px',
        'side_position' => 'left',
    ),
    'zones' => array(
        'main' => array(
            array(
                'type' => 'title',
                'props' => array(
                    'text_style' => 'bold',
                    'text_size' => '1.2em',
                    'text_height' => '2em',
                ),
            ),
            array(
                'type' => 'summary',
            ),
        ),
        'side' => array(
            array(
                'type' => 'image',
                'props' => array(
                    'size' => '150x999',
                ),
            ),
        ),
    ),
);