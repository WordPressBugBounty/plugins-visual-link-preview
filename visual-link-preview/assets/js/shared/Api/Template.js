import ApiWrapper from '../ApiWrapper';

let gettingPreview = false;
let gettingPreviewNext = false;

export default {
    preview( template ) {
        if ( ! gettingPreview ) {
            return this.previewDebounced( template );
        } else {
            gettingPreviewNext = template;
            return new Promise(r => r(false));
        }
    },
    previewDebounced( template ) {
        gettingPreview = true;

        const data = {
            template,
        };

        return ApiWrapper.call( `${ vlp_admin.endpoints.template }/preview`, 'POST', data ).then(json => {
            // Check if another request is queued.
            if ( gettingPreviewNext ) {
                const newTemplate = gettingPreviewNext;
                gettingPreviewNext = false;

                return this.previewDebounced( newTemplate );
            } else {
                // Return this request.
                gettingPreview = false;
                return json;
            }
        });
    },
    save(template) {
        const data = {
            template,
        };

        return ApiWrapper.call( vlp_admin.endpoints.template, 'POST', data );
    },
    delete(slug) {
        const data = {
            slug,
        };

        return ApiWrapper.call( vlp_admin.endpoints.template, 'DELETE', data );
    },
};
