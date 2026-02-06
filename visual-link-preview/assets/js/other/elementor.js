window.VisualLinkPreview = typeof window.VisualLinkPreview === 'undefined' ? {} : window.VisualLinkPreview;

window.VisualLinkPreview.elementor = {
	init: () => {
		elementor.channels.editor.on( 'vlp:link:create', function( view ) {
			window.VisualLinkPreview.elementor.openModal( view, '' );
		});

		elementor.channels.editor.on( 'vlp:link:edit', function( view ) {
			const encoded = view.container.settings.attributes.vlp_encoded || '';
			window.VisualLinkPreview.elementor.openModal( view, encoded );
		});

		elementor.channels.editor.on( 'vlp:link:unset', function( view ) {
			window.VisualLinkPreview.elementor.changeEncoded( view, '' );
		});
	},
	openModal( view, encoded ) {
		if ( ! window.VisualLinkPreview.admin || ! window.VisualLinkPreview.admin.modal ) {
			return;
		}

		window.VisualLinkPreview.admin.modal.open( '', {
			encoded: encoded,
			saveCallback: ( newEncoded ) => {
				window.VisualLinkPreview.elementor.changeEncoded( view, newEncoded );
			},
		});
	},
	changeEncoded( view, encoded ) {
		parent.window.$e.run( 'document/elements/settings', {
			container: view.container,
			settings: {
				vlp_encoded: encoded,
			},
			options: {
				external: true,
			},
		});
	},
};

ready(() => {
	window.VisualLinkPreview.elementor.init();
});

function ready( fn ) {
	if ( document.readyState !== 'loading' ) {
		fn();
	} else {
		document.addEventListener( 'DOMContentLoaded', fn );
	}
}
