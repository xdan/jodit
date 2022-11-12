# Jodit filebrowser

Module for working with remote images or just files. Allows you to upload / delete / rename files on the server.

> A prerequisite for the module to work is the server side. Jodit offers its own implementation in php [jodit-connectors](https://github.com/xdan/jodit-connectors). The module will not work without the server side.

You can write the backend yourself, it must support [API](https://github.com/xdan/jodit-connectors#api)
Module settings allow you to override behavior for your server-side implementation.

For example, by default, the server side returns a list of files in this format:

```json
{
	"success": true,
	"time": "2021-12-23 16:30:01",
	"data": {
		"sources": [
			{
				"baseurl": "https://xdsoft.net/jodit/finder/files/",
				"path": "/folder/somepath/",
				"files": [
					{
						"name": "pexels-sachin-c-nair-954929.jpg",
						"type": "image"
					},
					{
						"name": "pexels-james-wheeler-417074.jpg",
						"type": "image"
					}
				],
				"name": "default"
			}
		],
		"code": 220
	}
}
```

But what if your server returns such data for example?

```json
[
	{
		"name": "pexels-sachin-c-nair-954929.jpg",
		"type": "image"
	},
	{
		"name": "pexels-james-wheeler-417074.jpg",
		"type": "image"
	}
]
```

In this case, you can add the setting [[IFileBrowser.ajax.process]] or define the same setting for a specific handle,
for example, to get a list [[IFileBrowser.items]]

```js
Jodit.make('#editor', {
	filebrowser: {
		ajax: {
			url: 'https://sitename.com/connector/index.php', // this parameter is required
			process: resp => {
				return {
					success: true,
					time: '2021-12-23 16:30:01',
					data: {
						sources: [
							{
								baseurl:
									'https://xdsoft.net/jodit/finder/files/',
								path: '/folder/somepath/',
								files: resp,
								name: 'default'
							}
						],
						code: 220
					}
				};
			}
		}
	}
});
```

but in that case all the responses of the all endpoints will be processed by this function. Better to handle the response for a specific handle:

```js
Jodit.make('#editor', {
	filebrowser: {
		ajax: {
			url: 'https://sitename.com/connector/index.php'
		},
		// a request for a list of files will be handled in a special way
		items: {
			process: resp => {
				return {
					success: true,
					time: '2021-12-23 16:30:01',
					data: {
						sources: [
							{
								baseurl:
									'https://xdsoft.net/jodit/finder/files/',
								path: '/folder/somepath/',
								files: resp,
								name: 'default'
							}
						],
						code: 220
					}
				};
			}
		}
	}
});
```

## Settings

-   filebrowser.howLongShowMsg=3000 How long to show an error message
    in the status bar (ms)
-   filebrowser.sort=function (a, b, sortBy, parent) { return b.changed - a.changed;}
    Items sort functions
-   filebrowser.sortBy='changed-desc' Sort by field
-   filebrowser.filter=function (item, searchWord) { return item.name.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1} Filter items
-   filebrowser.showFileName=true Show filename in thumbs
-   filebrowser.showFileSize=true Show filesize in thumbs
-   filebrowser.showFileChangeTime=true Show the last modification time in thumbs
-   filebrowser.editImage=true use [[ImageEditor]] - crop and resize image
-   filebrowser.preview=true Show preview button in context menu
-   filebrowser.showPreviewNavigation=true Show navigation buttons in preview
-   filebrowser.showSelectButtonInPreview=true Show select button in preview
-   filebrowser.contextMenu=true use context menu
-   filebrowser.createNewFolder=true The ability to create a directory of the web browser
-   filebrowser.deleteFolder=true The ability to delete directories from the web browser
-   filebrowser.moveFolder=true The ability to move directories from the web browser
-   filebrowser.moveFile=true The ability to move file from the web browser
-   filebrowser.showFoldersPanel=true Show folders panel
-   filebrowser.width=763px The width of the web browser
-   filebrowser.height=400px The height of the file browser
-   filebrowser.buttons=`[ 'filebrowser.upload', 'filebrowser.remove', 'filebrowser.update', 'filebrowser.select', 'filebrowser.edit', '|', 'filebrowser.tiles', 'filebrowser.list', '|', 'filebrowser.filter', '|', 'filebrowser.sort', ]`

Example:

```javascript
var editor = Jodit.make('#editor', {
	filebrowser: {
		buttons: [
			'filebrowser.upload',
			'filebrowser.remove',
			'filebrowser.update',
			{
				name: 'deleteall',
				icon: 'remove',
				exec: function (fb) {
					fb.state.elements().forEach(function () {
						editor.filebrowser.remove(
							editor.filebrowser.currentPath,
							$(this).data('name')
						);
					});

					editor.filebrowser.loadTree();
				}
			}
		]
	}
});
```

-   filebrowser.isSuccess method to check - whether the response positive
-   filebrowser.getMessage method for receiving a message from the response

```javascript
Jodit.make('#editor', {
	filebrowser: {
		isSuccess: function (resp) {
			return resp.status == 1;
		},
		getMessage: function (resp) {
			return resp.message;
		}
	}
});
```

-   filebrowser.view='tiles' Filelist view - `tiles` or `list`
-   filebrowser.ajax The default settings for AJAX connections to the server.
    Most of the settings like here [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) but is not jQuery.ajax
-   filebrowser.ajax.prepareData Method of preparation
    of data to be sent to the server
-   filebrowser.ajax.process The method of processing the
    data obtained after administration of the server. Must return this PlainObject format

```js
const response = {
	files: resp.files || [], // {array} The names of files or folders,
	// files canbe ['image.jpg', 'image.jpg2', 'image3.jpg' ...] and [{file: 'image.jpg', thumb: '_thumbs/image.jpg'}, {file: 'image2.jpg', thumb: '_thumbs/image2.jpg'} ...]
	path: resp.path, // {string} Real relative path
	baseurl: resp.baseurl, // {string} Base url for filebrowser
	error: resp.error, // {int}
	msg: resp.msg // {string}
};
```

-   filebrowser.ajax.url='' Address entry point on the server for AJAX connection
-   filebrowser.ajax.data={} Default data to send to the server
-   filebrowser.ajax.headers={} An object of additional header key/value pairs toWYSIWYG
    send along with requests using the `XMLHttpRequest` transport. The header `X-Requested-With: XMLHttpRequest`
    is always added, but its default `XMLHttpRequest` value can be changed here.
    @property {object} `filebrowser.resize` Settings for AJAX connections to the server to resize
    image. By default, the uses [[Config.filebrowser.ajax]] with argument
    action=create
-   filebrowser.crop Settings for AJAX connections to the server to crop image.
    By default, the uses [[Config.filebrowser.ajax]] with argument
    action=create
-   filebrowser.c Settings for AJAX connections to the server to create
    the category . By default, the uses [[Config.filebrowser.ajax]]
    with argument `action=create`
-   filebrowser.move Settings for AJAX connections to the server for the moving
    image or category . By default uses [[Config.filebrowser.ajax]]
    with argument `action=move`
-   filebrowser.remove Settings for AJAX connections to the server toWYSIWYG
    delete the image or category . By default uses [[Config.filebrowser.ajax]]
    with argument `action=remove`
    @property {object} filebrowser.folder Settings for AJAX connections to the server toWYSIWYG
    download the list of categories .
    By default uses [[Config.filebrowser.ajax]]
    with argument `action=folder`
-   filebrowser.items Settings for AJAX connections to the server to download
    the image list in the specified category . By default uses
    [[Config.filebrowser.ajax]] with argument action=items
-   filebrowser.uploader=null Settings Module [[Uploader]]
    for fast uploading images in category via Drag&Drop file in the file browser. The default settings of
    the module [[Uploader]]

Example:

```js
// default values
const options = {
	isSuccess: function (resp) {
		return !resp.error;
	},
	getMessage: function (resp) {
		return resp.msg;
	},
	ajax: {
		url: '',
		async: true,
		data: {},
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		headers: {},
		method: 'POST',
		processData: true,
		headers: {},
		prepareData: function (data) {
			return data;
		},
		process: function (resp) {
			return {
				files: resp.files || [],
				path: resp.path,
				baseurl: resp.baseurl,
				error: resp.error,
				msg: resp.msg
			};
		}
	},
	resize: {
		data: { action: 'imageResize' }
	},
	crop: {
		data: { action: 'imageCrop' }
	},
	create: {
		data: { action: 'folderCreate' }
	},
	fileMove: {
		data: { action: 'fileMove' }
	},
	fileFolder: {
		data: { action: 'fileFolder' }
	},
	folderRename: {
		data: { action: 'folderRename' }
	},
	fileRemove: {
		data: { action: 'fileRemove' }
	},
	items: {
		data: { action: 'files' }
	},
	folders: {
		data: { action: 'folders' }
	},
	uploader: null // use default Uploader's settings
};
```

Example:

```javascript
Jodit.make('#editor2', {
	filebrowser: {
		isSuccess: function (resp) {
			return resp.length !== 0;
		},
		getMessage: function (resp) {
			return resp;
		},
		ajax: {
			url: 'ajax.php',
			method: 'GET',
			headers: {
				'X-CSRF-Token': document
					.querySelector('meta[name="csrf-token"]')
					.getAttribute('content')
			},
			data: {
				someparameter: 1
			},
			prepareData: function (data) {
				data.someparameter++;
				return data;
			},
			process: function (resp) {
				return resp.split('|'); // return items list
			}
		}
	}
});
```

Example:

```javascript
var editor = Jodit.make('#jodit', {
	uploader: {
		url: 'connector/upload.php',
		baseurl: 'images/'
	},
	filebrowser: {
		create: {
			url: 'connector/create.php'
		},
		fileMove: {
			url: 'connector/move.php'
		},
		fileRemove: {
			url: 'connector/remove.php'
		},
		items: {
			url: 'connector/items.php'
		},
		folder: {
			url: 'connector/tree.php'
		}
	}
});
```
