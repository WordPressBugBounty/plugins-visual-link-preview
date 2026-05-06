import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FieldUrl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            error: null,
            hasFetched: false,
        };

        this.handleUrlData = this.handleUrlData.bind(this);
        this.handleUrlError = this.handleUrlError.bind(this);
        this.handleUrlStart = this.handleUrlStart.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.handleRetryWithProvider = this.handleRetryWithProvider.bind(this);
    }

    componentDidMount() {
        // Listen for URL fetch events to update loading state.
        document.addEventListener('vlp-external-url-data', this.handleUrlData);
        document.addEventListener('vlp-external-url-error', this.handleUrlError);
        document.addEventListener('vlp-external-url-start', this.handleUrlStart);
        
        // Sync hasFetched with providerUsed prop
        if ( this.props.providerUsed ) {
            this.setState({ hasFetched: true });
        }
    }

    componentDidUpdate(prevProps) {
        // Reset hasFetched when providerUsed is cleared
        if ( prevProps.providerUsed && !this.props.providerUsed ) {
            this.setState({ hasFetched: false });
        }
        // Set hasFetched when providerUsed is set
        if ( !prevProps.providerUsed && this.props.providerUsed ) {
            this.setState({ hasFetched: true });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('vlp-external-url-data', this.handleUrlData);
        document.removeEventListener('vlp-external-url-error', this.handleUrlError);
        document.removeEventListener('vlp-external-url-start', this.handleUrlStart);
    }

    handleUrlData() {
        this.setState({
            isLoading: false,
            error: null,
            hasFetched: true,
        });
    }

    handleUrlStart() {
        this.setState({
            isLoading: true,
            error: null,
        });
    }

    handleUrlError(e) {
        const detail = e.detail || {};
        const errorMessage = detail.message || 'Failed to fetch URL metadata.';
        
        this.setState({
            isLoading: false,
            error: errorMessage,
            hasFetched: true,
        });
    }

    handleUrlChange(e) {
        const url = e.target.value;
        this.props.onChangeField(e);
        
        // Reset state when URL changes.
        if ( ! url ) {
            this.setState({
                isLoading: false,
                error: null,
                hasFetched: false,
            });
        } else {
            this.setState({
                error: null,
                hasFetched: false,
            });
        }
    }

    handleRetryWithProvider(e) {
        const providerId = e.target.value;
        if ( ! providerId ) {
            return;
        }

        // Reset dropdown.
        e.target.value = '';

        this.setState({
            isLoading: true,
            error: null,
        });

        if ( this.props.onRetryWithProvider ) {
            this.props.onRetryWithProvider(providerId);
        }
    }

    getProviderName(providerId) {
        if ( ! window.vlp_admin || ! window.vlp_admin.url_providers ) {
            return providerId;
        }

        const provider = window.vlp_admin.url_providers.find(p => p.id === providerId);
        return provider ? provider.name : providerId;
    }

    getAvailableProviders() {
        if ( ! window.vlp_admin || ! window.vlp_admin.url_providers ) {
            return [];
        }

        return window.vlp_admin.url_providers.filter(p => p.available);
    }

    render() {
        const { value, providerUsed } = this.props;
        const { isLoading, error, hasFetched } = this.state;
        const availableProviders = this.getAvailableProviders();
        const hasUrl = value && value.trim() !== '';

        return (
            <>
                <div className="vlp-form-line vlp-link-type-external">
                    <div className="vlp-form-label">
                        <label htmlFor="vlp-link-url">Link</label>
                    </div>
                    <div className="vlp-form-input">
                        <input 
                            type="text" 
                            id="vlp-link-url" 
                            value={value} 
                            onChange={this.handleUrlChange} 
                        />
                    </div>
                    <div className="vlp-form-description">URL to link to.</div>
                </div>
                {hasUrl && (
                    <div className="vlp-form-line vlp-url-provider-line">
                        <div className="vlp-form-label"></div>
                        <div className="vlp-form-input">
                            <div className="vlp-url-provider-status">
                                {!hasFetched && !isLoading && (
                                    <button
                                        type="button"
                                        className="button button-secondary button-compact"
                                        onClick={this.props.onFetchDetails}
                                    >
                                        Automatically fetch details
                                    </button>
                                )}
                                {isLoading && (
                                    <div className="vlp-provider-loading">
                                        Fetching...
                                    </div>
                                )}
                                {!isLoading && hasFetched && providerUsed && (
                                    <div className="vlp-provider-used">
                                        Fetched using: <strong>{this.getProviderName(providerUsed)}</strong>
                                    </div>
                                )}
                                {!isLoading && hasFetched && error && (
                                    <div className="vlp-provider-error">
                                        {error}
                                    </div>
                                )}
                                {!isLoading && hasFetched && hasUrl && availableProviders.length > 1 && (
                                    <div className="vlp-provider-retry">
                                        <select 
                                            onChange={this.handleRetryWithProvider}
                                            defaultValue=""
                                        >
                                            <option value="">Retry with different provider...</option>
                                            {availableProviders.map(provider => (
                                                <option key={provider.id} value={provider.id}>
                                                    {provider.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="vlp-form-description"></div>
                    </div>
                )}
            </>
        );
    }
}

FieldUrl.propTypes = {
    value: PropTypes.string.isRequired,
    onChangeField: PropTypes.func.isRequired,
    providerUsed: PropTypes.string,
    onRetryWithProvider: PropTypes.func,
    onFetchDetails: PropTypes.func.isRequired,
}

export default FieldUrl;
