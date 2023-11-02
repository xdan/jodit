# Color Picker widgets

Color picker widget is a simple widget that allows you to select a color from the palette.

```javascript
const editor = Jodit.make('#editor');
const tabs = Jodit.modules.TabsWidget(editor, {
	Text: Jodit.modules.ColorPickerWidget(
		editor,
		color => {
			alert(color);
		},
		'#fff'
	),
	Background: Jodit.modules.ColorPickerWidget(
		editor,
		color => {
			alert(color);
		},
		'#eee'
	)
});
```
