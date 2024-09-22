import React, { Component, Fragment } from 'react';

import '../../../../css/public/shortcode.scss';

import Loader from '../../general/Loader';
import Api from 'Shared/Api';

export default class PreviewTemplate extends Component {
    constructor(props) {
        super(props);

        const preview = props.template && props.template.hasOwnProperty( preview ) ? props.template.preview : false;
        const loading = false === preview ? true : false;

        this.state = {
            hasError: false,
            templateToPreview: false,
            templatePreviewed: preview ? props.template : false,
            preview,
            loading,
        }

        this.updatePreview();
    }

    componentDidCatch() {
        this.setState({
            hasError: true,
        });
    }

    componentDidUpdate( prevProps ) {
        this.updatePreview();
    }

    updatePreview() {
        // Check if update is needed.
        if ( JSON.stringify( this.props.template ) !== JSON.stringify( this.state.templatePreviewed ) && JSON.stringify( this.props.template ) !== JSON.stringify( this.state.templateToPreview ) ) {
            if ( false === this.props.template ) {
                this.setState({
                    templateToPreview: false,
                    templatePreviewed: false,
                    preview: false,
                    loading: false,
                });
            } else {
                this.setState({
                    templateToPreview: this.props.template,
                    loading: true,
                });

        
                Api.template.preview( this.props.template )
                    .then((data) => {
                        if ( data ) {
                            this.setState({
                                preview: data.hasOwnProperty( 'preview' ) ? data.preview : false,
                                templateToPreview: false,
                                templatePreviewed: data.hasOwnProperty( 'template' ) ? data.template : false,
                                loading: false,
                            });
                        }
                    });
            }
        }
    }

    render() {
        return (
            <Fragment>
                <div className="vlp-main-container">
                    <h2 className="vlp-main-container-name">Preview</h2>
                    <div className="vlp-main-container-preview">
                        {
                            ! this.state.hasError && false !== this.state.preview
                            &&
                            <div dangerouslySetInnerHTML={ { __html: this.state.preview } }/>
                        }
                        {
                            this.state.loading
                            &&
                            <Loader />
                        }       
                    </div>
                </div>
            </Fragment>
        );
    }
}

// Prevent click on preview.
ready(() => {
	document.addEventListener( 'click', function(e) {
		for ( var target = e.target; target && target != this; target = target.parentNode ) {
			if ( target.matches( '.vlp-link-container' ) ) {
                e.preventDefault();
				e.stopPropagation();
				break;
			}
		}
	}, false );
});

function ready( fn ) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}