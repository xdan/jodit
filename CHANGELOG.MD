# Changelog

> **Tags:**
>
> -   :boom: [Breaking Change]
> -   :rocket: [New Feature]
> -   :bug: [Bug Fix]
> -   :memo: [Documentation]
> -   :house: [Internal]
> -   :nail_care: [Polish]

## 3.13.2

#### :rocket: New Feature

-   Added a plugin to handle pressing the Tab key, it added the functionality of processing a keystroke inside the UL/li
    element and allows you to add tree-like lists.
-   Added static `Jodit.isJoditAssigned` method: Checks if the element has already been initialized when for Jodit

```js
const area = document.getElementById('editor');
(Jodit.make(area) === Jodit.make(area)) === Jodit.make(area);
console.log(Jodit.isJoditAssigned(area)); // true
const editor = Jodit.make(area);
editor.destruct();
console.log(Jodit.isJoditAssigned(area)); // false
```

#### :bug: Bug Fix

- Fixed a bug  when switching between source and wysiwyg mode, the FORM tag was wrapped in P
- [Not maintaining styles set when switching format blocks #773](https://github.com/xdan/jodit/issues/773)

## 3.13.1

#### :boom: Breaking Change

-   `ObserveObject` removed
-   Added `observable` function which makes object observable. In this case, the function returns the same object.

```js
const obj = {
	a: 1,
	b: {
		c: 5
	}
};

const obsObj = Jodit.modules.observable(obj);
console.log(obj === obsObj); // true
obsObj.on('change', () => {
	console.log('Object changed');
});
obsObj.on('change.a', () => {
	console.log('Key a changed');
});
obsObj.on('change.b.c', () => {
	console.log('Key b.c changed');
});

obj.a = 6;
// Object changed
// Key a changed

obj.b = { c: 6 };
// Object changed

obj.b.c = 8;
// Object changed
// Key b.c changed
```

#### :bug: Bug Fix

-   Fixed autotest in Chrome on Windows

## 3.12.5

#### :rocket: New Feature

-   Added options `safeMode:boolean` and `safePluginsList:string[]` for debugging

```js
Jodit.make('#editor', {
	safeMode: true,
	safePluginsList: ['about']
});
```

Only one plugin will be activated. Convenient for debugging and your plugins, you can turn off all the others.

#### :bug: Bug Fix

-   Fixed a bug due to which Jodit did not work in ie11, + added a polyfill for the iterator

## 3.12.3

-   [Fixed Full Screen showing elements not part of editable content #763](Issue: https://github.com/xdan/jodit/issues/763)

#### :rocket: New Feature

-   Added `monospace` button in format list https://github.com/xdan/jodit/issues/767
-   In plugin `paste` added `memorizeChoiceWhenPasteFragment` option: when the user inserts a piece of HTML, the plugin will ask - How to insert it.
    If after that user insert the same fragment again, the previous option will be used without extra question.

> memorizeChoiceWhenPasteFragment = false, by default, it is Breaking change

## 3.12.1

#### :boom: Breaking Change

-   `ObserveObject` renamed to `ObservableObject`

```js
const obj = { a: 1, b: 2 };
const observed = Jodit.modules.ObservableObject.create(obj);

observed.on('change', (oldV, newV) => console.log(oldV, newV));
observed.a = 5;
```

-   [Replace additional newlines by HTML line breaks. #770](https://github.com/xdan/jodit/pull/770)

#### :bug: Bug Fix

-   [New lines are removed when pasting plain text in the jodit editor #755](https://github.com/xdan/jodit/issues/755)

#### :rocket: New Feature

-   In addition to the preinstalled editors, the source plugin adds the ability to use its own implementation. You can read more in the [documentation](https://xdsoft.net/jodit/docs/modules/plugins_source.html)

## 3.11.2

#### :bug: Bug Fix

-   Fixed a bug when resizing images whose size was specified in the style attribute - the size did not change

## 3.11.1

#### :boom: Breaking Change

-   Plugin `Delete` renamed to` Backspace`. And it is highly refractory.

#### :rocket: New Feature

-   Open localhost in browser on `npm start`
-   Added `Async.prototype.delay` method

```js
await editor.async.delay(1000);
alert('Alert after 1s');
```

-   Added `Ajax.options.responseType` option `XMLHttpRequestResponseType`
-   Added `Response.prototype.blob()` method

```js
const ajax = new Jodit.modules.Ajax({ responseType: 'blob' });
await ajax.send().then(resp => resp.blob());
```

#### :bug: Bug Fix

-   Added handling of `contenteditable = false` elements to the plugin` Backspace`.
-   [es2018 build don't works properly starting from jodit 3.9.4 #758](https://github.com/xdan/jodit/issues/758)
-   [shadow dom support only partly fixed #746](https://github.com/xdan/jodit/issues/746)

## 3.10.2

#### :boom: Breaking Change

-   The hotkeys have been castled in the Delete plugin:
    Was:

```js
const hotkeys = {
	delete: ['delete', 'cmd+backspace'],
	deleteWord: ['ctrl+delete', 'cmd+alt+backspace', 'ctrl+alt+backspace'],
	backspace: ['backspace'],
	backspaceWord: ['ctrl+backspace']
};
```

But the setting was called incorrectly, when the combination was pressed, not one word was deleted, but a whole sentence.
Now added one more setting:

```js
const hotkeys = {
	delete: ['delete', 'cmd+backspace'],
	deleteWord: ['ctrl+delete', 'cmd+alt+backspace', 'ctrl+alt+backspace'],
	deleteSentence: ['ctrl+shift+delete', 'cmd+shift+delete'],
	backspace: ['backspace'],
	backspaceWord: ['ctrl+backspace'],
	backspaceSentence: ['ctrl+shift+backspace', 'cmd+shift+backspace']
};
```

#### :bug: Bug Fix

-   fixed sync between WYSIWYG and source editor

## 3.10.1

#### :boom: Breaking Change

-   Update `TypeScript@4.5.2`
-   In `IJodit.getEditorValue` added second argument for using with `afterGetValueFromEditor` event.
    You can see example in `source` plugin.
-   In UIButton `state.status` changed to `state.variant`
-   `beforeClose` event can prevent closing the dialog

```js
const dialog = new Jodit.modules.Dialog();
dialog.setContent('Hello world!').open();
dialog.e.on('beforeClose', () => confirm('Are you sure?'));
```

#### :bug: Bug Fix

-   fix: Proxy blur event to parent triggered on the ACE editor

## 3.9.5

#### :rocket: New Feature

-   [Feature request: Open the inline toolbar without having to highlight text. #600](https://github.com/xdan/jodit/issues/600)
    Allow open inline toolbar. This feature is implemented on the basis of the `inline-popup` plugin, a setting has been
    added to it: `popup.toolbar`, which lists the buttons that will be shown in such a toolbar. Added the `showInline`
    method to the `ToolbarEditorCollection` itself:

```js
const editor = Jodit.make('#editor', {
	preset: 'inline',
	popup: {
		toolbar: Jodit.atom(['bold', 'italic', 'image'])
	}
});
editor.s.focus();

editor.toolbar.showInline();
// or
editor.e.fire('showInlineToolbar');
```

Also added `ToolbarCollection.hide` and `ToolbarCollection.show` methods.

```js
const editor = Jodit.make('#editor');
editor.toolbar.hide();
editor.toolbar.show();
```

-   Allow use prototype as component name

```js
console.log(Jodit.modules.UIButton.getFullElName('element')); // jodit-ui-button__element
console.log(Jodit.modules.UIButton.componentName); // jodit-ui-button
```

-   [Remember last opened folder with FileBrowser #675](https://github.com/xdan/jodit/issues/675)
    Boolean option `filebrowser.saveStateInStorage` split to dictionary:

```ts
interface IFileBrowserOptions

:
{
}
saveStateInStorage: false | {
	storeLastOpenedFolder? : boolean;
	storeView? : boolean;
	storeSortBy? : boolean;
};
}
```

By default:

```js
{
	saveStateInStorage: {
		storeLastOpenedFolder: true,
			storeView
	:
		true,
			storeSortBy
	:
		true
	}
}
```

Disable it:

```js
Jodit.make('#editor', {
	filebrowser: {
		saveStateInStorage: false
	}
});

// or

Jodit.make('#editor', {
	filebrowser: {
		saveStateInStorage: {
			storeLastOpenedFolder: false
		}
	}
});
```

-   [Spacer in Button Toolbar](https://github.com/xdan/jodit/issues/713)
    In addition to the `|` metacharacters and `\n` which stand for separator and newline, the `---` metacharacter has
    appeared, which allows you to add a spacer element which pushes all buttons behind the spacer to the right side of the
    toolbar and creates space in the middle.

```js
Jodit.make('#editor', {
	buttons: [
		'source',
		'bold',
		'|',
		'---',
		'|',
		'brush',
		'about',
		'\n',
		'italic'
	]
});
```

## 3.9.4

#### :rocket: New Feature

-   Changed style resize rectangle for resize image or table
-   Added link `POWERED BY JODIT` in statusbar
-   Changed icon for resize handle in the bottom right corner

#### :bug: Bug Fix

-   Fixed popup color for dark theme
-   [Change html tags when list style on/off #738](https://github.com/xdan/jodit/issues/738)
-   [order list/unorder list in source view #732](https://github.com/xdan/jodit/issues/732)
-   [dots supplementary buttons shown incorrectly #692](https://github.com/xdan/jodit/issues/692)
-   [Jodit adds unexpected <span> tag when user lefts cursor inside <script> tag #687](https://github.com/xdan/jodit/issues/687)

## 3.9.3

#### :boom: Breaking Change

-   The style `table-layout: fixed` has been removed from tables. When inserting a table, the width of the columns is
    immediately set for it.

## 3.9.1

#### :boom: Breaking Change

-   Removed `Travis.CI` 👋👋👋
-   `EventsNative` module - renamed to `EventEmitter`

```js
const editor = Jodit.make('#editor');

console.log(editor.e instanceof Jodit.modules.EventEmitter); // true
console.log(editor.events instanceof Jodit.modules.EventEmitter); // true
console.log(editor.events instanceof Jodit.modules.EventsNative); // true, deprecated
```

-   BOOM: Move Ajax class into `request` folder.

```js
import { Ajax } from 'jodit/src/core/request';
```

-   Changed the signature of the send method in the Ajax API and is closer to the fetch () API

```js
const editor = Jodit.make('#editor');

// Before
await new Ajax(editor, {
	url: 'index.php'
}).send(); // {success: true, data: ...}

// Now
await new Ajax(editor, {
	url: 'index.php'
})
	.send()˚
.
then(resp => resp.json()); // {success: true, data: ...}
```

-   In `.npmignore` added:
    -   build-system/
    -   test.html
    -   .eslintrc.js
    -   .eslintignore
    -   .editorconfig
    -   .gitignore
    -   .prettierrc.json
    -   .stylelintrc
    -   app.css
    -   composer.json

#### :rocket: New Feature

In `Dom` module added `nextGen` and `eachGen` methods. These methods return generators:

```js
const editor = Jodit.make('#editor');
editor.value = '<ul><li><img>1</li><li>2</li><li>3</li></ul>';

const gen = Dom.nextGen(editor.editor.querySelector('img'), editor.editor);
let next = gen.next();

while (!next.done) {
	console.log(next.value); // 1, LI, 2, LI, 3
	next = gen.next();
}

const gen2 = Dom.eachGen(editor.editor);
let next2 = gen2.next();

while (!next2.done) {
	console.log(next2.value); // UL, LI, 1, LI, 2, LI, 3
	next2 = gen2.next();
}
```

#### :bug: Bug Fix

-   [Indent doesn't work in table cell #729](https://github.com/xdan/jodit/issues/729)
-   [cleanHTML replaceOldTags doesn't seem to do anything #728](https://github.com/xdan/jodit/issues/728)
-   [Fixed Resize column table #712](https://github.com/xdan/jodit/issues/712)
-   [Font and font size settings are not applied to all text if part of it has been changed earlier #706](https://github.com/xdan/jodit/issues/706)
-   [Delete multi rows and colums #690](https://github.com/xdan/jodit/issues/690)
-   [When {"enter": "BR"} option is enabled, adding a heading to the text causes it to become wrapped by a "h\*" tag #547](https://github.com/xdan/jodit/issues/547)
-   [Issue with clear format on <p> tags #680](https://github.com/xdan/jodit/issues/680)

## 3.8.5

#### :house: Internal

-   The build system is divided into modules and is now located in the 'build-system' folder, the `src/utils` folder has
    been moved to it.

#### :bug: Bug Fix

-   [When I merged some cells by dragging it to change its width. #737](https://github.com/xdan/jodit/issues/737)
-   [Color dropdown looks broken #736](https://github.com/xdan/jodit/issues/736)
-   [all popups and dialogs are outside shadow dom #731](https://github.com/xdan/jodit/issues/731)
-   [shadow dom browser support #730](https://github.com/xdan/jodit/issues/730)
-   [fix removal of attributes width and height when editing images](https://github.com/xdan/jodit/pull/733)
-   Fixed work in IE11
-   [toolbar menus are almost not visible on IE11 #458](https://github.com/xdan/jodit/issues/458)

## 3.8.4

#### :rocket: New Feature

-   В eventEmitter добавлены методы:
    -   `mute(event?: string)` Doesn't start any handler;
    -   `isMuted(event?: string)` No handlers are triggered for the event
    -   `unmute(event?: string)` Returns event handling

```js
const editor = Jodit.make('#editor');

editor.events.on('change', () => {
	console.log(editor.value);
});
editor.value = '1'; // Console '1'

editor.events.mute('change');
editor.value = '2'; // Nothing
editor.events.unmute('change');
editor.value = '3'; // Console '3'
```

## 3.8.3

#### :boom: Breaking Change

-   beforeSetNativeEditorValue - get object {value: string} and can change value
-   Added `resizer.forImageChangeAttributes=true` option. Issue: https://github.com/xdan/jodit/issues/696

```js
// Disable
Jodit.make('#editor', {
	resizer: {
		forImageChangeAttributes: false
	}
});
```

#### :house: Internal

-   The Source button has been moved to the depth of the toolbar as it is not cool for the WYSIWYG editor

#### :bug: Bug Fix

-   [Trying to get in touch regarding a security issue #702](https://github.com/xdan/jodit/issues/702)
-   [Scrolling to top of editor bug in Safari. #715](https://github.com/xdan/jodit/issues/715)
-   [Refused to run the JavaScript URL because it violates the following Content Security Policy directive #716](https://github.com/xdan/jodit/issues/716)
-   [Popup doesn't follow the toolbar on scroll #703](https://github.com/xdan/jodit/issues/703)
-   Fixed the link dialog: the unlink button does not work in some cases, and the selection is not restored

## 3.8.1

#### :boom: Breaking Change

-   Rename `Style` to `CommitStyle`

```js
const editor = Jodit.make('#editor');

const style = new Jodit.ns.CommitStyle({
	style: {
		color: 'red'
	}
});

editor.execCommand('selectall');
style.apply(editor);
```

-   `Dom` refactoring: from `isNode`,`isElement`,`isHTMLElement` removed `Window` argument.

Before

```js
const editor = Jodit.make('#editor', { iframe: true });
Dom.isNode({}, editor.ow); // false
Dom.isNode(document.body, window); // true
Dom.isNode(document.body, editor.ow); // true
Dom.isNode(editor.od.body, editor.ow); // true
Dom.isNode(editor.ed.body, editor.ow); // false
```

Now

```js
const editor = Jodit.make('#editor', { iframe: true });
Dom.isNode({}); // false
Dom.isNode(document.body); // true
Dom.isNode(document.body); // true
Dom.isNode(editor.od.body); // true
Dom.isNode(editor.ed.body); // true
```

#### :rocket: New Feature

-   Added `KeyArrowOutside`, allowing to go outside an inline element if there is no other element after that.
-   Dictionary of variable values in css, a complete list can be found
    here https://github.com/xdan/jodit/blob/master/src/styles/variables.less#L25
    ```js
    const editor = Jodit.make('#editor', {
    	styleValues: {
    		'color-icon': '#0f0',
    		'color-text': 'red',
    		colorBorder: 'black',
    		'color-panel': 'blue'
    	}
    });
    ```

#### :bug: Bug Fix

-   [Toolbar buttons are not read by screen reader correctly #725](https://github.com/xdan/jodit/issues/725)
-   [Bug : table & background color #722](https://github.com/xdan/jodit/issues/722)
-   [Video links are not reliably converted to an IFrame. #714](https://github.com/xdan/jodit/issues/714)
-   [Eraser delete "<a>" tag! #705](https://github.com/xdan/jodit/issues/705)

## 3.7.1

#### :boom: Breaking Change

-   Update Typescript 4.3.2 - and used override keyword.
-   `noImplicitOverride` set true.
-   Enable `@typescript-eslint/explicit-module-boundary-types`
-   Remove `type` helper. Buy `jQuery` - it was your last part.

#### :bug: Bug Fix

-   [hovering over the text editor triggers hover over source button instantly #138](https://github.com/jodit/jodit-react/issues/138)
-   Allow insert in image dialog - relative path

#### :rocket: New Feature

-   Added `idle` decorator - allow wrap class method in `requestIdleCallback`

```ts
@component
class UIInput extends UIElement {
	@idle()
	onSomeEvent() {
		console.log('Some data');
	}
}

const elm = new UIInput(jodit);
elm.onSomeEvent();
for (let i = 0; i < 5; i += 1) {
	console.log(i);
}
```

Output

```
1
2
3
4
Some data
```

## 3.6.18

#### :bug: Bug Fix

-   Fixed table cells selection
-   [isUrl add rtmp schema #677](https://github.com/xdan/jodit/issues/677)
-   [The editor is very slow when working with tables in IE #673](https://github.com/xdan/jodit/issues/673)

## 3.6.17

#### :rocket: New Feature

-   Added `IJodit.waitForReady(): Promise<IJodit>` method.

```js
const jodit = Jodit.make('#editor', {
	extraPlugins: ['myPlugin']
});

await jodit.waitForReady(); // wait for all plugins will be initialised

jodit.e.fire('someAsyncLoadedPluginEvent', test => {
	alert(test);
});
```

## 3.6.16

#### :bug: Bug Fix

-   Fixed selection restoring after blur and set source mode.

## 3.6.15

#### :bug: Bug Fix

-   Fixed bug with fixed width and auto height resizing

## 3.6.13

#### :bug: Bug Fix

-   Hot fix `focus` plugin + `Select`.`save` deny set focus in another place.

#### :rocket: New Feature

-   Added `Select`.`hasMarkers` method.

## 3.6.12

#### :rocket: New Feature

-   Added `cursorAfterAutofocus=end` option inside `autofocus` plugin. Allow change default autofocus position. Possible
    values `start`, `end`.
    [autofocus plugin should focus on the end of the text #649](https://github.com/xdan/jodit/issues/649)

-   Added `saveSelectionOnBlur=true` option inside `autofocus` plugin. Allow restore position after editor has focus after
    blur.

#### :house: Internal

-   Renamed `autofocus` > `focus` plugin.

#### :boom: Breaking Change

-   The `Dom`.`wrap` method changed signature - instead IJodit call with ICreate.
-   The `Select`.`restore` method is called with no arguments. It finds the range using the data attribute selector. In
    the `Select`.`save` method added `silent=false` argument.

Earlier

```js
const editor = Jodit.make('#editor');
const info = editor.s.save();
// Change code
editor.s.restore(info);
```

Now

```js
const editor = Jodit.make('#editor');

editor.s.save(true); // Do not change current range
// Change code
editor.s.restore();
```

#### :bug: Bug Fix

-   ['allowResizeX' option does not work without 'height' option #668](https://github.com/xdan/jodit/issues/668)
-   [Pasting link with a colon (:) crashes the browser/makes it unresponsive #667](https://github.com/xdan/jodit/issues/667)
-   [Inserting images/videos scrolls user to top of text area #644](https://github.com/xdan/jodit/issues/644)
-   [Change event is fired twice after inserting a link #636](https://github.com/xdan/jodit/issues/636)
-   [iPhone is out of text selection #632](https://github.com/xdan/jodit/issues/632)
-   [Pasting an MS Excel cell inserts the cell as image #474](https://github.com/xdan/jodit/issues/474)
-   Fixed a bug when FONT was inserted into the change history

## 3.6.10

#### :rocket: New Feature

-   [Video alignment request #646](https://github.com/xdan/jodit/issues/646)
-   Set `component` property for source textarea with Jodit instance.

```html
<textarea id="editor" cols="30" rows="10"></textarea>
<script>
	Jodit.make('#editor');
	console.log(document.getElementById('editor').component.value);
	document.getElementById('editor').component.filebrowser.open();
</script>
```

#### :bug: Bug Fix

-   Hide popup after deleting target node with key press.
-   [image-editor : onChangeSizeInput #663](https://github.com/xdan/jodit/issues/663)
-   [image-editor : switcher #662](https://github.com/xdan/jodit/issues/662) Replace buttons to switcher
-   [Error from ESlint, please fix it #658](https://github.com/xdan/jodit/issues/658)
-   [Support Mobile platform’s slide to type feature. #654](https://github.com/xdan/jodit/issues/654)
-   [The Jodit eraser tool doesn't work for <p> tags #652](https://github.com/xdan/jodit/issues/652)
-   [Links at the end of editor after unlink #648](https://github.com/xdan/jodit/issues/648)

## 3.6.7

#### :bug: Bug Fix

-   When deleting a file via the context menu - the list of files was not updated.

#### :rocket: New Feature

-   Added the ability to open a file browser and any dialog in a new window. To do this, you need to define
    the `ownerWindow` field. For example, this can be done so that the file browser opens in a separate popup window.

```js
const editor = Jodit.make('#editor', {
	uploader: {
		url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
	},
	filebrowser: {
		ajax: {
			url: 'https://xdsoft.net/jodit/connector/index.php'
		}
	}
});

// Rewrite default filebrowser instance
editor.e.on('getInstanceFileBrowser', options => {
	const win = window.open(
		'about:blank',
		'File Browser',
		'location=0,menubar=0,status=0,toolbar=0,titlebar=0,width=700,height=500'
	);

	win.document.open();
	// Need append css for Jodit
	win.document.write(
		'<html><head><title>File Browser!</title><link rel="stylesheet" type="text/css" href="./build/jodit.min.css"></head><body></body></html>'
	);
	win.document.close();

	const browser = new Jodit.modules.FileBrowser({
		ownerWindow: win, // set window which will be used for opening
		headerButtons: [], // disable buttns - close and fullscreen
		fullsize: true,
		events: {
			beforeOpen: () => {
				win.focus();
			},
			afterClose: () => {
				win.close();
			}
		},
		ajax: options.ajax
	});

	browser.noCache = true; // Becouse window can be closed - create instance on every getInstanceFileBrowser

	return browser;
});
```

## 3.6.5

#### :boom: Breaking Change

-   Removed options: `useIframeResizer`, `useImgResizer`, `useTableResizer` from `resizer` plugin. Instead,
    added `allowResizeTags`.

```js
Config.prototype.allowResizeTags = ['img', 'iframe', 'table', 'jodit'];
```

## 3.6.2

#### :bug: Bug Fix

-   [Error when resizing tables and tables cells](https://github.com/xdan/jodit/issues/611)
-   [Image and video resizing in the table does not work correctly](https://github.com/xdan/jodit/issues/528)
-   [The link popup closes when trying to add it to an image inside a table. #524](https://github.com/xdan/jodit/issues/524)
-   Fixed a bug when command `emptyTable` didn't work.

## 3.6.1

#### :bug: Bug Fix

-   [<style> tag wrapping problem #620](https://github.com/xdan/jodit/issues/620)
-   [Disable Link Checking #618](https://github.com/xdan/jodit/issues/618)
-   [Changing text style undoes text alignment #614](https://github.com/xdan/jodit/issues/614)
-   [<section> tag is always wraped <p></p> once when toggle the wysiwyg/source mode #612](https://github.com/xdan/jodit/issues/612)
-   [Error when resizing tables and tables cells. #611](https://github.com/xdan/jodit/issues/611)
-   [Backspace and Delete have an errant character #597](https://github.com/xdan/jodit/issues/597)

#### :rocket: New Feature

-   Added `classSpan` plugin. Applying some className to selected text. Thanks https://github.com/s-renier-taonix-fr

```js
const editor = new Jodit('#editor', {
	controls: {
		classSpan: {
			list: {
				class1: 'Classe 1',
				class2: 'Classe 2',
				class3: 'Classe 3',
				class4: 'Classe 4',
				class5: 'Classe 5'
			}
		}
	}
});
```

-   Added `UIFileInput` element.
-   Added `UIButtonGroup` element.

```ts
const group = new UIButtonGroup(jodit, {
	label: 'Theme',
	name: 'theme',
	value: this.state.theme,
	radio: true,
	options: [
		{ value: 'default', text: 'Light' },
		{ value: 'dark', text: 'Dark' }
	],
	onChange: values => {
		this.state.theme = values[0].value as string;
	}
});
```

#### :house: Internal

-   Enabled `"importsNotUsedAsValues": "error"` in `tsconfig`
-   Refactoring `Filebrowser` module
-   Refactoring `Dialog` module
-   Added "stylelint-config-idiomatic-order" in style linter
-   Added "en" bundle without another languages.
-   Replaced `Config` system. You can change default setting in you extensions.

```js
// before
const a = new Jodit();
a.options.allowResizeY; // true
Jodit.defaultOptions.allowResizeY = false;
a.options.allowResizeY; // true

// Now
const a = new Jodit();
a.options.allowResizeY; // true
Jodit.defaultOptions.allowResizeY = false;
a.options.allowResizeY; // false
```

-   Added `promisify` mode in `debounce` and `throttle` decorators.
-   Removed `src/core/ui/form/validators/key-validator.ts`.
-   Added `Async`.`requestIdlePromise` method.
-   Removed `Helpers`.`extend` method.
-   Added `Helpers`.`loadImage` method.
-   Changed `render` method in state/ui system.

```js
// Before
@component()
class UIBtn extends UIElement {
	className() {
		return 'UIBtn';
	}

	createContainer() {
		const button = this.j.c.element('button');
		button.style.color = 'red';

		button.classList.add(this.getFullElName('button'));

		this.j.e.on('click', button, this.onClick);
		return button;
	}

	@autobind onClick() {
		alert('click');
	}
}

// Now
@component()
class UIBtn extends UIElement {
	className() {
		return 'UIBtn';
	}

	render() {
		return `<button class="&__button" style="color:red"></button>`;
	}

	@watch('container:click') onClick() {
		alert('click');
	}
}
```

and styles

```css
.jodit-ui-btn__button {
	border: 1px solid #ccc;
}
```

## 3.5.4

#### :bug: Bug Fix

-   [From Jodit 3.5.1 on, popup z-index is lower than the modal (Ant Design) z-index #587](https://github.com/xdan/jodit/issues/587)

## 3.5.3

#### :bug: Bug Fix

-   Fixed ES2018 version https://github.com/xdan/jodit/issues/585

## 3.5.2

#### :house: Internal

-   Added `async.requestIdleCallback` method https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback.
-   Focused inputs have box shadow.

#### :bug: Bug Fix

-   [The link and image popup closes automatically on the inline preset. #582](https://github.com/xdan/jodit/issues/582)
-   [Preset:inline / Link Popup Closes #515](https://github.com/xdan/jodit/issues/515)
-   [Missing autobind-decorator types on the latest release #583](https://github.com/xdan/jodit/issues/583)
-   [link does not carry when dragging/dropping #581](https://github.com/xdan/jodit/issues/581)
-   [When editor is disabled/readonly (both), list controls are still available by using the arrow bug #572](https://github.com/xdan/jodit/issues/572)

#### :rocket: New Feature

##### New option `link.hotkeys: string[] = ['ctrl+k', 'cmd+k']`

Execute new command `openLinkDialog`. Related: https://github.com/xdan/jodit/issues/576

## 3.5.1

#### :house: Internal

-   Removed `useAceEditor` option. [https://github.com/xdan/jodit/issues/544](https://github.com/xdan/jodit/issues/544)
-   Added `component` and `persistent` decorators

```typescript
import { component, persistent } from './src/core/decorators';

@component
class Item extends UIElement {
	@persistent
	options = {
		some: true
	};
}

const item = new Item(jodit);
console.log(item.options); // {some: true}

item.options = {
	some: false
};

const item2 = new Item(jodit); // or reload page
console.log(item.options); // {some: false}
```

-   In `UIInput` added `autocomplete`, `clearButton`, `icon` options.

#### :bug: Bug Fix

-   [Clear formatting control does not clear all styles (keeps underline and strikethrough) #575](https://github.com/xdan/jodit/issues/575)
-   [Reset in size change not rescaling image #568](https://github.com/xdan/jodit/issues/568)
-   [Backspace in beginning of a _
    styled_ line does not affect the line positioning #567](https://github.com/xdan/jodit/issues/567)
-   [Table cell elements are always left-aligned #550](https://github.com/xdan/jodit/issues/550)
-   [editor.destruct throws error #543](https://github.com/xdan/jodit/issues/543)
-   [How I can get Iframe without parent element <jodit>...</jodit> #540](https://github.com/xdan/jodit/issues/540)
-   [Layout bug and drag&drop image loading #536](https://github.com/xdan/jodit/issues/536)
-   [Popups are not showing at all on Legacy Edge #531](https://github.com/xdan/jodit/issues/531)
-   Fixed a bug when the search bar was shown in the scrolling editor, the editor was scrolled up. And the search box was
    not in sticky mode.

#### :rocket: New Feature

##### Jodit.atom

`Jodit.Array` and `Jodit.Object` marked as deprecated. In `3.5` they will be removed. Instead, use `Jodit.atom`.

```
const editor = Jodit.make('#editor', {
    buttons: Jodit.atom(['bold', 'italic']),
    popup: {
        img: Jodit.atom({
            // full rewrite
        })
    }
});
```

##### New option `observer.maxHistoryLength: number = Infinity`

Related with https://github.com/xdan/jodit/issues/574. In some cases need to limit size of undo history.

##### New options in `link.plugin`

-   @property {"input"|"select"|""} link.modeClassName="input" Use an input text to ask the classname or a select or not
    ask
-   @property {boolean} link.selectMultipleClassName=true Allow multiple choises (to use with modeClassName="select")
-   @property {number} link.selectSizeClassName=3 The size of the select (to use with modeClassName="select")
-   @property {IUIOption[]} link.selectOptionsClassName=[] The list of the option for the select (to use with
    modeClassName="select")
-   ex: [
-                                                                                                                       	{ value: "", text: "" },
-                                                                                                                       	{ value: "val1", text: "text1" },
-                                                                                                                       	{ value: "val2", text: "text2" },
-                                                                                                                       	{ value: "val3", text: "text3" }
-                                                                                                                       ]
    PR: https://github.com/xdan/jodit/pull/577 Thanks @s-renier-taonix-fr

##### New option `statusbar: boolean = true`

Issue https://github.com/xdan/jodit/issues/535

```
const editor = Jodit.make('#editor', {
   statusbar: false
});
console.log(editor.statusbar.isShown); // false
editor.statusbar.show();
console.log(editor.statusbar.isShown); // true
```

##### Buttons groups

The `buttons` option can contain named groups of buttons. Each plugin decides which button belongs to which group. Thus,
if you turn off the plugin, then its buttons will not be shown either. Available
groups: ["source", "font-style", "script", "list", "indent", "font", "color", "media", "state", "clipboard", "insert", "history", "search", "other", "info"]
;

```js
const editor = Jodit.make('#editor', {
	buttons: [
		{
			group: 'custom',
			buttons: []
		},
		'bold'
	]
});

Jodit.defaultOptions.controls.someButton = {
	icon: 'pencil',
	command: 'selectall'
};

Jodit.plugins.add('somePlugin', function (editor) {
	editor.registerButton({
		name: 'someButton',
		group: 'custom'
	});
});
```

##### Hotkeys for BackSpace and Delete and remove part of text

Added hotkey settings for Delete and Backspace buttons. And added hotkey `ctrl+backspace` for removing left part of
text. Issue: [https://github.com/xdan/jodit/issues/532](https://github.com/xdan/jodit/issues/532)

```js
Jodit.make('#editor', {
	delete: Jodit.atom({
		hotkeys: {
			delete: ['delete', 'cmd+backspace'],
			deleteWord: [
				'ctrl+delete',
				'cmd+alt+backspace',
				'ctrl+alt+backspace'
			],
			backspace: ['backspace'],
			backspaceWord: ['ctrl+backspace']
		}
	})
});
```

##### Added `one` method in event system

```js
const editor = Jodit.make('#editor');

editor.events
	.one('keydown', () => {
		console.log('Fire only one time');
	})
	.on('keydown', () => {
		console.log('Fire everytime');
	});
```

## 3.4.28

#### :bug: Bug Fix

-   [#526 Editor disable in ifram with split_mode](https://github.com/xdan/jodit/issues/526)
-   [#519 Insert link scrolls user to top of text area](https://github.com/xdan/jodit/issues/519)

#### :rocket: New Feature

Added `extraIcons` option. By default, you can only install an icon from the Jodit suite. You can add your icon to the
set using the `Jodit.modules.Icon.set (name, svg Code)` method. But for a declarative declaration, you can use this
option.

```js
Jodit.modules.Icon.set('someIcon', '<svg><path.../></svg>');
const editor = Jodit.make({
	extraButtons: [
		{
			name: 'someButton',
			icon: 'someIcon'
		}
	]
});
```

```js
const editor = Jodit.make({
	extraIcons: {
		someIcon: '<svg><path.../></svg>'
	},
	extraButtons: [
		{
			name: 'someButton',
			icon: 'someIcon'
		}
	]
});
```

```js
const editor = Jodit.make({
	extraButtons: [
		{
			name: 'someButton',
			icon: '<svg><path.../></svg>'
		}
	]
});
```

## 3.4.27

-   https://github.com/xdan/jodit/issues/514
    Run command insertUnorderedList & insertOrderedList should replace all headings (h1, h2, etc.) to ul>li

## 3.4.26

#### :bug: Bug Fix

-   https://github.com/xdan/jodit/issues/506
-   https://github.com/xdan/jodit/issues/505
-   https://github.com/xdan/jodit/issues/503
-   https://github.com/xdan/jodit/issues/501
-   https://github.com/xdan/jodit/issues/500
-   https://github.com/xdan/jodit/issues/496
-   https://github.com/xdan/jodit/issues/495
-   https://github.com/xdan/jodit/issues/490

#### :rocket: New Feature

-   https://github.com/xdan/jodit/issues/513 allow set percentage and another points inside width and height inputs

## 3.4.25

-   https://github.com/xdan/jodit/issues/422
-   https://github.com/xdan/jodit/issues/375
-   https://github.com/xdan/jodit/issues/343

### Features

-   https://github.com/xdan/jodit/issues/489
    In textIcons - besides `boolean`, you can put `function(key: string): boolean`;

```js
var editor = new Jodit('#editor', {
	textIcons: key => key !== 'bold'
});
```

## 3.4.24

### Bug fixes

-   https://github.com/xdan/jodit/issues/487
-   https://github.com/xdan/jodit/issues/486
-   https://github.com/xdan/jodit/issues/485
-   https://github.com/xdan/jodit/issues/483
-   https://github.com/xdan/jodit/issues/478
-   https://github.com/xdan/jodit/issues/476
-   https://github.com/xdan/jodit/issues/475
-   https://github.com/xdan/jodit/issues/473

## 3.4.22

-   https://github.com/xdan/jodit/issues/467
-   https://github.com/xdan/jodit/issues/466

### Features

Added `maxHeight` option.

```js
const jodit = Jodit.make('#editor', {
	minHeight: 200,
	maxHeight: 500
});
```

## 3.4.18

-   https://github.com/xdan/jodit/issues/463
-   https://github.com/xdan/jodit/issues/446
-   https://github.com/xdan/jodit/issues/342
-   https://github.com/xdan/jodit/issues/340

## 3.4.16

### Bug fixes

-   Fixed https://github.com/xdan/jodit/issues/456
-   Fixed https://github.com/xdan/jodit/issues/454
-   Fixed https://github.com/xdan/jodit/issues/453
-   Fixed https://github.com/xdan/jodit/issues/451
-   Fixed https://github.com/xdan/jodit/issues/444
-   Fixed https://github.com/xdan/jodit/issues/428
-   Fixed https://github.com/xdan/jodit/issues/427
-   Fixed https://github.com/xdan/jodit/issues/426
-   Fixed https://github.com/xdan/jodit/issues/222

### Features

-   Added Find and Preview buttons
-   https://github.com/xdan/jodit/issues/417
    Added `defaultFontSizePoints` options. Possible values `pt` or `px`. By default: `px`

```js
const editor = new Jodit('#editor', {
	defaultFontSizePoints: 'pt'
});
```

-   https://github.com/xdan/jodit/issues/449
    Added `showCharsCounter` options.

```js
const editor = new Jodit('#editor', {
	language: 'en',
	showCharsCounter: true,
	countHTMLChars: true
});

editor.value = '<p>Simple text</p><p>Simple text</p>';
const statusbar = editor.container.querySelector('.jodit-status-bar');

expect(statusbar.textContent.match(/Chars: 36/)).is.not.null;
```

## 3.4.15

-   Fixed https://github.com/xdan/jodit/issues/441
-   Fixed https://github.com/xdan/jodit/issues/437
-   Fixed https://github.com/xdan/jodit/issues/435
-   Fixed https://github.com/xdan/jodit/issues/431

## 3.4.13

### Bug fixes

-   https://github.com/xdan/jodit/issues/379

## 3.4.12

### Bug fixes

-   https://github.com/xdan/jodit/issues/424
    Fixed `allowTabNavigation` By default: `false`.

```js
const jodit = new Jodit('#editor', {
	allowTabNavigation: true // enable tab navigation between toolbar's buttons
});
```

-   https://github.com/xdan/jodit/issues/421
-   https://github.com/xdan/jodit/issues/420
-   https://github.com/xdan/jodit/issues/419
-   https://github.com/xdan/jodit/issues/418#issuecomment-651145548
-   https://github.com/xdan/jodit/issues/415

## 3.4.2

### Bug fixes

https://github.com/xdan/jodit/issues/359

## 3.4

### Bug fixes

-   https://github.com/xdan/jodit/issues/408
-   https://github.com/xdan/jodit/issues/405
-   https://github.com/xdan/jodit/issues/404 See more in Features
-   https://github.com/xdan/jodit/issues/400
-   https://github.com/xdan/jodit/issues/398
-   https://github.com/xdan/jodit/issues/396
-   https://github.com/xdan/jodit/issues/393
-   https://github.com/xdan/jodit/issues/392
-   https://github.com/xdan/jodit/issues/391
-   https://github.com/xdan/jodit/issues/385
-   https://github.com/xdan/jodit/issues/378
-   https://github.com/xdan/jodit/issues/369
-   https://github.com/xdan/jodit/issues/360
-   https://github.com/xdan/jodit/issues/352
-   Fixed unde-redo subsystem for source mode

### Features

-   All `less` variables were replaced to css custom properties for modern browsers.
-   Added `WrapTextNodes` plugin - it wrap all alone text node(or inline elements) inside `options.enter` element. You can
    disable this behaviour:

```js
const editor = Jodit.make('#editor', {
	disablePlugins: ['WrapTextNodes']
});
```

-   Added `shadowRoot` option for ShadowDom support.
    > ACE source editor does not support Shadow Dom

```html
<div id="editor"></div>
```

```js
const app = document.getElementById('editor');
app.attachShadow({ mode: 'open' });
const root = app.shadowRoot;

root.innerHTML = `
<link rel="stylesheet" href="./build/jodit.css"/>
<h1>Jodit example in Shadow DOM</h1>
<div id="edit"></div>
`;

var editor = new Jodit(root.getElementById('edit'), {
	globalFullSize: false,
	shadowRoot: root
});
editor.value = '<p>start</p>';
```

-   From `NativeEvent.on` method was removed `selector` argument. It was `jQuery.live` style. Example:

```html
<div class="test">
	<button>1</button>
	<button>2</button>
</div>
```

Earlier, you can use something like this

```js
editor.events.on(
	document.querySelector('div'),
	'click',
	function () {
		alert(this.innerText);
	},
	'button'
);
```

Now, you should use `event.target`

```js
editor.events.on(document.querySelector('div'), 'click', function (e) {
	alert(e.target.innerText);
});
```

-   `Select.applyCSS` was renamed to `Select.applyStyle`

```js
const editor = Jodit.make('#editor');
editor.s.applyStyle({ color: 'red' }); // will add to all selection text - red color
```

-   `FileBrowser`, `Dialog` etc. modules which extend `View` has only one argument in the constructor - options. Before:

```js
const editor = Jodit.make('#editor');
const fb = Jodit.modules.FileBrowser(editor, {
	ajax: {
		url: 'https://xdsoft.net'
	}
});
fb.open();
fb.close();

editor.destruct();
fb.open(); // error, fb is already destructed
```

Now:

```js
const editor = Jodit.make('#editor');
const fb = Jodit.modules.FileBrowser({
	ajax: {
		url: 'https://xdsoft.net'
	}
});
fb.open();
fb.close();

editor.destruct();
fb.open(); // Normal

fb.destruct();
//or
editor.e.on('beforeDestruct', () => {
	fb.destruct();
});
```

-   Split `table` plugin on `select-cells` and `resize-cells` plugins. `useTableProcessor` was removed. Instead, use

```js
Jodit.make('#editor', {
	table: {
		allowCellSelection: true,
		selectionCellStyle: 'border: 1px double #1e88e5 !important;',

		allowCellResize: true,
		useExtraClassesOptions: true
	}
});
```

-   All `less` files were moved near with TS. Class naming was changed closer to BEM.
-   Removed `PopupList` and `Popup`. Instead, use only `PopupMenu`.
-   Added `ui.button` and `ui.list` for working with buttons. `toolbar.button` extends `ui.button`. UIButton - is
    reactive:

```js
const button = new UIButton();
button.state.activated = true; // will automatically change setAttribute('area-pressed', 'true')
button.state.icon = 'plus'; // will add `svg` icon in container

// or use `setState`
button
	.setState({
		text: 'Click me'
	})
	.onAction(() => {
		Jodit.Alert('Click');
	})
	.appendTo(document.body); // will append it inside the body
```

-   In `tsconfig` added decorators supports. Methods that need binding binds with `@autobind` decorator.
-   Added `watch` decorator.
-   All filenames were renamed to kebab-case.
-   Added short aliases for. Can be used as chain - `this.j.e.on`
    -   `this.jodit` => `this.j`
    -   `this.options` => `this.o`
    -   `this.selection` => `this.s`
    -   `this.create` => `this.c`
    -   `this.events` => `this.e`
    -   `this.ownerDocument` => `this.od`
    -   `this.ownerWindow` => `this.ow`
    -   `this.editorDocument` => `this.ed`
    -   `this.editorWindow` => `this.ew`
-   Change name `Dialog`.`setTitle` to `Dialog`.`setHeader`
-   Remove `Create.inside` field and instead added `Jodit.createInside`
-   In popups added position strategies: `'leftBottom' | 'rightBottom' | 'leftTop' | 'rightTop'` etc.

## 3.3.24

### BugFix

-   [342](https://github.com/xdan/jodit/issues/342)
-   [343](https://github.com/xdan/jodit/issues/343)

## 3.3.23

### BugFix

-   [#325](https://github.com/xdan/jodit/issues/325) [#239](https://github.com/xdan/jodit/issues/239)
-   [#327](https://github.com/xdan/jodit/issues/327)
-   [#292](https://github.com/xdan/jodit/issues/292)
-   [#203](https://github.com/xdan/jodit/issues/203)
-   [#339](https://github.com/xdan/jodit/issues/339)

### Feature

-   Added `Dom`.`isTag` method

```js
const editor = Jodit.make('#editor');

const a = editor.createInside.element('a');
const br = document.createElement('br');

Jodit.modules.Dom.isTag(a, 'a'); // true
Jodit.modules.Dom.isTag(br, 'br'); // true
```

-   Added `Helpers`.`call` method

```js
const f = Math.random();
Jodit.modules.Helpers.call(f > 0.5 ? Math.ceil : Math.floor, f);
```

-   Added `Helpers`.`position` method - Helper function to get an element's exact position

```js
console.log(Jodit.modules.Helpers.position(editor.editor.querySelector('p')));
```

## 3.3.19

### BugFix

-   Fixed a lots of bugs inside `link` plugin
    [#331](https://github.com/xdan/jodit/issues/331)
    [#334](https://github.com/xdan/jodit/issues/334)
    [#334](https://github.com/xdan/jodit/issues/334)
    [#235](https://github.com/xdan/jodit/issues/235)

### Feature

-   In `link` plugin added `formTemplate` and `formClassName` options [#333](https://github.com/xdan/jodit/issues/333)

```js
const editor = getJodit({
	link: {
		formTemplate: function () {
			return '<form class="form_url"><input ref="url_input" type="url"><button>save</button></form>';
		},
		formClassName: 'some_class'
	}
});
```

-   Added deprecated mechanism. Some methods will not be removed and only will be marked as deprecated until major
    release. [#330](https://github.com/xdan/jodit/issues/330)

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

const div2 = editor2.createInside.div();
expect(div2.className).equals('test');

const ul = editor2.createInside.element('ul');
expect(ul.className).equals('ui-test');
```

## 3.3.15

### Bugfix

Fixed SPLIT_MODE

### Feature

Added `editHTMLDocumentMode` in order to allow the user to edit the entire
document [#241](https://github.com/xdan/jodit/issues/241).

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
// <body class="jodit-wysiwyg" style="outline:none">test test <a href="#">test</a></body>
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
doc.write(
	'<html><body><textarea id="editor"></textarea><' +
		'script src="./build/jodit.js"><' +
		'/script></body></html>'
);
doc.close();

Jodit.make('#editor', {
	ownerWindow: win,
	ownerDocument: doc
});
```

Fixed bug with ProgressBar - it simply does not work(

### Feature

Source plugin was separated on several classes. Now you can choose SourceEditor or make
yourself (https://github.com/xdan/jodit/issues/242)

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

-   Added Async module for control asynchronous operations

```javascript
const editor = new Jodit('#editor');
setTimeout(() => {
	editor.s.insertHTML('Hello!');
}, 1000);

editor.async.setTimeout(() => {
	editor.s.insertHTML('World!');
}, 1000);

editor.destruct();
```

After destruct the first timeout will throw the error, but second will be cleared.

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
editor.events.on('afterRemoveNode', node => {
	if (node.nodeName === 'IMG') {
		fetch('delete.php', { image: node.src });
	}
});
```

## 3.3.8

### Plugin system was changed

> Before

```javascript
Jodit.plugins.insertText = function (editor) {
	editor.events.on('someEvent', function (text) {
		editor.s.insertHTMl('Hello ' + text);
	});
};
```

> Now

```javascript
Jodit.plugins.add('insertText', function (editor) {
	editor.events.on('someEvent', function (text) {
		editor.s.insertHTMl('Hello ' + text);
	});
});
console.log(Jodit.plugins.get('insertText'));
Jodit.plugins.remove('insertText');
```

### `extraPlugins` options

Inside plugin, you can use several fields:

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

In `plugins/example` folder you can find an example.

extraPlugins option allows appending in editor extra plugins from npm, bower etc.

### Build System

In Build system was added gulp subsystem to build extra plugins. You can make extra plugins like `plugins/example` and
after build, this plugin will not be inside `jodit.min.js` file. It will be in separate folder (
eg `build/plugins/emoji/`).

Also in root you can find `make.js` file for install your plugin in build system.

---

### 2.5.61

Added `zIndex` option

```javascript
var editor = new Jodir('.editor', {
	zIndex: 10000
});
```

### 2.5.60

-   Fix table editor in iframe mode
-   Fix styles

### 2.5.57

-   Added `useIframeResizer` option for resize IFRAME tag
    ![Iframe resizer](http://xdsoft.net/jodit/stuf/iframe-resizer.jpg)
-   Added `offsetTopForAssix` option. For example, in Joomla, the top menu bar closes Jodit toolbar when scrolling.
    Therefore, it is necessary to move the toolbar Jodit by this amount

```javascript
var editor = new Jodit('#editor', {
	offsetTopForAssix: 74
});
```

Without affix offset
![Without affix](http://xdsoft.net/jodit/stuf/joomla-exampla-affix-bad.jpg)
With affix offset
![Withou affix](http://xdsoft.net/jodit/stuf/joomla-exampla-affix-good.jpg)

### 2.5.55

Added `Embed video` button. Added `vimeo` or `youtube` video embeded code.

### 2.5.54

When you insert text into the editor from another site, all the images are from a remote site. Before Jodit, it was
quite uncomfortable: first I had to download the image from a remote resource, and then upload it to your site, then
replace the image in the editor. In 2.5.54 it can be done in 3 clicks

![Upload remote image](http://xdsoft.net/jodit/stuf/upload-remote-image.jpg)

> `Note`. Need update [PHP Connector](https://github.com/xdan/jodit-connectors)

### 2.5.53

Added [Jodit.focus](http://xdsoft.net/jodit/doc/module-Jodit.html#.focus) method

```javascript
var editor = new Jodit('.redactor');
editor.focus();
```

### 2.5.52

Added `OK` button in Alert dialog

#### More About dialogs

#### Alert

```javascript
Jodit.Alert('File was uploaded');
Jodit.Alert('File was uploaded', 'Message');
Jodit.Alert('File was uploaded', function () {
	$('form').hide();
});
Jodit.Alert("File wasn't uploaded", 'Error', function () {
	$('form').hide();
});
```

#### Promt

![Promt dialog](http://xdsoft.net/jodit/stuf/promt.jpg)

```javascript
Jodit.Promt('Enter your name', function (name) {
	if (name.length < 3) {
		Jodit.Alert('The name must be at least 3 letters');
		return false;
	}
	// do something
});
Jodit.Promt('Enter your name', 'Promt Dialog', function (name) {
	if (name.length < 3) {
		Jodit.Alert('The name must be at least 3 letters');
		return false;
	}
	// do something
});
```

#### Confirm

![Confirm dialog](http://xdsoft.net/jodit/stuf/confirm.jpg)

```javascript
Jodit.Confirm('Are you sure?', function (yes) {
	if (yes) {
		// do something
	}
});
```

### 2.5.49

First step for Mobile-friendly [sizeLG,sizeMD,sizeSM](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#sizeLG) and
sets of buttons for different sizes editors.

> `Note`. this is not the width of the device, the width of the editor

-   buttons The list of buttons that appear in the editor's toolbar on large places (≥ options.sizeLG).
-   buttonsMD The list of buttons that appear in the editor's toolbar on medium places (≥ options.sizeMD).
-   buttonsSM The list of buttons that appear in the editor's toolbar on small places (≥ options.sizeSM).
-   buttonsXS The list of buttons that appear in the editor's toolbar on tiny places (< options.sizeSM).

```javascript
var editor = new Jodit('#some-editor', {
	sizeLG: 900,
	sizeMD: 700,
	sizeSM: 400,

	buttons: [
		'source',
		'|',
		'bold',
		'italic',
		'|',
		'ul',
		'ol',
		'|',
		'font',
		'fontsize',
		'brush',
		'paragraph',
		'|',
		'image',
		'table',
		'link',
		'|',
		'left',
		'center',
		'right',
		'justify',
		'|',
		'undo',
		'redo',
		'|',
		'hr',
		'eraser',
		'fullsize',
		'about'
	],
	buttonsMD: [
		'source',
		'|',
		'bold',
		'italic',
		'|',
		'ul',
		'ol',
		'|',
		'font',
		'fontsize',
		'brush',
		'paragraph',
		'|',
		'image',
		'table',
		'link',
		'|',
		'left',
		'center',
		'right',
		'justify',
		'|',
		'undo',
		'redo',
		'|',
		'hr',
		'eraser',
		'fullsize'
	],
	buttonsSM: [
		'bold',
		'italic',
		'|',
		'ul',
		'ol',
		'|',
		'fontsize',
		'brush',
		'paragraph',
		'|',
		'image',
		'table',
		'link',
		'|',
		'left',
		'center',
		'right',
		'|',
		'undo',
		'redo',
		'|',
		'eraser',
		'fullsize'
	],
	buttonsXS: [
		'bold',
		'image',
		'|',
		'brush',
		'paragraph',
		'|',
		'left',
		'center',
		'right',
		'|',
		'undo',
		'redo',
		'|',
		'eraser'
	]
});
```

### 2.5.46

-   More comfortable colorpicker

![More comfortable colorpicker](http://xdsoft.net/jodit/stuf/colorpicker.jpg)

-   Added [Helper.normalizeColor](http://xdsoft.net/jodit/doc/module-Helper.html#~normalizeColor)
-   Fixed [Helper.colorToHex](http://xdsoft.net/jodit/doc/module-Helper.html#~colorToHex) now for transparent color it
    will return NaN

### 2.5.45

-   Fixed bug in Image Resizer when border was less than Image
-   Rename Selection.setCursorTo to Selection.moveCursorTo
-   Fixed style for Dialog resizer

### 2.5.42

Fix a few bugs in [JJE](http://xdsoft.net/jodit/#extesions)

### 2.5.40

-   In [Helper](http://xdsoft.net/jodit/doc/module-Helper.html) module added [isHTML] method. Used plugin `insertHTML`
-   Added simple plugin `insertHTML` and him option `askBeforePasteHTML` - Ask before paste HTML in WYSIWYG mode. Try
    insert in WYSIWYG mode some HTML source

```javascript
(function ($) {
	'use strict';
	Jodit.defaultOptions = $.extend(true, Jodit.defaultOptions, {
		/**
		 * @property {boolean} askBeforePasteHTML=true Ask before paste HTML in WYSIWYG mode
		 */
		askBeforePasteHTML: true
	});

	/**
	 * Ask before paste HTML source
	 */
	Jodit.plugins.insertHTML = function (parent) {
		if (parent.options.askBeforePasteHTML) {
			parent.events.on('beforePaste', function (event) {
				if (
					event &&
					event.clipboardData &&
					event.clipboardData.getData &&
					event.clipboardData.types[0] === 'text/plain'
				) {
					var html = event.clipboardData.getData('text/plain');
					if (parent.helper.isHTML(html)) {
						Jodit.Confirm(
							'Your code is similar to HTML. Paste as HTML?',
							'Paste as HTML',
							function (agree) {
								if (agree) {
									parent.s.insertHTML(html);
								} else {
									parent.s.insertHTML(
										parent.helper.htmlspecialchars(html)
									);
								}
								parent.syncCode(true);
							}
						);
						return false;
					}
				}
			});
		}
	};
})(Jodit.modules.Dom);
```

### 2.5.39

Fix [#issue 11](https://github.com/xdan/jodit/issues/11) in `file:` mode CDN CodeMirror not working

### 2.5.38

-   Added `Filter` in FileBrowser
-   Added `SortBy` in FileBrowser

### 2.5.37

-   Fixed bug in [`Beautifier`](http://xdsoft.net/jodit/doc/module-Beautifier.html) plugin. When in `source` mode, start
    comment enter `<!--` Browser stops responding.
-   Added `tiles` and `list` switcher in filebrowser

### 2.5.36

-   In PHP FileBrowser connector added MaxFileSize option
-   Fixed popap error in filebrowser

### 2.5.30

Fix Splitmode autohaight
![Autoheight in Split mode Jodit](http://xdsoft.net/jodit/stuf/split-mode.jpg)
Fix syncronize code in TableProcessor module

### 2.5.28

Fix bug in Dialog.Confirm

```javascript
Jodit.Confirm('Are you sure?', 'Confirm', function (success) {
	if (success) {
		alert('Agree');
	}
});
```

### 2.5.27

-   Fixed IE11's
    bug [http://xdsoft.net/jodit/doc/module-Jodit.html#comment-2866837441](http://xdsoft.net/jodit/doc/module-Jodit.html#comment-2866837441)
-   Added [textIcons](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#texticons) options - Use text instead of
    icons. In IE9 it is default - true [Example](http://xdsoft.net/jodit/#example-text-icons)

```javascript
var editor = new Jodit('#example2_0', {
	textIcons: true,
	removeButtons: [
		'hr',
		'ol',
		'about',
		'italic',
		'format',
		'fullsize',
		'justify'
	]
});
```

![Text icons](http://xdsoft.net/jodit/stuf/texticons.jpg)
![Text icons in filebrowser](http://xdsoft.net/jodit/stuf/texticons-filebrowser.jpg)

### 2.5.26

Dom Module is now compatible with jQuery objects

```javascript
var a = jQuery("<a href="
#link
">Link</a>"
)
;
jodit.modules.Dom('.selector').append(a);
jodit.modules.Dom(jQuery("#someid")).val();
jodit.modules.Dom("#someid").val();
```

But you must remember that Jodit.modules.Dom! = JQuery

### 2.5.23

-   Added `expand button` In filebrowser
-   Added [fullsize](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#dialog)
    and [fullsizeButton](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#dialog) options

### 2.5.20

-   Fix [Dom.prev](http://xdsoft.net/jodit/doc/module-Dom.html#prev) method
-   Added navigation and select in preview
    ![Navigation and select buttons](http://xdsoft.net/jodit/stuf/preview_navigation.jpg)
-   Added [showSelectButtonInPreview](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#filebrowser)
    and [showPreviewNavigation](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#filebrowser)

### 2.5.19

Added [cleanHTML.allowTags](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#cleanhtml) option.

```javascript
var editor = Jodit('#editor', {
	allowTags: 'p,a[href],table,tr,td, img[src=1.png]' // allow only <p>,<a>,<table>,<tr>,<td>,<img> tags and for <a> allow only `href` attribute and <img> allow only `src` atrribute == '1.png'
});
editor.val(
	'Sorry! <strong>Goodby</strong> <span>mr.</span> <a style="color:red" href="http://xsoft.net">Freeman</a>'
);
console.log(editor.val()); //Sorry! <a href="http://xsoft.net">Freeman</a>
```

Or you can use PlainObject. This code equivalent to the top

```javascript
var editor = Jodit('#editor', {
	allowTags: {
		p: true,
		a: {
			href: true
		},
		table: true,
		tr: true,
		td: true,
		img: {
			src: '1.png'
		}
	}
});
```

### 2.5.18

Fixed bug in Image plugin

### 2.5.17

Fixed bug in JJE

### 2.5.16

-   Fixed a few styles

### 2.5.15

-   Fixed `package.json`

### 2.5.13

-   Added in FileBrowser [sort](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#filebrowser) options
-   Jodit.Promt and Jodit.Alert by default set focus to OK button

```javascript
Jodit.Promt('Enter your name', function (name) {
	if (!name.length) {
		Jodit.Alert('You need enter 3 chars');
		return false;
	}
	//... some logic
});
```

-   Fix `$config` bug in [JJE](http://xdsoft.net/jodit/release/joomla.zip)
-   Added a few options in JJE plugin

### 2.5.12

Added edit button in Image Properties Dialog
![Edit button](http://xdsoft.net/jodit/stuf/editbutton.jpg)

### 2.5.11

-   Added file info in filebrowser
    ![Filebrowser file info](http://xdsoft.net/jodit/stuf/filebrowsernames.jpg)
-   Added [showFileName,showFileSize,showFileChangeTime](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#filebrowser)

### 2.5.1

-   Dom module was rewritten and was fixed afew bugs
-   In [OEM and Pro](http://xdsoft.net/jodit/#download)
    added [Image Editor module](http://xdsoft.net/jodit/doc/module-ImageEditor.html) resize and crop image. You can
    try [here](http://xdsoft.net/jodit/)
    ![Crop Image](http://xdsoft.net/jodit/stuf/crop.jpg)
    ![Resize Image](http://xdsoft.net/jodit/stuf/resize.jpg)

### 2.4.22

-   Added contextmenu module.
-   Added context menu in FileBrowser
-   Added preview in FilwBrowser

### 2.4.21

-   Fixed TableProcessor's bugs. In a situation did not appear resizer cells and the resizer throughout the table.

### 2.4.20

-   Fixed z-index Popap
-   Fixed behavior of selection table cells

### 2.4.17

Fixed copy-paste html behavior

### 2.4.16

Fixed bug on after type `Enter`

### 2.4.15

Fixed bug with insert `OL` tag and Fixed Dom module work with Text node

### 2.4.12

Added [toolbarButtonSize](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#toolbarbuttonsize) Size of icons in the
toolbar (can be "small", "middle", "large")

```javascript
var editor = new Jodit('#editor', {
	toolbarButtonSize: 'small'
});
```

### 2.4.10

-   Added [node.create](http://xdsoft.net/jodit/doc/module-Node.html#create) method

```javascript
var editor = new Jodit('.jodit'),
	node = editor.node.create('text', 'Hellow world');
editor.s.insertNode(node);
```

-   Added [link](http://xdsoft.net/jodit/doc/module-link.html) plugin. And its options
    -   [processPastedLink](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#link) Wrap inserted link
        in `<a href="link">link</a>`
    -   [openLinkDialogAfterPost](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#link) Open Link dialog after post
    -   [removeLinkAfterFormat](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#link) When the button is pressed to
        clean format, if it was done on the link is removed like command `unlink`
-   Replace format icon

### 2.4.8

Fixed Base icons [issue](https://gist.github.com/leonderijke/c5cf7c5b2e424c0061d2)

### 2.4.6

Fast Fixed in JJE Fixed a lot of bugs in Jodit

### 2.4.1

-   Fixed a lot of bugs in Dom module
-   Fixed a lot of bugs in TableProcessor module
-   Replace PNG icon on SVG sprite
-   Added new module Icons
-   Added theme `Dark`
-   Fixed bug Popap's module
-   Divide one less file by modules

### 2.3.59

-   Added [Cookie](http://xdsoft.net/jodit/doc/module-Cookie.html) module
-   Added [saveModeInCookie](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#savemodeincookie) if it is true that
    the current mode is saved in a cookie , and is restored after a reload of the page
-   In Joomla Jodit Editor(JJE) added corresponding option
    saveModeInCookie [Download Jodit Joomla editor](http://xdsoft.net/jodit/release/joomla.zip)

### 2.3.57

-   Fixed issue with `input[type=checkbox]` and [Dom.attr](http://xdsoft.net/jodit/doc/module-Dom.html#attr) method
-   Release Joomla Jodit Editor (JJE) [Download JJE](http://xdsoft.net/jodit/release/joomla.zip)

### 2.3.53

-   Added option [cleanHTML.cleanOnPaste](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#cleanhtml) The
    plugin [cleanHTML](http://xdsoft.net/jodit/doc/module-cleanHTML.html) automatically cleans up content from Microsoft
    Word and other HTML sources to ensure clean, compliant content that matches the look and feel of the site.
-   Added [beforePaste](http://xdsoft.net/jodit/doc/module-Jodit.html#~event:beforePaste),[processPaste](http://xdsoft.net/jodit/doc/module-Jodit.html#~event:processPaste),[afterPaste](http://xdsoft.net/jodit/doc/module-Jodit.html#~event:afterPaste)
    events

### 2.3.49

Added [iframeBaseUrl](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#iframebaseurl) option - Base URL where the
root directory for [iframe](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#iframe) mode

### 2.3.48

Added [spellcheck](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#spellcheck) option specifies whether the editor
is to have its spelling and grammar checked or not

### 2.3.47

Added [removeEmptyBlocks](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#removeemptyblocks) option - Remove empty
blocks

```javascript
var editor = new Jodit('#editor', {
	removeEmptyBlocks: false
});
editor.val(' '); // add space in editor
console.log(editor.val()); //<p>&nbsp;</p>

editor.options.removeEmptyBlocks = true;
editor.val(' ');
console.log(editor.val()); //''
```

### 2.3.46

-   Fixed critical bug in Safari (window.performance)
-   Fixed bug when editor can get selection from another place

### 2.3.44

Added [direction](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#direction) option. The writing direction of the
language which is used to create editor content. Allowed values are:

-   '' (an empty string) – Indicates that content direction will be the same as either the editor UI direction or the page
    element direction.
-   'ltr' – Indicates a Left-To-Right text direction (like in English).
-   'rtl' – Indicates a Right-To-Left text direction (like in Arabic).

### 2.3.43

Fixed styles bugs

### 2.3.41

When [filebrowser.showFoldersPanel](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#filebrowser) === false show 4
colums in filelist

### 2.3.40

-   Added [filebrowser.moveFolder](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#filebrowser) option. Allow/deny
    move folder
-   Added [filebrowser.moveFile](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#filebrowser) option. Allow/deny
    move file
-   Added [filebrowser.showFoldersPanel](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#filebrowser) option.
    Hide/show folders panel in filebrowser

### 2.3.39

Fixed [Filebrowser](http://xdsoft.net/jodit/doc/module-Filebrowser.html) uploader's options bug. Previously , you had to
either use a general [Uploader](http://xdsoft.net/jodit/doc/module-Uploader.html) module settings , or override them
completely

```javascript
var editor = new Jodit('.redactor', {
	filebrowser: {
		uploader: null
	},
	uploader: {
		url: 'uploader.php',
		format: 'json'
	}
});

// or
var editor = new Jodit('.redactor', {
	filebrowser: {
		uploader: {
			url: 'uploader.php',
			format: 'json',
			filesVariableName: 'fils'
			//... all options from [uploader](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#uploader)
		}
	}
});
```

Now you can just override some of your settings

```javascript
var editor = new Jodit('.redactor', {
	filebrowser: {
		uploader: {
			url: 'uploader2.php'
		}
	},
	uploader: {
		url: 'uploader.php'
	}
});
```

### 2.3.38

-   Fixed i18n bug
-   [useSplitMode](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#usesplitmode) set default false
-   Fixed toolbar width after fullsize mode
-   Fixed [#issue5](https://github.com/xdan/jodit/issues/5)

### 2.3.37

Fast fix

### 2.3.36

-   Added plugin `Fullsize`. Now you can change fullsize mode

```javascript
var editor = new Jodit();
editor.events.fire('toggleFullsize');
editor.events.fire('toggleFullsize', [true]); // fullsize
editor.events.fire('toggleFullsize', [false]); // usual mode
```

-   Added [globalFullsize](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#globalFullsize) (default `true`) if true,
    after `fullsize` - all parents element get `jodit_fullsize_box` class (z-index: 100000 !important;)
-   Fixed focus bug

### 2.3.35

-   Fixed placeholder style
-   Fixed [Dom.css](http://xdsoft.net/jodit/doc/module-Dom.html#~css) then

```html
<div class="idclass" style="margin-top:20px;"></div>
```

```javascript
Jodit.modules.Dom('.idclass').css('margin-top'); //has returned string `20px`
Jodit.modules.Dom('.idclass').css('margin-top'); //now it returns int `20`
```

### 2.3.33

-   Fixed placeholder style. Placeholder placed in a separate
    module [Placeholder](http://xdsoft.net/jodit/doc/module-Placeholder.html)
-   Added [showPlaceholder](http://xdsoft.net/jodit/doc/module-Placeholder.html#showplaceholder) option
-   Added [useInputsPlaceholder](http://xdsoft.net/jodit/doc/module-Placeholder.html#useinputsplaceholder) option
-   Added [placeholder](http://xdsoft.net/jodit/doc/module-Placeholder.html#placeholder) option

### 2.3.32

Added [uploader.data](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#uploader) option. Data to be sent to the
server like POST parameters

### 2.3.31

Added [editorCssClass](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#editorcssclass) option - Class name that
can be appended to the editor Fixed internacionalization

### 2.3.30

Added [triggerChangeEvent](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#triggerchangeevent) option Fixed
uploader's options - When the uploader is not configured, the editor still displays images upload button

### 2.3.29

Add [Dom.defaultAjaxOptions.async](http://xdsoft.net/jodit/doc/module-Dom.html#.__.defaultAjaxOptions) By default, all
requests are sent asynchronously (i.e. this is set to true by default). If you need synchronous requests, set this
option to false

### 2.3.28

Added `headers` option in {@link module:FileBrowser|FileBrowser} and {@link module:Uploader|Uploader}. But primarily in
{@link module:Dom|Dom}

```javascript
var token = document
		.querySelector('meta[name="csrf-token"]')
		.getAttribute('content'),
	editor = new Jodit('#redactor', {
		uploader: {
			url: '../connector/index.php?action=upload',
			headers: {
				'X-CSRF-Token': token
			}
		},
		filebrowser: {
			ajax: {
				url: '../connector/index.php',
				headers: {
					'X-CSRF-Token': token
				}
			}
		}
	});
// or replace global options
Jodit.modules.Dom.defaultAjaxOptions.headers = {
	headers: {
		'X-CSRF-Token': token
	}
};
```

```javascript
Jodit.modules.Dom.ajax({
	url: 'data.json',
	headers: {
		'Accept-Language': 'en-US,en;q=0.8,ru;q=0.6,de;q=0.4,ja;q=0.2'
	},
	success: function (resp) {
		console.log(resp);
	}
});
```

### 2.3.27

Fixed [#issues1](https://github.com/xdan/jodit/issues/1)

### 2.3.24

Fixed dialog's module when was opened Promt window, after Enter submit the form and the page reloaded. Fixed connector's
bugs Update [Jodit.i18n](http://xdsoft.net/jodit/doc/module-Jodit.html#.i18n) method. Now it can be used staticly

```javascript
var editor = new Jodit('#redactor', {
	langusage: 'ru'
});
console.log(editor.i18n('Cancel')); //Отмена;

Jodit.defaultOptions.language = 'ru';
console.log(Jodit.prototype.i18n('Cancel')); //Отмена

Jodit.lang.cs = {
	Cancel: 'Zrušit'
};
Jodit.defaultOptions.language = 'cs';
console.log(Jodit.prototype.i18n('Cancel')); //Zrušit

Jodit.lang.cs = {
	'Hello world': 'Hello 1$ Good 2$'
};
Jodit.defaultOptions.language = 'cs';
console.log(Jodit.prototype.i18n('Hello world', 'mr.Perkins', 'day')); //Hello mr.Perkins Good day
```

Fixed [Jodit.destroy](http://xdsoft.net/jodit/doc/module-Jodit.html#.destroy) method

```javascript
var editor = new Jodit('.jodit');
editor.destroy();
```

### 2.3.22

Fixed bug when Dialog module was used without Jodit context

```javascript
Jodit.Alert('Hello world!!!');
```

### 2.3.20

Fixed dialog's module zIndex manage. Fixed [Dom.css](http://xdsoft.net/jodit/doc/module-Dom.html#~css) method bug. That
example has not worked.

```javascript
Jodit.modules.Dom('.someelement').css('z-index', 1000);
```

### 2.3.19

Fixed bug in Uploader module when `http://sitename.net/jodit///files/fg.jpg` was
replaced `http:/sitename.net/jodit/files/fg.jpg`

### 2.3.18

Added `afterInsertImage` event - triggered after image was
inserted [selection.insertImage](http://xdsoft.net/jodit/doc/module-Selection.html#-insertImage__anchor). This method
can execute from [Filebrowser](http://xdsoft.net/jodit/doc/module-Filebrowser.html)
or [Uploader](http://xdsoft.net/jodit/doc/module-Uploader.html)

```javascript
var editor = new Jodit('#redactor');
editor.events.on('afterInsertImage', function (image) {
	image.className = 'bloghead4';
});
```

### 2.3.15

Fixed bug with inserting table

### 2.3.14

Work with table became faster

### 2.3.12

-   Fixed filbrowser bug. When a new file is uploaded file list has not been updated
-   Added [dialog.zIndex](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#.dialog) option

### 2.3.11

Fixed toolbar width fot fullsize mode

### 2.3.10

-   Fixed CodeMirror bug on download XML parser
-   Fixed CodeMirror bug endless cycle
-   Fixed overflow behavior in fullsize mode

### 2.3.8

Fixed connector problem and Fixed item's style in filebrowser

### 2.3.3

Switched on FontAwesome icons

### 2.3.0

Added copy-paste image file for FireFox

### 2.2.6

Fixed copy-paste for FireFox

### 2.2.5

Added copy-paste support by clipboard image. [Try](http://xdsoft.net/jodit) paste print screen.

### 2.2.4

Added the ability in the file browser to obtain data about the file not as a string and as an object with parameters
{file: 'name.jpg', thumb: '\_thumbs/name.jpg'}

### 2.2.3

Fixed conflict between textProcessor and Beatyfier plugins

### 2.2.2

Fixed BACKSPACE entering behavior. And Fixed ie10 support

### 2.2.0

Added [iframe](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#.iframe)
, [iframeStyle](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#.iframeStyle)
, [iframeIncludeJoditStyle](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#.iframeIncludeJoditStyle)
, [iframeCSSLinks](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#.iframeCSSLinks)
, [width](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#.width)
, [height](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#.height)
, [minHeight](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#.minHeight).
`iframe` by default false. When this option is enabled, the editor's content will be placed in an iframe and isolated
from the rest of the page.
`width` and `height` you can set size fot editor

### 2.1.0

Added internationalization. Read more http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#.language

### 2.0.9

Added Split mode. Added [useSplitMode](http://xdsoft.net/jodit/doc/Jodit.defaultOptions.html#.useSplitMode) options (
default true) Example [here](http://xdsoft.net/jodit/#splitmode)

### 2.0.8

Fixed dialog bug

### 2.0.4

Added CodeMirror plugin. Enable by default {@link defaultOptions~codeMirror.|options.codeMirror}

### 2.0.0

We got rid of jQuery

### 1.2.1

Fixed bug in filebrowser

### 1.2.0

Fixed bug when [selection.insertHTML](http://xdsoft.net/jodit/doc/module-Selection.html#-inner-insertHTML__anchor)
doesn't work without focus

### 1.1.0

Fixed bug with uploader and filebrowser

### 1.0.6

If source `textarea` has `placeholder` attribute then Jodit use it how placeholder

### 1.0.4

Added About button

### 1.0.1

First release
