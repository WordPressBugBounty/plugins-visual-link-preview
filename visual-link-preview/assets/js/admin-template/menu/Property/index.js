import React from 'react';

import '../../../../css/admin/template/property.scss';

import Icon from '../../general/Icon';

import PropertyColor from './Color';
import PropertyDropdown from './Dropdown';
import PropertyFont from './Font';
import PropertyIcon from './Icon';
import PropertyImageSize from './ImageSize';
import PropertyNumber from './Number';
import PropertySize from './Size';
import PropertyText from './Text';
import PropertyToggle from './Toggle';

const propertyTypes = {
    color: PropertyColor,
    align: PropertyDropdown,
    border: PropertyDropdown,
    dropdown: PropertyDropdown,
    float: PropertyDropdown,
    font: PropertyFont,
    font_size: PropertySize,
    icon: PropertyIcon,
    image_size: PropertyImageSize,
    percentage: PropertyNumber,
    number: PropertyNumber,
    size: PropertySize,
    text: PropertyText,
    toggle: PropertyToggle,
}

const Property = (props) => {
    const PropertyComponent = propertyTypes.hasOwnProperty(props.property.type) ? propertyTypes[props.property.type] : false;

    if ( ! PropertyComponent ) {
        return null;
    }

    let helpIcon = null;
    if ( props.property.hasOwnProperty( 'help' ) ) {
        helpIcon = (
            <Icon
                type="question"
                title={ props.property.help }
                className="vlp-admin-icon-help"
            />
        );
    }

    return (
        <div className="vlp-template-property">
            <div className="vlp-template-property-label">
                { props.property.name } { helpIcon }
            </div>
            <div className={ `vlp-template-property-value vlp-template-property-value-${props.property.type}` }>
                <PropertyComponent
                    property={ props.property }
                    value={ props.value }
                    onValueChange={ (value) => { props.onPropertyChange( props.property.id, value ); } }
                />
            </div>
        </div>
    );
}

export default Property;