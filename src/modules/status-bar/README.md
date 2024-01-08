# Status bar

This module provides a status bar for the application.
Allowing to display a message to the user or additional information about the editor.

## How to use

```js
const jodit = Jodit.make('#editor');
const elm = document.createElement('div');
elm.className = 'jodit-status-bar__element';
elm.innerHTML = 'Hello world!';
jodit.statusbar.append(elm);
```
