The plugin allows you to ensure that the document does not contain unwanted tags, xxs scripts and the like.

For example, you can explicitly specify which tags or attributes are allowed and which are not:

```javascript
Jodit.make('#editor', {
	cleanHTML: {
		allowTags: {
			p: true,
			a: {
				href: true
			},
			table: true,
			tbody: true,
			tr: true,
			td: true,
			th: false,
			img: {
				src: '1.png'
			}
		}
	}
});
```

Plugin settings are under the namespace [[Config.cleanHTML]]
