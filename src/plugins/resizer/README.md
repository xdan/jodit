# Resize elements

Adds to the editor the ability to change the size of elements such as pictures, iframes and tables.

```js
Jodit.make('#editor', {
	allowResizeTags: Jodit.atom(['img']),
	resizer: {
		showSize: true,
		hideSizeTimeout: 2000,
		useAspectRatio: false, //['img', 'table'],
		forImageChangeAttributes: true,
		min_width: 10,
		min_height: 10
	}
});
```
