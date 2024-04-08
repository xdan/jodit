# Selection

A module for working with the cursor, text selections, processing selections, inserting html in place of the cursor.
Most obvious use case

## How to insert HTML into Jodit

There is a family of methods for this.[[ISelect.insertHTML]], [[ISelect.insertNode]], [[ISelect.insertImage]].

```js
const jodit = Jodit.make('#editor');
jodit.selection.insertHTML('<span>some html</span>');
jodit.selection.insertNode(document.createElement('div')); // don't do that =) see [[core/create]]
jodit.selection.insertImage('https://somesite.com/image.png');
```

## How to set focus in Jodit editor

```js
const jodit = Jodit.make('#editor');
jodit.selection.focus();
```

## Apply a style to selected text

```js
const jodit = Jodit.make('#editor');
jodit.s.commitStyle({ element: 'h1' }); // Wrap selected text in <h1> tag
jodit.s.commitStyle({ attributes: { className: 'some-class' } }); // Add class to selected text
jodit.s.commitStyle({ attributes: { style: { color: 'red' } } }); // Apply style to selected text
jodit.synchronizeValues();
```

> s - is a shortcut for `selection`
