const BackgroundBorder = {
    header: 'Background & Border',
    properties: [
        {
            id: 'background_color',
            name: 'Background Color',
            type: 'color',
            default: '',
        },
        {
            id: 'border_style',
            name: 'Border Style',
            type: 'dropdown',
            options: {
                '': 'None',
                'solid': 'Solid',
                'dashed': 'Dashed',
                'dotted': 'Dotted',
                'double': 'Double',
                'groove': 'Groove',
                'ridge': 'Ridge',
                'inset': 'Inset',
                'outset': 'Outset',
            },
            default: '',
        },
        {
            id: 'border_width',
            name: 'Border Width',
            type: 'size',
            default: '',
        },
        {
            id: 'border_color',
            name: 'Border Color',
            type: 'color',
            default: '',
        },
        {
            id: 'border_radius',
            name: 'Border Radius',
            type: 'size',
            units: ['px', '%'],
            default: '',
        },
    ],
};

export default BackgroundBorder;