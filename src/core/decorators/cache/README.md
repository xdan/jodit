# Cache methods decorator

The decorator allows you to cache the result of executing any getter of the UI component.

```typescript
import { cache, component } from 'jodit/core/decorators'

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

Также можно кешировать возвращаеиые HTML элементы. При следующем вызове метода, элемент дулет клоинроваться;

```typescript
import { cacheHTML, component } from 'jodit/core/decorators'

@component
class UIComponent extends UIElement {
	@cacheHTML()
	someHeavyMethod(param1, param2) {
		const div = document.createElement('div');
    div.innerHTML = someHeaveCalculation(param1, param2);
		return div;
	}
}

const elm = new UIComponent(jodit);
const div1 = elm.someHeavyMethod();
const div2 = elm.someHeavyMethod();
console.log(div1 === div2); // false
```
```
