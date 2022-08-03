# Show info messages

Allow show information messages inside editor:

```js
const editor = Jodit.make('#editor');
editor.events.fire('errorMessage', 'Hellow world!', 'error');
editor.events.fire('errorMessage', 'Hellow world!', 'info');
editor.events.fire('errorMessage', 'Hellow world!', 'success', 3000); // Show 3 seconds
```
