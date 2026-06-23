---
title: Wait Decorator
description: The @wait decorator defers a method until a given condition function returns true, useful for delaying calls until a dependency like jQuery has loaded.
keywords: jodit wait, decorator, condition, deferred call, dependency, async
---

# @wait

Wrap function in wait wrapper, it will be called after `condition` returns `true`

```typescript
import { component, wait } from 'jodit/core/decorators';
import { UIElement } from 'jodit/ui';

@component
class UISomeElement extends UIElement {
	@wait(() => typeof jQuery !== 'undefined')
	protected runOnLoadJQuery(html: string): void {
		jQuery(this.container).html(html);
		alert('Run');
	}
}

const elm = new UISomeElement(jodit);
elm.runOnLoadJQuery('<h1>One</h1>'); // Do nothing
// jQuery is loaded
// alert
```
