Plugin for inserting or changing the type of a block element: p => h1, h1 => h2 etc

All settings are reduced to adding a new field to `Config.prototype.controls.paragraph.list`

```js
Jodit.make('#editor', {
	controls: {
		paragraph: {
			list: {
				pre: 'Source code'
			}
		}
	}
});
```

If you want to completely override the list, you can do it with [[Jodit.atom]]

```js
Jodit.make('#editor', {
	controls: {
		paragraph: {
			list: Jodit.atom({
        p: 'Pharagraph',
        h1: 'Heading 1',
        h2: 'Heading 2',
        h3: 'Heading 3',
        h4: 'Heading 4',
        h5: 'Heading 5',
        h6: 'Heading 6',
        blockquote: 'Quote',
        div: 'Div',
				pre: 'Source code'
			})
		}
	}
});
```

[//]: # (-   [Changelog]&#40;plugins/format-block/CHANGELOG.md&#41;)
