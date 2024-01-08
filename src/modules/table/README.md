# Table

Module for working with tables. Delete, insert, merger, division of cells,
rows and columns.

## Usage

```js
const table = document.createElement('table');
table.innerHTML = '<tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr>';
console.log(table.rows.length); // 2
Jodit.modules.Table.appendRow(table, false, false, {
	element(tag) {
		return document.createElement(tag);
	}
});
console.log(table.rows.length); // 3
```

But better use [[Create DOM]] module

```js
const jodit = Jodit.make('#editor');
Jodit.modules.Table.appendRow(table, false, false, jodit.createInside);
```

You can append a new row after another row

```js
const jodit = Jodit.make('#editor');
Jodit.modules.Table.appendRow(table, table.rows[1], false, jodit.createInside);
```

## Methods

Module methods are available through the `Jodit.modules.Table` property;
more details about the methods can be found in the [[table.Table.md | documentation for each of them.]]
