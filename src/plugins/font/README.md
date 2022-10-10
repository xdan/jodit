# Fontsize/Font buttons

Allows you to apply the font size or the font itself to the selected text.
Adds the appropriate buttons to the menu.

```js
const editor = Jodit.make('#editor', {
	controls: {
		fontsize: {
			list: Jodit.atom([8, 9, 10])
		}
	}
});
```

```js
const editor = Jodit.make('#editor', {
	controls: {
		font: {
			list: Jodit.atom({
				'': 'Default',
				'Helvetica,sans-serif': 'Helvetica',
				'Arial,Helvetica,sans-serif': 'Arial',
				'Georgia,serif': 'Georgia',
				'Impact,Charcoal,sans-serif': 'Impact',
				'Tahoma,Geneva,sans-serif': 'Tahoma',
				'Times New Roman,Times,serif': 'Times New Roman',
				'Verdana,Geneva,sans-serif': 'Verdana'
			})
		}
	}
});
```
