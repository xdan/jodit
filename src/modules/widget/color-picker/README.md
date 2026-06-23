---
title: Color Picker Widget
description: The Jodit color picker widget that lets users choose a color from a palette, often combined with the tabs widget for text and background colors.
keywords: jodit, color picker, colorpicker widget, palette, color selection, widget
---

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
