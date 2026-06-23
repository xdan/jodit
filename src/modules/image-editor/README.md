---
title: Image Editor Module
description: The Jodit image editor for cropping and resizing images, opened programmatically and configured through the ImageEditorOptions interface.
keywords: jodit, image editor, crop image, resize image, photo editing, imageeditor
---

# Image editor

Photo editing is configured through the interface [[ImageEditorOptions]]

for example:

```js
const jodit = Jodit.make('#editor', {
	imageeditor: {
		closeAfterSave: true,
		crop: false,
		resize: true,
		width: 500
	}
});

jodit.imageeditor.open(
	'https://xdsoft.net/jodit/images/test.png',
	(name, data, success, failed) => {
		const img = jodit.node.c('img');
		img.setAttribute('src', 'https://xdsoft.net/jodit/images/test.png');
		if (box.action !== 'resize') {
			return failed(
				'Sorry it is work only in resize mode. For croping use FileBrowser'
			);
		}
		img.style.width = data.w;
		img.style.height = data.h;
		jodit.s.insertNode(img);
		success();
	}
);
```
