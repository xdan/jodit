The plugin allows you to add the ability to directly edit HTML to the editor.
The plugin connects the editor to the [Ace](https://ace.c9.io/)  page (default behavior).
This is implemented through the connection of the CDN JS file. They are set in the settings in [[Config.sourceEditorCDNUrlsJS]]
The appearance of the Ace editor can be set through its settings, option [[Config.sourceEditorNativeOptions]]

For example, let's change the editor theme to light `Chrome`

```js
Jodit.make('#editor', {
  sourceEditorNativeOptions: {
    theme: 'chrome'
  }
})
```

The list of themes supported by `Ace` can be found on this page https://ace.c9.io/build/kitchen-sink.html

Also, you can not use `Ace` but just use `Textarea`

```js
Jodit.make('#editor', {
  sourceEditor: 'area'
})
```

## Custom editor

You can implement your own text editor implementation, for example you can use [CodeMirror](https://codemirror.net/)
To do this, you need to add a class that will implement the interface [[ISourceEditor]] and register it with the plugin.

```js
class MirrorEditor {
	constructor(jodit){}

  getValue() {}
  setValue(raw) {};
  insertRaw(raw) {};

  getSelectionEnd() {};
  getSelectionStart() {};
  setSelectionRange(start, end) {};

  setPlaceHolder(title){}

  focus() {
  }

  setReadOnly(isReadOnly) {}

  selectAll() {}

  get isReady() {};
  onReadyAlways(callback) {};
}

Jodit.make('#editor', {
  sourceEditor: (j) => new MirrorEditor(j)
});
```

