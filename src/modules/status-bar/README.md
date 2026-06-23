---
title: Status Bar Module
description: The Jodit status bar module that displays messages to the user or extra information about the editor and lets you append custom elements to it.
keywords: jodit, status bar, statusbar, editor info, footer bar, custom elements
---

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
