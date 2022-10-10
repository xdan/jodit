# Editor in iframe

When you want to set unique styles for editable text, but do not want to connect them to the main page.
You can tell the editor to open the edit box in the iframe.

```js
Jodit.make('#editor', {
	iframe: true,
	iframeDefaultSrc: 'http://xdsoft.net/jodit/docs/',
	iframeBaseUrl: 'http://xdsoft.net/jodit/docs/',
	iframeTitle: 'Jodit',
	iframeStyle: 'html{margin: 0px;}',
	iframeCSSLinks: ['styles/default.css']
});
```

For example, this can be convenient for admin panels, where there should not be styles from the site itself.
