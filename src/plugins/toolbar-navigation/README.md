---
title: Toolbar navigation plugin
description: Keyboard access to the Jodit toolbar — Alt+F10 to reach it, the arrow keys to walk the buttons, Escape to go back to the editor.
keywords: jodit, toolbar, keyboard, accessibility, a11y, wai-aria, alt+f10
---

# Toolbar navigation

Makes the toolbar reachable from the keyboard, following the
[WAI-ARIA authoring practices](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) for a
`role="toolbar"` widget.

| Key                          | Action                                                           |
| ---------------------------- | ---------------------------------------------------------------- |
| `Alt+F10`                    | Move the focus from the editable area to the toolbar             |
| `Arrow Right` / `Arrow Left` | Move between the buttons, wrapping at the ends (reversed in RTL) |
| `Home` / `End`               | Jump to the first / last button                                  |
| `Enter` / `Space`            | Activate the focused button                                      |
| `Escape`                     | Give the focus back to the editor                                |

On a button with a dropdown (a list or a popup):

| Key                          | Action                                                           |
| ---------------------------- | ---------------------------------------------------------------- |
| `Arrow Down`                 | Open the dropdown and focus its first item                       |
| `Arrow Down` / `Arrow Up`    | Move between the items                                           |
| `Arrow Up` on the first item | Close the dropdown and go back to the button                     |
| `Escape`                     | Close the dropdown and go back to the button                     |

Disabled buttons are skipped. The focus is moved programmatically, so this works regardless of
[[Config.allowTabNavigation]] — that option only controls whether the buttons also take part in
the `Tab` order of the page (it is `false` by default).

## Configuration

Reaching the toolbar is a regular editor command, so remap it like any other one:

```js
const editor = Jodit.make('#editor', {
	commandToHotkeys: {
		focusToolbar: 'alt+0'
	}
});
```

It can be called directly as well:

```js
editor.execCommand('focusToolbar');
```

To switch the whole thing off:

```js
const editor = Jodit.make('#editor', {
	disablePlugins: ['toolbarNavigation']
});
```

The arrow keys, `Home` and `End` are not remappable: they are what `role="toolbar"` means to a
screen reader user.
