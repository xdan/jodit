---
title: Storage Module
description: A persistent storage module that saves data to the user's local storage, falling back to an in-memory provider when persistent storage is not permitted.
keywords: jodit, storage, persistent storage, local storage, memory storage, data persistence
---

# Persistent storage

The module is designed to save information to the user's local storage.
At startup, it is checked whether the user has allowed saving to persistent storage.

> If not allowed, the module will use the [[MemoryStorageProvider]] strategy.

```js
const jodit = Jodit.make('#editor');
jodit.storage.set('someKey', 1);

// reload page

jodit.storage.get('someKey'); // 1
```
