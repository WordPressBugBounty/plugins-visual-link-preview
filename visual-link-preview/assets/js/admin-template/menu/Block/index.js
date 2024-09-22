import React, { Fragment } from 'react';

import Property from '../Property';

import BackgroundBorder from './BackgroundBorder';
import Margin from './Margin';
import Padding from './Padding';
import Text from './Text';

const Block = (props) => {
    const blockType = props.block.type;
    const blockProps = props.block.hasOwnProperty( 'props' ) ? props.block.props : {};

    let groups = [];

    // Add properties for different blocks.
    switch ( blockType ) {
        case 'button':
            groups = [
                {
                    header: 'Button',
                    properties: [
                        {
                            id: 'text',
                            name: 'Text',
                            type: 'text',
                            default: 'Read More',
                        },
                    ],
                },
                Text,
            ];
            break;
        case 'url':
            groups = [
                {
                    header: 'URL Display',
                    properties: [
                        {
                            id: 'url_protocol',
                            name: 'Show Protocol',
                            type: 'toggle',
                            default: '1',
                        },
                        {
                            id: 'url_path',
                            name: 'Show Path',
                            type: 'toggle',
                            default: '1',
                        },
                    ],
                },
                Text,
            ];
            break;
        case 'title':
            groups = [
                {
                    header: 'Title',
                    properties: [
                        {
                            id: 'tag',
                            name: 'Tag',
                            type: 'dropdown',
                            options: {
                                span: 'span',
								div: 'div',
								h1: 'h1',
								h2: 'h2',
								h3: 'h3',
								h4: 'h4',
								h5: 'h5',
								h6: 'h6',
                            },
                            default: 'div',
                        },
                    ],
                },
                Text,
            ];
            break;
        case 'summary':
            groups = [
                Text,
            ];
            break;
        case 'image':
            groups = [
                {
                    header: 'Image',
                    properties: [
                        {
                            id: 'size',
                            name: 'Image Size',
                            type: 'image_size',
                            default: '150x999',
                        },
                    ],
                },
            ];
            break;
    }

    // Padding and margin options for every block.
    groups = [
        ...groups,
        BackgroundBorder,
        Padding,
        Margin,
    ]

    return (
        <Fragment>
            {
                groups.map((group, i) => {
                    return (
                        <Fragment key={i}>
                            {
                                group.hasOwnProperty( 'header' )
                                && <div className="vlp-template-block-header">{ group.header }</div>
                            }
                            {
                                group.properties.map((property, j) => {
                                    const value = blockProps.hasOwnProperty( property.id ) ? blockProps[ property.id ] : property.default;

                                    return <Property
                                                property={ property }
                                                value={ value }
                                                onPropertyChange={ ( propertyId, propertyValue ) => {
                                                    let newBlock = JSON.parse( JSON.stringify( props.block ) );

                                                    if ( ! newBlock.hasOwnProperty( 'props' ) ) {
                                                        newBlock.props = {};
                                                    }

                                                    newBlock.props[ propertyId ] = propertyValue;

                                                    props.onBlockChange( newBlock );
                                                } }
                                                key={j}
                                            />;
                                })
                            }
                        </Fragment>
                    )
                })
            }
        </Fragment>
    );
}

export default Block;