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
    getContentFromUrl(url) {
        let content = {};

        // Check if valid URL.
        try {
            const testIfValidURL = new URL(url);
        } catch(e) {
            return Promise.resolve({
                success: false,
                data: content,
            });
        }

        let endpoint = 'https://api.microlink.io';
        let headers = {};

        if ( '' !== vlp_admin.microlink_api_key ) {
            endpoint = 'https://pro.microlink.io';
            headers['x-api-key'] = vlp_admin.microlink_api_key;
        }

        // Valid URL, use OpenGraph API.
        return fetch( endpoint + '?url=' + encodeURIComponent( url ), { headers })
        .then((response) => response.json())
        .then((json) => {
            if ( 'success' === json.status ) {
                if ( json.data.title ) {
                    content.title = json.data.title;
                }
                if ( json.data.description ) {
                    content.summary = json.data.description;
                }
                if ( json.data.image && json.data.image.url ) {
                    content.image_id = -1;
                    content.image_url = json.data.image.url;
                }
            }

            return {
                success: 'success' === json.status,
                data: content,
            };
        }).catch( (error) => {
            console.log( 'Fetch Error', error );

            return {
                success: false,
                data: {},
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
