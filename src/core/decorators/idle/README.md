# Idle decorators

Wrap function in [[Async.requestIdleCallback]] wrapper

```ts
import { component, idle } from 'jodit/src/core/decorators';
import { UIElement } from 'jodit/src/ui';

@component
class SomeClass extends UIElement {
	@idle
	runIdle(): void {
		// Do some havy work
		this.runIdle(); // This will work and won't go into stack depth error and break the main thread
	}
}
```
