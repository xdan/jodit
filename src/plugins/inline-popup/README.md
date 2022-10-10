# Inline popup plugin

Adds to elements inside the editor, a popup edit dialog.

```js
Jodit.make('#editor', {
	toolbarInline: true,
	toolbarInlineForSelection: true,
	toolbarInlineDisableFor: [],
	toolbarInlineDisabledButtons: ['source'],
	popup: {
		a: Jodit.atom(['link', 'unlink'])
	}
});
```
