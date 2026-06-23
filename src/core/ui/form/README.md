---
title: Form UI Element
description: A UI component for building form interfaces in Jodit by composing inputs, blocks, and buttons through the UIForm, UIInput, and UIBlock elements.
keywords: jodit, form, ui element, uiform, uiinput, form interface
---

# Form UI Element

Component for creating form interfaces.

```ts
import { UIForm, UIInput, UIBlock } from 'jodit/core/ui';

const form = new UIForm(jodit, [
	new UIInput(editor, {
		required: true,
		label: 'URL',
		name: 'url',
		type: 'text',
		placeholder: 'https://'
	}),
	new UIInput(editor, {
		name: 'text',
		label: 'Alternative text'
	}),
	new UIBlock(editor, [button])
]);
```
