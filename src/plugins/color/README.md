# Color Plugin

Provides text color and background color selection with a visual color picker.

## Description

This plugin adds a "brush" button to the toolbar that opens a color picker popup. Users can select colors for text (foreground) or background, with support for both predefined color palettes and custom colors.

## Features

- **Brush Button**: Visual color picker dropdown
- **Two Color Modes**: Text color and background color
- **Tabbed Interface**: Separate tabs for background and text color
- **Color Picker Widget**: Visual color selection with palette
- **Cell Color**: Special `brushCell` button for coloring table cells
- **Commands**: `forecolor` and `background` for programmatic use
- **Icon Updates**: Button icon shows currently selected color

## Buttons

### `brush`
- **Group**: `color`
- **Commands**: `forecolor`, `background`
- **Features**:
  - Opens tabbed popup with color picker
  - Icon fill color updates to show current selection
  - Applies color to selected text or current element

### `brushCell` (Table cells)
- **Icon**: `brush`
- **Features**:
  - Only visible when table cells are selected
  - Three tabs: Background, Text, Border colors
  - Applies color to all selected table cells

## Usage Examples

### Programmatic Color Application

```javascript
const editor = Jodit.make('#editor');

// Set text color
editor.execCommand('forecolor', false, '#ff0000');
editor.execCommand('forecolor', false, 'red');
editor.execCommand('forecolor', false, 'rgb(255, 0, 0)');

// Set background color
editor.execCommand('background', false, '#ffff00');
editor.execCommand('background', false, 'yellow');
```

### Remove Color

```javascript
// Remove text color
editor.execCommand('forecolor', false, '');

// Remove background color
editor.execCommand('background', false, '');
```

### Custom Toolbar

```javascript
const editor = Jodit.make('#editor', {
  buttons: ['bold', 'italic', 'brush', 'link']
});
```

### Listen to Color Changes

```javascript
const editor = Jodit.make('#editor');

editor.events.on('change', () => {
  // Colors are applied via inline styles
  // Check the editor's value for style attributes
});
```

## How It Works

### Color Application

1. User clicks brush button
2. Popup opens with color picker tabs (Background / Text)
3. User selects a color from palette or inputs custom color
4. Plugin applies color using `commitStyle`:
   - **Text color**: Sets `style.color`
   - **Background**: Sets `style.backgroundColor`
5. Icon fill updates to show selected color
6. Popup closes automatically

### Color Normalization

All color values are normalized to HEX format internally:
- Named colors: `red` → `#ff0000`
- RGB: `rgb(255,0,0)` → `#ff0000`
- Already HEX: `#ff0000` → `#ff0000`

### Table Cell Coloring

When table cells are selected:
1. `brushCell` button becomes available
2. Opens popup with 3 tabs: Background, Text, Border
3. Applies selected color to all selected cells via CSS

## Configuration

This plugin has no specific configuration options but respects:

```javascript
const editor = Jodit.make('#editor', {
  disablePlugins: ['color'] // Disable color plugin entirely
});
```

## Commands

### `forecolor`

Sets text color.

**Parameters:**
- `command`: `'forecolor'`
- `second`: (unused)
- `third`: Color value (HEX, RGB, or named color)

```javascript
editor.execCommand('forecolor', false, '#00ff00');
```

### `background`

Sets background color.

**Parameters:**
- `command`: `'background'`
- `second`: (unused)
- `third`: Color value (HEX, RGB, or named color)

```javascript
editor.execCommand('background', false, 'rgba(255, 255, 0, 0.5)');
```

## Color Picker Widget

The popup uses `ColorPickerWidget` which provides:
- Predefined color palette
- Custom color input
- Color preview
- Recent colors (if configured)

## Notes

- Colors are applied as inline styles (`style` attribute)
- Button icon dynamically shows the current color
- Empty string removes the color style
- Works with text selection or at cursor position
- Table cell coloring requires table plugin
- Uses `commitStyle` method for proper style application
