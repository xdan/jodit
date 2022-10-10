# Search inside editor

Search plugin. it is used for custom search in text
![search](https://user-images.githubusercontent.com/794318/34545433-cd0a9220-f10e-11e7-8d26-7e22f66e266d.gif)

Disable plugin:

```js
Jodit.make('#editor', {
	useSearch: false
});
```

or

```js
Jodit.make('#editor', {
	disablePlugins: 'search'
});
```

## JS API

### Find and select some text

```js
const editor = Jodit.make('#editor');
editor.value = '<p>this text contains some text</p>';
editor.e.fire('search', 'some text').then(() => {
	console.log('Selected!');
});
```

### Find next fragment

```js
const editor = Jodit.make('#editor');
editor.value = '<p>this text thow times contains some text and some text</p>';
editor.e.fire('searchNext', 'some text').then(() => {
	console.log('Selected!');
	editor.e.fire('searchNext', 'some text');
});
```
