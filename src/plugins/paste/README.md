# Process paste

The plugin handles pasting text fragments from the clipboard.

To disable the plugin, just select:

```js
Jodit.make('#editor', {
	disablePlugins: ['paste']
});
```

## Options

```ts
interface Config {
	/**
	 * Ask before paste HTML in WYSIWYG mode
	 */
	askBeforePasteHTML: boolean;

	/**
	 * When the user inserts a snippet of HTML, the plugin will prompt for the insertion method.
	 * If the user inserts the same fragment again, the previously selected option will be used without prompting for confirmation.
	 */
	memorizeChoiceWhenPasteFragment: boolean;

	/**
	 * Handle pasted text - similar to HTML
	 */
	processPasteHTML: boolean;

	/**
	 * Inserts HTML line breaks before all newlines in a string
	 */
	nl2brInPlainText: boolean;

	/**
	 * List of tags that will not be removed from the pasted HTML with INSERT_AS_TEXT mode
	 */
	pasteExcludeStripTags: HTMLTagNames[];

	/**
	 * Options when inserting HTML string
	 */
	pasteHTMLActionList: IUIOption[];

	/**
	 * Scroll the editor to the pasted fragment
	 */
	scrollToPastedContent: boolean;
}
```

## Example

```javascript
const editor = Jodit.make('#editor', {
	askBeforePasteHTML: true,
	memorizeChoiceWhenPasteFragment: true,
	processPasteHTML: true,
	nl2brInPlainText: true,
	pasteExcludeStripTags: ['br', 'style'],
	pasteHTMLActionList: [
		{ value: Jodit.constants.INSERT_AS_HTML, text: 'Keep' },
		{ value: Jodit.constants.INSERT_AS_TEXT, text: 'Insert as Text' },
		{ value: Jodit.constants.INSERT_ONLY_TEXT, text: 'Insert only Text' }
	]
});
```

Add custom action to pasteHTMLActionList:

For example, add the action of "CUSTOM" and process it in the event `OnCustPasteoption`
All tags will be removed `<Span>`:

```javascript
Jodit.make('#editor', {
	events: {
		onCustomPasteHTMLOption: (action, html) => {
			if (action === 'custom') {
				return html.replace(/<span[^>]*>([^<]+)<\/span>/g, '$1');
			}
		}
	},
	pasteHTMLActionList: [
		{
			text: 'Custom',
			value: 'custom'
		}
	]
});
```

You can add some more serious processor:

```javascript
Jodit.make('#editor', {
	events: {
		onCustomPasteHTMLOption: (action, html) => {
			if (action === 'custom') {
				const div = document.createElement('div');
				div.innerHTML = html;
				const spans = div.querySelectorAll('span');
				for (let i = 0; i < spans.length; i++) {
					const span = spans[i];
					const p = document.createElement('p');
					p.innerHTML = span.innerHTML;
					span.parentNode.replaceChild(p, span);
				}
				return div.innerHTML;
			}
		}
	},
	pasteHTMLActionList: [
		{
			text: 'Custom',
			value: 'custom'
		}
	]
});
```

You can also reduce the HTML default insert and not ask the user a choice:

```javascript
Jodit.make('#editor', {
	askBeforePasteHTML: false,
	defaultActionOnPaste: 'custom',
	events: {
		onCustomPasteHTMLOption: (action, html) => {
		  return html;
		}
	}
});
```
