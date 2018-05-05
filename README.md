# Jodit Editor 3
An excellent WYSIWYG editor written in pure TypeScript without the use of additional libraries. Its file editor and image editor.

![Jodit WYSIWYG editor](https://raw.githubusercontent.com/xdan/jodit/master/examples/logo.png)

[![Build Status](https://travis-ci.org/xdan/jodit.svg?branch=master)](https://travis-ci.org/xdan/jodit)
[![npm version](https://badge.fury.io/js/jodit.svg)](https://badge.fury.io/js/jodit)
[![npm](https://img.shields.io/npm/dm/jodit.svg)](https://www.npmjs.com/package/jodit)
[![Gitter](https://badges.gitter.im/xdan/jodit.svg)](https://gitter.im/xdan/jodit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

 * [Demo and Official site](https://xdsoft.net/jodit/)
 * [Playground - play with options](https://xdsoft.net/jodit/play.html)
 * [Documentation](https://xdsoft.net/jodit/doc/)
 * [Download&Changes](https://github.com/xdan/jodit/releases)
 
> For old version, please follow here [https://github.com/xdan/jodit2](https://github.com/xdan/jodit2)

## Get Started
## How use
Download latest [release](https://github.com/xdan/jodit/releases/latest) or
### INSTALL VIA BOWER
```bash
bower install jodit
```
### INSTALL VIA NPM
```bash
npm install jodit
```
Include just two files

```xml
<link type="text/css" rel="stylesheet" href="build/jodit.min.css">
<script type="text/javascript" src="build/jodit.min.js"></script>
```
### CDN
```xml
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jodit/3.1.92/jodit.min.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/jodit/3.1.92/jodit.min.js"></script>
```
### USAGE

And some `<textarea>` element

```xml
<textarea id="editor" name="editor"></textarea>
```
After this, you can init Jodit plugin

```javascript
var editor = new Jodit('#editor');
editor.value = '<p>start</p>';
```

With jQuery
```javascript
$('textarea').each(function (elm) {
    var editor = new Jodit(elm);
    editor.value = '<p>start</p>';
});
```

## For contributors:
```bash
npm install
```

Run webpack Hot Reload server:
```bash
npm start
```
Demo will be available here
```
http://localhost:2000/
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
composer create-project --no-dev jodit/connector
```
Run test PHP server
```bash
php -S localhost:8181 -t ./
```

and set options for Jodit:
```javascript
var editor = new Jodit('#editor', {
    uploader: {
        url: 'http://localhost:8181/index-test.php?action=fileUpload'
    },
    filebrowser: {
        ajax: {
            url: 'http://localhost:8181/index-test.php'
        }
    }
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


## Contributing

This project is maintained by a community of developers. Contributions are welcome and appreciated. You can find Jodit on GitHub; feel free to start an issue or create a pull requests:
https://github.com/xdan/jodit

## License

Licensed under GNU General Public License v2.0 or later


