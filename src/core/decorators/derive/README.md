# Decorator derive

Inspired by the great [V4Fire framework](https://github.com/V4Fire), we decided to add a trait mechanism to the editor.
You can read more about the derive directive in the original [project](https://github.com/V4Fire/Client/tree/master/src/traits).

Here we will consider only an example of use.
The expansion of the object's fields is not due to inheritance, but due to the copying of functions from the so-called traits.

Let's describe some functionality that we would like to reuse in other classes.

```typescript
import type { IComponent, IDictionary } from 'jodit/types';

export abstract class SomeFuntionality {
	abstract mods: IDictionary;

	setMode(
		this: IComponent & SomeFuntionality,
		name: string,
		value: string
	): void {
		this.mods[name] = value;
	}

	getMode(
		this: IComponent & SomeFuntionality,
		name: string
	): CanUndef<string> {
		return this.mods[name];
	}
}
```

In classical OOP, we would use inheritance. But if we want to add this functionality to a class,
which has nothing to do with it, there will be problems.
Therefore, the traits mechanism was proposed in V4Fire, and Jodit borrowed it.

```typescript
import type { IComponent, IDictionary } from 'jodit/types';
import { Component } from 'jodit/core/component';
import { derive } from 'jodit/core/decorators';
import { SomeFuntionality } from './traits/some-functionality.ts';

export interface SomeComponent extends SomeFuntionality {}

@derive(SomeFuntionality)
export class SomeComponent extends Component {
	mods: IDictionary = {};
}

const component = new SomeComponent();
component.setMode('open', 'true');
```

TypeScript uses a mechanism to extend the interface of any class. And in runtime, they are added by the `derive` directive.

This is how multiple inheritance works. Those. A decorator can take multiple extensions.

```typescript
import type { IComponent, IDictionary } from 'jodit/types';
import { Component } from 'jodit/core/component';
import { derive } from 'jodit/core/decorators';
import { Mods, Dlgs, Elms } from 'jodit/core/traits';
import { SomeFuntionality } from './traits/some-functionality.ts';

export interface SomeComponent extends Mods, Dlgs, Elms, SomeFuntionality {}

@derive(Mods, Dlgs, Elms, SomeFuntionality)
export class SomeComponent extends Component {
	mods: IDictionary = {};
}

const component = new SomeComponent();
component.setMode('open', 'true'); // From SomeComponent
component.setMod('open', 'true'); // From Mods
component.alert('Hi'); // From Dlgs
component.getElm('header'); // From Elms
```
