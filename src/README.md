The Jodit editor consists of modules and plugins. Modules make up the permanent basis of the editor's work,
and plugins can add their own functionality [[plugin]].

The editor is initialized on a DOM element. It must already exist on the page:

```js
Jodit.make('#editor');
```
You can also set a DOM element right away.

```js
const elm = document.querySelector('#editor');
Jodit.make(elm);
```

The [[Jodit.make]] method returns an instance of [[Jodit]].

```js
const jodit = Jodit.make('#editor');
console.log(jodit.isReady)
```

This is almost equivalent to

```js
const jodit = new Jodit('#editor');
console.log(jodit.isReady)
```

> But the `make` method is preferable.

All customization of the editor is done through the [[Config]]:

```js
Jodit.make('#editor', {
	height: 300
});
```

Jodit instance has a module [[EventEmitter]]

```js
const jodit = Jodit.make('#editor');
jodit.events.on('keydown', (e) => {
	console.log(e.key)
})
```

And the [[Select]] module, which allows you to manipulate the content of the editor through HTML insertion

```js
const jodit = Jodit.make('#editor');
jodit.s.focus()
jodit.s.insertHTML('<p>test</p>')
```
