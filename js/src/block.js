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

                var textarea = el('textarea', {}, props.attributes.markdown);

                var editor = el('div', {

                }, textarea);

                var preview = el('div', {

                }, 'Here be the preview');

                var loaderImage = createElement('img', {
                    src: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
                    onLoad: function (evt) {
                        console.info('Initialize SimpleMDE for this block');
                    }
                });

                return el('div', {}, editor, preview, loaderImage);
            },

            // Defines the saved block.
            save: function (props) {
                return null;
            }
        }
    );
})();