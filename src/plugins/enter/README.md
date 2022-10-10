# Plugin for correct processing of pressing the Enter key

When you press the Enter key on an empty space, inserts a tag from the option [[Config.enter]].

Disabling a Plugin:

```js
Jodit.make('#editor', {
	disablePlugins: ['enter']
});
```

Also handles an input situation in the middle of a split element:

```html
<h1>te|st</h1>
```

will be divided into

```html
<h1>te</h1>
<h1>|st</h1>
```

But if the cursor is at the end of the element

```html
<h1>test|</h1>
```

then a new element will be added according to [[Config.enter]]

```html
<h1>test</h1>
<p>|<br /></p>
```
