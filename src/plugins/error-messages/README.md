# Show info messages

Allow show information messages inside editor:

```js
const editor = Jodit.make('#editor');
editor.events.fire('errorMessage', 'Hellow world!', 'error'); // or 'danger'
editor.events.fire('errorMessage', 'Hellow world!', 'info'); // or 'primary'
editor.events.fire('errorMessage', 'Hellow world!', 'secondary');
editor.events.fire('errorMessage', 'Hellow world!', 'success', 3000); // Show 3 seconds
```

If you want to override the appearance of popup messages, you can use the following css template:

```css
.jodit-jodit__error-messages_type_secondary {
	--em-alert-color: #41464b;
	--em-alert-bg: #e2e3e5;
	--em-alert-border-color: #d3d6d8;
}
```

Where `type_secondary` can be replaced with:

-   `type_error` or `type_danger`
-   `type_info` or `type_primary`
-   `type_success`
