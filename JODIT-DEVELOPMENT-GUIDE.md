# Jodit Development Guide

## Avoid Using Default Exports

To improve module traceability, it's recommended to avoid default exports.

Incorrect:

```typescript
export default class Some {}
//...
import Some from './some';
```

Correct:

```typescript
export class Some {}
//...
import { Some } from './some';
```

## Prefer Full File Paths and the Jodit Namespace

For better tree-shaking, reduced code coupling, and to avoid circular dependencies,
use full file paths instead of shortcuts.
Also, prefer the jodit namespace over relative paths.

Incorrect:

```typescript
import { trim, isString, htmlspecialchars } from '../core/helpers';
```

Correct:

```typescript
import { trim } from 'jodit/core/helpers/string/trim';
import { isString } from 'jodit/core/helpers/checkers/is-string';
import { htmlspecialchars } from 'jodit/core/helpers/html/htmlspecialchars';
```

If you are importing multiple modules from the same path, use the shortest valid path.

Incorrect:

```typescript
import { trim, isString, isUrl } from 'jodit/core/helpers';
```

Correct:

```typescript
import { trim } from 'jodit/core/helpers/string/trim';
import { isString, isUrl } from 'jodit/core/helpers/checkers';
```

## Import Order

Imports should be organized in the following order:

-   Styles
-
-   Global types
-   Global modules
-
-   Local types
-   Local modules

> Remember to use the type keyword if you're importing types only.

Incorrect:

```typescript
import './config';
import type { LocalType } from './interface';
import { isString } from 'jodit/core/helpers/checkers/is-string';
import { IJodit } from 'jodit/types';
import './styles.less';
```

Correct:

```typescript
import './styles.less';

import type { IJodit } from 'jodit/types';
import { isString } from 'jodit/core/helpers/checkers/is-string';

import type { LocalType } from './interface';
import './config';
```

## Re-export Multiple Modules in an index.ts File

If a folder contains multiple modules, it's recommended to re-export them in the folder's `index.ts` file.

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

This structure allows for easier imports from the respective folder.
