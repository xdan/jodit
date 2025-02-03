![Jodit WYSIWYG editor](https://raw.githubusercontent.com/xdan/jodit/main/examples/assets/logo.png)

# Jodit Editor

Jodit Editor is an excellent WYSIWYG editor written in pure TypeScript
without the use of additional libraries. It includes a file editor and image editor.

[![Build Status](https://github.com/xdan/jodit/workflows/Run%20tests/badge.svg)](https://github.com/xdan/jodit/actions/workflows/tests.yml)
[![npm version](https://badge.fury.io/js/jodit.svg)](https://badge.fury.io/js/jodit)
[![npm](https://img.shields.io/npm/dm/jodit.svg)](https://www.npmjs.com/package/jodit)
[![npm](https://img.shields.io/npm/dm/jodit-react.svg)](https://www.npmjs.com/package/jodit-react)

-   [Demo and Official site](https://xdsoft.net/jodit/)
-   [PRO Version](https://xdsoft.net/jodit/pro/)
-   [Builder](https://xdsoft.net/jodit/builder/)
-   [Playground - Play with Options](https://xdsoft.net/jodit/play.html)
-   [Documentation](https://xdsoft.net/jodit/docs/)
-   [Download & Changes](https://github.com/xdan/jodit/releases)
-   [Changelog](https://github.com/xdan/jodit/blob/main/CHANGELOG.md)
-   [Examples](https://xdan.github.io/jodit)
-   [TypeScript Starter](https://codesandbox.io/s/ggc6km)

## Get Started

## How to Use

Download the latest [release](https://github.com/xdan/jodit/releases/latest) or via npm:

```sh
npm install jodit
```

You will get the following files:

-   Inside `/esm`: ESM version of the editor (compatible with tools like webpack)
-   Inside `/es5`, `/es2015`, `/es2018`, `/es2021`: UMD bundled files (not minified)
-   Inside `/es5`, `/es2015`, `/es2018`, `/es2021` with `.min.js` extension: UMD bundled and minified files
-   `types/index.d.ts`: This file specifies the API of the editor. It is versioned, while everything else is considered private and may change with each release.

### Include Jodit in Your Project

Include the following two files:

#### ES5 Version:

```html
<link type="text/css" rel="stylesheet" href="es2015/jodit.min.css" />
<script type="text/javascript" src="es2015/jodit.min.js"></script>
```

ES2021 Version (for modern browsers only):

```html
<link type="text/css" rel="stylesheet" href="es2021/jodit.min.css" />
<script type="text/javascript" src="es2021/jodit.min.js"></script>
```

#### ESM Modules:

```html
<script type="importmap">
  {
    "imports": {
      "autobind-decorator": "https://unpkg.com/autobind-decorator@2.4.0/lib/esm/index.js"
    }
  }
</script>
<link rel="stylesheet" href="./node_modules/jodit/es2021/jodit.min.css" />
<script type="module">
  import { Jodit } from './node_modules/jodit/esm/index.js';
  Jodit.make('#editor', {
    width: 600,
    height: 400
  });
</script>
```

The ESM modules automatically include only the [basic set of plugins](https://github.com/xdan/jodit/blob/main/tools/utils/resolve-alias-imports.ts#L59) and the English language.
You can manually include additional plugins and languages as needed.

```html
<script type="importmap">
  {
    "imports": {
      "autobind-decorator": "https://unpkg.com/autobind-decorator@2.4.0/lib/esm/index.js"
    }
  }
</script>
<link rel="stylesheet" href="./node_modules/jodit/es2021/jodit.min.css" />
<script type="module">
  import { Jodit } from './node_modules/jodit/esm/index.js';
  import './node_modules/jodit/esm/plugins/add-new-line/add-new-line.js';
  import './node_modules/jodit/esm/plugins/fullsize/fullsize.js';

  // Or import all plugins
  import './node_modules/jodit/esm/plugins/all.js';

  import de from './node_modules/jodit/esm/langs/de.js';

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
  href="https://cdnjs.cloudflare.com/ajax/libs/jodit/4.0.1/es2021/jodit.min.css"
/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jodit/4.0.1/es2021/jodit.min.js"></script>
```

#### unpkg

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/jodit@4.0.1/es2021/jodit.min.css"
/>
<script src="https://unpkg.com/jodit@4.0.1/es2021/jodit.min.js"></script>
```

### Usage

Add a `textarea` element to your HTML:

```html
<textarea id="editor" name="editor"></textarea>
```

Initialize Jodit on the textarea:

```javascript
const editor = Jodit.make('#editor');
editor.value = '<p>start</p>';
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
      iconURL: 'https://xdsoft.net/jodit/logo.png',
      exec: function (editor) {
        editor.s.insertHTML(new Date().toDateString());
        editor.synchronizeValues(); // For history saving
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
      iconURL: 'https://xdsoft.net/jodit/logo.png',
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
      iconURL: 'https://xdsoft.net/jodit/logo.png',
      exec: function (editor) {
        editor.events.fire('someEvent', 'world!!!');
      }
    }
  }
});
```

## FileBrowser and Uploader

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

## Browser Support

-   Internet Explorer 11
-   Latest Chrome
-   Latest Firefox
-   Latest Safari
-   Microsoft Edge

## License

MIT
