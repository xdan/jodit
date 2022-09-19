# Show info messages

Allow show information messages inside editor:

```js
const editor = Jodit.make('#editor');

editor.message.error('Hellow world!');
editor.message.info('Hellow world!');
editor.message.success('Hellow world!', 3000); // Show 3 seconds

// or use `errorMessage` event
editor.events.fire('errorMessage', 'Hellow world!', 'error'); // or 'danger'
editor.events.fire('errorMessage', 'Hellow world!', 'info'); // or 'primary'
editor.events.fire('errorMessage', 'Hellow world!', 'secondary');
editor.events.fire('errorMessage', 'Hellow world!', 'success', 3000); // Show 3 seconds
```

If you want to override the appearance of popup messages, you can use the following css template:

```css
.jodit-ui-message_variant_secondary {
	--em-alert-color: #41464b;
	--em-alert-bg: #e2e3e5;
	--em-alert-border-color: #d3d6d8;
}
```

Where `variant_secondary` can be replaced with:

-   `variant_error` or `type_danger`
-   `variant_info` or `type_primary`
-   `variant_success`
