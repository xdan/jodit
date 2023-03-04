# UI Component decorator

Any UI component inherited from [[UIElement]] must have a component decorator
This decorator calls `setStatus('ready')` after the `new UI()` operation
All other decorators start their work only when the component is ready to work.

```typescript
@component
class UIHeight extends UIElement {
	public state = {
		height: 10
	};

	@watch('state.height')
	protected onChangeHeight() {
		this.container.style.height = this.state.height + 'px';
	}
}

@component
class UIWidth extends UIHeight {
	public state = {
		height: 10,
		width: 10
	};

	@watch('state.width')
	protected onChangeWidth() {
		this.container.style.width = this.state.width + 'px';
	}

	constructor(jodit: IJodit) {
		super(jodit);
		console.log(this.componentStatus); // beforeReady
	}
}

const elm = new UIWidth(jodit);
console.log(elm.componentStatus); // ready
elm.state.width = 100;
```

You can choose not to use a decorator when you need to independently manage the readiness of a component to work.

```ts
class UIData extends UIElement {
	public state = {
		data: {}
	};

	@watch('state.data')
	protected onChangeWidth() {
		this.container.innerText = this.state.data.content;
	}

	@hook('ready')
	protected onReady() {
		alert("I'm ready");
	}
}

const elm = new UIData(jodit);

fetch('index.php').then(resp => {
	elm.state.data = resp.json();
	elm.setStatus('ready');
});
```

<iframe src="https://codesandbox.io/embed/decorators-u2h0os?fontsize=14&hidenavigation=1&theme=dark"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="Decorators"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>
