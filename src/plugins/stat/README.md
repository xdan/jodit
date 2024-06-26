# Editor stats

Adds inside statusbar several options: chars and words count

```js
Jodit.make('#editor', {
	showCharsCounter: true,
	countHTMLChars: true,
	countTextSpaces: false,
	showWordsCounter: true
});
```

## Options

| Name             | Description                                                                    | Type      | Default |
| ---------------- | ------------------------------------------------------------------------------ | --------- | ------- |
| showCharsCounter | Show chars counter. `<div>Hello world!</div>` represents 11 characters.        | `boolean` | `true`  |
| countHTMLChars   | Count all HTML characters. `<div>Hello world!</div>` represents 24 characters. | `boolean` | `false` |
| countTextSpaces  | Count spaces as chars. `<div>Hello world!</div>` represents 12 characters.     | `boolean` | `false` |
| showWordsCounter | Show words counter. `<div>Hello world!</div>` represents 2 words.              | `boolean` | `true`  |
