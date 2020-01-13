/**
 * Source for adding the Markdown Gutenberg block to WordPress
 */

(function () {
    var __ = wp.i18n.__;
    var createElement = wp.element.createElement;
    var registerBlockType = wp.blocks.registerBlockType;

    var markdownIcon = wp.element.createElement('svg', {
            width: 16,
            height: 16
        },
        wp.element.createElement('path', {
            d: "M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"
        })
    );

    /**
     * Register block
     *
     * @param  {string}   name     Block name.
     * @param  {Object}   settings Block settings.
     * @return {?WPBlock}          Block itself, if registered successfully,
     *                             otherwise "undefined".
     */
    registerBlockType(
        'aelora/markdown-block', {
            title: __('Markdown', 'markdown-gutenberg-block'),
            icon: markdownIcon,
            category: 'common',
            description: __('Edit posts in markdown with the SimpleMDE editor', 'markdown-gutenberg-block'),
            attributes: {
                markdown: {
                    default: ''
                },
                html: {
                    default: ''
                }
            },
            supports: {
                html: false,
                reusable: true
            },

            // Defines the block within the editor.
            edit: function (props) {
                var el = wp.element.createElement;

                var textarea = el('textarea', {
                    style: {
                        display: 'none'
                    }
                }, props.attributes.markdown);

                var editor = el('div', {
                    'data-markdown': 'editor'
                }, textarea);

                var preview = el('div', {
                    'data-markdown-preview': props.clientId,
                    'data-markdown': 'preview'
                }, '');

                var loaderImage = createElement('img', {
                    src: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                    onLoad: function (evt) {
                        var simplemde = new SimpleMDE({
                            element: jQuery('div[data-block="' + props.clientId + '"] textarea')[0],
                            toolbar: false,
                            spellChecker: false,
                            status: false
                        });

                        /* I'm doing this with jQuery instead of loading it directly because it was escaping
                            when put in the contents of the preview div
                        */
                        jQuery('div[data-markdown-preview="' + props.clientId + '"]').html(props.attributes.html);

                        /* Load the contents into properties for the block */
                        simplemde.codemirror.on("change", function () {
                            var renderedHTML = simplemde.options.previewRender(simplemde.value());
                            props.setAttributes({
                                markdown: simplemde.value(),
                                html: renderedHTML
                            });
                            jQuery('div[data-markdown-preview="' + props.clientId + '"]').html(renderedHTML);
                        });

                        /* Watch for changes in block class to see if we need to refresh the codemirror */
                        var observer = new MutationObserver(function (mutationsList) {
                            console.info('observer has fired');
                            var el = jQuery('div#block-' + props.clientId);
                            if (el.hasClass('is-selected')) {
                                simplemde.codemirror.refresh();
                            }
                        });
                        observer.observe(jQuery('div#block-' + props.clientId)[0], {
                            attributes: true,
                            attributeOldValue: true,
                            attributeFilter: ['class']
                        });
                    }
                });

                return el('div', {}, editor, preview, loaderImage);
            },

            // Defines the saved block.
            // save: function (props) {
            //     return null;
            // }
        }
    );
})();