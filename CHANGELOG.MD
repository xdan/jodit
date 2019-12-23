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
