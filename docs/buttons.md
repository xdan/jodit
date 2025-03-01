# Buttons

Jodit implements a sophisticated customization system by allowing the addition of various buttons.
Most plugins add their own buttons to the editor’s toolbar.

---

## IControlType

To add a button, you don’t necessarily need to create your own plugin.
It is enough to add the button to the editor’s configuration.

```js
Jodit.make('#editor', {
	buttons: [
		{
			icon: 'source',
			exec: editor => {
				editor.toggleMode();
			}
		}
	]
});
```

> We implement the [IControlType](https://xdsoft.net/jodit/docs/interfaces/types.IControlType.html) interface.

We are using the pre-connected icon `source`.
For more information on how to include icons, please refer to the [Icons](https://xdsoft.net/jodit/docs/modules/icons.html) section.
You can also use a URL for the icon:

```js
Jodit.make('#editor', {
	buttons: [
		{
			name: 'button',
			iconURL: 'https://example.com/icon.png',
			popup: jodit => {
				const div = jodit.create.element('div');
				div.textContent = 'Hello world';
				return div;
			}
		}
	]
});
```

**Note:** In this example we call the [popup](https://xdsoft.net/jodit/docs/interfaces/types.IControlType.html#popup) handler rather than [exec](https://xdsoft.net/jodit/docs/interfaces/types.IControlType.html#exec). This means that clicking the button will display a popup window. You can add any content to this popup; everything returned by the `popup` function will be included in the window. Jodit also supports simple string values:

```js
Jodit.make('#editor', {
	buttons: [
		{
			name: 'button',
			iconURL: 'https://example.com/icon.png',
			popup: () => '<div>Hello world</div>'
		}
	]
});
```

The `popup` function may choose not to display a window if it returns `false`.

---

## Controls

Adding buttons directly into the settings can clutter your code. The recommended approach is to extend the `Jodit.defaultOptions.controls` object.

```js
Jodit.defaultOptions.controls.myBtn = {
	icon: 'source',
	exec: editor => {
		editor.toggleMode();
	}
};

Jodit.make('#editor', {
	buttons: ['myBtn']
});
```

---

## Lists

In addition to popups, buttons can also implement a more specific type of popup: lists.

### Basic List

```js
Jodit.make('#editor', {
	buttons: [
		{
			name: 'list',
			list: ['One', 'Two', 'Three'],
			exec: (editor, current, btn) => {
				const value = btn.control.args[0];
				editor.selection.insertHTML(value);
			}
		}
	]
});
```

When a list is used, the button will display a special arrow for expanding the list.

Note that if you click on the button itself, the configuration of the button (without any arguments) is passed to `exec`—
which may cause an error if not handled properly.

One solution is to set default arguments for the button:

### List with Default Arguments

```js
Jodit.make('#editor', {
	buttons: [
		{
			args: ['One'],
			name: 'button',
			list: ['One', 'Two', 'Three'],
			exec: (editor, current, btn) => {
				const value = btn.control.args[0];
				editor.selection.insertHTML(value);
			}
		}
	]
});
```

### Return False to Use Dropdown Behavior

Alternatively, you can return `false` so that clicking the button itself acts like clicking the dropdown arrow:

```js
Jodit.make('#editor', {
	buttons: [
		{
			name: 'button',
			list: ['One', 'Two', 'Three'],
			exec: (editor, current, btn) => {
				if (!btn.control.args.length) {
					return false;
				}
				const value = btn.control.args[0];
				editor.selection.insertHTML(value);
			}
		}
	]
});
```

### Storing Button State

This behavior can be used only on the first click and then store the state within the button.

```js
Jodit.make('#editor', {
	buttons: [
		{
			name: 'button',
			list: ['One', 'Two', 'Three'],
			exec: (editor, control, btn) => {
				const key = `button:${control.name}`;
				const value =
					(control.args && control.args[0]) ??
					Jodit.modules.Helpers.dataBind(editor, key);

				if (!value) {
					return false;
				}

				Jodit.modules.Helpers.dataBind(editor, key, value);
				editor.selection.insertHTML(value);
			}
		}
	]
});
```

### List as a Hash Table

You can also define a list as a hash table:

```js
Jodit.make('#editor', {
	buttons: [
		{
			name: 'button',
			list: {
				One: 'Insert "One"',
				Two: 'Insert "Two"',
				Three: 'Insert "Three"'
			},
			exec: (editor, current, btn) => {
				const value = btn.control.args[0];
				// The actual value can also be accessed as btn.control.args[1]
				editor.selection.insertHTML(value);
			}
		}
	]
});
```

---

## Customizing List Items

The appearance of list elements can be customized using the [childTemplate](https://xdsoft.net/jodit/docs/interfaces/types.IControlType.html#childtemplate) method.

```js
Jodit.make('#editor', {
	buttons: [
		{
			name: 'button',
			list: {
				class1: 'Apply "class1"',
				class2: 'Apply "class2"',
				class3: 'Apply "class3"'
			},
			exec: (editor, current, btn) => {
				const className = btn.control.args[0];
				editor.s.commitStyle({ attributes: { className: className } });
			},
			childTemplate: (editor, className, text) => {
				return `<span class="${className}">${text}</span>`;
			}
		}
	]
});
```

Such display settings can be used in any Jodit button.
For example, we will reduce the view of the list of the "Paragraph" button that allows you to use the H1 tag, etc. to the highlighted text:

```js
Jodit.make('#editor', {
  controls: {
    paragraph: {
      childTemplate: (editor, tag, text) => {
        return `<${tag} style="font-size: 12px">${text}</${tag}>`;
      }
    }
  }
});
```

---

## Button Lists

If an element in the list is already registered as a button, it will automatically be replaced by the button in the list. For example:

```js
Jodit.defaultOptions.controls.myBtn1 = {
	icon: 'source',
	exec: editor => {
		editor.toggleMode();
	}
};

Jodit.defaultOptions.controls.myBtn2 = {
	icon: 'brush',
	popup: editor => {
		const div = editor.create.element('div');
		const input = editor.create.element('input');
		input.type = 'color';
		input.value = '#ff0000';
		input.onblur = () => {
			editor.selection.applyStyle({ color: input.value });
		};
		div.appendChild(input);
		return div;
	}
};

Jodit.make('#editor', {
	buttons: [
		{
			name: 'list',
			list: ['myBtn1', 'myBtn2']
		}
	]
});
```

You can use any buttons defined in the `Jodit.defaultOptions.controls` list.

---

## Custom Button Template

When the provided display mechanisms aren’t sufficient, you can create a button with your own custom template:

```js
Jodit.make('#editor', {
	buttons: [
		{
			name: 'button',
			template: (editor, key, value) => {
				return `<div>${key}</div>`;
			},
			list: ['One', 'Two', 'Three']
		}
	]
});
```

## Interactivity

### isDisabled

For buttons in the editor, it is important to determine whether they are available or not.
For example, the "Cut" button should only be available if there is selected text.
For this purpose, the [IControlType](https://xdsoft.net/jodit/docs/interfaces/types.IControlType.html) interface includes the [isDisabled](https://xdsoft.net/jodit/docs/interfaces/types.IControlType.html#isdisabled) method.

```js
Jodit.make('#editor', {
    buttons: [
        {
            name: 'button',
            icon: 'cut',
            isDisabled: (editor, control) => {
                return editor.selection.isCollapsed();
            },
            exec: editor => {
                editor.execCommand('cut');
            }
        }
    ]
});
```

### isActive

There is also the `isActive` method, which can be used to signal to the user that the button might be responsible for the element under the cursor:

```js
Jodit.make('#editor', {
    buttons: [
        {
            icon: 'link',
            isActive: (editor, control) => {
                const current = editor.selection.current();
                return Jodit.modules.Dom.closest(current, 'a', editor.editor);
            },
            exec: editor => {
                editor.execCommand('unlink');
            }
        }
    ]
});
```

### isVisible

You can even remove the button from the toolbar entirely if it is not needed at the moment:

```js
Jodit.make('#editor', {
    buttons: [
        {
            icon: 'link',
            isVisible: (editor, control) => {
                return editor.selection.isCollapsed();
            },
            exec: editor => {
                editor.execCommand('unlink');
            }
        }
    ]
});
```
