# Bold and styles button

Provide Bold/Italic/Strikethrough/Underline/Subscript/Superscript buttons and commands.

```js
const editor = Jodit.make('#editor');
editor.execCommand('bold'); // or press Ctrl+B
editor.execCommand('italic'); // or press Ctrl+I
editor.execCommand('underline'); // or press Ctrl+U
editor.execCommand('strikethrough');
editor.execCommand('subscript');
editor.execCommand('superscript');
```
