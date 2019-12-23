# Changelog

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

### In options added extraPlugins

It allows append in editor extra plugins form npm, bower etc.
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
In `plugins/example` folder you can find example.

### Build System
-------------
In Build system was added gulp subsystem for build extra plugins.
You can make extra plugins like `plugins/example` and after build,
this plugin will notbe inside `jodit.min.js` file. It will be in separate
folder (eg `build/plugins/emoji/`).

Also in root you can find `make.js` file fot
