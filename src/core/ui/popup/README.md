# Popup

The module is used to create pop-up windows next to interface elements.

```js
const { Popup } = Jodit.modules;

const popup = new Popup(jodit);
popup.setContent('Hello world').open(() => ({
	left: 100,
	top: 200
}));

popup.close();
```
