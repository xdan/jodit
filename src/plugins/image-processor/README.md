# Plugin for processing images in a document.

-   Attaches a click handler to each image and select image after click
-   After `load` image fire - resize - for recalculating editor size
-   Checks if the `imageProcessor.replaceDataURIToBlobIdInView` option is enabled then converts image src which has data
    base64 to [blob-uri](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)

In this case, `Jodit.value` returns images with `data-uri`. And original `textarea` itself does the reverse replacement take place.

```js
const editor = Jodit.make('#editor', {
	imageProcessor: {
		replaceDataURIToBlobIdInView: true // This is the default value, but for examples we set it
	}
});

editor.value =
	'<p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="/></p>';
console.log(editor.value); // <p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="/></p>
console.log(editor.getElementValue()); // '<p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="/></p>'
console.log(editor.getNativeEditorValue()); // <p><img src="blob:http://localhost:2000/03377cf0-6260-4351-82ad-8a8901ea104f"></p>
```
