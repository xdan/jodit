Sets a handler for changing the component's status.

```ts
import { component, hook } from 'jodit/src/core/decorators';
import { UIElement } from 'jodit/src/ui';

@component()
class UISomeElement extends UIElement {
	@hook('ready')
	protected onReadyHandler(): void {
		alert('Component ise ready');
	}
}
```

Component statuses can be viewed in [[STATUSES]]
