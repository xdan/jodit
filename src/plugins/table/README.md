---
title: Table Plugin
description: Adds a toolbar button with a visual grid selector for inserting tables of chosen dimensions, with optional CSS class presets for styling.
keywords: jodit, table plugin, insert table, grid selector, table classes, bootstrap
---

# Table Plugin

Adds toolbar button for inserting tables with visual grid selector. Users can hover over a grid to select table dimensions, with optional CSS class presets for styling.

## Features

- Visual table size selector (10x10 grid)
- Hover preview of table dimensions
- Click to insert table
- Optional CSS class presets (Bootstrap styles)
- Equal column widths
- Configurable selection cell styling
- History snapshot integration

## Configuration Options

### `table.selectionCellStyle`

**Type:** `string`

**Default:** `'border: 1px double #1e88e5 !important;'`

CSS style applied to selected table cells when using cell selection feature (see select-cells plugin). This style is dynamically injected into the document to highlight selected cells.

### `table.useExtraClassesOptions`

**Type:** `boolean`

**Default:** `false`

When enabled, shows checkboxes for applying CSS classes (e.g., Bootstrap table classes) to inserted tables.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    table: {
        useExtraClassesOptions: true
    }
});
```

### `table.leaveStylesToPage`

**Type:** `boolean`

**Default:** `false`

Jodit's stylesheet gives tables in the editing area a `1em` margin above and below, and their cells `0.4em` padding, a `2em` minimum width and a border. Its rules outrank the page's usual rules for tables, such as `.content td`, so in the inline editor, for example, tables can look different from how they look where the content is shown.

When enabled, Jodit leaves the look of tables in the editing area to the page's stylesheet, and to the browser's defaults where it has no rules, so the editor shows tables as the page does. Selecting cells works as before.

In iframe mode, the default `iframeStyle`'s rules for tables do the same, leaving their look to the `iframeCSSLinks` stylesheets. An `iframeStyle` of your own is left as it is, and so is a document edited with `editHTMLDocumentMode`, which brings its own styles.

The preview keeps Jodit's look.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    inline: true,
    editorClassName: 'content',
    table: {
        leaveStylesToPage: true
    }
});
```

## Controls

### `table` Control

**Icon:** `'table'`

**Tooltip:** `'Insert table'`

**Group:** `'insert'`

**Data:**
- `cols: 10` - Grid columns
- `rows: 10` - Grid rows
- `classList` - CSS class options (Bootstrap Bordered, Striped, Dark)

Opens popup with table size selector grid.

## Usage Examples

### Basic Table Insertion

```typescript
const editor = Jodit.make('#editor');

// Click Table button
// Hover over grid (e.g., 3x2)
// Click to insert 3-column, 2-row table
```

### With Bootstrap Classes

```typescript
const editor = Jodit.make('#editor', {
    table: {
        useExtraClassesOptions: true
    },
    controls: {
        table: {
            data: {
                classList: {
                    'table table-bordered': 'Bordered',
                    'table table-striped': 'Striped'
                }
            }
        }
    }
});

// Check "Bordered" before inserting
// Table gets "table table-bordered" classes
```

## Typical Use Case

Users need to quickly insert tables with specific dimensions. The table plugin provides this by showing a visual grid selector where hovering shows dimensions and clicking inserts the table with equal column widths.