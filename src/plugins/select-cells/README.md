# Select Cells Plugin

Enables click-and-drag selection of table cells. This plugin allows users to select multiple table cells by clicking on a cell and dragging to adjacent cells, similar to spreadsheet applications.

## Features

- Click and drag to select multiple cells
- Visual selection highlighting
- Popup toolbar for selected cells
- Keyboard navigation (Tab to deselect)
- Table commands work on selected cells
- Touch event support
- Nested table handling
- Read-only mode support
- Locks editor during selection
- Firefox redraw hack for proper display

## Configuration Options

### `tableAllowCellSelection`

**Type:** `boolean`

**Default:** `true`

Enables or disables the ability to select multiple table cells by click-and-drag.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    tableAllowCellSelection: true
});
```

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor', {
    tableAllowCellSelection: true
});

// Insert a table
// Click on a cell and drag to select multiple cells
// Use table commands on selected cells
```

### Disable Cell Selection

```typescript
const editor = Jodit.make('#editor', {
    tableAllowCellSelection: false
});
// Click-and-drag selection disabled
```

### Listen to Selection Events

```typescript
const editor = Jodit.make('#editor');

// Listen for popup show (when cells selected)
editor.e.on('showPopup', (table, getPosition, type) => {
    if (type === 'cells') {
        console.log('Cells selected, popup shown');
    }
});
```

## How It Works

### Selection Process

1. **Click Start**: User clicks on a table cell (mousedown/touchstart)
2. **Store Cell**: Plugin saves first selected cell
3. **Enable Mode**: Sets selection mode flag
4. **Add Selection**: Marks cell as selected via Table module
5. **Drag**: User moves mouse over other cells
6. **Calculate Bounds**: Determines rectangular selection area
7. **Select Range**: Selects all cells within bounds
8. **Release**: User releases mouse (mouseup/touchend)
9. **Show Popup**: Displays toolbar for selected cells

### Selection Bounds

Uses formal matrix to calculate rectangular selection:
- Gets coordinates of first and current cell
- Calculates min/max bounds
- Selects all cells in rectangular area
- Handles colspan/rowspan via formal matrix

### Popup Display

When selection completes:
- Calculates combined position of all selected cells
- Fires `showPopup` event with table and position
- Popup type is `'cells'` for identification
- Position includes left, top, width, height

### Table Commands

Plugin intercepts table commands when cells selected:
- `tablesplitv` - Split cells vertically
- `tablesplitg` - Split cells horizontally (горизонтально)
- `tablemerge` - Merge selected cells
- `tableempty` - Empty selected cells
- `tablebin` - Delete table
- `tablebinrow` - Delete rows containing selected cells
- `tablebincolumn` - Delete columns containing selected cells
- `tableaddcolumnafter/before` - Add column
- `tableaddrowafter/before` - Add row

### Justify Commands

Handles justify commands for selected cells:
- `justifyLeft`, `justifyRight`, `justifyCenter`, `justifyFull`
- Applies alignment to all selected cells

## Events

### `showPopup`

Fired when cell selection is completed and popup should be shown.

**Parameters:**
- `table` (HTMLTableElement): The table
- `getPosition` (Function): Returns position bounds
- `type` (string): Always `'cells'`

**Example:**
```typescript
editor.e.on('showPopup', (table, getPosition, type) => {
    if (type === 'cells') {
        const bounds = getPosition();
        console.log(bounds); // { left, top, width, height }
    }
});
```

### `hidePopup`

Fired when selection should be removed or cleared.

**Example:**
```typescript
editor.e.on('hidePopup', (type) => {
    if (type === 'cells') {
        console.log('Cell popup hidden');
    }
});
```

## Commands

Plugin intercepts these commands when cells are selected:

- `tablesplitv` - Split vertically
- `tablesplitg` - Split horizontally
- `tablemerge` - Merge cells
- `tableempty` - Clear content
- `tablebin` - Delete table
- `tablebinrow` - Delete rows
- `tablebincolumn` - Delete columns
- `tableaddcolumnafter` - Add column after
- `tableaddcolumnbefore` - Add column before
- `tableaddrowafter` - Add row after
- `tableaddrowbefore` - Add row before
- `justifyLeft/Right/Center/Full` - Align cells

## Edge Cases

1. **Tab Key**: Pressing Tab deselects all cells
2. **Outside Click**: Clicking outside deselects cells
3. **Nested Tables**: Only selects cells from same table level
4. **Empty Cells**: Adds `<br>` to empty cells on selection start
5. **Read-Only**: Selection disabled in read-only mode
6. **Editor Lock**: Locks editor during drag to prevent editing
7. **Multiple Clicks**: Clicking new cell deselects previous
8. **Touch Events**: Full touch support alongside mouse
9. **Firefox Hack**: Temporary node added for proper redraw
10. **Range Removal**: Removes text selection when multiple cells selected

## Notes

- Plugin is class-based, extends `Plugin` base class
- Requires `select` plugin
- Uses `@autobind` and `@watch` decorators
- Event namespacing `.select-cells` for clean removal
- Lock key is `'table_processor_observer'`
- Mouse move throttled to `defaultTimeout / 2`
- Uses `Table` module for cell operations
- Selection stored via `addSelection()` and `removeSelection()`
- Formal matrix handles colspan/rowspan calculations
- Popup position calculated from cell positions
- Firefox hack adds/removes temporary transparent div
- The `getAllSelectedCells()` returns currently selected cells
- Selection bounds use `getSelectedBound()` from Table module
- Nested table check prevents selecting across table boundaries
- The plugin properly cleans up event listeners on destruction
- Mouse move uses async throttle with custom label
- Listens to `clickEditor`, `mousedownTd/Th`, `touchstartTd/Th` events
- Special handling for `clickTr` and `clickTbody` to prevent default
- The `unselectCells()` method removes selection from all cells
- Command regex: `/table(splitv|splitg|merge|empty|bin|binrow|bincolumn|addcolumn|addrow)/`
- Justify regex: `/^justify/`
- Cell emptying uses `Dom.detach()` to remove children
- Row deletion collects unique rows via Set
- Column deletion uses Set to track unique column indices

## Typical Use Case

Users need to apply operations to multiple table cells simultaneously, like in spreadsheet applications. The select-cells plugin provides this by:

1. Enabling click-and-drag selection
2. Visual highlighting of selected cells
3. Showing context toolbar for operations
4. Supporting table commands on selection
5. Handling keyboard deselection

This improves user experience by:
- Providing familiar spreadsheet-like interaction
- Reducing repetitive operations
- Visual feedback during selection
- Efficient bulk cell operations
- Touch-friendly interface