# Jodit Development Guide

## Avoid Default Export

To effectively track module usage, it is recommended not to use default exports.

Wrong:

```typescript
export default class Some {}
//...
import Some from './some';
```

Right:

```typescript
export class Some {}
//...
import { Some } from './some';
```

## Prefer Full File Paths and Use the Jodit Namespace

For better tree-shaking, reduced code cohesion, and to avoid circular dependencies,
it is preferable to use full file paths instead of shortcuts.
Additionally, use the `jodit` namespace instead of relative paths.

Wrong:

```typescript
import { trim, isString, htmlspecialchars } from '../core/helpers';
```

Right:

```typescript
import { trim } from 'jodit/core/helpers/string/trim';
import { isString } from 'jodit/core/helpers/checkers/is-string';
import { htmlspecialchars } from 'jodit/core/helpers/html/htmlspecialchars';
```

If multiple modules are imported from the same place, you can use the most extreme shortcut.

Wrong:

```typescript
import { trim, isString, isUrl } from 'jodit/core/helpers';
```

Right:

```typescript
import { trim } from 'jodit/core/helpers/string/trim';
import { isString, isUrl } from 'jodit/core/helpers/checkers';
```

## Import order

Imports should follow the following order:

-   Styles
-
-   Global types
-   Global modules
-
-   Local types
-   Local modules

> Don't forget to use the `type` keyword if you only need the type

Wrong:

```typescript
import './config';
import type { LocalType } from './interface';
import { isString } from 'jodit/core/helpers/checkers/is-string';
import { IJodit } from 'jodit/types';
import './styles.less';
```

Right:

```typescript
import './styles.less';

import type { IJodit } from 'jodit/types';
import { isString } from 'jodit/core/helpers/checkers/is-string';

import type { LocalType } from './interface';
import './config';
```

## Re-export Multiple Modules in a Folder's Index.ts

If a folder contains multiple modules,
it is recommended to re-export them in the folder's `index.ts` file.

folder/subfolder/some.ts

```
export function some1(){}
export function some2(){}
```

folder/subfolder/another.ts

```
export function another1(){}
export function another2(){}
```

folder/subfolder/index.ts

```
export * from "./some"
export * from "./another"
```

folder/index.ts

```
export * from "./subfolder"
```

By following this structure, you can easily import the modules from their respective folders.
