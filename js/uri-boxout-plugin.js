// https://code.tutsplus.com/tutorials/guide-to-creating-your-own-wordpress-editor-buttons--wp-30182

(function() {

    var cName = 'cl-boxout',
        wName = 'CLBoxout';
    
	function renderBoxout( shortcode ) {
		var parsed, safeData, classes, out;
        
		parsed = URIWYSIWYG.parseShortCodeAttributes( shortcode );
		safeData = window.encodeURIComponent( shortcode );
        classes = 'mceNonEditable ' + cName;
        
        out = '<div data-shortcode="' + safeData + '"';
        if(parsed.float != 'auto') {
            classes += ' ' + parsed.float;
        }
        out += ' class="' + classes + '">';
        if(parsed.title) {
            out += '<h1>' + parsed.title + '</h1>';
        }
        if(parsed.content) {
            out += '<p>' + parsed.content + '</p>';
        }
        out += '</div>';
		
		return out;
	}
	
	function generateBoxoutShortcode(params) {

		var attributes = [];
        
		for(i in params) {
            if(i != 'content') {
                attributes.push(i + '="' + params[i] + '"');
            }
		}
        
        console.log('generate content', params.content);
		
		return '[' + cName + ' ' + attributes.join(' ') + ']' + params.content + '[/' + cName + ']';

	}





	tinymce.create('tinymce.plugins.uri_wysiwyg_boxout', {
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
				title : 'Boxout',
				text : '',
				cmd : wName,
				image : url + '/i/boxout.png'
			});
		
			// add a js callback for the button
			ed.addCommand(wName, function(args) {
			
				// create an empty object if args is empty
				if(!args) {
					args = {}
				}
				// create an empty property so nothing is null
				var possibleArgs = ['title', 'content', 'float'];
				possibleArgs.forEach(function(i){
					if(!args[i]) {
						args[i] = '';
					}
				});
				// prevent nested quotes... escape / unescape instead?
				args = URIWYSIWYG.unEscapeQuotesDeep(args);

				ed.windowManager.open({
					title: 'Insert / Update Boxout',
					body: [
						{type: 'textbox', name: 'title', label: 'Title', value: args.title},
                        {type: 'textbox', multiline: 'true', name: 'content', label: 'Content', value: args.content},
                        {type: 'listbox', name: 'float', label: 'Alignment', value: args.float, 'values': [
                            {text: 'Auto', value: 'auto'},
                            {text: 'Left', value: 'left'},
                            {text: 'Right', value: 'right'}
                            ]
                        },
					],
					onsubmit: function(e) {
						// Insert content when the window form is submitted
						e.data = URIWYSIWYG.escapeQuotesDeep(e.data);						
						shortcode = generateBoxoutShortcode(e.data);
						ed.execCommand('mceInsertContent', 0, shortcode);
					}
				},
				{
					wp: wp,
				});

			});
            
			ed.on( 'BeforeSetContent', function( event ) {
				event.content = URIWYSIWYG.replaceShortcodes( event.content, cName, false, renderBoxout );
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
	tinymce.PluginManager.add( 'uri_wysiwyg_boxout', tinymce.plugins.uri_wysiwyg_boxout );


})();

