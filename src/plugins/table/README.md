# Table processing plugin

Adds a button to the toolbar for quickly inserting a new table into the editor

```js
Jodit.make('#editor', {
	selectionCellStyle: 'border: 1px double #1e88e5 !important;',
	useExtraClassesOptions: true,
	table: {
		data: {
			classList: {
				'table table-bordered': 'Bootstrap Bordered',
				'table table-striped': 'Bootstrap Striped',
				'table table-dark': 'Bootstrap Dark'
			}
		}
	}
});
```
