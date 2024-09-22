import React, { Component, Fragment } from 'react';

export default class PropertySize extends Component {
    constructor(props) {
        super(props);

        this.state = {
            units: props.property.hasOwnProperty( 'units' ) ? props.property.units : ['px', 'em'],
        };
    }

    changeNumber( value ) {
        const { number, unit } = this.getNumber( value );
        this.props.onValueChange( `${number}${unit}` );
    }

    getNumber( value ) {
        const split = value.match(/([+-]?\d*\.?\d*)\s*([^;]*)/);

        const number = split ? split[1] : '';
        let unit = split ? split[2] : '';

        // No unit without number.
        if ( '' === number ) {
            unit = '';
        }

        // No number without unit.
        if ( '' !== number && '' === unit ) {
            unit = this.state.units[0];
        }

        return {
            number,
            unit,
        };
    }

    render() {
        const { number, unit } = this.getNumber( this.props.value );
        let unitOptions = [ ...this.state.units ];

        if ( unit && ! unitOptions.includes( unit ) ) {
            unitOptions.push( unit );
        }

        return (
            <Fragment>
                <input
                    className="vlp-template-property-input"
                    type="number"
                    step={ 'em' === unit ? '0.1' : '1' }
                    value={ number }
                    onChange={ (e) => this.changeNumber( `${e.target.value}${unit}` ) }
                />
                {
                    unitOptions.map((unitOption, index) => (
                        <span
                            className={ unitOption === unit ? 'vlp-template-property-value-size-unit vlp-template-property-value-size-unit-selected' : 'vlp-template-property-value-size-unit' }
                            onClick={ () => this.changeNumber( `${number}${unitOption}` ) }
                            key={ index }
                        >{ unitOption }</span>
                    ))
                }
            </Fragment>
        );
    }
}