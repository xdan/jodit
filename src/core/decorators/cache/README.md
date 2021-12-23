The decorator allows you to cache the result of executing any method of the UI component.

```typescript
@component()
class UIComponent extends UIElement {
  @cache()
  someHeavyMethod(param1, param2) {
    return someHeaveCalculation(param1, param2);
  }
}

const elm = new UIComponent(jodit);
elm.someHeavyMethod(1, 2);
elm.someHeavyMethod(1, 2);
elm.someHeavyMethod(1, 2); // someHeaveCalculation will execute only once
elm.someHeavyMethod(2, 2); // someHeaveCalculation will execute again
```
