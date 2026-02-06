const ajaxUrl = undefined === window.vlp_admin ? vlp_blocks.ajax_url : vlp_admin.ajax_url;
const ajaxNonce = undefined === window.vlp_admin ? vlp_blocks.nonce : vlp_admin.nonce;

// TODO Use REST API.
export default {
    searchPosts(input) {
		return fetch(ajaxUrl, {
            method: 'POST',
            credentials: 'same-origin',
            body: 'action=vlp_search_posts&security=' + ajaxNonce + '&search=' + encodeURIComponent( input ),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
        })
        .then(response => {
            return response.json().then(json => {
                return response.ok ? json : Promise.reject(json);
            });
        });
    },
    getTemplate(encoded) {
		return fetch(ajaxUrl, {
            method: 'POST',
            credentials: 'same-origin',
            body: 'action=vlp_get_template&security=' + ajaxNonce + '&encoded=' + encodeURIComponent( encoded ),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
        })
        .then(response => {
            return response.json().then(json => {
                return response.ok ? json : Promise.reject(json);
            });
        });
    },
    getContent(type, value) {
        if ( 'internal' === type ) {
            return this.getContentFromPost( value );
        } else {
            return this.getContentFromUrl( value );
        }
    },
    getContentFromPost(postId) {
        document.dispatchEvent( new CustomEvent( 'vlp-external-url-start' ) );

        return fetch(ajaxUrl, {
            method: 'POST',
            credentials: 'same-origin',
            body: 'action=vlp_get_post_content&security=' + ajaxNonce + '&id=' + encodeURIComponent( postId ),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
        })
        .then(response => {
            return response.json().then(json => {
                return response.ok ? json : Promise.reject(json);
            });
        });
    },
    getContentFromUrl(url, provider) {
        let content = {};

        // Check if valid URL.
        try {
            const testIfValidURL = new URL(url);
        } catch(e) {
            document.dispatchEvent( new CustomEvent( 'vlp-external-url-error', { detail: { message: 'Invalid URL format.' } } ) );
            return Promise.resolve({
                success: false,
                data: content,
                error: 'Invalid URL format.',
            });
        }

        // Use server-side AJAX handler.
        const ajaxUrl = undefined === window.vlp_admin ? vlp_blocks.ajax_url : vlp_admin.ajax_url;
        const ajaxNonce = undefined === window.vlp_admin ? vlp_blocks.nonce : vlp_admin.nonce;

        let body = 'action=vlp_get_url_content&security=' + ajaxNonce + '&url=' + encodeURIComponent( url );
        if ( provider ) {
            body += '&provider=' + encodeURIComponent( provider );
        }

        return fetch(ajaxUrl, {
            method: 'POST',
            credentials: 'same-origin',
            body: body,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
        })
        .then((response) => response.json())
        .then((json) => {
            if ( json.success && json.data ) {
                content = json.data.data || {};
                content.provider_used = json.data.provider_used || '';

                document.dispatchEvent( new CustomEvent( 'vlp-external-url-data', { detail: { json, content } } ) );
            } else {
                // Dispatch error event for error handling.
                const errorMessage = json.data && json.data.message ? json.data.message : 'Failed to fetch URL metadata.';
                document.dispatchEvent( new CustomEvent( 'vlp-external-url-error', { detail: { message: errorMessage } } ) );
            }

            return {
                success: json.success || false,
                data: content,
                error: json.data && json.data.message ? json.data.message : null,
            };
        }).catch( (error) => {
            console.log( 'Fetch Error', error );

            const errorMessage = error.message || 'Failed to fetch URL metadata.';
            document.dispatchEvent( new CustomEvent( 'vlp-external-url-error', { detail: { message: errorMessage } } ) );

            return {
                success: false,
                data: {},
                error: errorMessage,
            };
        });
    },
    saveImage(url) {
		return fetch(ajaxUrl, {
            method: 'POST',
            credentials: 'same-origin',
            body: 'action=vlp_save_image&security=' + ajaxNonce + '&url=' + encodeURIComponent( url ),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
        })
        .then(response => {
            return response.json().then(json => {
                return response.ok ? json : Promise.reject(json);
            });
        });
    },
};
