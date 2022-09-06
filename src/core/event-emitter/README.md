# Jodit Event Emitter

This is the heart of Jodit. All processes inside Jodit mostly flow through events.

```js
const jodit = Jodit.make('#editor');
jodit.e.on('someEvent', param => alert(`Some event fired for ${param}!!!`));
jodit.async.setTimeout(() => {
	jodit.e.fire('someEvent', 'you');
}, 1000);
```

In addition to custom events, the emitter can work with DOM elements and browser events:

```js
jodit.e.on(document.body, 'click', () => alert(`Doc click!!!`));
```

If you don't want to listen to the event anymore, you can unsubscribe from it:

```js
jodit.e
	.one('someEvent', param => alert(`Some event fired for ${param}!!!`))
	.one('someEvent', param => alert(`Some event fired for ${param}!!!`))
	.one('someEvent', param => alert(`Some event fired for ${param}!!!`));

jodit.e.off('someEvent'); // will unsubscribe from all handlers
```

```js
const handler1 = param => alert(`Some event fired for ${param}!!!`);
const handler2 = param => alert(`Some event fired for ${param}!!!`);
const handler3 = param => alert(`Some event fired for ${param}!!!`);

jodit.e
	.one('someEvent', handler1)
	.one('someEvent', handler2)
	.one('someEvent', handler3);

jodit.e.off('someEvent', handler1); // only handler1 will unsubscribe
```
