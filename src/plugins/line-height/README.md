# Line Height Plugin

Provides line height (line spacing) control for the Jodit editor. This plugin adds a toolbar button with dropdown to adjust line height of text blocks, with support for default editor-wide line height and per-block customization.

## Features

- Line height dropdown button in toolbar
- Customizable list of available line heights
- Default line height for entire editor
- Apply line height to selected blocks
- Toggle behavior (reselecting same value removes it)
- Automatic block wrapping when needed
- Preserves selection across operations
- Remembers last selected value

## Configuration Options

### `defaultLineHeight`

**Type:** `number | null`

**Default:** `null`

Sets the default line height for the entire editor. Applied to the editor's root element. When `null`, no default line height is set.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    defaultLineHeight: 1.5
});
```

### Control Configuration: `lineHeight`

The line height button can be customized through the `controls` configuration:

**Properties:**
- `command`: `'applyLineHeight'`
- `list`: `[1, 1.1, 1.2, 1.3, 1.4, 1.5, 2]` - Available line height values

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    controls: {
        lineHeight: {
            list: Jodit.atom([1, 1.2, 1.5, 2, 2.5, 3])
        }
    }
});
```

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor');
// Use line height button in toolbar
```

### With Default Line Height

```typescript
const editor = Jodit.make('#editor', {
    defaultLineHeight: 1.6
});
```

### Custom Line Height List

```typescript
const editor = Jodit.make('#editor', {
    controls: {
        lineHeight: {
            list: Jodit.atom([1, 1.5, 2, 2.5, 3, 3.5])
        }
    }
});
```

### Compact List

```typescript
const editor = Jodit.make('#editor', {
    controls: {
        lineHeight: {
            list: Jodit.atom([1, 1.5, 2])
        }
    }
});
```

### Programmatic Usage

```typescript
const editor = Jodit.make('#editor');

// Apply line height 1.5
editor.execCommand('applyLineHeight', false, 1.5);

// Apply line height 2
editor.execCommand('applyLineHeight', false, 2);
```

### With Default and Custom List

```typescript
const editor = Jodit.make('#editor', {
    defaultLineHeight: 1.4,
    controls: {
        lineHeight: {
            list: Jodit.atom([1, 1.2, 1.4, 1.6, 1.8, 2])
        }
    }
});
```

## How It Works

### Plugin Initialization

1. **Button Registration**: Registers `lineHeight` button in `font` toolbar group
2. **Language Loading**: Extends language files with line height translations
3. **Default Application**: Sets `defaultLineHeight` on editor root element (if configured)
4. **Command Registration**: Registers `applyLineHeight` command

### Line Height Application

When line height is applied:

1. **Focus Check**: Ensures editor is focused
2. **Selection Save**: Saves current selection
3. **Block Processing**:
   - For collapsed cursor: Inserts fake node, applies to containing block, removes fake node
   - For text selection: Applies to all blocks in selection via `eachSelection`
4. **Block Discovery**: Finds nearest block element containing cursor/selection
5. **Block Wrapping**: If no block exists, wraps content in block using `enter` config
6. **Toggle Detection**: Checks if block already has the target line height
7. **Style Application**:
   - If different value: Sets `line-height` CSS property
   - If same value: Removes `line-height` (toggle off)
8. **Selection Restore**: Restores saved selection

### Toggle Behavior

The plugin implements toggle logic:

```typescript
const previousValue = css(parentBlock, 'lineHeight');
const addStyle = previousValue.toString() !== value.toString();
css(parentBlock, 'lineHeight', addStyle ? value : null);
```

- First time applying value: Sets line height
- Reselecting same value: Removes line height (returns to default)
- Selecting different value: Changes to new line height

### Default Line Height

The `defaultLineHeight` is applied as:

```typescript
css(jodit.editor, { lineHeight: jodit.o.defaultLineHeight });
```

This sets the CSS `line-height` property on the editor's root element, affecting all content unless overridden.

On destruction:

```typescript
css(jodit.editor, { lineHeight: null });
```

This removes the default line height when editor is destroyed.

### Value Memorization

The control uses `memorizeExec` helper which:

- Remembers the last selected line height value
- Pre-fills this value on subsequent uses
- Provides consistent UX for repeated actions

## Commands

### `applyLineHeight`

Applies line height to block elements containing cursor or selection.

**Syntax:**
```typescript
editor.execCommand('applyLineHeight', false, value: number)
```

**Parameters:**
- `value` (number): Line height value (e.g., 1.5, 2, 2.5)

**Example:**
```typescript
// Apply line height 1.8
editor.execCommand('applyLineHeight', false, 1.8);
```

## Control Configuration

### `lineHeight` Control

**Default Configuration:**
```typescript
{
    command: 'applyLineHeight',
    tags: ['ol'],  // Associated tags (note: seems unusual for line-height)
    tooltip: 'Line height',
    list: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 2]
}
```

**Customization:**

Use `Jodit.atom()` to completely replace the list:

```typescript
controls: {
    lineHeight: {
        list: Jodit.atom([1, 1.5, 2, 3])
    }
}
```

Without `Jodit.atom()`, custom configuration merges with defaults.

## Edge Cases

1. **No Block Element**: Automatically wraps inline content in block before applying line height

2. **Collapsed Selection**: Uses fake node insertion to identify target block

3. **Multiple Blocks**: Applies line height to all blocks in selection range

4. **Toggle Same Value**: Selecting current line height removes it (returns to default/inherited)

5. **Default Conflicts**: Block-level line height overrides editor's `defaultLineHeight`

6. **Numeric Values**: List should contain numbers (1, 1.5, 2) not strings

7. **Default Null**: When `defaultLineHeight` is `null`, no default is set (uses browser/CSS defaults)

8. **Selection Preservation**: Uses fake node technique to maintain cursor position

## Notes

- Line height is applied as inline `style` attribute on block elements
- The button appears in the `font` toolbar group
- Default line height applies to entire editor via root element styling
- Block-specific line heights override the default
- The control's `tags` property lists `['ol']` which seems unrelated to line height
- Values in the list are unitless (CSS line-height relative values)
- Toggle behavior allows removing line height by reselecting same value
- The plugin uses `memorizeExec` to remember last selected value
- Plugin properly cleans up default line height on editor destruction
- Line height affects vertical spacing between lines in paragraphs and other block elements
- Use `Jodit.atom()` when replacing the entire list to avoid merging with defaults
- The plugin works with any block element type (paragraphs, headings, lists, etc.)