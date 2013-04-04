/**
 * view.js
 *
 * Client-side view rendering based on Handlebars templates with added
 * DOM selectors and callbacks for initializing event handlers. Also uses a touch
 * of jQuery (Zepto should also work).
 *
 * Homepage: https://github.com/jbroadway/view.js
 * License: MIT
 * Author: Johnny Broadway <johnny@johnnybroadway.com>
 *
 * Usage:
 *
 *     <!-- our handlebars template -->
 *     <script type="text/html" id="hello-template">
 *         <p><a href="#" id="click-me">Hello {{name}}</a></p>
 *     </script>
 *     
 *     <!-- the div to insert the content into -->
 *     <div id="hello-world"></div>
 *     
 *     <script>
 *     $(function () {
 *         // define our view
 *         view.add ({
 *             name: 'hello',
 *             selector: '#hello-world',
 *             template: 'hello-template',
 *             callback: function (el) {
 *                 // you can access the view as this
 *                 console.log ('Rendered view: ' + this.name);
 *                 console.log ('With the name: ' + this.data.name);
 *                 
 *                 // add event listeners here
 *                 $(el).find ('#click-me').click (function () {
 *                     alert ('Clicked!');
 *                 });
 *             }
 *         });
 *         
 *         // render the view
 *         view.hello.render ({name: 'world'});
 *     });
 *     </script>
 */
var view = (function ($) {
	var self = {};
	
	/**
	 * Enable/disable debugging output to the console.
	 */
	self.debug = false;

	/**
	 * Helper function to verify parameters.
	 */
	var _has = function (obj, prop) {
		return obj.hasOwnProperty (prop);
	};
	
	/**
	 * console.log wrapper for debugging. Returns the object
	 * passed to it, so it can be used as a pass-through.
	 */
	var _log = function (obj) {
		if (self.debug && window.console) {
			console.log (obj);
		}
		return obj;
	};

	/**
	 * Shorter syntax for calling handlebars templates.
	 */
	var _tpl = function (tpl, data) {
		return Handlebars.templates[tpl] (data);
	};

	/**
	 * Fill the specified selector with a template call
	 * and return the jQuery object.
	 */
	var _fill = function (selector, tpl, data) {
		return $(selector).html (_tpl (tpl, data)).show ();
	};

	/**
	 * Render a view template, then assign any event handlers
	 * and call the callback function.
	 */
	var _render = function (data) {
		this.data = (typeof data !== 'undefined') ? data : this.data;
		var selector = _fill (this.selector, this.template, this.data),
			view = this;

		if (this.callback) {
			return this.callback (selector);
		}
		return selector;
	};

	/**
	 * Hide the element surrounding the view.
	 */
	var _hide = function () {
		$(this.selector).hide ();
	};

	/**
	 * Add a new view template to the list.
	 */
	self.add = function (view) {
		if (! _has (view, 'name')) throw new Error ('Required: name');
		if (! _has (view, 'selector')) throw new Error ('Required: selector');
		if (! _has (view, 'template')) throw new Error ('Required: template');

		var defaults = {
			selector: null,
			template: null,
			callback: null,
			hide: null,
			data: {}
		};

		self[view.name] = $.extend (defaults, view);
		self[view.name].render = $.proxy (_render, self[view.name]);
		if (self[view.name].hide === null) {
			self[view.name].hide = $.proxy (_hide, self[view.name]);
		} else {
			self[view.name].hide = $.proxy (self[view.name].hide, self[view.name]);
		}
		return self[view.name];
	};
	
	return self;
})(jQuery || $);