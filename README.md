# Jodit Editor 3
An excellent WYSIWYG editor written in pure TypeScript without the use of additional libraries. Its file editor and image editor.

> For old version, please follow here [https://github.com/xdan/jodit2](https://github.com/xdan/jodit2)

## For contributors:
```$xslt
npm install
```

Run webpack Hot Reload server:
```$xslt
npm start
```

Build min files:
```$xslt
npm run build
```

Run tests:
```$xslt
karma start --browsers ChromeHeadless,IE,Firefox karma.conf.js
```
or
```$xslt
npm test
```
or
```$xslt
yarn test
```

For checking tests in browser, open URL:
```$xslt
http://localhost:2000/test/test.html
```

For testing FileBrowser and Uploader modules, need install [PHP Connector](https://github.com/xdan/jodit-connectors)
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

With jQuery
```javascript
$('textarea').each(function (elm) {
    new Jodit(elm);
});
```

## Browser Support
______________________
* Internet Explorer 9
* Latest Chrome
* Latest Firefox
* Latest Safari
* Microsoft Edge


## Changelog
### 3.0.4
 * Restored `iframe` mode. It need for adding another stylesheets in editor. 
### 3.0.2
 * Now `options`.`language` by default equal `auto`. It means that after init Jodit, it try define page language (`<html lang="de">`), if it is impossible, editor define language by browser.language.
 * Added `options`.`debugLanguage`=`false` if true, editro ignore `options`.`language` and `editor.i18n(key)` return `'{key}'`  
### 3.0.1
 * Restore inline toolbar for Images and Tables

