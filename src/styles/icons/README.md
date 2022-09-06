# Icon system

The Jodit icon system allows you to connect and use a ready-made set of icons in several places.
Icons are actually SVG strings. You can insert any of these into your layout:

```js
console.log(Jodit.modules.Icon.get('cancel')); // <svg ...
```

You can add your own icons:

```js
Jodit.modules.Icon.set('someIcon', '<svg ....');
```

And then use this icon for example in a button in the toolbar

```js
Jodit.make('#editor', {
	buttons: [
		{
			icon: 'someIcon',
			name: 'someButton',
			exec: e => alert(e.selection.html)
		}
	]
});
```

The list of icons from the build can be viewed [here](https://github.com/xdan/jodit/tree/master/src/styles/icons)

In addition to the added icons in the toolbar, you can also use a simple link to the image:

```js
Jodit.make('#editor', {
	buttons: [
		{
			iconURL: 'https://xdsoft.net/jodit/build/images/logo.png',
			name: 'someButton',
			exec: e => alert(e.selection.html)
		}
	]
});
```

## Custom icons / Use Font awesome

Include Jodit and the CDN Font Awesome

```html
<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>
<link rel="stylesheet" href="build/jodit.min.css" />
<script src="build/jodit.min.js"></script>
```

Create input element

```html
<textarea id="editor">Some text</textarea>
```

And define event `getIcon`:

```js
const editor = Jodit.make('#editor', {
	events: {
		getIcon: function (name, control, clearName) {
			var code = name;

			// not all font awesome icons is matched to Jodit icons
			switch (clearName) {
				case 'redo':
					code = 'rotate-right';
					break;
			}

			return (
				'<i style="font-size:14px" class="fa fa-' +
				code +
				' fa-xs"></i>'
			);
		}
	}
});
```

For full replacing you can copy this code:

```js
const editor = Jodit.make('#editor', {
	events: {
		getIcon: function (name, control, clearName) {
			var code = clearName;

			switch (clearName) {
				case 'redo':
					code = 'rotate-right';
					break;

				case 'video':
					code = 'video-camera';
					break;

				case 'copyformat':
					code = 'clone';
					break;

				case 'about':
					code = 'question';
					break;

				case 'selectall':
					code = 'legal';
					break;

				case 'symbol':
					return '<span style="text-align: center;font-size:14px;">Ω</span>';

				case 'hr':
					code = 'minus';
					break;

				case 'left':
				case 'right':
				case 'justify':
				case 'center':
					code = 'align-' + name;
					break;

				case 'brush':
					code = 'tint';
					break;

				case 'fontsize':
					code = 'text-height';
					break;

				case 'ul':
				case 'ol':
					code = 'list-' + name;
					break;

				case 'source':
					code = 'code';
					break;
			}

			return (
				'<i style="font-size:14px" class="fa fa-' +
				code +
				' fa-xs"></i>'
			);
		}
	}
});
```
