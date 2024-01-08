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
const editor = new Jodit('#editor', {
	askBeforePasteHTML: true,
	memorizeChoiceWhenPasteFragment: true,
	processPasteHTML: true,
	nl2brInPlainText: true,
	pasteExcludeStripTags: Jodit.atom(['br', 'style']),
	pasteHTMLActionList: Jodit.atom([
		{ value: Jodit.constants.INSERT_AS_HTML, text: 'Keep' },
		{ value: Jodit.constants.INSERT_AS_TEXT, text: 'Insert as Text' },
		{ value: Jodit.constants.INSERT_ONLY_TEXT, text: 'Insert only Text' }
	])
});
```
