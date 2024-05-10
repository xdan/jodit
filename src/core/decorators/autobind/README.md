# @autobind

This decorator is used to bind the class methods to the class instance. This is useful when you want to pass the class methods as a callback and you want to preserve the class instance.

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

Also, you can use this decorator to bind all class methods to the class instance:

```typescript
import { autobind } from 'jodit/core/decorators';

@autobind
class UIComponent {
	onClick1() {
		console.log(this); // UIComponent instance
	}
	onClick2() {
		console.log(this); // UIComponent instance
	}
}

const elm = new UIComponent();
const button = document.createElement('button');
button.addEventListener('click', elm.onClick1);
button.addEventListener('click', elm.onClick2);
button.click(); // UIComponent instance,UIComponent instance
```

> Now `autobind` is just alias for `autobind-decorator` package. But in our future versions, we will replace it with our own implementation.
