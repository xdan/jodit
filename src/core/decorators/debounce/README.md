Wraps a component method in [[Async.debounce]]. This makes it possible to reduce the load on 'heavy' functions.
For example:

```typescript
import { component, watch, debounce } from 'jodit/src/core/decorators';
import { Dom } from 'jodit/src/core/dom';

@component()
class UIInputSuggestion extends UIElement {
	override render(): string {
		return `<div>
			<input class="&__inputElement" type="text"/>
			<div class="&__suggestions"></div>
		</div>`; // container
	}

	state = {
		suggestions: []
	};

	// adds a listener for the container to the `input` event
	@watch(':inputElement.input')
	@debounce(100)
	protected onInputQuery(): void {
		fetch('search.php?q=' + encodeURIComponent(this.container.value)).then(
			resp => {
				this.state.suggestions = resp.json();
			}
		);
	}

	@watch('state.suggestions') // react on change `state.suggestions`
	@debounce(100)
	protected onChangeSuggestions(): void {
		Dom.detach(this.getElm('suggestions')); // clear liist

		this.state.suggestions.forEach(item => {
			const elm = this.jodit.ci.div();
			elm.innerText = item.title;
			this.getElm('suggestions').appendChild(div);
		});
	}
}
```
