# History

The history module is responsible for keeping track of the changes made to the editor and allowing the user to undo and redo them.

Editor change history occurs by comparing two editor states. Every time the editor changes,
the current state of the editor is compared with the previous state.
If they are different, then the current state of the editor is added to the history.

We do not use `MutationObserver` in the current implementation, so changes that occur in the editor must be synchronized with history manually.

```js
const editor = Jodit.make('#editor');
editor.value = '<p>Hello world!</p>';
console.log(editor.history.canUndo()); // true
console.log(editor.history.canRedo()); // false
console.log(editor.history.length); // 1
```

Now, let's modify the editor's content using JS methods:

```js
editor.editor.appendChild(editor.createInside.text('Hello world!'));
```

The history hasn't changed:

```js
console.log(editor.history.length); // 1
```

Because the changes were not in sync with history.
To do this, you need to call the `editor.synchronizeValues()` method:

```js
editor.editor.appendChild(editor.createInside.text('Hello world!'));
editor.synchronizeValues();
```

Now the story has changed:

```js
console.log(editor.history.length); // 2
```

To clear the history, you can call the method:

```js
editor.history.clear();
```

The editor state is an object that contains all the necessary data to restore the editor state.
In the current implementation, this is [[SnapshotType]], which contains the HTML editor code and the cursor position.

```js
const editor = Jodit.make('#editor');
editor.value = '<p>Hello world!</p>';
console.log(editor.history.snapshot.make()); // {html: "<p>Hello world!</p>", range: {…}}
```
