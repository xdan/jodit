# Delete Plugin

Provides custom implementation of the `delete` command with intelligent content merging, empty block cleanup, and cursor positioning.

## Description

This plugin overrides the browser's default `delete` command behavior to provide smarter deletion when text is selected. It handles merging blocks, cleaning up empty elements, managing lists and tables, and positioning the cursor correctly after deletion.

**Note**: This plugin extends the `backspace` plugin functionality and requires it as a dependency.

## Features

- **Smart Block Merging**: Merges left and right blocks after deletion
- **List Handling**: Manages list items and empty list elements
- **Table Support**: Adds `<br>` to empty table cells after deletion
- **Cursor Positioning**: Places cursor in correct editable position
- **Empty Block Cleanup**: Removes unnecessary empty blocks and `<br>` tags
- **Content Preservation**: Moves content from right block to left block
- **Full Editor Cleanup**: Clears editor if all content is deleted (except tables/images)

## Command

### `delete`

Deletes selected content with intelligent merging and cleanup.

**Parameters:**
- `command`: `'delete'`

```javascript
editor.execCommand('delete');
```

## Dependency

This plugin requires the `backspace` plugin:

```typescript
static override requires = ['backspace'];
```

If `backspace` plugin is disabled, this plugin won't work.

## Usage Examples

### Basic Deletion

```javascript
const editor = Jodit.make('#editor');
editor.value = '<p>Hello</p><p>World</p>';

// Select all text
editor.execCommand('selectall');

// Delete selection
editor.execCommand('delete');

console.log(editor.value); // Empty or default paragraph
```

### Programmatic Selection and Delete

```javascript
const editor = Jodit.make('#editor');
editor.value = '<p>First paragraph</p><p>Second paragraph</p>';

// Select some text programmatically
const range = editor.s.createRange();
range.selectNodeContents(editor.editor.firstChild);
editor.s.selectRange(range);

// Delete selected content
editor.execCommand('delete');
```

### Disable Plugin

```javascript
const editor = Jodit.make('#editor', {
  disablePlugins: ['delete']
  // Falls back to browser default delete behavior
});
```

### Listen to Delete Events

```javascript
const editor = Jodit.make('#editor');

editor.e.on('afterCommand', (command) => {
  if (command === 'delete') {
    console.log('Delete command completed');
  }
});

editor.e.on('beforeCommand', (command) => {
  if (command === 'delete') {
    console.log('Delete command starting');
    // Can prevent deletion by returning false
  }
});
```

## How It Works

### Main Delete Flow

1. **Check Selection**: If selection is collapsed (no text selected), do nothing
2. **Expand Selection**: Call `editor.s.expandSelection()` to include full blocks
3. **Delete Content**: Use `range.deleteContents()` to remove selected content
4. **Insert Marker**: Place temporary fake text node at deletion point
5. **Find Siblings**: Locate left and right sibling blocks
6. **Merge Content**: Move content from right block into left block
7. **Position Cursor**: Place cursor in correct editable position
8. **Cleanup**: Remove empty blocks and add `<br>` where needed
9. **Remove Marker**: Delete fake text node
10. **Select Range**: Set final cursor position

### Block Merging (`__moveContentInLeftSibling`)

```javascript
// Example: Deleting across two paragraphs
// Before: <p>Hel|lo</p><p>Wor|ld</p>
// After: <p>Held</p>

1. Define left sibling (handles lists specially)
2. Check if siblings are blocks (not lists/tables)
3. Append fake marker to left block
4. Move all content from right block to left block
5. Remove empty right block
6. Clean up empty list items if needed
```

### List Handling (`__defineRightLeftBox`)

When left sibling is a list:
1. Find the last list item (`<li>`)
2. If no leaf exists, create new `<li>`
3. Use that `<li>` as the merge target
4. This prevents merging into the `<ul>`/`<ol>` directly

### Empty Block Cleanup (`__addBrInEmptyBlock`)

After deletion:
1. If fake marker is alone in a block, add `<br>` for cursor positioning
2. If right sibling is a table, check first cell
3. If cell is empty, add `<br>` to keep it editable

### Post-Delete Cleanup (`__afterDeleteCommand`)

Fires on `afterCommand.delete` event:
1. Remove extra `<br>` from current element's first child
2. Check if editor is now empty (no text, images, tables, etc.)
3. If empty, clear `innerHTML` completely
4. Set cursor in editor root
5. Remove the cursor marker node

## Events

### `afterCommand.delete`

Fired after delete command completes.

```javascript
editor.e.on('afterCommand.delete', () => {
  console.log('Delete operation finished');
  console.log('Editor content:', editor.value);
});
```

## Edge Cases Handled

### 1. Deleting Across Block Boundaries
```html
<!-- Before -->
<p>Hello|</p><p>|World</p>

<!-- After -->
<p>Hello</p>
```

### 2. Deleting in Lists
```html
<!-- Before -->
<ul>
  <li>Item 1|</li>
  <li>|Item 2</li>
</ul>

<!-- After -->
<ul>
  <li>Item 1</li>
</ul>
```

### 3. Deleting Next to Tables
```html
<!-- Before -->
<p>Text|</p><table><tr><td>|Cell</td></tr></table>

<!-- After -->
<p>Text</p><table><tr><td><br></td></tr></table>
```

### 4. Deleting All Content
```html
<!-- Before -->
<p>|All content|</p>

<!-- After -->
<!-- Editor cleared completely -->
```

## Configuration

This plugin has no configuration options. To disable:

```javascript
const editor = Jodit.make('#editor', {
  disablePlugins: ['delete']
});
```

## Notes

- Requires `backspace` plugin as dependency
- Only works when selection is NOT collapsed (text is selected)
- Uses fake text node as temporary marker during processing
- Handles block-level merging intelligently
- Preserves table structure and adds `<br>` to empty cells
- Clears entire editor if all meaningful content is deleted
- Does NOT trigger on collapsed selection (use backspace plugin for that)
- Prevents default browser delete behavior by returning `false`