# Jodit View UI component

Jodit components [[Component]] require the parent component [[IJodit]], or [[IViewBased]] to work.
But Jodit itself is also a component. And for its initialization it only needs options.

Also [[Dialog]], it does not need a Jodit instance to run.
You can display the dialog independently of the editor.

```js
const dialog = new Jodit.module.Dialog();
dialog.setContent('Hello world!');
dialog.open();
```

Thus, if you need a component that has its own event system, its own [[Async]] module, then you must inherit from [[View]].

```js
import { component } from 'jodit/src/core/decorators';
import { View } from 'jodit/src/core/view';

@component
class YourComponent extends View {}

const elm = new YourComponent();
elm.events.on('someEvent', () => alert('Yo'));
```
