<?php
/*
Plugin Name: URI WYSIWYG
Plugin URI: http://www.uri.edu
Description: Create a set of custom WYSIWYG buttons
Version: 0.1
Author: URI Web Communications
Author URI: 
@author John Pennypacker <jpennypacker@uri.edu>
@author Brandon Fuller <bjcfuller@uri.edu>
@see https://codex.wordpress.org/TinyMCE_Custom_Buttons
*/

// Block direct requests
if ( !defined('ABSPATH') )
	die('-1');
	

/**
 *
 */
function uri_wysiwyg_register_tinymce_plugin( $plugin_array ) {
	// load up the noneditable plugin from TinyMCE
	$plugin_array['noneditable'] = plugins_url( '/js/noneditable/plugin.min.js', __FILE__ );

    // load the custom boxout plugin
	$plugin_array['uri_wysiwyg_boxout'] = plugins_url( '/js/uri-boxout-plugin.js', __FILE__ );
	// load the custom buttons plugin
	$plugin_array['uri_wysiwyg_button'] = plugins_url( '/js/uri-button-plugin.js', __FILE__ );
    // load the custom cards plugin
	$plugin_array['uri_wysiwyg_card'] = plugins_url( '/js/uri-card-plugin.js', __FILE__ );
    // load the custom heros plugin
	$plugin_array['uri_wysiwyg_hero'] = plugins_url( '/js/uri-hero-plugin.js', __FILE__ );
    // load the custom notice plugin
	$plugin_array['uri_wysiwyg_notice'] = plugins_url( '/js/uri-notice-plugin.js', __FILE__ );
    // load the custom panel plugin
	$plugin_array['uri_wysiwyg_panel'] = plugins_url( '/js/uri-panel-plugin.js', __FILE__ );
    // load the custom video plugin
	$plugin_array['uri_wysiwyg_video'] = plugins_url( '/js/uri-video-plugin.js', __FILE__ );

	$plugin_array['uri_wysiwyg_tiles'] = plugins_url( '/js/uri-tiles-plugin.js', __FILE__ );

	return $plugin_array;
}
// Load the TinyMCE plugin
add_filter( 'mce_external_plugins', 'uri_wysiwyg_register_tinymce_plugin' );


/**
 *
 */
function uri_wysiwyg_register_buttons( $buttons ) {
	array_push( $buttons, 'CLBoxout', 'CLButton', 'CLCard', 'CLHero', 'CLNotice', 'CLPanel', 'CLVideo', 'CLTiles' );
	return $buttons;
}
// add new buttons
add_filter( 'mce_buttons', 'uri_wysiwyg_register_buttons' );
 

/**
 * Enqueue a script in the WordPress admin
 * @param int $hook Hook suffix for the current admin page.
 */
function uri_wysiwyg_add_scripts( $hook ) {
	if ( 'edit.php' === $hook || 1==1) { // @todo: only load on the add/edit screen?
	  wp_enqueue_style('URIWYSIWYG-admin-styles', plugins_url( '/css/uri-wysiwyg-admin.css', __FILE__ ) );
		wp_enqueue_script( 'URIWYSIWYG', plugins_url( '/js/uri-wysiwyg-helpers.js', __FILE__ ), array(), '1.0' );
	}

}
add_action( 'admin_enqueue_scripts', 'uri_wysiwyg_add_scripts' );


/**
 * Apply styles to the visual editor
 */ 
function uri_wysiwyg_editor_style( $url ) {
	if ( !empty($url) ) {
		$url .= ',';
	}
	$url .= plugins_url( '/css/uri-wysiwyg-editor.css', __FILE__ );
 	return $url;
}
add_filter('mce_css', 'uri_wysiwyg_editor_style');
