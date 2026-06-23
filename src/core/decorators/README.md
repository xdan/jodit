---
title: Decorators Overview
description: An overview of Jodit decorators that simplify UI component work by wiring up event handlers, reactive state changes and component lifecycle status.
keywords: jodit decorators, component, watch, hook, ui component, reactive state
---

# Decorators

Decorators are designed to make it easier to work with UI components.
Adding event handlers, state changes, and component status.

```ts
import { component, watch, hook } from 'jodit/core/decorators';
import { UIElement } from 'jodit/ui';

@component
class UISomeReactElement extends UIElement {
	state = {
		color: 'red',
		counter: 1
	};

	render(): string {
		return `<div>
            This text must be colored <span class="&__counter"></span>
        </div>`;
	}

	@hook('ready')
	@watch('state.color')
	onChangeColor(): void {
		this.container.style.color = this.state.color;
	}

	@hook('ready')
	@watch('state.counter')
	onChangeColor(): void {
		this.getElm('counter').innerText = this.state.counter.toString();
	}
}

const elm = new UISomeReactElement(jodit);
elm.state.color = 'yellow';
elm.state.counter = 55;
```
