const { __ } = wp.i18n;
const {
	Button,
    PanelBody,
    SelectControl,
    ToggleControl
} = wp.components;
const {
	Component,
} = wp.element;

// Backwards compatibility.
let InspectorControls;
let PlainText;
if ( wp.hasOwnProperty( 'blockEditor' ) ) {
	InspectorControls = wp.blockEditor.InspectorControls;
	PlainText = wp.blockEditor.PlainText;
} else {
	InspectorControls = wp.editor.InspectorControls;
	PlainText = wp.editor.PlainText;
}

import ImageSelect from './ImageSelect';
import Api from '../../../shared/Api';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
        this.handleUrlData = this.handleUrlData.bind(this);
        this.handleUrlError = this.handleUrlError.bind(this);
        this.handleUrlStart = this.handleUrlStart.bind(this);
    }

    componentDidMount() {
        document.addEventListener('vlp-external-url-data', this.handleUrlData);
        document.addEventListener('vlp-external-url-error', this.handleUrlError);
        document.addEventListener('vlp-external-url-start', this.handleUrlStart);
    }

    componentWillUnmount() {
        document.removeEventListener('vlp-external-url-data', this.handleUrlData);
        document.removeEventListener('vlp-external-url-error', this.handleUrlError);
        document.removeEventListener('vlp-external-url-start', this.handleUrlStart);
    }

    handleUrlData() {
        this.setState({ isLoading: false });
    }

    handleUrlStart() {
        this.setState({ isLoading: true });
    }

    handleUrlError() {
        this.setState({ isLoading: false });
    }

    getProviderName(providerId) {
        if ( ! window.vlp_blocks || ! window.vlp_blocks.url_providers ) {
            return providerId;
        }

        const provider = window.vlp_blocks.url_providers.find(p => p.id === providerId);
        return provider ? provider.name : providerId;
    }

    getAvailableProviders() {
        if ( ! window.vlp_blocks || ! window.vlp_blocks.url_providers ) {
            return [];
        }

        return window.vlp_blocks.url_providers.filter(p => p.available);
    }

    fetchUrlMetadata(providerId = null) {
        const { attributes, setAttributes } = this.props;
        const url = attributes.url;

        if ( ! url ) {
            return;
        }

        Api.old.getContentFromUrl( url, providerId ).then(
            ({ data, error }) => {
                if ( ! error && data ) {
                    setAttributes({
                        ...data,
                    });
                }
            }
        );
    }

    render() {
        const { attributes, setAttributes } = this.props;
        const { isLoading } = this.state;
        const availableProviders = this.getAvailableProviders();
        const hasUrl = attributes.url && attributes.url.trim() !== '';
        const hasFetched = attributes.provider_used && attributes.provider_used.trim() !== '';

        const changeLinkButton = (
            <div style={{ marginTop: 15 }}>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setAttributes({
                            type: false,
                            post: 0,
                            provider_used: '',
                        });
                    }}
                >Change Link</Button>
            </div>
        );

        let templateOptions = [{
            value: 'use_default_from_settings',
            label: __( 'Use Default from Settings' ),
        }];
        for (let template in vlp_blocks.templates) {
            templateOptions.push({
                value: template,
                label: vlp_blocks.templates[template].name,
            });
        }

        return (
            <InspectorControls>
                {
                    'internal' === attributes.type
                    ?
                    <PanelBody title={ __( 'Internal Link' ) }>
                        <a href={ `${ vlp_blocks.edit_link }${ attributes.post}` } target="_blank"> { attributes.post_label || __( 'Edit Post' ) }</a>
                        { changeLinkButton }
                    </PanelBody>
                    :
                    <PanelBody title={ __( 'External Link' ) }>
                        <a href={ attributes.url } target="_blank"> { attributes.url }</a>
                        { changeLinkButton }
                    </PanelBody>
                }
                {
                    'external' === attributes.type && hasUrl && (
                        <PanelBody title={ __( 'Metadata Provider' ) }>
                            {!hasFetched && !isLoading && (
                                <Button
                                    variant="primary"
                                    onClick={() => this.fetchUrlMetadata()}
                                >
                                    { __( 'Automatically fetch details' ) }
                                </Button>
                            )}
                            {isLoading && (
                                <div>{ __( 'Fetching...' ) }</div>
                            )}
                            {!isLoading && hasFetched && attributes.provider_used && (
                                <div style={{ marginBottom: 10 }}>
                                    { __( 'Fetched using:' ) } <strong>{this.getProviderName(attributes.provider_used)}</strong>
                                </div>
                            )}
                            {!isLoading && hasFetched && availableProviders.length > 1 && (
                                <SelectControl
                                    label={ __( 'Retry with different provider' ) }
                                    value=""
                                    options={[
                                        { label: __( 'Select provider...' ), value: '' },
                                        ...availableProviders.map(provider => ({
                                            label: provider.name,
                                            value: provider.id,
                                        }))
                                    ]}
                                    onChange={ ( value ) => {
                                        if ( value ) {
                                            this.fetchUrlMetadata( value );
                                        }
                                    } }
                                />
                            )}
                        </PanelBody>
                    )
                }
                <PanelBody title={ __( 'Content' ) }>
                    <strong><PlainText
                        placeholder={ __( 'Title', 'dynamic-widget-content' ) }
                        value={ attributes.title }
                        onChange={ ( value ) => setAttributes( { title: value } ) }
                    /></strong>
                    <PlainText
                        placeholder={ __( 'Summary', 'dynamic-widget-content' ) }
                        value={ attributes.summary }
                        onChange={ ( value ) => setAttributes( { summary: value } ) }
                    />
                    <ImageSelect {...this.props} />
                </PanelBody>
                <PanelBody title={ __( 'Options' ) }>
                    <ToggleControl
                        label={ __( 'Open link in new tab' ) }
                        checked={ attributes.new_tab }
                        onChange={ () => setAttributes( { new_tab: ! attributes.new_tab } ) }
                    />
                    <ToggleControl
                        label={ __( 'Nofollow Link' ) }
                        help={ attributes.nofollow ? __( 'The rel="nofollow" attribute will get added to the link.' ) : __( 'The rel="nofollow" attribute will not get added to the link.' ) }
                        checked={ attributes.nofollow }
                        onChange={ () => setAttributes( { nofollow: ! attributes.nofollow } ) }
                    />
                </PanelBody>
                <PanelBody title={ __( 'Style' ) }>
                    <SelectControl
                        label={ __( 'Template' ) }
                        value={ attributes.template }
                        options={ templateOptions }
                        onChange={ ( value ) => {
                            setAttributes( {
                                template: value
                            } );
                        } }
                    />
                    <a href={ vlp_blocks.settings_link } target="_blank">{ __( 'Change template styling' ) }</a>
                </PanelBody>
            </InspectorControls>
        )
    }
}