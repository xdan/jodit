# Changelog

## 3.3.24
### BugFix
* [342](https://github.com/xdan/jodit/issues/342)
* [343](https://github.com/xdan/jodit/issues/343)

## 3.3.23
### BugFix
* [#325](https://github.com/xdan/jodit/issues/325) [#239](https://github.com/xdan/jodit/issues/239)
* [#327](https://github.com/xdan/jodit/issues/327)
* [#292](https://github.com/xdan/jodit/issues/292)
* [#203](https://github.com/xdan/jodit/issues/203)
* [#339](https://github.com/xdan/jodit/issues/339)

### Feature
* Added `Dom`.`isTag` method
```js
const editor = Jodit.make('#editor');

const a = editor.create.inside.element('a');
const br = document.createElement('br');

Jodit.modules.Dom.isTag(a, 'a') // true
Jodit.modules.Dom.isTag(br, 'br') // true
```
* Added `Helpers`.`call` method
```js
const f = Math.random();
Jodit.modules.Helpers.call(f > 0.5 ? Math.ceil : Math.floor, f);
```
* Added `Helpers`.`position` method - Helper function to get an element's exact position
```js
console.log(Jodit.modules.Helpers.position(editor.editor.querySelector('p')));
```
## 3.3.19
### BugFix
* Fixed a lots bugs inside `link` plugin
[#331](https://github.com/xdan/jodit/issues/331)
[#334](https://github.com/xdan/jodit/issues/334)
[#334](https://github.com/xdan/jodit/issues/334)
[#235](https://github.com/xdan/jodit/issues/235)

### Feature
* In `link` plugin added `formTemplate` and `formClassName` options [#333](https://github.com/xdan/jodit/issues/333)
```js
const editor = new Jodit(appendTestArea(), {
  link: {
    formTemplate: function() {
      return '<form class="form_url"><input ref="url_input" type="url"><button>save</button></form>';
    },
    formClassName: "some_class"
  }
});
```
* Added deprecated mechanism. Some methods will not be removed and only will be marked as deprecated until major release. [#330](https://github.com/xdan/jodit/issues/330)

## 3.3.16
Added `createAttributes` option [#243](https://github.com/xdan/jodit/issues/243)
All elements which will be inserted in editor will be created with these attributes

```js
const editor2 = Jodit.make('#editor', {
    createAttributes: {
      div: {
        class: 'test'
      },
      ul: function (ul) {
        ul.classList.add('ui-test');
      }
    }
});

const div2 = editor2.create.inside.div();
expect(div2.className).equals('test');

const ul = editor2.create.inside.element('ul');
expect(ul.className).equals('ui-test');

```

## 3.3.15

### Bugfix
Fixed SPLIT_MODE

### Feature
Added `editHTMLDocumentMode` in order to allow the user to edit the entire document [#241](https://github.com/xdan/jodit/issues/241).

Also added `iframeTitle` and `iframeDoctype` options
```js
const editor = Jodit.make('#editor', {
	iframe: true,
	iframeTitle: 'Hello world!',
	iframeDoctype: '<!DOCTYPE html>',
	editHTMLDocumentMode: true,
	iframeStyle: ''
});

console.log(editor.value);

// <html dir="" class="jodit" lang="en" spellcheck="true" style="min-height: 113px;">
// <head>
//     <title>Hello world!</title>
// </head>
// <body class="jodit_wysiwyg" style="outline:none">test test <a href="#">test</a></body>
// </html>
```

## 3.3.14
### Bugfix
Fixed https://github.com/xdan/jodit/issues/316
Fixed bug when Jodit was initialized inside iframe.
```js
const iframe = document.createElement('iframe');
document.body.appendChild(iframe);

const win = iframe.contentWindow;
const doc = win.document;
doc.open();
doc.write('<html><body><textarea id="editor"></textarea><' + 'script src="./build/jodit.js"><' + '/script></body></html>');
doc.close();

Jodit.make('#editor', {
	ownerWindow: win,
	ownerDocument: doc
});
```
Fixed bug with ProgressBar - it simple does not work(

### Feature
Source plugin was separated on several classes. Now you can choose SourceEditor
or make yourself (https://github.com/xdan/jodit/issues/242)
> Before
```js
Jodit.make('#editor', {
	useAceEditor: true
});
```

> Now
```js
Jodit.make('#editor', {
	sourceEditor: 'area' || 'ace' // || 'mirror' in PRO
});
```
In PRO version you can choose mirrror&
* Added Async module for control asynchronous operations
```javascript
const editor = new Jodit('#editor');
setTimeout(() => {
	editor.selection.insertHTML('Hello!')
}, 1000);

editor.async.setTimeout(() => {
	editor.selection.insertHTML('World!')
}, 1000);

editor.destruct();
```
After destruct first timeout will throw the error, but second will be cleared.

Added two methods setPanel and addPlace
```html
<textarea id="editor"></textarea>
<textarea id="editor2"></textarea>
<textarea id="editor3"></textarea>
<div id="toolbar"></div>
```
```js
const editor = new Jodit('#editor');
editor.setPanel('#toolbar');
//add id instance to editor
editor.addPlace('#editor2');
editor.addPlace('#editor3');
```

### Events
Added `afterRemoveNode` event
```js
const editor = new Jodit('#editor');
editor.events.on('afterRemoveNode', (node) => {
	if (node.nodeName === 'IMG') {
		fetch('delete.php', {image: node.src});
	}
});
```

## 3.3.8

### Plugin system was changed

> Before
```javascript
Jodit.plugins.insertText = function (editor) {
    editor.events.on('someEvent', function (text) {
        editor.selection.insertHTMl('Hello ' + text);
    });
};
```
> Now
```javascript
Jodit.plugins.add('insertText', function (editor) {
    editor.events.on('someEvent', function (text) {
        editor.selection.insertHTMl('Hello ' + text);
    });
});
console.log(Jodit.plugins.get('insertText'));
Jodit.plugins.remove('insertText');
```
### `extraPlugins` options

Inside plugin you can use several fields:
```js
// emoji.js

class Emoji {
    hasStyle = true; //
    requires = ['autocomplete'];
    init(editor) {
        // this code will be execute only after autocomplete.init
    }
}

Jodit.plugins.add('emoji', Emoji);
```
And inside you init code
```javascript
Jodit.make('#editor', {
	basePath: 'https://sitename.com/somepath/',
	extraPlugins: ['emoji']
});
```

It will try to download
```
https://sitename.com/somepath/plugins/emoji/emoji.js
```
`hasStyle = true;` means try download and include in page style file:
```
https://sitename.com/somepath/plugins/emoji/emoji.css
```

In `plugins/example` folder you can find example.

extraPlugins option allows append in editor extra plugins from npm, bower etc.

### Build System

In Build system was added gulp subsystem for build extra plugins.
You can make extra plugins like `plugins/example` and after build,
this plugin will not be inside `jodit.min.js` file. It will be in separate
folder (eg `build/plugins/emoji/`).

Also in root you can find `make.js` file for install your plugin
in build system.
