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
