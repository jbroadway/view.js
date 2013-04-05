# view.js

Client-side view rendering based on Handlebars templates with added
DOM selectors and callbacks for initializing event handlers. Also uses
a touch of jQuery (Zepto should also work).

## Usage

```html
<!-- our handlebars template -->
<script type="text/html" name="hello">
	<p><a href="#" id="click-me">Hello {{name}}</a></p>
</script>

<!-- the div to insert the content into -->
<div id="hello"></div>

<script>
$(function () {
	// define our view
	view.add ({
		name: 'hello',
		events: {
			'click #click-me': function () {
				alert ('Clicked!');
			}
		}
	});
	
	// render the view
	view.hello.render ({name: 'world'});
});
</script>
```

Also see the included [demo.html](https://github.com/jbroadway/view.js/blob/master/demo.html)
for a complete example.

## View API

Views have the following properties and methods:

### view.add(properties)

This is the only method of the `view` object, and it adds a view to the list. For example:

```javascript
view.add ({
	name: 'my_view'
});
```

### callback

A function to call after the view has been rendered and the events have been bound.
This function receives the view object as `this` and the `selector` element as a jQuery
object as its first parameter. For example:

```javascript
view.add ({
	name: 'my_view',
	callback: function (el) {
		// replace everything with the view name
		el.html (this.name);
	}
});
```

### data

This allows you to set the data object before calling `render()`. This is the object
that is passed to Handlebars to render the template.

### events

This is a list of events to bind after the template has been rendered. For example:

```javascript
view.add ({
	name: 'my_view',
	events: {
		'click #click-me': function (event) {
			event.preventDefault ();
			alert ('Clicked!');
		}
	}
});
```

### hide()

This method hides the selector element in the page. For example:

```javascript
view.my_view.hide ();
```

###  name

The name of your view. This is used to call your view, for example `view.my_view_name.render ({})`.
This is the only required property.

If the ID of the selector and the name of the template match the name of the view, then
you can omit them from the `view.add()` parameters.

### render(data)

Renders the template into the view, binds any events to the view elements, and calls
the callback method, if one is defined.

### selector

The selector of a DOM element that will be filled with this view. If the element's ID
matches the view name, you can omit it from the `view.add()` parameters.

### template

The name of the template to use to render this view. If the template's name attribute
matches the view name, you can omit it from the `view.add()` parameters.

Here is an example template:

```html
<script type="text/html" name="my_view">
	<p>Hello {{name}}</p>
</script>
```
