---
title: Context Menu Module
description: The Jodit context menu module that shows a custom right-click menu with icons and actions, replacing the browser's default context menu.
keywords: jodit, context menu, right click, contextmenu, custom menu, editor actions
---

# Context menu

It's pretty easy to use:

```js
const editor = Jodit.make('#editor');

const { ContextMenu } = Jodit.modules;
const contextMenu = new ContextMenu(editor);

editor.events.on(editor.editor, 'contextmenu', event => {
	contextMenu.show(event.clientX, event.clientY, [
		{
			title: 'Some action',
			icon: 'search',
			exec: () => {
				console.log('Click on some action', event.target);
			}
		},
		{
			title: 'Another action',
			icon: 'bold',
			exec: () => {
				console.log('Click another action', event.target);
			}
		}
	]);

	return false; // prevent default context menu
});
```

You can use svg instead of icon macros.

```js
const action = {
	title: 'Another action',
	icon: '<svg>...</svg>',
	exec: () => {
		console.log('Click another action');
	}
};
```
