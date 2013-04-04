# view.js

Client-side view rendering based on Handlebars templates with added
DOM selectors and callbacks for initializing event handlers. Also uses
a touch of jQuery (Zepto should also work).

## Usage

```html
<!-- our handlebars template -->
<script type="text/html" id="hello-template">
	<p><a href="#" id="click-me">Hello {{name}}</a></p>
</script>

<!-- the div to insert the content into -->
<div id="hello-world"></div>

<script>
$(function () {
	// define our view
	view.add ({
		name: 'hello',
		selector: '#hello-world',
		template: 'hello-template',
		callback: function (el) {
			// you can access the view as this
			console.log ('Rendered view: ' + this.name);
			console.log ('With the name: ' + this.data.name);
			
			// add event listeners here
			$(el).find ('#click-me').click (function () {
				alert ('Clicked!');
			});
		}
	});
	
	// render the view
	view.hello.render ({name: 'world'});
});
</script>
```

Also see the included [demo.html](https://github.com/jbroadway/view.js/blob/master/demo.html)
for a complete example.