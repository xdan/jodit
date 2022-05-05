# Jodit development guide

## We do not use default export

This allows you to effectively track module usage.

wrong:

```typescript
export default class Some {}
//...
import Some from './some'
```

Right:

```typescript
export class Some {}
//...
import { Some } from './some'
```

## Prefer full file paths over shortcuts. Also use jodit namespace instead of relative path

For better tree-shaking and less code cohesion. It also avoids circular dependencies.

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

If several modules are imported from one place, then you can use the most extreme shortcut

Wrong:

```typescript
import { trim, isString, isUrl } from 'jodit/core/helpers';
```

Right:

```typescript
import { trim } from 'jodit/core/helpers/string/trim';
import { isString, isUrl } from 'jodit/core/helpers/checkers';
```

## Top types

And don't forget the `type` keyword if you only need the type:

Wrong:

```typescript
import { isString } from 'jodit/core/helpers/checkers/is-string';
import { IJodit } from 'jodit/types';
```

Right:

```typescript
import type { IJodit } from 'jodit/types';
import { isString } from 'jodit/core/helpers/checkers/is-string';
```

## Several modules in a folder should be re-exported to that folder's index.ts

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
