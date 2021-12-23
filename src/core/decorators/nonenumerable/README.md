Decorator that sets the enumerable property of a class field to false.

```ts
import { nonenumerable } from 'jodit/src/core/decorators';

class SomeComponent {
	@nonenumerable
	somePrivateProp: number = 1;

	anotherPublicProp: number = 2;
}

const elm = new SomeComponent();
console.log(Object.keys(elm)); // ['anotherPublicProp']
```
