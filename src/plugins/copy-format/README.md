# Copy Format Plugin

Provides a "Format Painter" tool for copying and applying text/element formatting from one place to another.

## Description

This plugin adds a "copyformat" button (paint brush icon) that allows users to copy all formatting from one element and apply it to another element. It copies 13 CSS properties including fonts, colors, spacing, borders, and decorations.

## Features

- **Format Painter Button**: Click to copy, click again to paste formatting
- **Visual Feedback**: Button shows active state when format is copied
- **Smart Style Detection**: Inherits styles from parent elements
- **13 CSS Properties**: Copies comprehensive formatting
- **Works on Any Element**: Text, images, blocks, etc.

## Copied CSS Properties

The plugin copies these 13 CSS properties:

1. `fontWeight` - Bold, normal, etc.
2. `fontStyle` - Italic, normal
3. `fontSize` - Font size
4. `color` - Text color
5. `margin` - Outer spacing
6. `padding` - Inner spacing
7. `borderWidth` - Border thickness
8. `borderStyle` - Border type (solid, dashed, etc.)
9. `borderColor` - Border color
10. `borderRadius` - Rounded corners
11. `backgroundColor` - Background color
12. `textDecorationLine` - Underline, line-through, etc.
13. `fontFamily` - Font typeface

## Button

- **Name**: `copyformat`
- **Group**: `clipboard`
- **Tooltip**: "Paint format"
- **Icon**: Paint brush

## Usage Examples

### Basic Format Copying

```javascript
const editor = Jodit.make('#editor');

// User workflow:
// 1. Click somewhere in formatted text
// 2. Click the copyformat button (button becomes active)
// 3. Click on target text to apply formatting
// 4. Format is applied, button returns to normal state
```

### Cancel Format Copy

```javascript
const editor = Jodit.make('#editor');

// User workflow:
// 1. Click copyformat button (activates)
// 2. Click copyformat button again (cancels)
```

### Programmatic Usage

```javascript
const editor = Jodit.make('#editor');

// Check if format is being copied
const isActive = editor.buffer.exists('copy-format');
console.log('Format copy active:', isActive);

// Note: This plugin works via button clicks
// There's no direct execCommand for this feature
```

### Custom Toolbar

```javascript
const editor = Jodit.make('#editor', {
  buttons: ['bold', 'italic', 'copyformat', 'brush']
});
```

## How It Works

### Copy Phase

1. User clicks on formatted text/element
2. User clicks `copyformat` button
3. Plugin finds the nearest element (not text node)
4. Plugin reads all 13 CSS properties from that element
5. If a property equals the default, it looks up the parent chain
6. Stores format in editor buffer with key `'copy-format'`
7. Attaches `mouseup` event listener to editor
8. Button shows active state

### Paste Phase

1. User clicks on target text/element
2. `mouseup` event fires
3. Plugin retrieves format from buffer
4. If target is an `<img>`, applies styles directly via `css()`
5. Otherwise, uses `editor.s.commitStyle()` to apply formatting
6. Removes buffer data and event listener
7. Button returns to normal state

### Style Inheritance

The plugin intelligently handles inherited styles:

```javascript
// If element's style matches default (inherited from parent)
// Plugin walks up the DOM tree to find actual styled ancestor
// This prevents copying default/inherited values
```

## Notes

- Works with any HTML element (text, images, blocks)
- Button has toggle behavior (click to activate, click again to cancel)
- Uses `editor.buffer` for temporary storage
- Removes event listener after paste or cancel
- Border styles only copied if border width exists
- Default styles are calculated using a temporary `<span>` element
- Format is lost if user clicks `copyformat` button again before pasting