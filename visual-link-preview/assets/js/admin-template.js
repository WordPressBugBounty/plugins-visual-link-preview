import ReactDOM from 'react-dom';
import React from 'react';
import App from './admin-template/App';

let appContainer = document.getElementById( 'vlp-template-editor' );

if (appContainer) {
	ReactDOM.render(
		<App/>,
		appContainer
	);
}