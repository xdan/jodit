---
title: Nonenumerable Decorator
description: The @nonenumerable decorator marks a class field as non-enumerable so it is hidden from Object.keys and other enumeration of the instance.
keywords: jodit nonenumerable, decorator, class field, object.keys, enumerable, property descriptor
---

# @nonenumerable

Decorator that sets the enumerable property of a class field to false.

```ts
import { nonenumerable } from 'jodit/core/decorators';

class SomeComponent {
	@nonenumerable
	somePrivateProp: number = 1;

	anotherPublicProp: number = 2;
}

const elm = new SomeComponent();
console.log(Object.keys(elm)); // ['anotherPublicProp']
```
