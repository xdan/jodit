# @idle

Wrap function in [Async.requestIdleCallback](https://xdsoft.net/jodit/docs/classes/async.Async.html#requestidlecallback) wrapper

```ts
import { component, idle } from 'jodit/core/decorators';
import { UIElement } from 'jodit/ui';

@component
class SomeClass extends UIElement {
	@idle
	runIdle(): void {
		// Do some havy work
		this.runIdle(); // This will work and won't go into stack depth error and break the main thread
	}
}
```
