# Focus Plugin

Manages editor focus behavior including autofocus on load, cursor positioning, and selection persistence on blur.

## Description

This plugin handles three focus-related features:
1. **Autofocus**: Automatically focuses editor after initialization
2. **Cursor Positioning**: Places cursor at start or end after autofocus
3. **Selection Persistence**: Saves and restores selection when editor loses/regains focus
4. **Empty Block Focus**: Focuses empty blocks when clicked

## Features

- **Autofocus on Load**: Focus editor automatically after page load
- **Cursor Position Control**: Choose start or end position for initial cursor
- **Selection Saving**: Preserves selection when editor loses focus
- **Selection Restoring**: Restores saved selection when editor regains focus
- **Empty Block Handling**: Sets cursor in empty block elements when clicked
- **Timeout Support**: Delays autofocus by 300ms if `defaultTimeout` is set

## Configuration Options

### `autofocus`

Automatically focus editor after initialization.

- **Type**: `boolean`
- **Default**: `false`

```javascript
const editor = Jodit.make('#editor', {
  autofocus: true
});
```

**Behavior:**
- When `true`: Editor focuses automatically after page load
- When `false`: User must click to focus editor

### `cursorAfterAutofocus`

Cursor position after autofocus.

- **Type**: `'start' | 'end'`
- **Default**: `'end'`

```javascript
const editor = Jodit.make('#editor', {
  autofocus: true,
  cursorAfterAutofocus: 'end' // or 'start'
});
```

**Options:**
- `'end'`: Places cursor at end of content (default)
- `'start'`: Places cursor at beginning of content

### `saveSelectionOnBlur`

Save selection when editor loses focus and restore when it regains focus.

- **Type**: `boolean`
- **Default**: `true`

```javascript
const editor = Jodit.make('#editor', {
  saveSelectionOnBlur: true
});
```

**Behavior:**
- When `true`: Selection is saved on blur and restored on focus
- When `false`: Selection is lost when editor loses focus

## Usage Examples

### Basic Autofocus

```javascript
const editor = Jodit.make('#editor', {
  autofocus: true
});

// Editor automatically focuses after load
// Cursor positioned at end of content
```

### Cursor at Start

```javascript
const editor = Jodit.make('#editor', {
  autofocus: true,
  cursorAfterAutofocus: 'start'
});

// Editor focuses with cursor at beginning
```

### Cursor at End

```javascript
const editor = Jodit.make('#editor', {
  autofocus: true,
  cursorAfterAutofocus: 'end'
});

// Editor focuses with cursor at end (default)
```

### Disable Selection Saving

```javascript
const editor = Jodit.make('#editor', {
  saveSelectionOnBlur: false
});

// Selection is NOT saved when editor loses focus
// User must reselect text after clicking back
```

### Delayed Autofocus

```javascript
const editor = Jodit.make('#editor', {
  autofocus: true,
  defaultTimeout: 100 // or any value
});

// Autofocus happens after 300ms delay
// Useful to avoid race conditions with other scripts
```

### Disable Autofocus

```javascript
const editor = Jodit.make('#editor', {
  autofocus: false // default
});

// Editor does not focus automatically
// User must click to focus
```

### Multiple Editors with Autofocus

```javascript
// Only one editor should have autofocus to avoid conflicts
const editor1 = Jodit.make('#editor1', {
  autofocus: true
});

const editor2 = Jodit.make('#editor2', {
  autofocus: false
});
```

## How It Works

### Autofocus Flow

1. Plugin listens to `afterInit` event
2. Checks if `autofocus` option is `true`
3. If `defaultTimeout` exists, delays focus by 300ms
4. Otherwise, focuses immediately
5. Calls internal `focus()` function

### Focus Function

```javascript
const focus = () => {
  editor.s.focus(); // Focus editor

  if (cursorAfterAutofocus === 'end') {
    // Find last text node
    const lastTextNode = Dom.last(editor.editor, Dom.isText);

    if (lastTextNode) {
      // Place cursor at end of last text node
      editor.s.setCursorIn(lastTextNode, false);
    }
  }
  // If 'start', default behavior places cursor at start
};
```

### Selection Persistence

**On Blur:**
```javascript
editor.e.on('blur', () => {
  if (editor.isEditorMode()) {
    editor.s.save(true); // Save current selection
  }
});
```

**On Focus:**
```javascript
editor.e.on('focus', () => {
  editor.s.restore(); // Restore saved selection
});
```

**Purpose:** Allows user to click outside editor (to toolbar, buttons, etc.) without losing their text selection.

### Empty Block Click Handling

Plugin listens for mousedown on editor:

```javascript
editor.editor.addEventListener('mousedown', (e) => {
  const target = e.target;

  // Check if clicked on empty block element
  if (Dom.isBlock(target) && !target.childNodes.length) {
    if (target === editor.editor) {
      editor.s.focus(); // Focus editor root
    } else {
      editor.s.setCursorIn(target); // Focus empty block
    }
  }
});
```

**Behavior:** Clicking empty `<div>`, `<p>`, etc. places cursor inside.

## Events

This plugin hooks into:

### `afterInit`

Handles autofocus logic after editor initialization.

### `afterAddPlace`

Sets up empty block click handlers when new editing area is added.

### `blur`

Saves selection when editor loses focus (if `saveSelectionOnBlur` is true).

### `focus`

Restores saved selection when editor regains focus (if `saveSelectionOnBlur` is true).

## Edge Cases

### 1. Autofocus with Empty Editor
```javascript
// Empty editor with autofocus
const editor = Jodit.make('#editor', {
  autofocus: true,
  cursorAfterAutofocus: 'end'
});

// Cursor placed at editor root since no text nodes exist
```

### 2. Autofocus with cursorAfterAutofocus: 'start'
```javascript
const editor = Jodit.make('#editor', {
  autofocus: true,
  cursorAfterAutofocus: 'start'
});

// Default focus behavior places cursor at start
// No special handling needed
```

### 3. Selection Persistence
```javascript
// User selects text: "Hello |World|"
// User clicks outside editor (blur event)
// Selection saved
// User clicks back into editor (focus event)
// Selection restored: "Hello |World|"
```

### 4. Empty Block Click
```javascript
editor.value = '<p>Text</p><div></div><p>More</p>';

// User clicks on empty <div>
// Cursor placed inside: <div>|</div>
```

### 5. Multiple Editors
```javascript
// Only last editor with autofocus will have focus
const editor1 = Jodit.make('#editor1', { autofocus: true });
const editor2 = Jodit.make('#editor2', { autofocus: true });
// editor2 will be focused
```

## Configuration

Full configuration example:

```javascript
const editor = Jodit.make('#editor', {
  autofocus: true,
  cursorAfterAutofocus: 'end',
  saveSelectionOnBlur: true
});
```

To disable plugin:

```javascript
const editor = Jodit.make('#editor', {
  disablePlugins: ['focus']
});
```

## Notes

- Autofocus only works in editor mode (not source mode)
- 300ms delay applied if `defaultTimeout` option exists
- Selection persistence only works in editor mode
- `cursorAfterAutofocus: 'end'` finds last text node and places cursor there
- `cursorAfterAutofocus: 'start'` uses default focus behavior
- Empty block handling prevents clicking "dead space" in editor
- Only one editor should have `autofocus: true` to avoid conflicts
- Selection is saved with `editor.s.save(true)` (true = save to buffer)
- Selection is restored with `editor.s.restore()`
- Uses namespace `.autofocus` for event handlers