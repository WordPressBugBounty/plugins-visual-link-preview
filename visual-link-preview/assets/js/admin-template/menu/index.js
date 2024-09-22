import React, { Fragment } from 'react';

import '../../../css/admin/template/menu.scss';

import Icon from '../general/Icon';
import Loader from '../general/Loader';
import TemplateBlocks from './TemplateBlocks';
import TemplateProperties from './TemplateProperties';
import TemplateZones from './TemplateZones';

const Menu = (props) => {
    return (
        <div id="vlp-template-sidebar">
            {
                props.editing
                &&
                <div id="vlp-template-buttons">
                    <p>Editing template: { props.template.name }</p>
                    {
                        props.savingTemplate
                        ?
                        <Loader/>
                        :
                        <Fragment>
                            <button
                                className="button button-primary"
                                disabled={ ! props.changesMade }
                                onClick={() => {
                                    if ( confirm( 'Are you sure you want to save your changes?' ) ) {
                                        props.onSaveTemplate({
                                            ...props.template,
                                        });
                                    }
                                }}
                            >{ props.savingTemplate ? '...' : 'Save Changes' }</button>
                            <button
                                className="button"
                                onClick={() => {
                                    if ( ! props.changesMade || confirm( 'Are you sure you want to cancel your changes?' ) ) {
                                        props.onChangeEditing(false);
                                    }
                                }}
                            >{ props.changesMade ? "Cancel Changes" : "Stop Editing" }</button>
                        </Fragment>
                    }
                </div>
            }
            <div id="vlp-template-menu">
                {
                    ! props.editing
                    ?
                    <a
                        className={ 'manage' === props.mode ? "vlp-template-menu-group active" : "vlp-template-menu-group" }
                        onClick={ (e) => { props.onChangeMode( 'manage' ) } }
                    ><Icon type='manage' /> Manage Templates</a>
                    :
                    <Fragment>
                        <a
                            className={ 'properties' === props.mode ? "vlp-template-menu-group active" : "vlp-template-menu-group" }
                            onClick={ (e) => { props.onChangeMode( 'properties' ) } }
                        ><Icon type='properties' /> Template Properties</a>
                        <a
                            className={ 'zones' === props.mode ? "vlp-template-menu-group active" : "vlp-template-menu-group" }
                            onClick={ (e) => { props.onChangeMode( 'zones' ) } }
                        ><Icon type='blocks' /> Block Positions</a>
                        <a
                            className={ 'blocks' === props.mode ? "vlp-template-menu-group active" : "vlp-template-menu-group" }
                            onClick={ (e) => { props.onChangeMode( 'blocks' ) } }
                        ><Icon type='edit' /> Edit Blocks</a>
                    </Fragment>
                }
            </div>
            {
                'properties' === props.mode && props.template
                &&
                <TemplateProperties
                    template={ props.template }
                    onChangeTemplateProperty={ props.onChangeTemplateProperty }
                />
            }
            {
                'zones' === props.mode && props.template
                &&
                <TemplateZones
                    template={ props.template }
                    onChangeTemplateZones={ props.onChangeTemplateZones }
                />
            }
            {
                'blocks' === props.mode && props.template
                &&
                <TemplateBlocks
                    template={ props.template }
                    onChangeTemplateZones={ props.onChangeTemplateZones }
                />
            }
        </div>
    );
}

export default Menu;