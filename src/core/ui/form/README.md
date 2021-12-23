# Jodit Form UI Element

Component for creating form interfaces.

```ts
import { UIForm, UIInput, UIBlock } from 'jodit/src/core/ui';

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
