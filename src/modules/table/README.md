# Table processor

Module for working with tables. Delete, insert, merger, division of cells,
rows and columns.

## Usage

```js
const jodit = Jodit.make('#editor');
const table = document.createElement('table');
table.innerHTML = '<tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr>';
console.log(table.rows.length); // 2
jodit.getInstance('Table').appendRow(table, false, false);
console.log(table.rows.length); // 3
```

You can append a new row after another row

```js
const jodit = Jodit.make('#editor');
jodit.getInstance('Table').appendRow(table, table.rows[1], false);
```

## Methods

Module methods are available through the `Jodit.modules.Table` property;
more details about the methods can be found in the [[Table | documentation for each of them.]]
