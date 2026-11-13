---
title: Uploader Module
description: The Jodit uploader module for sending files to the server, configured via the uploader namespace with hooks for data, responses and file names.
keywords: jodit, uploader, file upload, upload files, ajax upload, drag and drop, server upload
---

# File uploader module

The module for uploading files to the server is configured via the `uploader` namespace and has [[IUploaderOptions]] options.

> These same options are used by default in [[IFileBrowserOptions.uploader]] but can be overridden.

Here are some of them:

## Options

### uploader.url

- Type: `string`

Point of entry for file uploader. This is a required parameter.

```js
Jodit.make('#editor', {
	uploader: {
		url: 'https://stitename.com/connector/index.php?action=upload'
	}
});
```

### uploader.format

- Type: `string`
- Default: 'json'

The format of the received data

### uploader.headers

- Type: `string`
- Default: null

An object of additional header key/value pairs to send along with
requests using the XMLHttpRequest transport. See [[Ajax.defaultAjaxOptions]]
Type: {function} uploader.prepareData Before send file will called this function. First argument it gets
[new FormData ()](https://developer.mozilla.org/en/docs/Web/API/FormData), you can use this if you want add some POST
parameter.

### uploader.data

- Type: `object`|`boolean`
- Default: false

POST parameters

#### Example prepareData

```js
Jodit.make('#editor', {
	uploader: {
		url: 'connector/index.php?action=upload', // This is a required parameter
		prepareData: function (formdata) {
			formdata.append('id', 24); // $_POST['id'] on server
			formdata.append('name', 'Some parameter'); // $_POST['name'] on server
		}
	}
});
```

### uploader.isSuccess

- Type: `function`

Check if received data was positive

### uploader.getMessage

- Type: `function`

If you need display a message use this

### uploader.process

- Type: `function`

The method of processing data received from the server. Must return special object:

```js
const process = resp => ({
	files: resp.files || [], // {array} The names of uploaded files.
	path: resp.path, // {string} Real relative path
	baseurl: resp.baseurl, // {string} Base url for filebrowser
	error: resp.error, // {int}
	msg: resp.msg // {string}
});
```

It can return `items`, one object per file (see `uploader.defaultHandlerSuccess`), instead of `files` and `isImages`. Its return type, `IUploaderProcessData`, lets `files` be left out then, and Jodit fills the arrays in from `items`. Return one or the other: when both are given, Jodit builds `items` from the arrays, unless `files` is empty.

```js
const process = resp => ({
	baseurl: resp.data.baseurl,
	items: resp.data.files.map((file, i) => ({
		file,
		isImage: resp.data.isImages[i]
	}))
});
```

### uploader.error

- Type: `function`

Process negative situation. For example file wasn't uploaded because of file permission

### uploader.defaultHandlerSuccess

- Type: `function`

Default success result processor. In first param it get `uploader.process` result

Its `items` has one object per file:

- `file`: the path relative to `baseurl`, or the data URI of an image read as base64
- `isImage`: whether the file is an image
- `name`: the name the file had on the user's device, which Jodit sets for images read as base64 (`insertImageAsBase64URI`)

Jodit builds `items` from the `files` and `isImages` the server answers with, so servers don't need to change. The same goes for the data passed to `uploader.bind()` handlers, `file.defaultHandlerSuccess`, `video.defaultHandlerSuccess` and `filebrowser.defaultCallback`, and the data `uploader.upload()` resolves with.

```js
Jodit.make('#editor', {
	uploader: {
		insertImageAsBase64URI: true,
		defaultHandlerSuccess(data) {
			const j = this.j || this;

			data.items.forEach(({ file, name }) => {
				const img = j.createInside.element('img');
				img.src = file;
				img.dataset.filename = name;
				j.s.insertImage(img, null, j.o.imageDefaultWidth);
			});
		}
	}
});
```

#### `files`, `isImages` and `fileNames` (deprecated)

Use `items`. The data still has these parallel arrays, with the same details, and when the server or `uploader.process` gives only `items`, Jodit fills them in from it. They will be removed in 5.0.

Until then the arrays win while `files` is set: the default handlers read them rather than `items`, so a handler that edits them and passes the data on to a default still works. A handler that edits `items` instead deletes `files` before passing the data on, or its edits aren't inserted:

```js
Jodit.make('#editor', {
	uploader: {
		defaultHandlerSuccess(data) {
			data.items = data.items.filter(({ isImage }) => isImage);
			delete data.files;

			Jodit.defaultOptions.uploader.defaultHandlerSuccess.call(
				this,
				data
			);
		}
	}
});
```

### uploader.defaultHandlerError

- Type: `function`

Default error result processor. A refused upload comes as an `UploadError` with the connector's `code`, the sent `files` and `retry()`, see the option's doc in the config.

### uploader.promptOnExists

- Type: `boolean`
- Default: `true`

On a `409` answer (the name is already taken) ask for another name and send the file again; `uploader.promptOnExistsSuggestName(name)` fills the prompt in. Details and examples are in the option's doc in the config.

### uploader.beforeUpload

- Type: `function`

Called before the files are sent: cancel, replace the files or add request fields, after asking the user if needed. Examples are in the option's doc in the config.

## uploader.processFileName

- Type: `function`
- Default: `(key, file, name) => [key, file, name]`

The method can be used to change the name of the uploaded file.

```js
Jodit.make('#editor', {
	uploader: {
		url: 'some-connector.php',
		processFileName: (key, file, name) => {
			return [key, file, 'some-prefix_' + name];
		}
	}
});
```

## Examples

### Example 1

```js
var editor = Jodit.make('#editor', {
	uploader: {
		url: 'connector/index.php?action=upload',
		format: 'json',
		headers: {
			'X-CSRF-Token': document
				.querySelector('meta[name="csrf-token"]')
				.getAttribute('content')
		},
		prepareData: function (data) {
			data.append('id', 24); //
		},
		buildData: function (data) {
			return { some: 'data' };
		},
		data: {
			csrf: document
				.querySelector('meta[name="csrf-token"]')
				.getAttribute('content')
		},
		isSuccess: function (resp) {
			return !resp.error;
		},
		getMessage: function (resp) {
			return resp.msg;
		},
		process: function (resp) {
			return {
				files: resp.files || [],
				path: resp.path,
				baseurl: resp.baseurl,
				error: resp.error,
				msg: resp.msg
			};
		},
		defaultHandlerSuccess: function (data) {
			data.items.forEach(function (item) {
				this.s.insertImage(data.baseurl + item.file);
			}, this);
		},
		error: function (e) {
			this.message.message(e.getMessage(), 'error', 4000);
		}
	}
});
```

### Example 2

```js
Jodit.make('#editor', {
	uploader: {
		url: 'https://sitename.com/jodit/connector/index.php?action=fileUpload',
		queryBuild: function (data) {
			return JSON.stringify(data);
		},
		contentType: function () {
			return 'application/json';
		},
		buildData: function (data) {
			return { hello: 'Hello world' };
		}
	}
});
```

### Example 3

```js
// buildData can return Promise
// this example demonstrate how send file like as base64 text. Work only in Firefox and Chrome
const editor = Jodit.make('#editor', {
	uploader: {
		url: 'index.php?action=fileUpload',
		queryBuild: function (data) {
			return JSON.stringify(data);
		},
		contentType: function () {
			return 'application/json';
		},
		buildData: function (data) {
			return new Promise(function (resolve, reject) {
				var reader = new FileReader();
				reader.readAsDataURL(data.getAll('files[0]')[0]);
				reader.onload = function () {
					return resolve({
						image: reader.result
					});
				};
				reader.onerror = function (error) {
					reject(error);
				};
			});
		}
	}
});
```
