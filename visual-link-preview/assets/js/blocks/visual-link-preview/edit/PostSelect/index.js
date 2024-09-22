const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { Button } = wp.components;

import '../../../../../css/admin/post-select.scss';
import Modal from './Modal';

export default class PostSelect extends Component {
    constructor() {
        super( ...arguments );

        this.state = {
            isModalOpen: false,
		}

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
		if ( ! this.state.isModalOpen ) {
			this.setState( { isModalOpen: true } );
		}
	}

	closeModal() {
		if ( this.state.isModalOpen ) {
			this.setState( { isModalOpen: false } );
		}
	}

    render() {
        return (
            <Fragment>
                <Button 
                    variant="primary"
                    onClick={this.openModal}
                >
                    { __( 'Search for post...' ) }
                </Button>
                {
					this.state.isModalOpen
					&&
					<Modal
						onClose={this.closeModal}
                        selectPost={(post) => {
                            this.closeModal();
                            this.props.onChangeField({
                                id: post.id,
                                text: post.label,
                            });
                        }}
					/>
				}
            </Fragment>
        );
    }
}