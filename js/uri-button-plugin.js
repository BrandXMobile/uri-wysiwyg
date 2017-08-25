// https://code.tutsplus.com/tutorials/guide-to-creating-your-own-wordpress-editor-buttons--wp-30182

(function() {
    
    var cName = 'cl-button',
        wName = 'CLButton';

	function renderButton( shortcode ) {
		var parsed, safeData, classes, out;

		parsed = URIWYSIWYG.parseShortCodeAttributes( shortcode );
		safeData = window.encodeURIComponent( shortcode );
        classes = 'mceNonEditable ' + cName;
        
        out = '<a data-shortcode="' + safeData + '"';
        if(parsed.prominent == 'true') {
            classes += ' prominent';
        }
        out += ' class="' + classes + '">';
        if(!parsed.text) { parsed.text = 'Explore'; }
        out += parsed.text + '</a>';
		
		return out;
	}
	
	function generateButtonShortcode(params) {

		var attributes = [];
		
        if(!params.text) {
            params.text = 'Explore';
        }
        
		for(i in params) {
			attributes.push(i + '="' + params[i] + '"');
		}
		
		return '[' + cName + ' ' + attributes.join(' ') + ']';

	}





	tinymce.create('tinymce.plugins.uri_wysiwyg_button', {
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
				title : 'Button',
				text : '',
				cmd : wName,
				image : url + '/i/button.png'
			});
		
			// add a js callback for the button
			ed.addCommand(wName, function(args) {
			
				// create an empty object if args is empty
				if(!args) {
					args = {}
				}
				// create an empty property so nothing is null
				var possibleArgs = ['link', 'text', 'tooltip', 'prominent'];
				possibleArgs.forEach(function(i){
					if(!args[i]) {
						args[i] = '';
					}
				});
				// prevent nested quotes... escape / unescape instead?
				args = URIWYSIWYG.unEscapeQuotesDeep(args);

				ed.windowManager.open({
					title: 'Insert / Update Button',
					body: [
						{type: 'textbox', name: 'link', label: 'Link', value: args.link},
						{type: 'textbox', name: 'text', label: 'Text', value: args.text},
                        {type: 'textbox', name: 'tooltip', label: 'Tooltip', value: args.tooltip},
                        {type: 'checkbox', name: 'prominent', label: 'Prominent', checked: args.prominent },
					],
					onsubmit: function(e) {
						// Insert content when the window form is submitted
						e.data = URIWYSIWYG.escapeQuotesDeep(e.data);						
						shortcode = generateButtonShortcode(e.data);
						ed.execCommand('mceInsertContent', 0, shortcode);
					}
				},
				{
					wp: wp,
				});

			});

			ed.on( 'BeforeSetContent', function( event ) {
				event.content = URIWYSIWYG.replaceShortcodes( event.content, cName, true, renderButton );
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
	tinymce.PluginManager.add( 'uri_wysiwyg_button', tinymce.plugins.uri_wysiwyg_button );


})();

