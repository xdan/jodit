# @cache

The decorator allows you to cache the result of executing any getter of the UI component.

```typescript
import { cache, component } from 'jodit/core/decorators';

@component
class UIComponent extends UIElement {
	@cache()
	get someHeavyGetter() {
		return someHeaveCalculation(param1, param2);
	}
}

const elm = new UIComponent(jodit);
elm.someHeavyGetter; // someHeaveCalculation will execute only once
elm.someHeavyGetter;
```

It is also possible to cache returned HTML elements. The next time the method is called, the element will be cloned;

```typescript
import { cacheHTML, component } from 'jodit/core/decorators';

@component
class UIComponent extends UIElement {
	@cacheHTML()
	someHeavyMethod() {
		const div = document.createElement('div');
		div.innerHTML = someHeaveCalculation();
		return div;
	}
}

const elm = new UIComponent(jodit);
const div1 = elm.someHeavyMethod(); // call once
const div2 = elm.someHeavyMethod();

const elm2 = new UIComponent(jodit);
const div3 = elm2.someHeavyMethod();

console.log(div1 === div2); // false
console.log(div3 === div2); // false
console.log(div3 === div1); // false
```

```

```
