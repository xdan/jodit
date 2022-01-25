A module for working with the DOM. All of its methods are static.
For example, you can insert an element in front of another element:

```js
import { Dom } from "jodit/src/core/dom";

const elm = document.getElementById('root');
const div = document.createElement('div');

Dom.before(elm, div);
```

The rest of the methods can be found in the [[Dom | documentation]]

> All module methods are static. So you don't need an instance to use them.
