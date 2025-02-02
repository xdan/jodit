# Clean HTML

The plugin provides a way to ensure that the document does not contain unwanted tags, XSS scripts, and similar elements.

For instance, you can explicitly define which tags or attributes are allowed or disallowed:

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

You can also disable specific tags. For example, let's disable script tags and images:

```javascript
Jodit.make('#editor', {
	cleanHTML: {
		denyTags: 'script,img'
	}
});
```

Alternatively, you can use an object to specify the denied tags:

```javascript
Jodit.make('#editor', {
	cleanHTML: {
		denyTags: {
			script: true,
			img: true
		}
	}
});
```

The plugin settings can be accessed under the namespace [[Config.cleanHTML]].

## Allow and deny tags

The option `allowTags` is more priority than` denyTags`.
If the `allowTags` is set, then all the tags that are not indicated in` allowTags` will be removed.

```javascript
const editor = Jodit.make('#editor', {
	cleanHTML: {
	  allowTags: {
			script: true,
		},
		denyTags: {
			script: true,
		}
	}
});

editor.value = '<script>alert(1)</script><p>test</p>';
// The result will be only <script>alert(1)</script> because the script tag is allowed
console.log(editor.value); // <script>alert(1)</script>
```
