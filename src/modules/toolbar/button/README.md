---
title: Toolbar Button
description: The Jodit toolbar button module that renders individual interactive buttons used to build the editor's toolbar controls.
keywords: jodit, toolbar button, button, toolbar control, editor button, ui button
---

# Toolbar button

## Description

This module provides a toolbar button for the application.

## Select

With `component: 'select'`, a control with a `list` shows its current value as words instead of its icon:

```js
Jodit.make('#editor', {
	controls: {
		font: { component: 'select' }
	}
});
```

A select is at least 100px wide and grows to fit its value. These CSS variables give it a fixed width instead, and a longer value is shortened with an ellipsis:

| Variable                              | Sets the width of           |
| ------------------------------------- | --------------------------- |
| `--jd-toolbar-select-width`           | every select                |
| `--jd-toolbar-select-font-width`      | the font family select      |
| `--jd-toolbar-select-fontsize-width`  | the font size select        |
| `--jd-toolbar-select-paragraph-width` | the paragraph format select |

A select's own variable takes precedence over `--jd-toolbar-select-width`:

```css
:root {
	--jd-toolbar-select-width: 120px;
	--jd-toolbar-select-font-width: 150px;
}
```
