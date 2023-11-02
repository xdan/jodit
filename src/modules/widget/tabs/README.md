# Tab widget

```javascript
const editor = Jodit.make('#editor');
const tabs = Jodit.modules.TabsWidget(editor, [
	{ name: 'Images', content: '<div>Images</div>' },
	{
		name: 'Title 2',
		content: editor.c.fromHTML('<div>Some content</div>')
	},
	{
		name: 'Color Picker',
		content: ColorPickerWidget(
			editor,
			function (color) {
				box.style.color = color;
			},
			box.style.color
		)
	}
]);
```
