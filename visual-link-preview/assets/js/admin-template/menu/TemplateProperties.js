import React, { Fragment} from 'react';

import Property from './Property';

import BackgroundBorder from './Block/BackgroundBorder';
import Margin from './Block/Margin';
import Padding from './Block/Padding';

const TemplateProperties = (props) => {
    const groups = [
        {
            header: 'General',
            properties: [
                // {
                //     id: 'layout',
                //     name: 'Layout',
                //     type: 'dropdown',
                //     options: {
                //         '2-columns': '2 Columns',
                //     },
                // },
                {
                    id: 'side_position',
                    name: 'Side Position',
                    type: 'dropdown',
                    options: {
                        'left': 'Left',
                        'top': 'Top',
                        'right': 'Right',
                        'bottom': 'Bottom',
                    },
                },
            ],
        },
        BackgroundBorder,
        Padding,
        Margin,
    ];

    return (
        <div id="vlp-template-properties" className="vlp-template-properties">
            <Fragment>
                {
                    groups.map((group, i) => {
                        if ( group.properties.length > 0 ) {
                            return (
                                <Fragment key={i}>
                                    <div className="vlp-template-properties-header">{group.header}</div>
                                    {
                                        group.properties.map((property, j) => {
                                            // Special case for layout property.
                                            if ( 'layout' === property.id ) {
                                                return <Property
                                                        property={ property }
                                                        value={ props.template.layout }
                                                        onPropertyChange={ props.onChangeTemplateProperty }
                                                        key={j}
                                                    />; 
                                            }

                                            // Only for properties that are part of this template.
                                            if ( ! props.template.props.hasOwnProperty( property.id ) ) {
                                                return null;
                                            }

                                            return <Property
                                                        property={ property }
                                                        value={ props.template.props[ property.id ] }
                                                        onPropertyChange={ props.onChangeTemplateProperty }
                                                        key={j}
                                                    />;
                                        })
                                    }
                                </Fragment>
                            )
                        }
                    })
                }
            </Fragment>
        </div>
    );
}

export default TemplateProperties;