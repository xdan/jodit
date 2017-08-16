# Jodit Editor 3
An excellent WYSIWYG editor written in pure TypeScript without the use of additional libraries. Its file editor and image editor.

 * [Official site](https://xdsoft.net/jodit/)
 * [Documentation](https://xdsoft.net/jodit/doc/)
 * [Download&Changes](https://github.com/xdan/jodit/releases)
 
> For old version, please follow here [https://github.com/xdan/jodit2](https://github.com/xdan/jodit2)

## For contributors:
```bash
npm install
```

Run webpack Hot Reload server:
```bash
npm start
```

Build min files:
```bash
npm run build
```

Run tests:
```bash
karma start --browsers ChromeHeadless,IE,Firefox karma.conf.js
```
or
```bash
npm test
```
or
```bash
yarn test
```

For checking tests in browser, open URL:
```
http://localhost:2000/test/test.html
```

For testing FileBrowser and Uploader modules, need install [PHP Connector](https://github.com/xdan/jodit-connectors)
```bash
composer create-project jodit/connector
```
Run test PHP server
```bash
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
var editor = new Jodit('#editor');
editor.setEditorValue('<p>start</p>')
```

With jQuery
```javascript
$('textarea').each(function (elm) {
    var editor = new Jodit(elm);
    editor.setEditorValue('<p>start</p>')
});
```

### Create plugin

```javascript
Jodit.plugins.yourplugin = function (editor) {
    editor.events.on('afterInit', function () {
        editor.seleciotn.insertHTMl('Text');
    });
}
```

### Add custom button
```javascript
var editor = new Jodit('.someselector', {
    extraButtons: [
        {
            name: 'insertDate',
            iconURL: 'http://xdsoft.net/jodit/logo.png',
            exec: function (editor) {
                editor.selection.insertHTML((new Date).toDateString());
            }
        }
    ]
})
```

## Browser Support
______________________
* Internet Explorer 9
* Latest Chrome
* Latest Firefox
* Latest Safari
* Microsoft Edge


