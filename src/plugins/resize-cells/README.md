# Resize Cells Plugin

Enables interactive resizing of table columns and entire tables by dragging visual resize handles that appear near cell borders. This plugin provides intuitive drag-and-drop functionality for adjusting table dimensions.

## Features

- Visual resize handles on cell borders
- Drag-to-resize table columns
- Drag-to-resize entire table width
- Left and right table edge resizing
- RTL (right-to-left) language support
- Automatic handle positioning
- Throttled mouse move for performance
- Minimum/maximum resize limits
- Proportional width calculations
- Adjacent column adjustment
- Touch event support
- Locked editor during resize
- Visual feedback during drag
- Automatic cleanup on mode change

## Configuration Options

### `tableAllowCellResize`

**Type:** `boolean`

**Default:** `true`

Enables or disables the ability to resize table cells and tables by dragging handles.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    tableAllowCellResize: true
});
```

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor', {
    tableAllowCellResize: true
});

// Insert a table
// Hover over cell borders to see resize handles
// Drag handles to resize columns or table
```

### Disable Cell Resizing

```typescript
const editor = Jodit.make('#editor', {
    tableAllowCellResize: false
});
// No resize handles will appear on tables
```

### With Custom Table Configuration

```typescript
Jodit.make('#editor', {
    tableAllowCellResize: true,
    table: {
        // Other table options
        useExtraClassesOptions: false
    }
});
```

### Programmatic Table Insertion with Resizing

```typescript
const editor = Jodit.make('#editor', {
    tableAllowCellResize: true
});

// Insert table
editor.execCommand('insertTable', false, [3, 3]);

// User can now resize columns by dragging cell borders
```

### With RTL Direction

```typescript
const editor = Jodit.make('#editor', {
    tableAllowCellResize: true,
    direction: 'rtl'
});
// Resize handles work correctly in right-to-left mode
```

## How It Works

### Handle Display

When hovering over table cells:

1. **Proximity Detection**: Checks if mouse is within `NEARBY` pixels (5px) of cell border
2. **Handle Creation**: Creates `.jodit-table-resizer` div element
3. **Position Calculation**: Positions handle at cell border (left or right edge)
4. **Height Setting**: Sets handle height to match table height
5. **Visual Display**: Shows vertical line indicating resize position

### Resize Modes

The plugin supports three resize modes:

#### 1. Column Resize (Middle Border)

Hovering near middle borders between cells:
- Resizes the column on the left
- Shrinks/expands the column on the right proportionally
- Maintains overall table width

#### 2. Whole Table Resize (Right Edge)

Hovering on rightmost cell border (or leftmost in RTL):
- Resizes entire table width
- Adjusts table width as percentage of parent container
- No column proportions change

#### 3. Whole Table with Margin (Left Edge)

Hovering on leftmost cell border (or rightmost in RTL):
- Resizes entire table width
- Adjusts left/right margin to maintain position
- Reduces table width from opposite side

### Drag Operation

When dragging resize handle:

1. **Lock Editor**: Prevents editing during resize (`editor.lock(key)`)
2. **Track Position**: Records `startX` and calculates `resizeDelta`
3. **Constrain Movement**: Enforces `minX` and `maxX` boundaries
4. **Visual Feedback**: Adds `jodit-table-resizer_moved` class
5. **Update Position**: Moves handle with mouse in real-time
6. **Clear Selection**: Removes text selection during drag

### Column Resizing

When resizing columns:

1. **Calculate Delta**: Determines pixel difference from start position
2. **Resize Current Column**: Adjusts width of dragged column by delta
3. **Resize Adjacent Column**: Adjusts neighboring column by negative delta
4. **Maintain Total Width**: Table width remains constant
5. **Update Marked Cells**: Tracks which cells have been modified

### Table Resizing

When resizing entire table:

**Right Side (or Left in RTL):**
- Calculates new width as percentage of parent
- Formula: `((width + delta) / parentWidth) * 100 + '%'`

**Left Side (or Right in RTL):**
- Reduces width: `((width - delta) / parentWidth) * 100 + '%'`
- Adds margin: `((margin + delta) / parentWidth) * 100 + '%'`

### RTL Support

For right-to-left languages:
- Mirrors all resize logic
- Left/right operations are reversed
- Margin calculations use `marginRight` instead of `marginLeft`
- Delta values are inverted for table resize

### Boundaries and Limits

#### Column Resize Limits

- **minX**: Maximum left position (from rightmost cell in column)
- **maxX**: Minimum right position (from leftmost cell in adjacent column)
- Ensures columns don't shrink below `NEARBY / 2` pixels

#### Table Resize Limits

- **minX**: Left edge of table parent container
- **maxX**: Right edge of table parent container
- Prevents table from exceeding parent bounds

### Event Lifecycle

1. **Init**: Plugin observes all tables on `change`, `afterCommand`, `afterSetMode`
2. **Observe Table**: Attaches `mousemove` and `mouseleave` listeners to each table
3. **Mouse Move**: Throttled handler calculates handle position
4. **Handle Shown**: Handle appears when near border
5. **Mouse Down**: Starts drag operation
6. **Mouse Move**: Updates handle position and delta during drag
7. **Mouse Up**: Applies resize and unlocks editor
8. **Handle Hidden**: Hides handle after timeout when mouse leaves

### Performance Optimizations

- **Throttling**: Mouse move handler throttled to `defaultTimeout` (typically 100ms)
- **Debounced Hide**: Handle hides after timeout delay
- **Data Binding**: Tables marked as observed to prevent duplicate listeners
- **Event Namespacing**: Uses `.resize-cells` for clean removal

## Events

The plugin listens to these events but doesn't fire custom events:

### `change`, `afterCommand`, `afterSetMode`

Re-observes all tables to add resize functionality to new tables.

**Example:**
```typescript
editor.e.on('change', () => {
    // Plugin automatically re-observes tables
});
```

### `beforeSetMode`

Cleans up table selections and normalizes tables before mode switch.

**Example:**
```typescript
editor.e.on('beforeSetMode', () => {
    // Plugin removes selections and normalizes tables
});
```

### `scroll` (on window)

Updates handle position during window scroll while dragging.

**Example:**
```typescript
editor.e.on(editor.ow, 'scroll', () => {
    // Plugin updates resize handle top position
});
```

## Edge Cases

1. **Locked Editor**: Handle doesn't appear or respond when editor is locked

2. **No Adjacent Cell**: Resizing leftmost/rightmost borders resizes whole table

3. **Touch Events**: Plugin supports both mouse and touch events

4. **RTL Direction**: All logic mirrors for right-to-left languages

5. **Minimum Width**: Columns can't shrink below `NEARBY / 2` (2.5px)

6. **Parent Bounds**: Table resize constrained to parent container width

7. **Iframe Editor**: Position calculations account for iframe offset

8. **Scroll During Drag**: Handle position updates during window scroll

9. **Multiple Tables**: Each table gets independent observers and handlers

10. **Handle Reuse**: Same handle element reused for all resize operations

11. **Mode Change**: Selections cleared and tables normalized before mode switch

12. **Table Mutations**: New tables automatically observed on content changes

## Notes

- Plugin is class-based, extends `Plugin` base class
- Uses `Table` module for column width calculations and formal coordinates
- Resize handle has class `jodit-table-resizer`
- Active drag state adds `jodit-table-resizer_moved` class
- Handle element created once and reused for all tables
- Mouse move throttled with `async.throttle()` decorator
- Uses `dataBind()` to mark observed tables and prevent duplicate listeners
- Event namespacing `.resize-cells` ensures clean removal on destroy
- Lock key is `'table_processor_observer-resize'`
- The `NEARBY` constant (5px) defines border proximity threshold
- Column resize uses `setColumnWidthByDelta()` from Table module
- Formal matrix and formal coordinate methods handle colspan/rowspan
- Position calculations use `offset()` helper for accurate coordinates
- Handle visibility managed with `showResizeHandle()` and `hideResizeHandle()`
- Hide operation uses async timeout for smooth UX
- Handle cleared on mouse leave (with check for handle as relatedTarget)
- Drag state tracked with `this.drag` boolean flag
- Work cell and work table memoized during resize operation
- The `wholeTable` property: `null` = column resize, `true` = left table edge, `false` = right table edge
- Width calculations use percentages relative to parent container
- Adjacent column resize uses negative delta to maintain table width
- The plugin integrates with editor's lock/unlock system
- Selection cleared during drag to prevent text selection interference
- Handle position constrained between `minX` and `maxX` during drag
- Mouse up event attached to window (`j.ow`) to catch releases outside editor
- Touch events (`touchstart`, `touchmove`, `touchend`) supported alongside mouse events
- The `resizeDelta` property tracks total pixel change during drag
- Margin adjustments maintain table position when resizing from left
- RTL detection uses `editor.o.direction === 'rtl'`
- All DOM queries use `$$()` helper for consistency
- The plugin properly cleans up all event listeners on destruction
- Scroll handler only active during drag operations
- Table normalization ensures consistent structure after resize

## Typical Use Case

Users need to adjust table column widths and table sizes to fit their content and layout requirements. The resize-cells plugin provides this by:

1. Showing visual handles when hovering near cell borders
2. Allowing intuitive drag-and-drop resizing
3. Supporting both column and whole-table resizing
4. Maintaining proportions when resizing columns
5. Respecting container boundaries

This improves user experience by:
- Providing familiar spreadsheet-like resize functionality
- Eliminating need for manual width attribute editing
- Supporting both precise and quick adjustments
- Working correctly with RTL languages
- Maintaining table structure integrity during resize