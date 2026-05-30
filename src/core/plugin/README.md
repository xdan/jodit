# Plugin System

Jodit plugins are designed to extend the basic functionality of the editor.
There are built-in plugins, without which the editor will not work correctly. There are plugins that add completely new functionality.
You can write your own plugin that will either change the current behavior of the editor or add a new function.

Plugins can be both simple functions and complex classes.

In the simplest case, it's just a function that receives a Jodit instance as input.

```js
Jodit.plugins.add('alertMyId', jodit => {
	alert(jodit.id);
});
```

The moment you create an instance of Jodit, all plugins are initialized.

```js
const editor = Jodit.make('#editorId'); // alert('editorId')
```

This is usually not what you expect. You probably want the plugin to take action on certain events.
The [EventEmiter](https://xdsoft.net/jodit/docs/classes/event_emitter.EventEmitter.html#root) editor will help you with this.

```js
Jodit.plugins.add('keyLogger', jodit => {
	jodit.events.on('keydown', e => {
		sendAnalytics('keydown', e.key);
	});
});
```

As mentioned above, plugins can be more complex than just a function. A plugin can be a class:

```js
class resizeEditor {
  hasStyle = true;

  buttons = [
    {
      name: 'custom',
      group: 'other'
    }
  ];

  static requires = ['enter', 'drag-and-drop'];

  init(jodit: IJodit): void {
    jodit.events.on('afterInit', () => {
      Jodit.ns.Helpers.css(jodit.editor, {
        width: 400
      });
    });
  }

  destruct() {
    Jodit.ns.Helpers.css(this.jodit.editor, {
      width: null
    });
  }
}

Jodit.plugins.add('resizeEditor', resizeEditor); // Constructor, not instance
```

### hasStyle

- Type: boolean
- Default: false

Jodit will try to load the styles along the same path as the plugin is loaded.

### buttons

- Type: Array<IPluginButton>
- Default: `[]`

```typescript
export interface IPluginButton {
	name: string;
	group?: ButtonGroup;
	position?: number;
	options?: IControlType;
}

export type ButtonGroup =
	| string
	| 'source'
	| 'font-style'
	| 'script'
	| 'list'
	| 'indent'
	| 'font'
	| 'color'
	| 'media'
	| 'state'
	| 'clipboard'
	| 'insert'
	| 'history'
	| 'search'
	| 'other'
	| 'info';
```

Buttons to be automatically added to the editor's button groups.
Those. If the plugin is connected, the button will appear in the list, if not connected, it will disappear.

```js
Jodit.defaultOptions.controls.insertTime = {
  icon: require('./icon.svg'),
  tooltip: 'Insert Time',
  exec: (editor: IJodit) => {
    editor.s.insertHTML(new Date().toTimeString());
    editor.synchronizeValues(); // For history module we need to synchronize values between textarea and editor
  }
};

class insertTimePlugin {
  buttons = [
    {
      name: 'insertTime',
      group: 'insert'
    }
  ];
}

Jodit.plugins.add('insertTimePlugin', insertTimePlugin);
```

In the `exec` method we insert the current time into the editor.
At the same time, if we disable the plugin, the button will disappear from the list.

Note that after insertion we call the `synchronizeValues` method, which synchronizes the values between the textarea and the editor.

This is necessary for the history module to work correctly, since the editor does not use [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to track changes internally.

> We may move to [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) in the future, but until that happens, you need to call `synchronizeValues` yourself after inserting content to the editor.

### static requires

- Type: Array<string>
- Default: []

If your plugin depends on other plugins, then it must be initialized after them.

## Loading external plugins: `extraPlugins` and `basePath`

There are two ways a plugin ends up available in an editor instance:

1. **Statically registered** — the plugin's module was imported somewhere in your
   bundle, so it called `Jodit.plugins.add('name', ...)` at import time. From then
   on it lives in the global plugin registry and every editor instance can use it.
2. **Dynamically loaded** via the [`extraPlugins`](https://xdsoft.net/jodit/docs/) option —
   Jodit fetches the plugin file over the network when the editor initializes.

### How `extraPlugins` resolves a URL

For each name listed in `extraPlugins`, Jodit first checks the registry. If the
plugin is **already registered, it is skipped** — no network request is made. Only
names that are *not* registered are downloaded, from:

```text
<basePath>plugins/<name>/<name>(.min).js
```

So `extraPlugins: ['emoji']` tries to load `<basePath>plugins/emoji/emoji.js`
(`.min.js` when [`minified`](https://xdsoft.net/jodit/docs/) is on).

```js
Jodit.make('#editor', {
	buttons: ['emoji'],
	extraPlugins: ['emoji'] // fetched from <basePath>plugins/emoji/emoji.js
});
```

You can also bypass the path convention with an explicit URL:

```js
Jodit.make('#editor', {
	extraPlugins: [{ name: 'emoji', url: 'https://cdn.example.com/emoji.js' }]
});
```

### `basePath` and the bundler gotcha

When `basePath` is not set, Jodit auto-detects it from `document.currentScript`,
then the last `<script src>` on the page, then `location.href`. This works for
classic `<script>` includes from a CDN or `/dist` folder.

It **breaks under ESM bundlers and dev servers** (Vite, Webpack dev, etc.): there
is no classic `<script>` tag for your application bundle, so the detection falls
back to your entry module URL. The result is a malformed request such as:

```text
http://localhost:5173/src/main.tsx?t=1771195693825plugins/emoji/emoji.js
```

Set `basePath` explicitly to fix it. Copy the plugin files you need from the
package (they ship under `node_modules/jodit/esm/plugins/<name>/`, or
`node_modules/jodit-pro/esm/plugins/<name>/` for PRO) to a publicly served folder,
then point Jodit at it (mind the trailing slash):

```js
Jodit.make('#editor', {
	basePath: 'https://your-site.com/jodit-assets/',
	buttons: ['emoji'],
	extraPlugins: ['emoji']
	// → loads https://your-site.com/jodit-assets/plugins/emoji/emoji.js
});
```

### Prefer static registration in bundled apps

In a bundled app (including React via `jodit-react` / `jodit-pro-react`) the
cleanest approach is usually to avoid network loading altogether: import the
plugin so it self-registers, then just add its button — drop `extraPlugins`.

```js
import 'jodit/esm/plugins/emoji/emoji'; // registers the plugin

Jodit.make('#editor', {
	buttons: ['emoji'] // no extraPlugins needed
});
```

The `jodit-pro-react` wrapper already does this for **all** PRO plugins (it imports
`jodit-pro/esm/plugins/all.js`), so inside React you can use plugins like `emoji`
or `finder` directly via `buttons` without `extraPlugins` or `basePath`.

## Debug

Since version `3.12.4` you can disable all Jodit plugins during development and work only with your own plugin.
This will allow you to find out if it works correctly and if it breaks the behavior of the editor or if it is caused by other plugins.

```js
Jodit.make('#editor', {
	safeMode: true,
	safePluginsList: ['about'],
	extraPlugins: ['yourPluginDev']
});
```
