# Table

Module for working with tables. Delete, insert, merger, division of cells , rows and columns.

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
