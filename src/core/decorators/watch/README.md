The decorator allows you to hang handlers on changes to the internal fields of the component,
as well as on any events [[EventEmitter]]

For example, we will make a reactive component that will change its color when its field changes:

```ts
import { component, watch, hook } from 'jodit/src/core/decorators';
import { UIElement } from 'jodit/src/ui';

@component()
class UISomeReactElement extends UIElement {
	state = {
		color: 'red'
	}

	render(): string {
		return `<div>
			This text must be colored
		</div>`
	}

	@hook('ready')
	@watch('state.color')
	onChangeColor(): void {
	  this.container.style.color = this.state.color;
	}
}

const elm = new UISomeReactElement(jodit);
elm.state.color = 'yellow';
```

The decorator can also be used to hang event handlers [[EventEmitter]]

Then the call signature has its own syntax:
- `:{EVENT}`
- `{CONTEXT}:{EVENT}`
- `{CONTEXT}:{EVENT.NAMESPACE}`

For example, this is how you can hang a click handler on the component container:

```ts
@component()
class UIButtonElement extends UIElement {
	state = {
		counter: 0
	}

	render(): string {
		return `<button>text</button>`
	}

	@watch('container:click') // Same this.j.e(this.container, 'click', this.onClick.bind(this))
	onClick(): void {
		this.state.counter++;
	}

	@watch('state.counter')
	onClick(): void {
		this.container.innerText = `Clicked ` + this.state.counter
	}
}
```

The context can be specified as a path to an object, and even as the name of a BEM interface element

```ts
@component()
class UICard extends UIElement {
	state = {
		counter: 0
	}

	render(): string {
		return `<div>
		  Clicked <span class="&__counter"></span>
		  <button class="&__card-button">Click</button>
		</div>`
	}

	@watch('card-button:click') // As this.j.e.on(this.getElm('card-button'), 'click', this.onClick.bind(this))
	onClick(): void {
		this.state.counter++;
	}

	@watch('jodit.editor:focus') // As this.j.e.on(this.j.editor, 'focus', this.onJoditEditorFocus.bind(this))
	onJoditEditorFocus(): void {
		alert('Focused')
	}

	@watch(':afterSetMode') // As this.j.e.on('afterSetMode', this.onAfterSetMode.bind(this))
	onAfterSetMode(): void {
		alert(this.jodit.mode)
	}

	@watch('state.counter')
	onClick(): void {
		this.getElm('counter').innerText = this.state.counter
	}
}
```

Also, the context can be set differently by setting it as the second parameter,
or by setting the function as the second parameter that will return the context

```ts
@component()
class UICardExt extends UICard {
	@watch(':click', (ctx) => ctx.getElm('card-button')) // As this.j.e.on(this.getElm('card-button'), 'click', this.onClick.bind(this))
	onClick(): void {
		this.state.counter++;
	}
}
```

The first argument can be an array:
```ts
@component()
class UICardExt extends UICard {
	@watch(['card-button:click','card-button:mouseup','card-button:mousedown'])
	onMouseEvents(e): void {
		e.preventDefault();
	}
}
```
