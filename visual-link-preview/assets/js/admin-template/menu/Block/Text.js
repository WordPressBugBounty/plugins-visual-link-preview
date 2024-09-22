const Text = {
    header: 'Text',
    properties: [
        {
            id: 'text_size',
            name: 'Text Size',
            type: 'size',
            default: '1em',
        },
        {
            id: 'text_height',
            name: 'Text Line Height',
            type: 'size',
            default: '1em',
        },
        {
            id: 'text_color',
            name: 'Text Color',
            type: 'color',
            default: 'black',
        },
        {
            id: 'text_style',
            name: 'Text Style',
            type: 'dropdown',
            options: {
                'normal': 'Normal',
                'bold': 'Bold',
                'italic': 'Italic',
            },
            default: 'normal',
        },
        {
            id: 'text_align',
            name: 'Text Align',
            type: 'dropdown',
            options: {
                'inherit': 'Inherit',
                'left': 'Left',
                'center': 'Center',
                'right': 'Right',
            },
            default: 'inherit',
        },
        {
            id: 'font_family',
            name: 'Font Familiy',
            type: 'font',
            default: 'inherit',
        },
    ],
};

export default Text;