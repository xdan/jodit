# Selection module

A module for working with the cursor, text selections, processing selections, inserting html in place of the cursor.
most obvious use case

## How to insert HTML into Jodit

There is a family of methods for this.[[Select.prototype.insertHTML]], [[Select.prototype.insertNode]], [[Select.prototype.insertImage]].

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
