# Jodit Editor 3
An excellent WYSIWYG editor written in pure TypeScript without the use of additional libraries. Its file editor and image editor.

 * [Official site](https://xdsoft.net/jodit/)
 * [Documentation](https://xdsoft.net/jodit/doc/)
 
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


## Release Notes
### 3.0.8
* Added mobile plugin. It fixes the problem when the user on the Iphone Safari clicks on the element, the editor instead putting the cursor there, selects the word and looks for its definition
* Separate response logic in mobile plugin
* Added option - extraButtons
```javascript
var editor = new Jodit('#table_editor_interface', {
    extraButtons: [
        {
            name: 'adddate',
            exec: function (editor) {
                var a = editor.doc.createTextNode('111');
                editor.selection.insertNode(a);
            }
        }
    ]
});
```

### 3.0.6
 * Now work options buttonsXS,buttonsSM and buttonsMD for responsible interface
 * Restore selection after change mode. It is very usefully
 * Fixed bug in source plugin - when user does not need ace editor. Simple textarea had been created with bug.
 * Iframe functional was separated in plugin
 
### 3.0.4
 * Restored `iframe` mode. It need for adding another stylesheets in editor. 
### 3.0.2
 * Now `options`.`language` by default equal `auto`. It means that after init Jodit, it try define page language (`<html lang="de">`), if it is impossible, editor define language by browser.language.
 * Added `options`.`debugLanguage`=`false` if true, editro ignore `options`.`language` and `editor.i18n(key)` return `'{key}'`  
### 3.0.1
 * Restore inline toolbar for Images and Tables

