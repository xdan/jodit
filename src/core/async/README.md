# Async

The Async module is designed to handle asynchronous operations within the editor.

## Motivation

The Jodit editor can be created, deleted, and re-created. All asynchronous operations associated with it should be properly handled.

For example, consider the following code:

```js
const jodit = Jodit.make('#editor');
setTimeout(() => {
	jodit.e.on('change', () => console.log(jodit.value));
}, 1000);
jodit.destruct();
```

This code will throw an error because, at the moment the [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) function is called,
the editor has already been destructed. To avoid such errors, you need to handle the operations independently.

One way to handle it is by using the `beforeDestroy` event:

```js
const timeout = setTimeout(() => {
	jodit.e.on('change', () => console.log(jodit.value));
}, 1000);
jodit.e.on('beforeDestroy', () => clearTimeout(timeout));
```

By doing this, you can ensure that the code executes without errors.
However, manually handling such operations can be error-prone and may lead to forgetting certain processes.

To address this, the `Async` module was developed.
It is designed to handle any kind of asynchronous operation in Jodit.
The module keeps track of its handlers, and when the parent class (Jodit) is destroyed,
it automatically clears all associated operations.

## Timeout/ClearTimeout

With the `Async` module, you can simplify the code mentioned earlier:

```js
jodit.async.setTimeout(() => {
	jodit.e.on('change', () => console.log(jodit.value));
}, 1000);
jodit.destruct();
```

You can also manually clean up the execution of the handler:

```js
const timeout = jodit.async.setTimeout(() => {}, 1000);
jodit.async.clearTimeout(timeout);
jodit.destruct();
```

However, it is not necessary to manually clear the timeouts.
When `jodit.destruct()` is called, all asynchronous operations associated
with the editor will be stopped automatically.

## Promise

Another advantage of the `Async` module is its support for working with promises.
Promises, like timeouts, can still resolve even after the editor is destroyed.

Consider the following code:

```js
new Promise(result => {
	fetch('index.php').then(result);
}).then(data => {
	// Here, Jodit is already destroyed
	jodit.setEditorValue(data); // Error
});

jodit.destruct();
```

To prevent such errors, it is recommended to perform all promise-based operations using the `async` method:

```js
jodit.async
	.promise(result => {
		fetch('index.php').then(result);
	})
	.then(data => {
		// This handler will no longer be executed
		jodit.setEditorValue(data);
	});

jodit.destruct();
```

## Debounce/Throttle

The `Async` module provides two convenient methods, `debounce` and `throttle`,
for handling well-known operations.

```js
const a = jodit.async.debounce(() => {
	console.log('A');
}, 100);
a();
// Wait for 50mc
a();
// Wait for 50mc
a();
a();
// Wait for 50mc
a();
a();
// Wait for 50mc
a(); // Output: A
a();
// Wait for 150mc
a(); // Output: A
```

In this code, the function will only execute once if the calls occur more frequently than every 100ms.
Similarly, the `throttle` method limits the execution to once per specified interval:

```js
const b = jodit.async.throttle(() => {
	console.log('B');
}, 100);
a();
// Wait for 50mc
a();
// Wait for 50mc
a(); // Output: B
a();
// Wait for 50mc
a();
// Wait for 50mc
a(); // Output: B
```

The code will execute the function once every 100ms.
If the method is called 100 times within one second, it will only execute 10 times.

## Delay

The `delay` method allows you to pause the execution of a script for a specified duration:

```js
async function Run() {
	console.log('A');
	await jodit.async.delay(1000); // Wait for 1 second
	console.log('B');
}
```

In this example, the code will output "A", pause for 1 second, and then output "B".

## Clear

You can manually remove all asynchronous editor operations without waiting for the destruction of the editor:

```js
jodit.async.setTimeout(() => alert('Hello'), 1000);
jodit.async.clear();
```
