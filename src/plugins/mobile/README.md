# Mobile mode

Displays a varying set of buttons in the editor based on different editor sizes.
The remaining buttons are concealed under the `dots` button.

## Configuration

```js
Jodit.make('#editor', {
	toolbarAdaptive: true, // Ennable/disable adaptive toolbar (default: true),
	buttons: [
		'bold',
		'italic',
		'underline',
		'superscript',
		'subscript',
		'strikethrough',
		'ul',
		'ol'
	],
	buttonsMD: ['bold', 'italic', 'underline', 'dots'],
	buttonsSM: ['bold', 'italic', 'dots'],
	buttonsXS: ['bold', 'dots']
});
```

The plugin also emulates the tap event for mobile devices.
When you tap on the input field, the editor will insert the cursor into the desired location.

```js
Jodit.make('#editor', {
	mobileTapTimeout: 500 // Timeout for emulate tap event (default: 300)
});
```

## Disable plugin

```js
Jodit.make('#editor', {
	toolbarAdaptive: false
});
```

or

```js
Jodit.make('#editor', {
	disablePlugins: ['mobile']
});
```
