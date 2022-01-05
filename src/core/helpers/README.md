Assistant functions are intended for small basic operations and are divided into subgroups.

For example, the [[helpers/string]] subgroup is designed to work with strings:
```js
Jodit.modules.Helpers.ucfirst('hello') // Hello
Jodit.modules.Helpers.camelCase('hello-world') // helloWorld
Jodit.modules.Helpers.trim('       hello-world  ') // hello-world
Jodit.modules.Helpers.kebabCase('helloWorld') // hello-world
```
And the [[helpers/html]] subgroup is designed to work with strings containing HTML:
```js
Jodit.modules.Helpers.nl2br('hello\nworld') // hello<br>world
```

> All helpers, regardless of the group, are in the namespace `Jodit.modules.Helpers`

The most commonly used helpers are checkers [[helpers/checker]]:

```js
Jodit.modules.Helpers.isBoolean('hello') // false

Jodit.modules.Helpers.isHtml('hello-world') // false
Jodit.modules.Helpers.isHtml('<p>hello world</p>') // true

Jodit.modules.Helpers.isInt('100') // true
Jodit.modules.Helpers.isInt('100.1') // false
Jodit.modules.Helpers.isInt('test') // false

Jodit.modules.Helpers.isFunction(() => {}) // true
Jodit.modules.Helpers.isString(123) // false
```
