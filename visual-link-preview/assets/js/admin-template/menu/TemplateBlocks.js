import React, { Component, Fragment } from 'react';

import '../../../css/admin/template/block.scss';
import Block from './Block';

export default class TemplateBlocks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editingZone: false,
            editingBlockIndexIndex: false,
        }
    }

    render() {
        let blockToEdit = false;
        let blockToEditLabel = '';

        if ( this.state.editingZone && this.props.template.zones.hasOwnProperty( this.state.editingZone ) ) {
            if ( false !== this.state.editingBlockIndex ) {
                blockToEdit = JSON.parse( JSON.stringify( this.props.template.zones[ this.state.editingZone ][ this.state.editingBlockIndex ] ) );
                blockToEditLabel = vlp_admin_template.blocks.hasOwnProperty( blockToEdit.type ) ? vlp_admin_template.blocks[ blockToEdit.type ] : blockToEdit.type;
            }
        }

        return (
            <div id="vlp-template-blocks" className="vlp-template-blocks">
                {
                    false === blockToEdit
                    ?
                    <Fragment>
                        <p>Click on a block to edit:</p>
                        {
                            Object.keys( this.props.template.zones ).map( ( zone, i ) => {
                                // No need to edit blocks that aren't used in the template.
                                if ( 'unused' === zone ) {
                                    return null;
                                }

                                return (
                                    <Fragment key={ i }>
                                        {
                                            this.props.template.zones[ zone ].map( ( block, j ) => {
                                                const label = vlp_admin_template.blocks.hasOwnProperty( block.type ) ? vlp_admin_template.blocks[ block.type ] : block.type;

                                                return (
                                                    <div
                                                        className="vlp-template-blocks-block"
                                                        onClick={() => {
                                                            this.setState({
                                                                editingZone: zone,
                                                                editingBlockIndex: j,
                                                            });
                                                        }}
                                                        key={ j }
                                                    >
                                                        { label }
                                                    </div>
                                                )
                                            })
                                        }
                                    </Fragment>
                                )
                            })
                        }
                    </Fragment>
                    :
                    <div className="vlp-template-blocks-block-edit">
                        <div className="vlp-template-blocks-block-edit-details">
                            <a
                                href="#"
                                onClick={ (e) => {
                                    e.preventDefault();
                                    this.setState({
                                        editingZone: false,
                                        editingBlockIndex: false,
                                    });
                                }}
                            >Blocks</a> &gt; { blockToEditLabel }
                        </div>
                        <Block
                            block={ blockToEdit }
                            onBlockChange={ ( block ) => {
                                let templateZones = JSON.parse( JSON.stringify( this.props.template.zones ) );
                                templateZones[ this.state.editingZone ][ this.state.editingBlockIndex ] = block;

                                this.props.onChangeTemplateZones( templateZones );
                            }}
                        />
                    </div>
                }
            </div>
        );
    }
}
