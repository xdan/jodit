# Jodit UI System

For interface design, Jodit provides a set of components that allow you to build complex interfaces.
Their advantage is the uniformity of the insert/drop interfaces. Reactivity created by observing the fields of the component.

Each UI element must implement the interface [[IIUElement]], and should extend [[UIElement]].

> For each element to work, an instance is required when creating it [[IView]]

```ts
import './style.less'

import { UIElement } from 'jodit/src/core/ui';
import { component } from 'jodit/src/core/decorators';

@component()
export class UISlider extends UIElement {
	className() {
		return 'UISlider';
	}

	render(): string {
		return `<div>
			<div class="&__wrapper">
			  <div class="&__item">1</div>
			  <div class="&__item">2</div>
			  <div class="&__item">3</div>
			</div>
		</div>`;
	}
}
```

Pay attention to the styles. They connect explicitly.

File `style.less`
```less
.jodit-ui-slider {
  &__wrapper {
    display: flex;
    overflow: scroll;
  }

  &__slider-item {
    display: flex;
    width: 200px;
    height: 100px;
    background-color: red;
  }
}
```
