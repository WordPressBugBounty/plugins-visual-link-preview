import React, { Component, Fragment } from 'react';
import SVG from 'react-inlinesvg';

export default class PropertyIcon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectingIcon: false,
        }
    }

    render() {
        const customSelected = vlp_admin_template.icons.hasOwnProperty(this.props.value);
        const iconUrl = customSelected ? vlp_admin_template.icons[this.props.value].url : this.props.value;

        return (
            <Fragment>
                {
                    ! this.state.selectingIcon
                    ?
                    <span className="vlp-template-property-icon-selected-container">
                        {
                            iconUrl
                            &&
                            <SVG
                                src={iconUrl}
                                className="vlp-template-property-icon-select"
                            />
                        }
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            this.setState({
                                selectingIcon: true,
                            });
                        }}>{ iconUrl ? 'Change...' : 'Select...' }</a>
                    </span>
                    :
                    <div className="vlp-template-property-icon-select-container">
                        <a href="#" onClick={(e) => {
                                e.preventDefault();
                                this.setState({
                                    selectingIcon: false,
                                });

                                return this.props.onValueChange('');
                        }}>Clear icon</a> | <a href="#" onClick={(e) => {
                                e.preventDefault();

                                const url = prompt('Set a custom URL for the icon');

                                if ( url ) {
                                    this.setState({
                                        selectingIcon: false,
                                    });
    
                                    return this.props.onValueChange(url);
                                }
                        }}>Set custom URL</a> | Select:
                        <div className="vlp-template-property-icon-select-container-icons">
                            {
                                Object.keys( vlp_admin_template.icons ).sort().map((id, index) => {
                                    let icon = vlp_admin_template.icons[id];
                                    return (
                                        <span href="#"
                                            onClick={() => {
                                                this.setState({
                                                    selectingIcon: false,
                                                });

                                                if ( icon.id !== this.props.value ) {
                                                    return this.props.onValueChange(icon.id);
                                                }
                                            }}
                                            key={index}
                                        >
                                            <SVG
                                                src={icon.url}
                                                className={ icon.id === this.props.value ? 'vlp-template-property-icon-select vlp-template-property-icon-selected' : 'vlp-template-property-icon-select' }
                                            />
                                        </span>
                                    );
                                })
                            }
                        </div>
                    </div>
                }
            </Fragment>
        );
    }
}