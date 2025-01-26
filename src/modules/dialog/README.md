# Dialog system

The Jodit dialog system enables the creation of modals with a title, footer, and content.
Each dialog is created as a distinct component that inherits from [[View]].

Several basic wrappers are readily available to swiftly create fundamental windows: [[Dialog system.Alert | Alert]]/[[Dialog system.Confirm | Confirm]]/[[Dialog system.Prompt | Prompt]]

```js
Jodit.Alert('Hello world!', () => {
	// After OK
});
Jodit.Confirm('Are you sure?', 'Confirm Dialog', yes => {
	if (yes) {
		// do something
	}
});
Jodit.Prompt('Enter your name', 'Prompt Dialog', name => {
	if (name.length < 3) {
		Jodit.Alert('The name must be at least 3 letters');
		return false;
	}
	// do something
});
```

Each of these wrappers returns an [[IDialog]] object, and you can expand the open window.

```js
const dialog = Jodit.Alert('Hello world!', () => {
	// After OK
});
dialog.setContent('Buy buy world! =)');
```

> Note that you do not need to call the [[Dialog.open]] method.

For a simpler setup, you can immediately create an instance [[Dialog]] and already fully manage its contents:

```js
const dialog = new Jodit.modules.Dialog();
dialog.setHeader('The header!');
dialog.setContent('Content');
dialog.setFooter([
	new Jodit.modules.UIButton(dialog).onAction(() => {
		dialog.close();
	})
]);
dialog.open();
```

In all these examples, the dialog opens irrespective of Jodit's configurations, including the selected language and theme.
To ensure the dialog opens in the same theme as the editor, you can specify the theme in its settings, or utilize the [[IDlgs]] trait.

```js
const dialog = new Jodit.modules.Dialog({
	theme: 'dark'
});

// or

const editor = Jodit.make('#editor', {
	theme: 'dark'
});
const dialog = editor.dlg();
dialog.setContent('Hello world!');
dialog.open();

editor.alert('Hello world!');
editor.confirm('Hello world?', yes => {
	console.log('Ok?', yes);
});
```

Thanks to the trait mechanism, there's no need to create utility dialogs like Alert/Confirm/Prompt as previously described.
Simply calling the appropriate methods on the [[Jodit]] instance is sufficient. The dialog will automatically adopt the editor's theme and language settings.

```js
const editor = Jodit.make('#editor', {
	theme: 'dark'
});
editor.alert('Hello world!');
editor.confirm('Hello world?', yes => {
	console.log('Ok?', yes);
});
```

## Dialog container

All `IViewBased` classes has `popupRoot` option (`Dialog`, `Jodit`, `FileBrowser`).
Allows you to specify the parental element of dialogs and popup windows.
If the option is not specified, then when creating a dialogue, there is a bypass of a tree, starting with the editor. If an element is found `dialog` or eny element with `position: fixed` or `position: absolute`, then it is used as a parent.
Also, `shadowRoot` can be used as a Root

Those. Parent search priorities:

1. `popupRoot` option
2. `shadowRoot` option
3. The closest element `dialog` or with style `position: fixed` or `position: absolute`
4. document.body

This is necessary in cases where Jodit is displayed inside the dialog windows with a focus interception.
For example, when inserting in [mui dialog] (https://mui.com/material-ui/react-dialog/)

If this is your situation, then in most cases you won't need to do anything, as Jodit will find the correct parent element on its own.
But if your code logic was configured specifically to insert into `document.body`, then you will need to explicitly specify `popupRoot: document.body`

```typescript
const editor = Jodit.make('#editor', {
  popupRoot: document.body
});
```
