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
 * Version: 0.2.0
 *
 * Usage:
 *
 *     <!-- our handlebars template -->
 *     <script type="text/html" name="hello-template">
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
 *             events: {
 *                 // add event listeners here
 *                 'click #click-me': function () {
 *                     alert ('Clicked!');
 *                 }
 *             },
 *             callback: function (el) {
 *                 // called after view is rendered and events are
 *                 // bound. you can access the view as 'this'
 *                 console.log ('Rendered view: ' + this.name);
 *                 console.log ('With the name: ' + this.data.name);
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
		if (! Handlebars.templates) {
			Handlebars.templates = [];
		}
		if (! Handlebars.templates[tpl]) {
			var src = $('script[name="' + tpl + '"]').html ();
			Handlebars.templates[tpl] = Handlebars.compile (src);
		}
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

		if (this.active) {
			this.detach_events ();
		}
		this.attach_events ();
		this.active = true;

		if (this.callback) {
			return this.callback (selector);
		}
		return selector;
	};

	/**
	 * Attach events to the view.
	 */
	var _attach_events = function () {
		_log ('attaching events (' + this.name + ')');
		for (var i in this.events) {
			var evt = i.split (' ', 2);
			$(this.selector).on (evt[0], evt[1], this.events[i]);
		}
	};

	/**
	 * Detach events from the view.
	 */
	var _detach_events = function () {
		_log ('detaching events (' + this.name + ')');
		for (var i in this.events) {
			var evt = i.split (' ', 2);
			$(this.selector).off (evt[0], evt[1], this.events[i]);
		}
	};

	/**
	 * Hide the element surrounding the view.
	 */
	var _hide = function () {
		this.active = false;
		this.detach_events ();
		$(this.selector).html ('').hide ();
		if (this.on_hide !== null) {
			this.on_hide ();
		}
	};

	/**
	 * Add a new view template to the list.
	 */
	self.add = function (view) {
		if (! _has (view, 'name')) throw new Error ('Required: name');
		if (! _has (view, 'selector')) view.selector = '#' + view.name;
		if (! _has (view, 'template')) view.template = view.name;

		var defaults = {
			active: false,
			selector: null,
			template: null,
			callback: null,
			hide: null,
			on_hide: null,
			events: {},
			data: {}
		};

		self._current = view.name;
		self[view.name] = $.extend (defaults, view);
		self[view.name].attach_events = $.proxy (_attach_events, self[view.name]);
		self[view.name].detach_events = $.proxy (_detach_events, self[view.name]);
		self[view.name].render = $.proxy (_render, self[view.name]);
		if (self[view.name].on_hide !== null) {
			self[view.name].on_hide = $.proxy (self[view.name].on_hide, self[view.name]);
		}
		self[view.name].hide = $.proxy (_hide, self[view.name]);
		return self[view.name];
	};
	
	return self;
})(jQuery || $);