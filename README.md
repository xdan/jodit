# Jodit Editor 3.0.0
An excellent WYSIWYG editor written in pure TypeScript without the use of additional libraries. Its file editor and image editor.

       For old version please follow here [https://github.com/xdan/jodit2](https://github.com/xdan/jodit2)

##For contributors:
```$xslt
yarn install
```

Run webpack Hot Reload server:
```$xslt
yarn start
```

Build min files:
```$xslt
yarn run build
```

For check tests, open in browser:
```$xslt
http://localhost:2000/test/test.html
```

For testing FileBrowser and Uploader need install [PHP Connector](https://github.com/xdan/jodit-connectors)
```
composer create-project jodit/connector
```
Run test PHP server
```
php -S localhost:8181 -t ./
```

and set options for Jodit:
```javascript
var editor = new Jodit('#editor', {
    uploader: {
        url: 'http://localhost:8181/index-test.php?action=upload'
    },
    filebrowser: {
        ajax: {
            url: 'http://localhost:8181/index-test.php'
        }
    }
});
```

## USAGE

And some `<textarea>` element

```xml
<textarea id="editor" name="editor"></textarea>
```
After this, you can init Jodit plugin

```javascript
new Jodit('#editor');
```

## Browser Support
______________________
* Internet Explorer 9
* Latest Chrome
* Latest Firefox
* Latest Safari
* Microsoft Edge

