import React, { Component, Fragment } from 'react';

import '../../../../css/admin/template/manage.scss';

import ManageTemplate from './ManageTemplate';

export default class ManageTemplates extends Component {

    constructor(props) {
        super(props);

        this.state = {
            mode: 'templates',
        }
    }

    render() {
        const props = this.props;

        let templatesGrouped = {
            'Our Default Templates': [],
            'Your Own Templates': [],
        }
    
        // Put templates in correct categories.
        Object.entries(props.templates).forEach(([slug, template]) => {
            if ( template.custom ) {
                templatesGrouped['Your Own Templates'].push(template);
            } else {
                templatesGrouped['Our Default Templates'].push(template);
            }
        });
    
        return (
            <Fragment>
                <div className="vlp-main-container">
                    <h2 className="vlp-main-container-name">Need help?</h2>
                    <p style={{ textAlign: 'center'}}>Have a look at the <a href="https://help.bootstrapped.ventures/article/53-template-editor" target="_blank">documentation for the Template Editor</a>!</p>
                </div>
                <div className="vlp-main-container">
                    <h2 className="vlp-main-container-name">Templates</h2>
                    <div
                        className={ `vlp-manage-templates-template${ 'import' === this.state.mode ? ' vlp-manage-templates-template-selected' : '' }` }
                        onClick={() => {
                            this.setState({
                                mode: 'import' !== this.state.mode ? 'import' : 'templates',
                            }, () => {
                                props.onChangeTemplate( false );
                            });
                        }}
                    >{ `${ 'import' !== this.state.mode ? 'Import template...' : 'Cancel import' }` }</div>
                    {
                        'import' === this.state.mode
                        ?
                        <div>
                            <textarea
                                className="vlp-manage-templates-import"
                                placeholder="Paste in template to import"
                                rows="10"
                                value=""
                                onChange={ (e) => {
                                    const value = e.target.value;
                                    if ( value ) {
                                        try {
                                            const importedTemplate = JSON.parse( value );
                                            this.setState({
                                                mode: 'templates',
                                            }, () => {
                                                props.onSaveTemplate({
                                                    ...importedTemplate,
                                                    slug: false, // Importing, so generate new slug.
                                                });
                                                alert( 'The template has been imported.' );
                                            });
                                        } catch (e) {
                                            alert( 'No valid template found.' );
                                        }
                                    }
                                }}
                            />
                        </div>
                        :
                        <Fragment>
                            {
                                Object.keys(templatesGrouped).map((header, i) => {
                                    let templates = templatesGrouped[header];
                                    if ( templates.length > 0 ) {
                                        return (
                                            <Fragment key={i}>
                                                <h3>{ header }</h3>
                                                {
                                                    templates.map((template, j) => {
                                                        let classes = 'vlp-manage-templates-template';
                                                        classes += props.template.slug === template.slug ? ' vlp-manage-templates-template-selected' : '';
                                                        classes += template.premium && ! vlp_admin.addons.premium ? ' vlp-manage-templates-template-premium' : '';
            
                                                        return (
                                                            <div
                                                                key={j}
                                                                className={ classes }
                                                                onClick={ () => {
                                                                    const newTemplate = props.template.slug === template.slug ? false : template.slug;
                                                                    return props.onChangeTemplate(newTemplate);
                                                                }}
                                                            >{ template.name }</div>
                                                        )
                                                    })
                                                }
                                            </Fragment>
                                        )
                                    }
                                })
                            }
                        </Fragment>
                    }
                </div>
                {
                    'templates' === this.state.mode
                    && props.template
                    &&
                    <ManageTemplate
                        onChangeEditing={ props.onChangeEditing }
                        template={ props.template }
                        onDeleteTemplate={ props.onDeleteTemplate }
                        onChangeTemplate={ props.onChangeTemplate }
                        savingTemplate={ props.savingTemplate }
                        onSaveTemplate={ props.onSaveTemplate }
                    />
                }
            </Fragment>
        );
    }
}