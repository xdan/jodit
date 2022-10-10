# Responsible for HTML compliance with Document Type Definition standards

For example, a TABLE block element cannot be nested inside a P block element.

```js
Jodit.make('#editor', {
	dtd: {
		/**
		 * Remove extra br element inside block element after pasting
		 */
		removeExtraBr: true,

		/**
		 * Check when inserting a block element if it can be inside another block element (according `blockLimits`)
		 */
		checkBlockNesting: true,

		/**
		 * List of elements that contain other blocks
		 */
		blockLimits: {
			article: 1,
			aside: 1,
			audio: 1,
			body: 1,
			caption: 1,
			details: 1,
			dir: 1,
			div: 1,
			dl: 1,
			fieldset: 1,
			figcaption: 1,
			figure: 1,
			footer: 1,
			form: 1,
			header: 1,
			hgroup: 1,
			main: 1,
			menu: 1,
			nav: 1,
			ol: 1,
			section: 1,
			table: 1,
			td: 1,
			th: 1,
			tr: 1,
			ul: 1,
			video: 1
		}
	}
});
```
