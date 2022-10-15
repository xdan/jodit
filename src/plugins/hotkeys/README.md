# Process hotkeys

Allows you to assign keyboard shortcuts to Jodit commands.

```js
Jodit.make('#editor', {
	commandToHotkeys: {
		removeFormat: ['ctrl+shift+m', 'cmd+shift+m'],
		insertOrderedList: ['ctrl+shift+7', 'cmd+shift+7'],
		insertUnorderedList: ['ctrl+shift+8, cmd+shift+8'],
		selectall: ['ctrl+a', 'cmd+a'],
		bold: ['ctrl+b']
	}
});
```

Jodit supports many custom commands, but you can set any of the ones already [built into the editor](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#parameters)

```js
Jodit.make('#editor', {
	commandToHotkeys: {
		insertParagraph: ['ctrl+shift+p', 'cmd+shift+p']
	}
});
```

## Events

You can just set some callback on keyboard shortcuts:

```js
Jodit.make('#editor', { disablePlugins: ['bold'] }).e.on(['meta+b', 'control+b'], () => {
	alert('Do smth with text');
	return false;
});
```

Pay attention to the order of the keys in this case, it should be like this: `meta`, `control`, `alt`, `shift`, `any`.

For example:
-   `meta+alt+t`
-   `control+alt+p`
-   `shift+d`

> Please note that, unlike the plugin settings, the `ctrl` and `cmd` keys here should be written exactly like this `control` and `meta`.
