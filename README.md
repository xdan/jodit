<div align="center">
<img width="340" src="https://raw.githubusercontent.com/xdan/jodit/main/examples/assets/logo.png" alt="Jodit Editor">
<h1>Jodit Editor</h1>
<p>Pure-TypeScript WYSIWYG editor with a built-in file browser &amp; image editor.</p>
<p>
<a href="https://xdsoft.net/jodit/"><img src="https://img.shields.io/badge/%E2%96%B6%20Live%20Demo-1F2937?style=for-the-badge" height="34" alt="Live Demo"></a>
&nbsp;
<a href="https://xdsoft.net/jodit/pro/"><img src="https://img.shields.io/badge/Get%20Jodit%20PRO%20%E2%86%92-F5A623?style=for-the-badge" height="34" alt="Get Jodit PRO"></a>
</p>
</div>

<br>

-   [Builder](https://xdsoft.net/jodit/builder/)
-   [Playground - Play with Options](https://xdsoft.net/jodit/play.html)
-   [Documentation](https://xdsoft.net/jodit/docs/)
-   [Download & Changes](https://github.com/xdan/jodit/releases)
-   [Changelog](https://github.com/xdan/jodit/blob/main/CHANGELOG.md)
-   [Examples](https://xdan.github.io/jodit)
-   [TypeScript Starter](https://codesandbox.io/s/ggc6km)

## Get Started

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
  href="https://cdnjs.cloudflare.com/ajax/libs/jodit/4.13.9/es2021/jodit.min.css"
/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jodit/4.13.9/es2021/jodit.min.js"></script>
```

#### unpkg

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/jodit@4.13.9/es2021/jodit.min.css"
/>
<script src="https://unpkg.com/jodit@4.13.9/es2021/jodit.min.js"></script>
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

> **Using Jodit in a commercial product?**
> Remove the "Powered by Jodit" mark and unlock 20+ premium plugins — Finder file manager, PDF &amp; Word export, @mentions, AI Assistant and more. One-time license from $99.
>
> [**Compare plans →**](https://xdsoft.net/jodit/pro/)

## Browser Support

-   Internet Explorer 11
-   Latest Chrome
-   Latest Firefox
-   Latest Safari
-   Microsoft Edge

## Star History

<a href="https://star-history.dera.page/#xdan/jodit&Date">
  <img src="https://star-history.dera.page/svg?repos=xdan/jodit&type=Date" alt="Star History Chart" width="640">
</a>

## License

MIT
