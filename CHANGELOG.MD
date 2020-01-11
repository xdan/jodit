# Changelog

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

## Feature
Source plugin was separated on several classes. Now you can choose SourceEditor
or make yourself (https://github.com/xdan/jodit/issues/242)
> Before
```js
Jodit.make('#editor', {
	useAceEditor: true || false
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
