# DOM operation module

A module for working with the DOM. All of its methods are static.
For example, you can insert an element in front of another element:

```js
import { Dom } from 'jodit/src/core/dom';

const elm = document.getElementById('root');
const div = document.createElement('div');

Dom.before(elm, div);
```

The rest of the methods can be found in the [[Dom | documentation]]

> All module methods are static. So you don't need an instance to use them.

The module also includes the [[LazyWalker]] class. It is convenient for cases when it is necessary to go through
the entire tree of elements, but this must be done without stopping the main thread of execution.
For example, your plugin can search for some nodes, or text. If each time you run through the entire tree in a loop,
then the interface will noticeably slow down on large documents. To avoid this, this class is made.

```js
const walker = new Jodit.modules.LazyWalker(new Jodit.modules.Async(), 100);
const names = [];

walker
	.on('visit', node => {
		names.push(node.nodeName.toLowerCase());
	})
	.on('end', () => {
		expect(names).deep.eq([
			'div',
			'ul',
			'li',
			'strong',
			'#text',
			'span',
			'#text',
			'u',
			'#text',
			'li',
			'i',
			'#text',
			'b',
			'#text',
			'u',
			'#text',
			'img'
		]);
		done();
	});

const div = document.createElement('div');
div.innerHTML =
	"<ul><li><strong>test</strong><span>test</span><u>test</u></li><li><i>test</i><b>test</b><u>test</u><img src='' alt=''></li></ul>";
walker.setWork(div);
```
