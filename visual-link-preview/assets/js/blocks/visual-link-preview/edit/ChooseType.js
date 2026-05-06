const { __ } = wp.i18n;
const { Button } = wp.components;
const { Component } = wp.element;
const { createBlock } = wp.blocks;

import PostSelect from './PostSelect';

const IconPost = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M14 3v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M8 14h8M8 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
);

const IconLink = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1.5-1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
);

const IconList = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 6h12M8 12h12M8 18h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="4" cy="6" r="1.2" fill="currentColor"/>
        <circle cx="4" cy="12" r="1.2" fill="currentColor"/>
        <circle cx="4" cy="18" r="1.2" fill="currentColor"/>
    </svg>
);

export default class ChooseType extends Component {
    constructor() {
        super( ...arguments );

        this.state = {
            bulkUrls: '',
            bulkValidationMessage: '',
        };
    }

    getBulkUrls() {
        return this.state.bulkUrls
            .split( /\r?\n/ )
            .map( ( url ) => url.trim() )
            .filter( ( url ) => 0 < url.length );
    }

    validateBulkUrls() {
        const urls = this.getBulkUrls();
        const invalidUrls = urls.filter( ( url ) => {
            try {
                const parsedUrl = new URL( url );
                return ! [ 'http:', 'https:' ].includes( parsedUrl.protocol );
            } catch (e) {
                return true;
            }
        } );

        return {
            urls,
            invalidUrls,
        };
    }

    getPage(type) {
        this.props.setAttributes( {
            type,
            nofollow: 'external' === type ? true : false,
            new_tab: 'external' === type ? true : false,
        } );
    }

    createBulkBlocks() {
        const { attributes, clientId } = this.props;
        const { urls, invalidUrls } = this.validateBulkUrls();

        if ( invalidUrls.length ) {
            this.setState( {
                bulkValidationMessage: __( 'Please enter valid full URLs, including https:// or http://.' ),
            } );
            return;
        }

        if ( ! urls.length ) {
            this.setState( {
                bulkValidationMessage: __( 'Please enter at least one URL.' ),
            } );
            return;
        }

        const blocks = urls.map( ( url ) => createBlock( 'visual-link-preview/link', {
            type: 'external',
            url,
            nofollow: true,
            new_tab: true,
            template: attributes.template || 'use_default_from_settings',
        } ) );

        wp.data.dispatch( 'core/block-editor' ).replaceBlocks( clientId, blocks );
    }

    render() {
        const { attributes, setAttributes } = this.props;
        const { bulkUrls, bulkValidationMessage } = this.state;
        const { urls, invalidUrls } = this.validateBulkUrls();
        const urlCount = urls.length;
        const validCount = urlCount - invalidUrls.length;

        return (
            <div className="vlp-block-choosetype">
                <div className="vlp-block-choosetype-header">
                    <h3 className="vlp-block-choosetype-title">{ __( 'Add a Visual Link Preview' ) }</h3>
                    <p className="vlp-block-choosetype-subtitle">{ __( 'Choose one of the options below to get started.' ) }</p>
                </div>

                <div className="vlp-block-choosetype-container">
                    <div className="vlp-block-choosetype-container-head">
                        <span className="vlp-block-choosetype-icon"><IconPost /></span>
                        <label>{ __( 'Select a post on your website' ) }</label>
                    </div>
                    <PostSelect
                        value={ {
                            id: attributes.post,
                            text: attributes.post_label,
                        } }
                        onChangeField={ (option) => {
                            setAttributes( {
                                post: option.id,
                                post_label: option.text,
                            }, this.getPage('internal') );
                        } }
                    />
                </div>

                <div className="vlp-block-choosetype-divider" aria-hidden="true">
                    <span>{ __( 'or' ) }</span>
                </div>

                <div className="vlp-block-choosetype-container">
                    <div className="vlp-block-choosetype-container-head">
                        <span className="vlp-block-choosetype-icon"><IconLink /></span>
                        <label htmlFor="vlp-field-url">{ __( 'Add a link to an external URL' ) }</label>
                    </div>
                    <input
                        id="vlp-field-url"
                        type="text"
                        placeholder="https://example.com/article"
                        value={attributes.url}
                        onChange={(e) => setAttributes( { url: e.target.value } )}
                        onKeyPress={(e) => {
                            if ( 'Enter' === e.key ) {
                                this.getPage('external');
                            }
                        }}
                    />
                    <Button
                        variant="primary"
                        disabled={ 0 === attributes.url.length }
                        onClick={() => this.getPage('external')}
                    >
                    { __( 'Use this URL' ) }
                    </Button>
                </div>

                <div className="vlp-block-choosetype-divider" aria-hidden="true">
                    <span>{ __( 'or' ) }</span>
                </div>

                <div className="vlp-block-choosetype-container">
                    <div className="vlp-block-choosetype-container-head">
                        <span className="vlp-block-choosetype-icon"><IconList /></span>
                        <label htmlFor="vlp-field-bulk-urls">{ __( 'Add multiple external URLs at once' ) }</label>
                    </div>
                    <p className="vlp-block-choosetype-help">{ __( 'One URL per line. Each line creates a separate block.' ) }</p>
                    <textarea
                        id="vlp-field-bulk-urls"
                        rows="5"
                        placeholder={"https://example.com/first\nhttps://example.com/second"}
                        value={ bulkUrls }
                        onChange={ (e) => {
                            this.setState( {
                                bulkUrls: e.target.value,
                                bulkValidationMessage: '',
                            } );
                        } }
                    />
                    {
                        urlCount > 0 && 0 === invalidUrls.length && ! bulkValidationMessage && (
                            <div className="vlp-block-choosetype-status">
                                { validCount } { 1 === validCount ? __( 'URL ready.' ) : __( 'URLs ready.' ) }
                            </div>
                        )
                    }
                    {
                        bulkValidationMessage && (
                            <div className="vlp-block-choosetype-error">
                                { bulkValidationMessage }
                            </div>
                        )
                    }
                    {
                        invalidUrls.length > 0 && (
                            <div className="vlp-block-choosetype-error">
                                { invalidUrls.length } { 1 === invalidUrls.length ? __( 'invalid URL found.' ) : __( 'invalid URLs found.' ) }
                            </div>
                        )
                    }
                    <Button
                        variant="primary"
                        disabled={ 0 === urls.length || invalidUrls.length > 0 }
                        onClick={() => this.createBulkBlocks()}
                    >
                    { __( 'Create blocks' ) }
                    </Button>
                </div>
            </div>
        )
    }
}
