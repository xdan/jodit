# HTML Paste Processing Plugin from MSWord

Process pasting text from MS Word

```js
Jodit.make('#editor', {
	/**
	 * Show the paste dialog if the html is similar to what MSWord gives when copying.
	 */
	askBeforePasteFromWord: true,

	/**
	 * Handle pasting of HTML - similar to a fragment copied from MSWord
	 */
	processPasteFromWord: true,

	/**
	 * Default insert method from word, if not define, it will use defaultActionOnPaste instead
	 */
	defaultActionOnPasteFromWord: 'insert_clear_html'
});
```
