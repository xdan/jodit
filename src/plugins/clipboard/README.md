# Clipboard Plugin

Handles copy, cut, paste, and select all operations with toolbar buttons and keyboard shortcuts.

## Description

This plugin provides clipboard functionality for the editor, including:
- Copy selected content (HTML + plain text)
- Cut selected content and remove it
- Paste functionality (handled separately by paste plugin)
- Select all content
- Internal buffer storage for clipboard data

## Features

- **4 Toolbar Buttons**: Cut, Copy, Paste, Select All
- **Clipboard Events**: Intercepts browser copy/cut events
- **Dual Format**: Stores both HTML and plain text
- **Internal Buffer**: Saves clipboard data to editor's internal buffer
- **Smart Disable**: Cut/Copy buttons disabled when no selection
- **Event Hooks**: `afterCopy` event for custom handling

## Buttons

All buttons are in the `clipboard` toolbar group:

### Cut
- **Command**: `cut`
- **Disabled**: When selection is collapsed (no text selected)
- **Shortcut**: Browser default (Ctrl+X / Cmd+X)
- **Action**: Copies selection and removes it

### Copy
- **Command**: `copy`
- **Disabled**: When selection is collapsed
- **Shortcut**: Browser default (Ctrl+C / Cmd+C)
- **Action**: Copies selection without removing

### Paste
- **Command**: `paste`
- **Shortcut**: Browser default (Ctrl+V / Cmd+V)
- **Note**: Paste logic is handled by the separate `paste` plugin

### Select All
- **Command**: `selectall`
- **Shortcut**: Browser default (Ctrl+A / Cmd+A)
- **Action**: Selects all editor content

## Usage Examples

### Programmatic Commands

```javascript
const editor = Jodit.make('#editor');

// Copy selected text
editor.execCommand('copy');

// Cut selected text
editor.execCommand('cut');

// Select all content
editor.execCommand('selectall');
```

### Listen to Copy Event

```javascript
const editor = Jodit.make('#editor');

editor.events.on('afterCopy', (html) => {
  console.log('Copied HTML:', html);
  // Custom handling after copy
});
```

### Custom Toolbar

```javascript
const editor = Jodit.make('#editor', {
  buttons: ['bold', 'italic', '|', 'cut', 'copy', 'paste']
});
```

### Disable Specific Buttons

```javascript
const editor = Jodit.make('#editor', {
  buttons: Jodit.defaultOptions.buttons.filter(btn =>
    btn !== 'cut' && btn !== 'copy'
  )
});
```

## How It Works

### Copy/Cut Flow

1. User triggers copy/cut (button click or keyboard shortcut)
2. Plugin intercepts the browser's clipboard event
3. Gets selected HTML from editor
4. Sets clipboard data:
   - `text/html`: Full HTML markup
   - `text/plain`: Stripped plain text
5. Stores data in internal buffer (`CLIPBOARD_ID`)
6. Fires `pasteStack` event with the data
7. If cut: removes selection and refocuses editor
8. Fires `afterCopy` event

### Internal Buffer

The plugin uses `editor.buffer` to store clipboard data:

```javascript
// Access clipboard data from buffer
const clipboardData = editor.buffer.get(CLIPBOARD_ID);
```

## Configuration

This plugin has no specific configuration options. It works with browser's native clipboard API.

## Events

### `afterCopy`

Fired after copy/cut operation completes.

**Parameters:**
- `html: string` - The HTML content that was copied

```javascript
editor.events.on('afterCopy', (html) => {
  // Custom logic
});
```

### `pasteStack`

Fired to add copied content to paste stack.

**Parameters:**
- `data: { html: string, action: string }`

## Notes

- Buttons automatically disable when there's no selection (for cut/copy)
- Works with browser's native clipboard API
- Stores both HTML and plain text formats
- Internal buffer persists data for paste operations
- The actual paste handling is done by the `paste` plugin
