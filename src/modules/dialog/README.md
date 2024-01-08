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

const editor = new Jodit('#editor', {
	theme: 'dark'
});
const dialog = editor.dlg();
editor.alert('Hello world!');
editor.confirm('Hello world?', yes => {
	console.log('Ok?', yes);
});
```

Thanks to the trait mechanism, there's no need to create utility dialogs like Alert/Confirm/Prompt as previously described.
Simply calling the appropriate methods on the [[Jodit]] instance is sufficient. The dialog will automatically adopt the editor's theme and language settings.

```js
const editor = new Jodit('#editor', {
	theme: 'dark'
});
editor.alert('Hello world!');
editor.confirm('Hello world?', yes => {
	console.log('Ok?', yes);
});
```
