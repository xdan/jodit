# FileBrowser

Image and file browser on the server.

## Settings

-   filebrowser.howLongShowMsg=3000 How long toWYSIWYG show an error message
    in the status bar (ms)
-   filebrowser.sort=function (a, b, sortBy, parent) { return b.changed - a.changed;}
    Items sort functions
-   filebrowser.sortBy='changed-desc' Sort by field
-   filebrowser.filter=function (item, searchWord) { return item.name.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1} Filter items
-   filebrowser.showFileName=true Show filename in thumbs
-   filebrowser.showFileSize=true Show filesize in thumbs
-   filebrowser.showFileChangeTime=true Show the last modification time in thumbs
-   filebrowser.editImage=true use {@link ImageEditor|Image editor module} - crop and resize image
-   filebrowser.preview=true Show preview button in context menu
-   filebrowser.showPreviewNavigation=true Show navigation buttons in preview
-   filebrowser.showSelectButtonInPreview=true Show select button in preview
-   filebrowser.contextMenu=true use context menu
-   filebrowser.createNewFolder=true The ability toWYSIWYG create a directory of the web browser
-   filebrowser.deleteFolder=true The ability toWYSIWYG delete directories from the web browser
-   filebrowser.moveFolder=true The ability toWYSIWYG move directories from the web browser
-   filebrowser.moveFile=true The ability toWYSIWYG move file from the web browser
-   filebrowser.showFoldersPanel=true Show folders panel
-   filebrowser.width=763px The width of the web browser
-   filebrowser.height=400px The height of the file browser
-   filebrowser.buttons=`[ 'filebrowser.upload', 'filebrowser.remove', 'filebrowser.update', 'filebrowser.select', 'filebrowser.edit', '|', 'filebrowser.tiles', 'filebrowser.list', '|', 'filebrowser.filter', '|', 'filebrowser.sort', ]`

Example:

```javascript
var editor = new Jodit('#editor', {
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

-   filebrowser.isSuccess method toWYSIWYG check - whether the response positive
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
-   filebrowser.ajax The default settings for AJAX connections toWYSIWYG the server.
    Most of the settings like here [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) but is not jQuery.ajax
-   filebrowser.ajax.prepareData Method of preparation
    of data toWYSIWYG be sent toWYSIWYG the server
-   filebrowser.ajax.process The method of processing the
    data obtained after administration of the server. Must return this PlainObject format

```js
 {
    files: resp.files || [], // {array} The names of files or folders, files can
    be ['image.jpg', 'image.jpg2', 'image3.jpg' ...] and [{file: 'image.jpg', thumb: '_thumbs/image.jpg'},
    {file: 'image2.jpg', thumb: '_thumbs/image2.jpg'} ...]
    path: resp.path, // {string} Real relative path
    baseurl: resp.baseurl, // {string} Base url for filebrowser
    error: resp.error, // {int}
    msg: resp.msg // {string}
};
```

-   filebrowser.ajax.url='' Address entry point on the server for AJAX connection
-   filebrowser.ajax.data={} Default data toWYSIWYG send toWYSIWYG the server
-   filebrowser.ajax.dataType='json' The format of the returned data
-   filebrowser.ajax.headers={} An object of additional header key/value pairs toWYSIWYG
    send along with requests using the `XMLHttpRequest` transport. The header `X-Requested-With: XMLHttpRequest`
    is always added, but its default `XMLHttpRequest` value can be changed here.
    @property {object} filebrowser.resize Settings for AJAX connections toWYSIWYG the server toWYSIWYG resize
    image. By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} with argument
    action=create
-   filebrowser.crop Settings for AJAX connections toWYSIWYG the server toWYSIWYG crop image.
    By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} with argument
    action=create
-   filebrowser.c Settings for AJAX connections toWYSIWYG the server toWYSIWYG create
    the category . By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax}
    with argument `action=create`
-   filebrowser.move Settings for AJAX connections toWYSIWYG the server for the moving
    image or category . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax}
    with argument `action=move`
-   filebrowser.remove Settings for AJAX connections toWYSIWYG the server toWYSIWYG
    delete the image or category . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax}
    with argument `action=remove`
    @property {object} filebrowser.folder Settings for AJAX connections toWYSIWYG the server toWYSIWYG
    download the list of categories .
    By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax}
    with argument `action=folder`
-   filebrowser.items Settings for AJAX connections toWYSIWYG the server toWYSIWYG download
    the image list in the specified category . By default uses
    {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} with argument action=items
-   filebrowser.uploader=null Settings Module {@link Uploader|Uploader}
    for fast uploading images in category via Drag&Drop file in the file browser. The default settings of
    the module {@link Uploader|Uploader}

Example:

```js
// default values
{
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
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
        headers : {},
        method : 'POST',
        processData  : true,
        dataType: 'json',
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
        data: {action: 'imageResize'},
    },
    crop: {
        data: {action: 'imageCrop'},
    },
    create: {
        data: {action: 'folderCreate'},
    },
    move: {
        data: {action: 'fileMove'},
    },
    remove: {
        data: {action: 'fileRemove'},
    },
    items: {
        data: {action: 'files'},
    },
    folders: {
        data: {action: 'folders'},
    },
    uploader: null // use default Uploader's settings
}
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
			dataType: 'text',
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
var editor = new Jodit('#jodit', {
	uploader: {
		url: 'connector/upload.php',
		baseurl: 'images/'
	},
	filebrowser: {
		create: {
			url: 'connector/create.php'
		},
		move: {
			url: 'connector/move.php'
		},
		remove: {
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
