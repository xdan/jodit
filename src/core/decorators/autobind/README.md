---
title: Autobind Decorator
description: The @autobind decorator binds a class method to its instance so it keeps the correct this context when passed as a callback, caching the bound function.
keywords: jodit autobind, decorator, this binding, callback, class method, event handler
---

# @autobind

This decorator is used to bind class methods to the class instance. This is useful when you want to pass class methods as callbacks and preserve the correct `this` context.

```typescript
import { autobind } from 'jodit/core/decorators';

class UIComponent {
	@autobind
	onClick() {
		console.log(this); // UIComponent instance
	}
}

const elm = new UIComponent();
const button = document.createElement('button');
button.addEventListener('click', elm.onClick);
button.click(); // UIComponent instance
```

## Important Notes

- This decorator can only be applied to **individual methods**, not to entire classes
- The bound method is cached on the instance for performance
- The decorator throws a `TypeError` if applied to a non-method property
