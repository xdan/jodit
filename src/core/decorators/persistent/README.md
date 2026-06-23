---
title: Persistent Decorator
description: The @persistent decorator transparently saves and restores a property value through persistent storage so it survives across instances and page reloads.
keywords: jodit persistent, decorator, storage, persistent storage, property, page reload
---

# @persistent

Allow save value inside persistent storage as set/get to property

```typescript
import { component, persistent } from './src/core/decorators';

@component
class Item extends UIElement {
	@persistent
	options = {
		some: true
	};
}

const item = new Item(jodit);
console.log(item.options); // {some: true}

item.options = {
	some: false
};

const item2 = new Item(jodit); // or reload page
console.log(item.options); // {some: false}
```
