# Custom processing for delete command

This plugin replaces the default delete command with a custom one that.

## Disable plugin

```js
Jodit.make('#editor', {
	disablePlugins: 'delete'
});
```

## How to use

```js
const editor = new Jodit('#editor');
editor.value = '<p>Hello, world!</p>';
editor.execCommand('selectall');
editor.execCommand('delete');
```
