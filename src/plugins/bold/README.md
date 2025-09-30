# Bold Plugin

Provides text formatting buttons and commands for bold, italic, underline, strikethrough, subscript, and superscript styles.

## Description

This plugin adds 6 toolbar buttons and corresponding commands for common text formatting:
- **Bold** - `<strong>` or `<b>` tags, or `font-weight: bold` CSS
- **Italic** - `<em>` or `<i>` tags, or `font-style: italic` CSS
- **Underline** - `<u>` tag or `text-decoration-line: underline` CSS
- **Strikethrough** - `<s>` tag or `text-decoration-line: line-through` CSS
- **Subscript** - `<sub>` tag for subscript text
- **Superscript** - `<sup>` tag for superscript text

## Features

- **Toolbar Buttons**: 6 buttons in `font-style` and `script` groups
- **Keyboard Shortcuts**: Ctrl+B (bold), Ctrl+I (italic), Ctrl+U (underline)
- **Smart Detection**: Recognizes both HTML tags and CSS styles
- **Toggle Behavior**: Click again to remove formatting

## Button Groups

- **font-style group**: bold, italic, underline, strikethrough
- **script group**: subscript, superscript

## Usage Examples

### Programmatic Commands

```javascript
const editor = Jodit.make('#editor');

// Apply formatting
editor.execCommand('bold');         // Ctrl+B or Cmd+B
editor.execCommand('italic');       // Ctrl+I or Cmd+I
editor.execCommand('underline');    // Ctrl+U or Cmd+U
editor.execCommand('strikethrough');
editor.execCommand('subscript');
editor.execCommand('superscript');
```

### Custom Toolbar

```javascript
const editor = Jodit.make('#editor', {
  buttons: ['bold', 'italic', 'underline'],
  // Only show bold, italic, underline buttons
});
```

### Disable Specific Buttons

```javascript
const editor = Jodit.make('#editor', {
  buttons: Jodit.defaultOptions.buttons.filter(btn => {
    return btn !== 'strikethrough';
  })
});
```

### Change Keyboard Shortcuts

```javascript
// Customize via controls configuration
Jodit.defaultOptions.controls.bold.hotkeys = ['ctrl+shift+b'];
Jodit.defaultOptions.controls.italic.hotkeys = ['ctrl+shift+i'];

const editor = Jodit.make('#editor');
```

## Configuration

Each button is configured in `Jodit.defaultOptions.controls`:

### Bold
- **Tags**: `<strong>`, `<b>`
- **CSS**: `font-weight: bold` or `font-weight: 700`
- **Hotkeys**: `Ctrl+B`, `Cmd+B`

### Italic
- **Tags**: `<em>`, `<i>`
- **CSS**: `font-style: italic`
- **Hotkeys**: `Ctrl+I`, `Cmd+I`

### Underline
- **Tags**: `<u>`
- **CSS**: `text-decoration-line: underline`
- **Hotkeys**: `Ctrl+U`, `Cmd+U`

### Strikethrough
- **Tags**: `<s>`
- **CSS**: `text-decoration-line: line-through`

### Subscript
- **Tags**: `<sub>`

### Superscript
- **Tags**: `<sup>`

## Notes

- The plugin uses `commitStyle` method for applying formatting
- Supports both HTML tag-based and CSS-based formatting detection
- Works with text selection or at cursor position
- Automatically calls `synchronizeValues()` after formatting changes
