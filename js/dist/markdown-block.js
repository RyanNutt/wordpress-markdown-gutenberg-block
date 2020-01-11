/**
 * Source for adding the Markdown Gutenberg block to WordPress
 */

(function () {
    var __ = wp.i18n.__;
    var createElement = wp.element.createElement;
    var registerBlockType = wp.blocks.registerBlockType;


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
            icon: 'media-code',
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
                console.info('setting up block contents');
                console.info(props);
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
                            spellChecker: false
                        });

                        /* I'm doing this with jQuery instead of loading it directly because it was escaping
                            when put in the contents of the preview div
                        */
                        jQuery('div[data-markdown-preview="' + props.clientId + '"]').html(props.attributes.html);

                        simplemde.codemirror.on("change", function () {
                            var renderedHTML = simplemde.options.previewRender(simplemde.value());
                            props.setAttributes({
                                markdown: simplemde.value(),
                                html: renderedHTML
                            });
                            jQuery('div[data-markdown-preview="' + props.clientId + '"]').html(renderedHTML);
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