# Paste Storage Plugin

Maintains a history of copied/pasted content in the editor. This plugin stores the last 5 copied items and provides a dialog for selecting and pasting from history using Ctrl+Shift+V keyboard shortcut.

## Features

- Stores last 5 copied items
- Dialog interface for paste history
- Keyboard navigation (Up/Down arrows)
- Preview pane showing selected item
- Ctrl+Shift+V / Cmd+Shift+V shortcut to open
- Click or double-click to paste
- Enter key to paste selected item
- Moves frequently used items to top
- Automatic cleanup on editor destruction
- Integration with paste button dropdown

## Configuration Options

This plugin has no configuration options. It works automatically when enabled.

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor');

// Copy some content (Ctrl+C)
// Copy more content
// Press Ctrl+Shift+V to open paste history
// Use arrow keys to navigate
// Press Enter or click to paste
```

### Programmatic Access

```typescript
const editor = Jodit.make('#editor');

// Open paste storage dialog
editor.execCommand('showPasteStorage');

// Check number of stored items
const count = editor.e.fire('pasteStorageList');
console.log(`${count} items in paste storage`);
```

### Disable Plugin

```typescript
Jodit.make('#editor', {
    disablePlugins: ['pasteStorage']
});
```

### Event Listeners

```typescript
const editor = Jodit.make('#editor');

// Listen for copy events
editor.e.on('afterCopy', (html) => {
    console.log('Content copied:', html);
});

// Check storage count
editor.e.on('pasteStorageList', () => {
    console.log('Storage list requested');
});
```

## How It Works

### Storage Management

1. **Copy Detection**: Listens to `afterCopy` event
2. **Duplicate Removal**: If HTML already exists in list, removes old entry
3. **Prepend**: Adds new item to beginning of list (`unshift`)
4. **Size Limit**: Maintains maximum of 5 items (truncates if exceeded)
5. **Persistence**: Storage is per-editor instance (not persisted between sessions)

### Dialog Interface

The dialog contains:

1. **List Box** (left side):
   - Shows numbered list of stored items
   - Items are truncated/stripped for display
   - Currently selected item has `jodit_active` class
   - Items are clickable links

2. **Preview Box** (right side):
   - Shows full HTML of selected item
   - Updates when selection changes

3. **Footer Buttons**:
   - Paste button (primary)
   - Cancel button

### Keyboard Navigation

- **Up Arrow**: Move to previous item (wraps to last if at first)
- **Down Arrow**: Move to next item (wraps to first if at last)
- **Enter**: Paste selected item and close dialog
- **Tab**: Navigate between list items

### Paste Operation

When pasting from storage:

1. **Focus**: Returns focus to editor
2. **Insert**: Inserts HTML at current cursor position
3. **Reorder**: If not first item, swaps with first item (most recently used goes to top)
4. **Close**: Closes dialog
5. **Sync**: Calls `synchronizeValues()` to update editor state
6. **Event**: Fires `afterPaste` event

### Dialog Opening

Dialog opens only if:
- At least 2 items in storage (`list.length < 2` blocks opening)
- Command `showPasteStorage` is executed (via hotkey or programmatically)

### Integration with Paste Button

The paste button (from paste plugin) shows paste storage as dropdown option:
- Uses `isChildDisabled()` check
- Disabled if fewer than 2 items in storage
- Fires `pasteStorageList` event to get count

## Commands

### `showPasteStorage`

Opens the paste storage dialog.

**Syntax:**
```typescript
editor.execCommand('showPasteStorage')
```

**Hotkeys:** `['ctrl+shift+v', 'cmd+shift+v']`

**Example:**
```typescript
// Open via command
editor.execCommand('showPasteStorage');

// Triggered by Ctrl+Shift+V or Cmd+Shift+V
```

## Events

### `afterCopy`

Fired after content is copied to clipboard. Plugin listens to this event to add items to storage.

**Parameters:**
- `html` (string): The copied HTML content

**Example:**
```typescript
editor.e.on('afterCopy', (html) => {
    console.log('Copied to storage:', html);
});
```

### `pasteStorageList`

Fired to get the count of items in paste storage. Used by paste button to determine if storage option should be enabled.

**Returns:** Number of items in storage

**Example:**
```typescript
const count = editor.e.fire('pasteStorageList');
console.log(`Storage has ${count} items`);
```

### `afterPaste`

Fired after content is pasted from storage (same as regular paste).

**Example:**
```typescript
editor.e.on('afterPaste', () => {
    console.log('Content pasted from storage');
});
```

## Edge Cases

1. **Empty Storage**: Dialog won't open if fewer than 2 items

2. **Duplicate Content**: Copying same content removes old entry and adds to top

3. **Storage Limit**: Only last 5 items kept; older items are discarded

4. **Item Reordering**: Pasting non-first item moves it to first position

5. **Dialog Reuse**: Dialog is created once and reused; content refreshed on each open

6. **Cleanup**: All storage cleared when editor is destroyed

7. **Selection Wrapping**: Arrow key navigation wraps around (top↔bottom)

8. **Focus Management**: Listbox items have `tab-index="-1"` to control focus order

9. **Double Click**: Double-clicking item immediately pastes without button click

10. **Event Namespacing**: Uses `.paste-storage` namespace for clean removal

## Notes

- Plugin is class-based, extends `Plugin` base class
- Storage is limited to 5 most recent items
- Items are stored as HTML strings
- Dialog uses `jodit-paste-storage` CSS class for styling
- List items show truncated text (removes whitespace with `SPACE_REG_EXP()`)
- Preview shows full HTML content
- The plugin integrates with copy/paste workflow automatically
- Hotkey (Ctrl+Shift+V) is standard clipboard history shortcut
- Dialog is modal and blocks editor interaction until closed
- Item reordering on paste implements most-recently-used (MRU) pattern
- The plugin uses async setTimeout for initial selection to ensure DOM is ready
- List box and preview box are separate divs within container
- Click handler uses event delegation on list box container
- Keyboard events are attached to individual list items
- Dialog footer uses Button components for consistent UI
- The plugin properly cleans up all DOM elements and event listeners on destruction
- Storage is per-editor instance (multiple editors have separate storage)
- No persistence between page reloads (storage is in-memory only)
- The `pasteStorageList` event enables paste button dropdown integration
- Dialog header uses localized text (`Choose Content to Paste`)
- List items use 1-based numbering for display
- The plugin prevents default link behavior on list items (uses `href="#"`)
- Preview updates immediately on selection change
- Paste operation focuses editor before inserting content

## Typical Use Case

Users frequently copy multiple pieces of content and want to paste an earlier copied item without re-copying it. The paste storage plugin solves this by:

1. Automatically tracking all copy operations
2. Providing quick access via Ctrl+Shift+V
3. Showing preview of each stored item
4. Allowing easy selection and pasting

This is especially useful when:
- Assembling content from multiple sources
- Reusing frequently copied snippets
- Working with repetitive content patterns
- Avoiding switching between applications to re-copy content