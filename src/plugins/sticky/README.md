# Sticky toolbar

Always keeps the toolbar position at the top of the browser window when scrolling in an editor with large text.

```js
Jodit.make('#editor', {
	toolbarSticky: true,

	toolbarDisableStickyForMobile: false,

	/**
	 * For example, in Joomla, the top menu bar closes Jodit toolbar when scrolling. Therefore, it is necessary to
	 * move the toolbar Jodit by this amount [more](http://xdsoft.net/jodit/doc/#2.5.57)
	 */
	toolbarStickyOffset: 100
});
```
