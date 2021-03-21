![Jodit WYSIWYG editor](https://raw.githubusercontent.com/xdan/jodit/master/examples/assets/logo.png)

# Jodit Editor 3
An excellent WYSIWYG editor written in pure TypeScript without the use of additional libraries. Its file editor and image editor.

[![Build Status](https://travis-ci.org/xdan/jodit.svg?branch=master)](https://travis-ci.org/xdan/jodit)
[![npm version](https://badge.fury.io/js/jodit.svg)](https://badge.fury.io/js/jodit)
[![npm](https://img.shields.io/npm/dm/jodit.svg)](https://www.npmjs.com/package/jodit)
[![Gitter](https://badges.gitter.im/xdan/jodit.svg)](https://gitter.im/xdan/jodit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

 * [Demo and Official site](https://xdsoft.net/jodit/)
 * [PRO Version](https://xdsoft.net/jodit/pro/)
 * [Playground - play with options](https://xdsoft.net/jodit/play.html)
 * [Documentation](https://xdsoft.net/jodit/doc/)
 * [Download&Changes](https://github.com/xdan/jodit/releases)
 * [Changelog](https://github.com/xdan/jodit/blob/master/CHANGELOG.MD)
 * [Examples](https://xdan.github.io/jodit/examples/)

## Get Started
## How use
Download latest [release](https://github.com/xdan/jodit/releases/latest) or

### INSTALL VIA NPM
```bash
npm install jodit
```
or
```bash
yarn add jodit
```

### Include just two files

ES5 Version
```html
<link type="text/css" rel="stylesheet" href="build/jodit.min.css"/>
<script type="text/javascript" src="build/jodit.min.js"></script>
```

ES2018 Version (if your users use only modern browsers)
```html
<link type="text/css" rel="stylesheet" href="build/jodit.es2018.min.css"/>
<script type="text/javascript" src="build/jodit.es2018.min.js"></script>
```

### CDN
```html
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jodit/3.6.1/jodit.min.css"/>
<script src="//cdnjs.cloudflare.com/ajax/libs/jodit/3.6.1/jodit.min.js"></script>
```

### USAGE

And some `<textarea>` element

```html
<textarea id="editor" name="editor"></textarea>
```
After this, you can init Jodit plugin

```javascript
var editor = new Jodit('#editor');
editor.value = '<p>start</p>';
```
or

```javascript
const editor = Jodit.make('#editor');
editor.value = '<p>start</p>';
```

With jQuery
```javascript
$('textarea').each(function () {
    var editor = new Jodit(this);
    editor.value = '<p>start</p>';
});
```

## For contributors:
```bash
git clone https://github.com/xdan/jodit.git
cd jodit
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
        editor.s.insertHTMl('Text');
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
                editor.s.insertHTML((new Date).toDateString());
            }
        }
    ]
})
```
or

```javascript
var editor = new Jodit('.someselector', {
	buttons: ['bold', 'insertDate'],
    controls: {
        insertDate: {
            name: 'insertDate',
            iconURL: 'http://xdsoft.net/jodit/logo.png',
            exec: function (editor) {
                editor.s.insertHTML((new Date).toDateString());
            }
        }
    }
})
```

button with plugin

```javascript
Jodit.plugins.add('insertText', function (editor) {
    editor.events.on('someEvent', function (text) {
        editor.s.insertHTMl('Hello ' + text);
    });
});

// or

Jodit.plugins.add('textLength', {
	init(editor) {
		const div = editor.create.div('jodit_div');
		editor.container.appendChild(div);
		editor.events.on('change.textLength', () => {
			div.innerText = editor.value.length;
		});
	},
	destruct(editor) {
		editor.events.off('change.textLength')
	}
});

// or use class

Jodit.plugins.add('textLength', class textLength {
	init(editor) {
		const div = editor.create.div('jodit_div');
		editor.container.appendChild(div);
		editor.events.on('change.textLength', () => {
			div.innerText = editor.value.length;
		});
	}
	destruct(editor) {
		editor.events.off('change.textLength')
	}
});

var editor = new Jodit('.someselector', {
	buttons: ['bold', 'insertText'],
    controls: {
        insertText: {
            iconURL: 'http://xdsoft.net/jodit/logo.png',
            exec: function (editor) {
                editor.events.fire('someEvent', 'world!!!');
            }
        }
    }
})
```

## Browser Support
______________________
* Internet Explorer 11
* Latest Chrome
* Latest Firefox
* Latest Safari
* Microsoft Edge


## Contributing

This project is maintained by a community of developers. Contributions are welcome and appreciated. You can find Jodit on GitHub; feel free to start an issue or create a pull requests:
https://github.com/xdan/jodit

## License

MIT


