# Set editing limit

Allow set chars or words limit

```js
Jodit.make('#editor', {
	/**
	 * limit words count
	 */
	limitWords: 100,

	/**
	 * limit chars count
	 */
	limitChars: 400,

	/**
	 * limit html chars count
	 */
	limitHTML: true
});
```

-   `limitWords` - Limits the number of words separated by spaces. Limitation does not include HTML tags and attributes
-   `limitChars` - Limits the number of characters not including spaces and special characters. Tags and attributes are also ignored.
-   `limitHTML` - If this option is enabled, then `limitWords` and `limitChars` count tags and their attributes.

## Events

When limits are reached, a series of events occur:

-   `limit.limit` - Upon reaching any of the limits
-   `denyChars.limit` - When the character limit is reached
-   `denyWords.limit` - Upon reaching any words
-   `denyPaste.limit` - If the user wanted to insert text beyond the limits

```js
const jodit = Jodit.make('#editor', {
	limitWords: 100
});

jodit.e.on(
	'limit.limit',
	jodit.async.debounce(() => {
		// Allow 'error' | 'info' | 'success' See error-messages plugin
		editor.e.fire('errorMessage', 'Limit reached!', 'error');
		return false;
	}, 300)
);
```
