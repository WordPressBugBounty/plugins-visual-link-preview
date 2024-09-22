import React from 'react';

import '../../../css/admin/template/main.scss';

import ManageTemplates from './manage-templates';
// import EditTemplate from './edit-template';
import PreviewTemplate from './preview-template';

const Main = (props) => {
    return (
        <div id="vlp-template-main" className={`vlp-template-main-${props.mode}`}>
            {
                'manage' === props.mode
                &&
                <ManageTemplates
                    templates={ props.templates }
                    template={ props.template }
                    onChangeEditing={ props.onChangeEditing }
                    onDeleteTemplate={ props.onDeleteTemplate }
                    onChangeTemplate={ props.onChangeTemplate }
                    savingTemplate={ props.savingTemplate }
                    onSaveTemplate={ props.onSaveTemplate }
                />
            }
            {
                props.template
                &&
                <PreviewTemplate
                    mode={ props.mode }
                    template={ props.template }
                />
            }
        </div>
    );
}

export default Main;