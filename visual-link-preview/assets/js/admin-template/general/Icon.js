import React from 'react';
import SVG from 'react-inlinesvg';

import IconManage from '../../../icons/manage.svg';
import IconProperties from '../../../icons/properties.svg';
import IconBlocks from '../../../icons/blocks.svg';
import IconHandle from '../../../icons/handle.svg';
import IconEdit from '../../../icons/edit.svg';
 
const icons = {
    manage: IconManage,
    properties: IconProperties,
    blocks: IconBlocks,
    handle: IconHandle,
    edit: IconEdit,
};

const Icon = (props) => {
    let icon = icons.hasOwnProperty(props.type) ? icons[props.type] : false;

    if ( !icon ) {
        return <span className="vlp-template-noicon">&nbsp;</span>;
    }

    return (
        <span className='vlp-template-icon'>
            <SVG
                src={icon}
            />
        </span>
    );
}
export default Icon;