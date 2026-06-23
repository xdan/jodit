---
title: File Selector Widget
description: A Jodit widget that lets users pick a file by browsing the file browser or uploading a new one, returning the chosen URL to a callback.
keywords: jodit, file selector widget, file browser, file upload, image picker, jodit widget
---

# File Selector widgets

```javascript
const jodit = Jodit.make('#editor', {
	filebrowser: {
		ajax: {
			url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
		}
	}
});

FileSelectorWidget(
	jodit,
	{
		filebrowser(data) {
			console.log(data);
		},
		upload: true,
		url(url, text) {
			console.log(url);
		}
	},
	null,
	() => {},
	true
);
```
