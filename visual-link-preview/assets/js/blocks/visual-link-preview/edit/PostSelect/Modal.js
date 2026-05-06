import { stringify } from 'querystringify';

const { __ } = wp.i18n;
const { apiFetch } = wp;
const { Component } = wp.element;
const { Modal, Spinner } = wp.components;

import Post from './Post';

class PostSelectModal extends Component {
	constructor() {
		super( ...arguments );

        this.latestRequestId = 0;
        this.isComponentMounted = false;

		this.state = {
            postType: '',
            search: '',
            posts: [],
            updatingPosts: false,
            hasLoadedPosts: false,
		};
    }

    componentDidMount() {
        this.isComponentMounted = true;
        this.updatePosts();
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    onChangePostType(event) {
        const postType = event.target.value;

        if ( postType !== this.state.postType ) {
            this.setState( {
                postType,
            }, this.updatePosts.bind( this ) );
        }
    }

    onChangeSearch(event) {
        const search = event.target.value;

        if ( search !== this.state.search ) {
            this.setState( {
                search,
            }, this.updatePosts.bind( this ) );
        }
    }

    updatePosts() {
        const requestId = ++this.latestRequestId;

        this.setState( {
            updatingPosts: true,
        } );

        apiFetch( {
            path: `/visual-link-preview/v1/search?${ stringify( {
                post_type: this.state.postType,
                keyword: this.state.search,
            } ) }`,
        } ).then( ( posts ) => {
            if ( this.isComponentMounted && requestId === this.latestRequestId ) {
                this.setState( {
                    posts,
                    updatingPosts: false,
                    hasLoadedPosts: true,
                } );
            }
        } ).catch( () => {
            if ( this.isComponentMounted && requestId === this.latestRequestId ) {
                this.setState( {
                    posts: [],
                    updatingPosts: false,
                    hasLoadedPosts: true,
                } );
            }
        } );
    }

    renderPostsBody() {
        const postRows = this.state.posts.map( ( post, index ) => (
            <Post
                post={ post }
                selectPost={ this.props.selectPost }
                key={ index }
            />
        ) );

        if ( ! this.state.hasLoadedPosts ) {
            return <tbody />;
        }

        if ( 0 === this.state.posts.length ) {
            return (
                <tbody>
                    <tr className="vlp-post-select-feedback">
                        <td colSpan="5">
                            <em>{ __( 'No posts found' ) }</em>
                        </td>
                    </tr>
                </tbody>
            );
        }

        return <tbody>{ postRows }</tbody>;
    }

	render() {
        return (
            <Modal
                title={ __( 'Search for post...') }
                onRequestClose={ this.props.onClose }
                focusOnMount={ false }
                className="vlp-post-select-modal"
            >
                <div className="vlp-post-select">
                    <div className="vlp-post-select-input">
                        <select
                            value={ this.state.postType }
                            onChange={ this.onChangePostType.bind(this) }
                        >
                            <option value="">{ __( 'All Post Types', 'custom-related-posts' ) }</option>
                            {
                                Object.keys(vlp_admin.post_types).map( ( postType, index ) => (
                                    <option
                                        value={ postType }
                                        key={ index }
                                    >{ vlp_admin.post_types[ postType ] }</option>
                                ) )
                            }
                        </select>
                        <div className="vlp-post-select-search-wrap">
                            <input
                                autoFocus
                                type="text"
                                placeholder={ __( 'Search posts...' ) }
                                className="vlp-post-select-search"
                                value={ this.state.search }
                                onChange={ this.onChangeSearch.bind(this) }
                            />
                            { this.state.updatingPosts && (
                                <span className="vlp-post-select-search-spinner">
                                    <Spinner />
                                </span>
                            ) }
                        </div>
                    </div>
                    <div className={ `vlp-post-select-results${ this.state.updatingPosts ? ' is-loading' : '' }` }>
                        <table className="vlp-post-select-posts">
                            <thead>
                                <tr>
                                    <th className="vlp-post-select-col-thumbnail">&nbsp;</th>
                                    <th className="vlp-post-select-col-type">{ __( 'Type' ) }</th>
                                    <th className="vlp-post-select-col-date">{ __( 'Date' ) }</th>
                                    <th className="vlp-post-select-col-title">{ __( 'Title' ) }</th>
                                    <th className="vlp-post-select-col-action">&nbsp;</th>
                                </tr>
                            </thead>
                            { this.renderPostsBody() }
                        </table>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default PostSelectModal;
