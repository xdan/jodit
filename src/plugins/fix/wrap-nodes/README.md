A plugin that ensures that there are no elements in the document that are not surrounded by a block element.

For example, the plugin will result in HTML:

```html
test <img src="./test.png" />
```

Depending on the [[Config.enter]] setting to this view:

```html
<p>test <img src="./test.png" /></p>
```

You may encounter a situation where your custom tags will be treated as inline by the plugin.
And he will also surround them in a block element.
To prevent this from happening, you can explicitly set in the settings which tags to avoid.

```js
Jodit.make('#editor', {
	wrapNodes: {
		exclude: ['hr', 'style', 'my-component']
	}
});
```

Plugin settings are under the namespace [[Config.wrapNodes]]
