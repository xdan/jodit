---
title: Hook Decorator
description: The @hook decorator registers a method as a handler that runs when a component reaches a given lifecycle status such as ready or beforeDestruct.
keywords: jodit hook, decorator, lifecycle status, ready, component, status handler
---

# @hook

Establishes a handler for modifying the status of the component.

```ts
import { component, hook } from 'jodit/core/decorators';
import { UIElement } from 'jodit/ui';

@component
class UISomeElement extends UIElement {
	@hook('ready')
	protected onReadyHandler(): void {
		alert('Component ise ready');
	}
}
```

Component statuses can be viewed in [STATUSES](https://xdsoft.net/jodit/docs/modules/component.html#statuses)
