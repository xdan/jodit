# Selection normalization

Plugin normalizes selection and also proxies click events.
A utility plugin that allows you to subscribe to a click/mousedown/touchstart/mouseup on an element in DOM order

```js
const editor = Jodit.make('#editor');
editor.e.on('clickImg', img => {
	console.log(img.src);
});
```
