# Component system

Every Jodit element inherits from [Component](https://xdsoft.net/jodit/docs/classes/component.Component.html), and implements the [IComponent](https://xdsoft.net/jodit/docs/interfaces/types.IComponent.html) interface accordingly.

Such elements have a name

```js
const jodit = Jodit.male('#editor');
console.log(jodit.componentName);
console.log(jodit.statusbar.componentName);
console.log(jodit.filebrowser.componentName);
console.log(jodit.uploader.componentName);
```

And also each component has its current life cycle status:

```js
const jodit = Jodit.male('#editor');
console.log(jodit.componentStatus); // beforeInit, ready, beforeDestruct, destructed
```

You can work on changes in the status of a component through the decorator [decorators/hook](https://xdsoft.net/jodit/docs/modules/decorators_hook.html)
either through the method [Component.hookStatus](https://xdsoft.net/jodit/docs/classes/component.Component.html#hookstatus)

```ts
import { Component } from 'jodit/core/component';

export class SomeComponent extends Component {}
const cmp = new SomeComponent();

cmp.hookStatus('ready', () => {
	console.log('Hello world on ready = )');
});
```

To set the status, it is enough to call the method [Component.setStatus](https://xdsoft.net/jodit/docs/classes/component.Component.html#setstatus)

```ts
import { Component } from 'jodit/core/component';

export class SomeComponent extends Component {}
const cmp = new SomeComponent();
cmp.setStatus('ready');
```

The component itself can automatically set the ready status:

```ts
import type { IJodit } from 'jodit/types';
import { Component } from 'jodit/core/component';

export class SomeComponent extends Component {
	constructor(jodit: IJodit) {
		super(jodit);
		cmp.setStatus('ready');
	}
}

const cmp = new SomeComponent();
console.log(cmp.isReady);
```

But it’s better not to do this, because with inheritance, such a component will be `ready` ahead of time:

```ts
import type { IJodit, IStatusBar } from 'jodit/types';
import { Component } from 'jodit/core/component';
import { StatusBar } from 'jodit/modules';

export class SomeComponent extends Component {
	constructor(jodit: IJodit) {
		super(jodit);
		cmp.setStatus('ready');
	}
}

export class SomeAnotherComponent extends SomeComponent {
	public status: IStatusBar;

	constructor(jodit: IJodit) {
		super(jodit);
		console.log(this.isReady); // true
		// Errors are possible here, since the status of the component is already 'ready' but you have not yet initialized its fields
		this.status = new StatusBar(jodit);
	}
}
```

Therefore, it is better to use a decorator [decorators/component](https://xdsoft.net/jodit/docs/modules/decorators_component.html)

```ts
import type { IJodit, IStatusBar } from 'jodit/types';
import { Component } from 'jodit/core/component';
import { StatusBar } from 'jodit/modules';
import { component } from 'jodit/core/decorators';

@component
export class SomeComponent extends Component {}

@component
export class SomeAnotherComponent extends SomeComponent {
	public status: IStatusBar;

	constructor(jodit: IJodit) {
		super(jodit);
		console.log(this.isReady); // false
		this.status = new StatusBar(jodit);
	}
}

const cmp = new SomeAnotherComponent();
console.log(cmp.isReady); // true
```
