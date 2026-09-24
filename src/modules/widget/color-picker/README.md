---
title: Color Picker Widget
description: The Jodit color picker widget that lets users choose a color from a palette, often combined with the tabs widget for text and background colors.
keywords: jodit, color picker, colorpicker widget, palette, color selection, widget
---

# Color Picker widgets

Color picker widget is a simple widget that allows you to select a color from the palette.

The palette is laid out in rows of `--jd-color-picker-columns` colors (10 by default), and each color is a `--jd-color-picker-cell-size` square (24px by default). Override them to fit your palette:

```css
:root {
	--jd-color-picker-columns: 17;
	--jd-color-picker-cell-size: 20px;
}
```

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

Next to the hex input there is a button that removes the color. It calls the callback with an empty string, so a callback that sets a style to the value it receives removes that style.
