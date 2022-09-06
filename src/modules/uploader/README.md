# File uploader module

The module for uploading files to the server is configured via the `uploader` namespace and has [[IUploaderOptions]] options.

> These same options are used by default in [[IFileBrowserOptions.uploader]] but can be overridden.

Here are some of them:

## Options

### uploader.url

-   Type: `string`

Point of entry for file uploader. This is a required parameter.

```js
Jodit.make('#editor', {
	uploader: {
		url: 'https://stitename.com/connector/index.php?action=upload'
	}
});
```

### uploader.format

-   Type: `string`
-   Default: 'json'

The format of the received data

### uploader.headers

-   Type: `string`
-   Default: null

An object of additional header key/value pairs to send along with
requests using the XMLHttpRequest transport. See [[Ajax.defaultAjaxOptions]]
Type: {function} uploader.prepareData Before send file will called this function. First argument it gets
[new FormData ()](https://developer.mozilla.org/en/docs/Web/API/FormData), you can use this if you want add some POST
parameter.

### uploader.data

-   Type: `object`|`boolean`
-   Default: false

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

-   Type: `function`

Check if received data was positive

### uploader.getMessage

-   Type: `function`

If you need display a message use this

### uploader.process

-   Type: `function`

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

### uploader.error

-   Type: `function`

Process negative situation. For example file wasn't uploaded because of file permission

### uploader.defaultHandlerSuccess

-   Type: `function`

Default success result processor. In first param it get `uploader.process` result

### uploader.defaultHandlerError

-   Type: `function`

Default error result processor.

## uploader.processFileName

-   Type: `function`
-   Default: `(key, file, name) => [key, file, name]`

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
		defaultHandlerSuccess: function (data, resp) {
			var i,
				field = 'files';
			if (data[field] && data[field].length) {
				for (i = 0; i < data[field].length; i += 1) {
					this.s.insertImage(data.baseurl + data[field][i]);
				}
			}
		},
		error: function (e) {
			this.e.fire('errorMessage', [e.getMessage(), 'error', 4000]);
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
