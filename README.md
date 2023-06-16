![Jodit WYSIWYG editor](https://raw.githubusercontent.com/xdan/jodit/main/examples/assets/logo.png)

# Jodit Editor 3

An excellent WYSIWYG editor written in pure TypeScript without the use of additional libraries. Its file editor and image editor.

[![Build Status](https://github.com/xdan/jodit/workflows/Run%20tests/badge.svg)](https://github.com/xdan/jodit/actions/workflows/tests.yml)
[![npm version](https://badge.fury.io/js/jodit.svg)](https://badge.fury.io/js/jodit)
[![npm](https://img.shields.io/npm/dm/jodit.svg)](https://www.npmjs.com/package/jodit)

-   [Demo and Official site](https://xdsoft.net/jodit/)
-   [PRO Version](https://xdsoft.net/jodit/pro/)
-   [Builder](https://xdsoft.net/jodit/builder/)
-   [Playground - play with options](https://xdsoft.net/jodit/play.html)
-   [Documentation](https://xdsoft.net/jodit/docs/)
-   [Download & Changes](https://github.com/xdan/jodit/releases)
-   [Changelog](https://github.com/xdan/jodit/blob/main/CHANGELOG.md)
-   [Examples](https://xdan.github.io/jodit/examples/)
-   [TypeScript Starter](https://codesandbox.io/s/ggc6km)

## Get Started

## How use

Download the latest [release](https://github.com/xdan/jodit/releases/latest) or

### INSTALL VIA NPM

```bash
npm install jodit
```

You will get:

- inside /esm: ESM version of the editor (compatible with e.g. webpack)
- inside /(es5|es2015|es2018|es2021)/*.js: UMD bundled, not minified
- inside /(es5|es2015|es2018|es2021)/*.min.js: UMD bundled, and minified
- types/index.d.ts: this specifies the API of the editor (this is what is actually versioned, everything else is considered private and might break with any release).

### Include just two files

ES5 Version

```html
<link type="text/css" rel="stylesheet" href="es2015/jodit.min.css" />
<script type="text/javascript" src="es2015/jodit.min.js"></script>
```

es2021 Version (if your users use only modern browsers)

```html
<link type="text/css" rel="stylesheet" href="es2021/jodit.min.css" />
<script type="text/javascript" src="es2021/jodit.min.js"></script>
```

esm modules

```html
<script type="importmap">
  {
    "imports": {
      "autobind-decorator": "https://unpkg.com/autobind-decorator@2.4.0/lib/esm/index.js"
    }
  }
</script>
<link rel="stylesheet" href="./node_modules/jodit/es2021/jodit.min.css"/>
<script type="module">
  import {Jodit} from "./node_modules/jodit/esm/index.js"
  Jodit.make('#editor', {
    width: 600,
    height: 400,
  });
</script>
```

ESM automatically connects only the basic set of plugins and only English.
You can connect the necessary plugins and languages yourself:

```html
<script type="importmap">
  {
    "imports": {
      "autobind-decorator": "https://unpkg.com/autobind-decorator@2.4.0/lib/esm/index.js"
    }
  }
</script>
<link rel="stylesheet" href="./node_modules/jodit/es2021/jodit.min.css"/>
<script type="module">
  import {Jodit} from "./node_modules/jodit/esm/index.js"
  import "./node_modules/jodit/esm/plugins/add-new-line/add-new-line.js"
  import "./node_modules/jodit/esm/plugins/fullsize/fullsize.js"
  import de from "./node_modules/jodit/esm/langs/de.js"

  Jodit.langs.de = de;

  Jodit.make('#editor', {
    width: 600,
    height: 400,
    language: 'de'
  });
</script>
```

### Use a CDN

#### cdnjs

```html
<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/jodit/4.0.0-beta.24/es2021/jodit.min.css"
/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jodit/4.0.0-beta.24/es2021/jodit.min.js"></script>
```

#### unpkg


```html
<link
	rel="stylesheet"
	href="https://unpkg.com/jodit@4.0.0-beta.24/es2021/jodit.min.css"
/>
<script src="https://unpkg.com/jodit@4.0.0-beta.24/es2021/jodit.min.js"></script>
```



### USAGE

And some `<textarea>` element

```html
<textarea id="editor" name="editor"></textarea>
```

After this, you can init Jodit plugin

```javascript
const editor = Jodit.make('#editor');
editor.value = '<p>start</p>';
```

with jQuery

```javascript
$('textarea').each(function () {
	const editor = Jodit.make(this);
	editor.value = '<p>start</p>';
});
```

## For contributors:

```bash
git clone https://github.com/xdan/jodit.git
cd jodit
npm ci
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
make build
```

Build without some plugins:

```bash
make build es=es2021 uglify=true excludePlugins="about,source,bold,image,xpath,stat,class-span,color,clean-html,file,focus,enter,backspace,media,preview,pint,redo-undo,resize-cells,search,spellcheck,table"
```

Build without some languages:

```bash
make build es=es2021 uglify=true excludeLanguages="ru,ar,cs_cz,de,es,fa,fr,he,hu,id,it,ja,ko,nl,pl,pt_br,ru,tr,zh_cn,zh_tw"
```

Run tests:

```bash
make test browsers ChromeHeadless,IE,Firefox
```

or

```bash
make test
```

or

```bash
npm test
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
const editor = Jodit.make('#editor', {
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
};
```

### Add custom button

```javascript
const editor = Jodit.make('.someselector', {
	extraButtons: [
		{
			name: 'insertDate',
			iconURL: 'http://xdsoft.net/jodit/logo.png',
			exec: function (editor) {
				editor.s.insertHTML(new Date().toDateString());
			}
		}
	]
});
```

or

```javascript
const editor = Jodit.make('.someselector', {
	buttons: ['bold', 'insertDate'],
	controls: {
		insertDate: {
			name: 'insertDate',
			iconURL: 'http://xdsoft.net/jodit/logo.png',
			exec: function (editor) {
				editor.s.insertHTML(new Date().toDateString());
			}
		}
	}
});
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
		editor.events.off('change.textLength');
	}
});

// or use class

Jodit.plugins.add(
	'textLength',
	class textLength {
		init(editor) {
			const div = editor.create.div('jodit_div');
			editor.container.appendChild(div);
			editor.events.on('change.textLength', () => {
				div.innerText = editor.value.length;
			});
		}
		destruct(editor) {
			editor.events.off('change.textLength');
		}
	}
);

const editor = Jodit.make('.someselector', {
	buttons: ['bold', 'insertText'],
	controls: {
		insertText: {
			iconURL: 'http://xdsoft.net/jodit/logo.png',
			exec: function (editor) {
				editor.events.fire('someEvent', 'world!!!');
			}
		}
	}
});
```

## Browser Support

-   Internet Explorer 11
-   Latest Chrome
-   Latest Firefox
-   Latest Safari
-   Microsoft Edge

## Contributing

This project is maintained by a community of developers. Contributions are welcome and appreciated. You can find Jodit on GitHub; feel free to start an issue or create a pull requests:
https://github.com/xdan/jodit

## License

MIT
