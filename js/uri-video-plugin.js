// https://code.tutsplus.com/tutorials/guide-to-creating-your-own-wordpress-editor-buttons--wp-30182

(function() {

    var cName = 'cl-video',
        wName = 'CLVideo';
    
	function renderVideo( shortcode ) {
		var parsed, safeData, out;

		parsed = URIWYSIWYG.parseShortCodeAttributes( shortcode );
		safeData = window.encodeURIComponent( shortcode );
                
		out = '<div class="' + cName + ' mceNonEditable" data-shortcode="' + safeData + '">';
        out += '<img id="' + parsed.vid + '" src="' + parsed.img + '" alt="' + parsed.alt + '"';
        if(parsed.aspect){
            out += ' data-aspect="' + parsed.aspect + '"';
        }
        out += '>';
		out += '</div>';
		
		return out;
	}
	
	function generateVideoShortcode(params) {

		var attributes = [];
        
		for(i in params) {
			attributes.push(i + '="' + params[i] + '"');
		}
		
		return '[' + cName + ' ' + attributes.join(' ') + ']';

	}



	tinymce.create('tinymce.plugins.uri_wysiwyg_video', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {

			// add the button that the WP plugin defined in the mce_buttons filter callback
			ed.addButton(wName, {
				title : 'Video',
				text : '',
				cmd : wName,
				image : url + '/i/video.png'
			});
		
			// add a js callback for the button
			ed.addCommand(wName, function(args) {
			
				// create an empty object if args is empty
				if(!args) {
					args = {}
				}
				// create an empty property so nothing is null
				var possibleArgs = ['img', 'vid', 'alt', 'aspect'];
				possibleArgs.forEach(function(i){
					if(!args[i]) {
						args[i] = '';
					}
				});
				// prevent nested quotes... escape / unescape instead?
				args = URIWYSIWYG.unEscapeQuotesDeep(args);
				
				var imageEl = '';
				if(args.img) {
					imageEl = '<img src="' + args.img + '" alt="' + args.alt + '" />';
				}

				ed.windowManager.open({
					title: 'Insert / Update Video',
					library: {type: 'image'},
					body: [
                        {type: 'container', label: ' ', html: '<div id="wysiwyg-img-preview">' + imageEl + '</div>'},
				        {type: 'button', label: 'Image (required)', text: 'Choose an image', onclick: URIWYSIWYG.mediaPicker},
						{type: 'textbox', name: 'img', id: 'img', value: args.img, subtype: 'hidden'},
                        {type: 'textbox', name: 'alt', id: 'alt', label: 'Image Alt Text', value: args.alt},
                        {type: 'textbox', name: 'vid', label: 'YouTube ID', value: args.vid},
                        {type: 'textbox', name: 'aspect', label: 'Aspect Ratio', 'placeholder': '16:9', value: args.aspect}

					],
					onsubmit: function(e) {
						// Insert content when the window form is submitted
						e.data = URIWYSIWYG.escapeQuotesDeep(e.data);
                        shortcode = generateVideoShortcode(e.data);
						ed.execCommand('mceInsertContent', 0, shortcode);
					}
				},
				{
					wp: wp,
				});

			});

			ed.on( 'BeforeSetContent', function( event ) {
				event.content = URIWYSIWYG.replaceShortcodes( event.content, cName, true, renderVideo );
			});

			ed.on( 'PostProcess', function( event ) {
				if ( event.get ) {
					event.content = URIWYSIWYG.restoreShortcodes( event.content, cName );
				}
			});

			//open popup on placeholder double click
			ed.on('DblClick',function( event ) {
				URIWYSIWYG.openPopup( event.target, ed, cName, wName);
			});

		},


		/**
		 * Creates control instances based in the incomming name. This method is normally not
		 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
		 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
		 * method can be used to create those.
		 *
		 * @param {String} n Name of the control to create.
		 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
		 * @return {tinymce.ui.Control} New control instance or null if no control was created.
		 */
		createControl : function(n, cm) {
				return null;
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'URI WYSIWYG',
				author : 'John Pennypacker',
				authorurl : 'https://today.uri.edu',
				infourl : 'https://www.uri.edu/communications',
				version : "0.1"
			};
		}


	});

	// Register plugin
	tinymce.PluginManager.add( 'uri_wysiwyg_video', tinymce.plugins.uri_wysiwyg_video );


})();

