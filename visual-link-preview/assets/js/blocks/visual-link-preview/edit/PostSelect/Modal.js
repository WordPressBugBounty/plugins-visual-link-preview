import { stringify } from 'querystringify';

const { __ } = wp.i18n;
const { apiFetch } = wp;
const { Component } = wp.element;
const { Modal } = wp.components;

import Post from './Post';

class PostSelectModal extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
            postType: '',
            search: '',
            posts: [],
            updatingPosts: false,
            needToUpdatePosts: false,
		}
    }

    onChangePostType(event) {
        const postType = event.target.value;

        if ( postType !== this.state.postType ) {
            this.setState({
                postType,
                needToUpdatePosts: this.state.search.length >= 2, // Only update if there is text.
            });
        }
    }

    onChangeSearch(event) {
        const search = event.target.value;

        if ( search !== this.state.search ) {
            this.setState({
                search,
                needToUpdatePosts: true,
            });
        }
    }

    componentDidUpdate() {
        if ( this.state.needToUpdatePosts ) {
            this.updatePosts();
        }
    }

    updatePosts() {
        if ( ! this.state.updatingPosts ) {
            if ( this.state.search.length < 2 ) {
                this.setState({
                    updatingPosts: false,
                    needToUpdatePosts: false,
                    posts: [],
                });
            } else {
                this.setState({
                    updatingPosts: true,
                    needToUpdatePosts: false,
                });

                const request = apiFetch( {
                    path: `/visual-link-preview/v1/search?${ stringify( {
                        post_type: this.state.postType,
                        keyword: this.state.search,
                    } ) }`,
                } );

                request.then( ( posts ) => {
                    this.setState( {
                        posts,
                        updatingPosts: false,
                    } );
                } );
            }
        }
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
                        <input
                            autoFocus
                            type="text"
                            placeholder={ __( 'Start typing to search...' ) }
                            className="vlp-post-select-search"
                            value={ this.state.search }
                            onChange={ this.onChangeSearch.bind(this) }
                        />
                    </div>
                    <table className="vlp-post-select-posts">
                        <thead>
                            <tr>
                                <th>{ __( 'Post Type' ) }</th>
                                <th>{ __( 'Date' ) }</th>
                                <th>{ __( 'Title' ) }</th>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        {
                            0 === this.state.posts.length
                            ?
                            <tbody>
                                <tr>
                                    <td colspan="4">
                                        <em>{ __( 'No posts found' ) }</em>
                                    </td>
                                </tr>
                            </tbody>
                            :
                            <tbody>
                                {
                                    this.state.posts.map( (post, index) => {
                                        return (
                                            <Post
                                                post={ post }
                                                selectPost={ this.props.selectPost }
                                                key={ index }
                                            />
                                        )
                                    })
                                }
                            </tbody>
                        }
                    </table>
                </div>
            </Modal>
        );
    }
}

export default PostSelectModal;