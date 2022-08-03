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
    insertParagraph: ['ctrl+shift+p', 'cmd+shift+p'],
  }
});
```
