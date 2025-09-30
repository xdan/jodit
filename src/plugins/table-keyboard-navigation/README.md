# Table Keyboard Navigation Plugin

Enables keyboard navigation between table cells using arrow keys and Tab. Users can move focus between cells without mouse, with automatic row creation when tabbing past last cell.

## Features

- Tab/Shift+Tab: Navigate forward/backward through cells
- Arrow keys: Navigate up/down/left/right in table
- Auto-creates new row when Tab on last cell
- Wraps to first/last cell at edges
- Handles merged cells (colspan/rowspan)
- Hides popup/resizer during navigation
- Auto-inserts `<br>` in empty cells
- Select all cell content on Tab

## Supported Keys

- **Tab**: Next cell (creates row if needed)
- **Shift+Tab**: Previous cell (creates row before if needed)
- **Left Arrow**: Previous cell (wraps to last)
- **Right Arrow**: Next cell (wraps to first)
- **Up Arrow**: Cell above (same column)
- **Down Arrow**: Cell below (same column)

## Usage Examples

### Basic Navigation

```typescript
const editor = Jodit.make('#editor');

// Insert table:
// | Cell 1 | Cell 2 |
// | Cell 3 | Cell 4 |

// Cursor in Cell 1:
// Press Tab → moves to Cell 2
// Press Tab → moves to Cell 3
// Press Tab → moves to Cell 4
// Press Tab → creates new row, moves to new cell
```

### Arrow Navigation

```typescript
// Cursor in Cell 2:
// Press Left → moves to Cell 1
// Press Right → moves back to Cell 2
// Press Down → moves to Cell 4
// Press Up → moves back to Cell 2
```

### Wrapped Navigation

```typescript
// Cursor in Cell 4 (last cell):
// Press Right → wraps to Cell 1 (first cell)

// Cursor in Cell 1 (first cell):
// Press Left → wraps to Cell 4 (last cell)
```

### Edge Navigation

```typescript
// Cursor in first column, top row:
// Press Up → stays in current cell (no cell above)

// Cursor in last column, bottom row:
// Press Down → stays in current cell (no cell below)
```

## How It Works

### Key Detection

On `keydown` event:
1. Checks if key is Tab or arrow key
2. Finds current table cell via `Dom.up(current, Dom.isCell)`
3. Validates cursor position:
   - For Tab: works from any position in cell
   - For arrows: only at cell boundaries (start/end of content)
4. If valid: executes navigation, returns `false` (prevents default)

### Tab Navigation

1. Gets next/previous cell via `Dom.next`/`Dom.prev`
2. If no next cell:
   - Calls `table.appendRow()` to add row at end/start
   - Gets newly created cell
3. Selects entire cell content
4. Fires `hidePopup` and `hideResizer` events

### Arrow Navigation

**Left/Right:**
- Gets next/previous cell in DOM order
- Wraps to last/first cell if at edge

**Up/Down:**
- Builds formal table matrix (handles colspan/rowspan)
- Gets cell coordinates [row, column]
- Accesses cell at [row±1, same column]
- Handles missing cells gracefully

### Empty Cell Handling

If target cell empty:
- Creates `<br>` element
- Appends to cell
- Sets cursor before `<br>`

### Cursor Position

For Tab: Selects entire cell content
For arrows: Sets cursor at start/end based on direction

## Edge Cases

1. **Merged Cells**: Formal matrix handles colspan/rowspan correctly
2. **Empty Cells**: Auto-inserts `<br>` for cursor positioning
3. **First Cell Tab Back**: Creates new row before first row
4. **Last Cell Tab Forward**: Creates new row after last row
5. **Cursor in Middle**: Arrows only work at text start/end
6. **Nested Tables**: Works only in immediate table, not nested
7. **Non-table Content**: Ignored, default behavior

## Typical Use Case

Users entering data in tables need efficient keyboard-only navigation between cells. The table-keyboard-navigation plugin provides this by enabling Tab and arrow keys to move between cells, similar to spreadsheet applications, with automatic row creation when needed.