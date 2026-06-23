---
title: Tabs Widget
description: A Jodit widget that builds a tabbed interface from a list of named panes, accepting HTML or DOM content for each tab including other widgets.
keywords: jodit, tabs widget, tabswidget, tabbed interface, editor popup, jodit ui
---

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
