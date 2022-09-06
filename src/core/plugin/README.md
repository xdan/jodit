# Jodit plugin system

Jodit plugins are designed to extend the basic functionality of the editor.
There are built-in plugins, without which the editor will not work correctly. There are plugins that add completely new functionality.
You can write your own plugin that will either change the current behavior of the editor or add a new function.

Plugins can be both simple functions and complex classes.

In the simplest case, it's just a function that receives a Jodit instance as input.

```js
Jodit.plugins.add('alertMyId', function (jodit) {
	alert(jodit.id);
});
```

The moment you create an instance of Jodit, all plugins are initialized.

```js
const editor = Jodit.make('#editorId'); // alert('editorId')
```

This is usually not what you expect. You probably want the plugin to take action on certain events.
The [EventEmiter](https://github.com/xdan/jodit/blob/master/src/types/events.d.ts#L9) editor will help you with this.

```js
Jodit.plugins.add('keyLogger', function (jodit) {
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

	requires = ['enter', 'drag-and-drop'];

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

Jodit.plugins.add('resizeEditor', resizeEditor);
```

### hasStyle

-   Type: boolean
-   Default: false

Jodit will try to load the styles along the same path as the plugin is loaded.

### buttons

-   Type: Array<IPluginButton>
-   Default: `[]`

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
Those. if the plugin is connected, the button will appear in the list, if not connected, it will disappear.

```js
Jodit.defaultOptions.controls.insertTime = {
	icon: require('./icon.svg'),
	tooltip: 'Insert Time',
	exec: (editor: IJodit) => {
		editor.s.insertHTML(new Date().toTimeString());
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

### requires

-   Type: Array<string>
-   Default: []

If your plugin depends on other plugins, then it must be initialized after them.

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
