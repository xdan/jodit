---
title: HR Plugin
description: Adds a toolbar button and command to insert horizontal rule separators, with cursor positioning and a following paragraph for continued typing.
keywords: jodit, hr plugin, horizontal rule, inserthorizontalrule, separator line, divider, block cleanup
---

# HR Plugin

Provides functionality to insert horizontal rule (`<hr>`) elements into the Jodit editor. This plugin adds a toolbar button and command for inserting horizontal lines that act as visual separators in content.

## Features

- Insert horizontal rule elements
- Automatic cursor positioning after insertion
- Smart block element handling
- Ensures proper document structure after insertion
- Creates following paragraph if needed
- Removes empty blocks automatically
- Toolbar button with icon
- Works with standard `insertHorizontalRule` command

## Configuration Options

### Control Configuration: `hr`

The `hr` control can be customized through the `controls` configuration:

**Properties:**
- `command`: `'insertHorizontalRule'` - The command to execute
- `tags`: `['hr']` - HTML tags associated with this control
- `tooltip`: `'Insert Horizontal Line'` - Tooltip text for the button

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    controls: {
        hr: {
            tooltip: 'Insert divider'
        }
    }
});
```

## Usage Examples

### Basic Usage

The plugin is enabled by default and provides an HR button in the toolbar:

```typescript
const editor = Jodit.make('#editor');
// Click the HR button in the toolbar to insert a horizontal line
```

### Programmatic Insertion

```typescript
const editor = Jodit.make('#editor');

// Insert horizontal rule at current cursor position
editor.execCommand('insertHorizontalRule');
```

### Insert with Event Handling

```typescript
const editor = Jodit.make('#editor');

editor.e.on('afterCommand', (command) => {
    if (command === 'insertHorizontalRule') {
        console.log('Horizontal rule inserted');
    }
});

editor.execCommand('insertHorizontalRule');
```

### Custom Button Configuration

```typescript
const editor = Jodit.make('#editor', {
    controls: {
        hr: {
            tooltip: 'Add separator line',
            tags: ['hr']
        }
    },
    buttons: ['bold', 'italic', 'hr', 'link']
});
```

### Disable HR Button

```typescript
const editor = Jodit.make('#editor', {
    buttons: ['bold', 'italic', 'underline', 'link']
    // HR button not included
});
```

### Insert Multiple HRs Programmatically

```typescript
const editor = Jodit.make('#editor');

// Insert multiple horizontal rules
editor.s.focus();
editor.execCommand('insertHorizontalRule');

// Move cursor and insert another
editor.s.insertHTML('<p>Some content</p>');
editor.execCommand('insertHorizontalRule');
```

## How It Works

### Plugin Initialization

1. **Icon Registration**: Loads the HR SVG icon
2. **Button Registration**: Registers the `hr` toolbar button in the `insert` group
3. **Command Registration**: Registers the `insertHorizontalRule` command handler

### Horizontal Rule Insertion

When the `insertHorizontalRule` command is executed:

1. **Element Creation**: Creates an `<hr>` element using `editor.createInside.element('hr')`

2. **Initial Insertion**: Inserts the HR element at the current cursor position using `editor.s.insertNode()`

3. **Block Cleanup**: Checks if the HR was inserted inside an empty block element:
   - Finds the nearest block parent of the HR
   - If the block is empty, not the editor root, and can't hold other blocks (not in `dtd.blockLimits`, so not a list item, a table cell or a `<div>`)
   - Moves the HR after the block
   - Removes the empty block

4. **Cursor Positioning**: Places the cursor right after the HR:
   - If a block follows the HR, at the start of that block
   - If text follows the HR, or the HR is in a line of text in a list item or table cell, after the HR, so the text goes on after the line
   - Otherwise creates a new element of the `editor.o.enter` type after the HR and places the cursor in it

5. **Return Value**: Returns `false` to prevent default browser behavior

### Empty Block Detection

The plugin checks for empty blocks:

```typescript
if (
    block &&
    Dom.isEmpty(block) &&
    block !== editor.editor &&
    !editor.o.dtd?.blockLimits[block.nodeName.toLowerCase()]
) {
    // Block is empty, not the editor root, and can't hold other blocks
    Dom.after(block, elm);  // Move HR after block
    Dom.safeRemove(block);  // Remove empty block
}
```

### Paragraph Creation

If nothing follows the HR, and it isn't in a line of text in a list item or table cell:

```typescript
const p = editor.createInside.element(editor.o.enter);
Dom.after(elm, p);
editor.s.setCursorIn(p);
```

This ensures users can continue typing after inserting an HR.

## Commands

### `insertHorizontalRule`

Inserts a horizontal rule element at the current cursor position.

**Syntax:**
```typescript
editor.execCommand('insertHorizontalRule'): false
```

**Returns:** `false` to prevent default browser behavior

**Example:**
```typescript
// Place cursor where you want the HR
editor.s.focus();

// Insert horizontal rule
editor.execCommand('insertHorizontalRule');

// Cursor is automatically positioned after the HR
```

## Edge Cases

1. **Empty Block**: If the cursor is in an empty block (e.g., empty `<p>`), the plugin removes the empty block and inserts the HR

2. **No Following Block**: If nothing follows the HR, the plugin creates a new paragraph so the user can continue typing. In a list item or table cell, the cursor goes after the HR instead

3. **End of Document**: When inserting at the end of the document, a new paragraph is automatically created after the HR

4. **Inside Block**: If the HR is inserted inside a block with content, the block is split and the HR is placed between the parts

5. **Multiple Insertions**: Each insertion creates a new HR element and positions the cursor properly

6. **Empty Editor**: Inserting an HR into an empty editor creates both the HR and a following paragraph

7. **Selection**: If text is selected when the command executes, the selection is replaced with the HR

8. **Nested Blocks**: In a list item or table cell the HR stays in it, at the cursor, as the browsers' own `insertHorizontalRule` places it (`<li>One<hr>|</li>`)

## Notes

- The plugin uses `editor.o.enter` to determine what type of block element to create after the HR (usually `<p>` or `<div>`)
- Horizontal rules are self-closing elements and cannot contain content
- The cursor is always positioned right after the HR, allowing immediate typing
- Empty blocks are removed to maintain clean HTML structure
- The plugin uses `Dom.safeRemove()` to safely remove elements without breaking the DOM
- The `insertNode` method is called with `false, false` parameters to avoid splitting the current node
- The plugin looks for the next block among the HR's own siblings, so the cursor doesn't leave the list item or table cell
- HR elements are created using `createInside` to ensure they belong to the editor's document context
- The command returns `false` to prevent any default browser insertion behavior
- The button is assigned to the `insert` group in the toolbar