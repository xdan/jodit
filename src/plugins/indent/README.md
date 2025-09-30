# Indent Plugin

Provides indent and outdent functionality for the Jodit editor. This plugin adds toolbar buttons and keyboard shortcuts to increase or decrease the indentation of block elements.

## Features

- Indent (increase indentation) button
- Outdent (decrease indentation) button
- Keyboard shortcuts (Ctrl/Cmd+] and Ctrl/Cmd+[)
- RTL (right-to-left) text direction support
- Smart handling of BR mode and block mode
- Automatic block wrapping when needed
- Prevents negative indentation
- Table cell padding support
- Preserves selection across multiple blocks

## Configuration Options

### `indentMargin`

**Type:** `number`

**Default:** `10`

The number of pixels to use for indenting the current line or block.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    indentMargin: 30
});
```

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor');
// Use indent/outdent buttons in toolbar or keyboard shortcuts
```

### Custom Indent Margin

```typescript
const editor = Jodit.make('#editor', {
    indentMargin: 20
});
```

### Programmatic Usage

```typescript
const editor = Jodit.make('#editor');

// Indent current block
editor.execCommand('indent');

// Outdent current block
editor.execCommand('outdent');
```

### Keyboard Shortcuts

- **Indent**: `Ctrl+]` (Windows/Linux) or `Cmd+]` (Mac)
- **Outdent**: `Ctrl+[` (Windows/Linux) or `Cmd+[` (Mac)

### With BR Mode

```typescript
const editor = Jodit.make('#editor', {
    enter: 'br',
    indentMargin: 15
});
```

## How It Works

### Plugin Initialization

1. **Button Registration**: Registers `indent` and `outdent` buttons in `indent` toolbar group
2. **Command Registration**: Registers `indent` and `outdent` commands with hotkeys
3. **Icon Loading**: Loads SVG icons for both buttons

### Indent/Outdent Command Execution

When indent or outdent command is executed:

1. **Mode Detection**: Checks if editor is in BR mode (`enter: 'br'`)
2. **Selection Handling**:
   - If collapsed selection in BR mode: Wraps content in block
   - Otherwise: Processes each selection range
3. **Block Discovery**: Finds nearest block element containing the cursor
4. **Block Wrapping**: If no block exists, wraps inline content in block
5. **Indentation Application**: Adjusts margin/padding value
6. **Duplicate Prevention**: Tracks processed elements to avoid duplicate processing

### Direction and Property Selection

The plugin automatically selects the correct CSS property based on:

- **Text Direction**: `marginLeft` for LTR, `marginRight` for RTL
- **Element Type**: `paddingLeft`/`paddingRight` for table cells, `marginLeft`/`marginRight` for other blocks

Selection logic:
```typescript
`${Dom.isCell(box) ? 'padding' : 'margin'}${direction === 'rtl' ? 'Right' : 'Left'}`
```

### Indentation Calculation

For each block element:

1. **Current Value**: Reads existing margin/padding value
2. **Calculate New Value**:
   - Indent: `currentValue + indentMargin`
   - Outdent: `currentValue - indentMargin`
3. **Apply Value**: Sets new value as inline style
4. **Cleanup**: Removes empty `style` attribute if value becomes 0

### BR Mode Handling

In BR mode with collapsed selection:

1. **Inline Wrap**: Uses `Dom.wrapNextInline()` to wrap content
2. **Block Creation**: Creates block using `enterBlock` configuration
3. **Apply Indent**: Applies indentation to created block

### Block Mode Handling

In block mode (`enter: 'p'` or `enter: 'div'`):

1. **Find/Create Block**: Finds existing block or wraps content
2. **Apply Indent**: Applies indentation to block
3. **Multiple Selections**: Processes each selection independently

### Outdent Button State

The outdent button is automatically disabled when:

- Current block has no indentation
- Indentation value is 0 or negative
- No current block element exists

## Commands

### `indent`

Increases indentation of current block element(s).

**Hotkeys:** `Ctrl+]`, `Cmd+]`

**Example:**
```typescript
editor.execCommand('indent');
```

### `outdent`

Decreases indentation of current block element(s).

**Hotkeys:** `Ctrl+[`, `Cmd+[`

**Example:**
```typescript
editor.execCommand('outdent');
```

## Edge Cases

1. **No Block Element**: Automatically wraps inline content in appropriate block before indenting
2. **BR Mode**: Uses `enterBlock` for wrapping instead of `enter`
3. **Multiple Selections**: Each selection range is processed independently
4. **Duplicate Processing**: Tracks processed elements to prevent double-processing
5. **Table Cells**: Uses `padding` instead of `margin` for table cell indentation
6. **RTL Direction**: Automatically uses `marginRight`/`paddingRight` for right-to-left text
7. **Negative Values**: Prevents negative indentation by setting minimum value to 0
8. **Empty Style**: Removes `style` attribute if it becomes empty after setting margin to 0
9. **Selection Preservation**: Saves and restores selection for each processed range

## Notes

- Indentation is applied as inline styles on block elements
- The plugin works with both LTR and RTL text directions
- Table cells receive padding instead of margin for proper rendering
- Multiple selected blocks are all indented/outdented together
- The plugin automatically creates block wrappers when needed
- Outdent button shows disabled state when no indentation exists
- Keyboard shortcuts work in both Windows/Linux and Mac
- The plugin respects `enter` and `enterBlock` configuration options
- Selection is preserved across indent/outdent operations
- Both buttons appear in the `indent` toolbar group