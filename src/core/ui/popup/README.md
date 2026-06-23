---
title: Popup Module
description: A module for creating pop-up windows positioned next to interface elements, with methods to set content, open at coordinates, and close.
keywords: jodit, popup, pop-up window, ui module, positioning, interface
---

# Popup

The module is used to create pop-up windows next to interface elements.

```js
const { Popup } = Jodit.modules;

const popup = new Popup(jodit);
popup.setContent('Hello world').open(() => ({
	left: 100,
	top: 200
}));

popup.close();
```
