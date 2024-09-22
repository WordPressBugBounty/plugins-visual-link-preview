import React, { Fragment} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import '../../../css/admin/template/zone.scss';
import Icon from '../general/Icon';

const TemplateZones = (props) => {
    const zones = {
        main: 'Main',
        side: 'Side',
        unused: 'Unused Blocks',
    };

    const onDragEnd = (result) => {
        if ( result.destination ) {
            if ( 'BLOCK' === result.type ) {
                let templateZones = JSON.parse( JSON.stringify( props.template.zones ) );

                const oldZone = result.source.droppableId.substr( 9 );
                const newZone = result.destination.droppableId.substr( 9 );

                // Make sure new zone exists.
                if ( ! templateZones.hasOwnProperty( newZone ) ) {
                    templateZones[ newZone ] = [];
                }

                const oldIndex = result.source.index;
                const newIndex = result.destination.index;
                            
                const block = templateZones[ oldZone ].splice( oldIndex, 1 )[0];
                templateZones[ newZone ].splice( newIndex, 0, block );
    
                props.onChangeTemplateZones( templateZones );
            }
        }
    };

    return (
        <div id="vlp-template-zones" className="vlp-template-zones">
            <DragDropContext
                onDragEnd={onDragEnd}
            >
                {
                    Object.keys( zones ).map( ( zone, i ) => {
                        const label = zones[ zone ];

                        const blocksInZone = props.template.zones.hasOwnProperty( zone ) ? props.template.zones[ zone ] : [];

                        return (
                            <div
                                className="vlp-template-zone-container"
                                key={i}
                            >
                                <div className="vlp-template-zone-header">{ label }</div>
                                <Droppable
                                    droppableId={ `vlp-zone-${ zone }` }
                                    type="BLOCK"
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            className={ `vlp-template-zone-blocks${ snapshot.isDraggingOver ? ' vlp-template-zone-blocks-draggingover' : ''}`}
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            {
                                                blocksInZone.map( ( block, j ) => {
                                                    const label = vlp_admin_template.blocks.hasOwnProperty( block.type ) ? vlp_admin_template.blocks[ block.type ] : block.type;

                                                    return (
                                                        <Draggable
                                                            draggableId={ `block-${block.type}` }
                                                            index={ j }
                                                            key={ block.type }
                                                            type="BLOCK"
                                                        >
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    className="vlp-template-zone-block"
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <div
                                                                        className="vlp-template-zone-block-handle"
                                                                    ><Icon type="handle" /></div>
                                                                    <div className="vlp-template-zone-block-label">
                                                                        { label }
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    )
                                                })
                                            }
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        )
                    })
                }
            </DragDropContext>
        </div>
    );
}

export default TemplateZones;