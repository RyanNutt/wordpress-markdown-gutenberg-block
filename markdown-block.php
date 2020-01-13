<?php

/**
 * Plugin Name:         Markdown Gutenberg Block
 * Plugin URI:          https://github.com/ryannutt/wordpress-markdown-gutenberg-block/
 * Description:         Adds a block to WordPress where you can use the SimpleMDE editor to write posts using Markdown
 * Version:             0.1.0
 * Requires at least:   5.2
 * Requires PHP:        7.2
 * Author:              Ryan Nutt
 * Author URI:          https://www.nutt.net
 * License:             GPL v2 or later
 * License URI:         https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:         markdown-gutenberg-block
 * Domain Path:         /lang
 */

namespace Aelora\WordPress\MarkdownBlock;

MarkDownBlock::init();

class MarkDownBlock
{
     private static $version = null;

     /**
      * Initializes the plugin
      */
     public static function init()
     {
          add_action('init', [self::class, 'register_block']);
     }


     public static function register_block()
     {
          wp_register_script(
               'aelora-simplemde',
               'https://cdnjs.cloudflare.com/ajax/libs/simplemde/1.11.2/simplemde.min.js',
               [],
               null,
               false
          );
          wp_register_script(
               'aelora-markdown',
               plugins_url('js/dist/markdown-block.min.js', __FILE__),
               ['jquery', 'wp-blocks', 'aelora-simplemde'],
               self::version(),
               false
          );

          wp_register_style('aelora-simplemde', 'https://cdnjs.cloudflare.com/ajax/libs/simplemde/1.11.2/simplemde.min.css', [], null);
          wp_register_style('aelora-markdown', plugins_url('css/dist/markdown-block.min.css', __FILE__), [], self::version());

          register_block_type('aelora/markdown-block', [
               'editor_script' => ['aelora-markdown'],
               'editor_style' => ['aelora-simplemde', 'aelora-markdown'],
               'render_callback' => [self::class, 'render_callback']
          ]);
     }

     /**
      * Render the content on client side
      * 
      * @param mixed $props The properties coming from Gutenberg
      */
     public static function render_callback($props)
     {
          return '<div>' . $props['html'] . '</div>';
     }

     /**
      * Gets the version from package.json
      */
     public static function version()
     {
          if (self::$version === null) {
               $json = json_decode(file_get_contents(__DIR__ . '/package.json'), true);
               if (empty($json) || empty($json['version'])) {
                    self::$version = false;
               } else {
                    self::$version = $json['version'];
               }
          }
          return self::$version;
     }
}
