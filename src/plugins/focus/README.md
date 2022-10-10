# Autofocus plugin

Autofocus plugin - set focus inside the editor after reload

```js
const editor = Jodit.make('#editor', {
	autofocus: true,
	cursorAfterAutofocus: 'start', // 'end';
	saveSelectionOnBlur: true
});
```
