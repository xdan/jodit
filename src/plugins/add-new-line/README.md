# Add New Line Plugin

Creates a floating button that appears near block elements (tables, images, iframes, etc.) allowing users to insert new paragraphs before or after them.

## Description

This plugin solves the problem of adding content before or after large block elements like tables or images. When you hover near the top or bottom edge of these elements, a floating button with an "enter" icon appears. Clicking it inserts a new paragraph at that position.

Additionally, the plugin supports double-clicking on empty space in the editor to quickly add a new paragraph.

## Features

- **Floating Button**: Appears when hovering near edges of trigger elements
- **Configurable Triggers**: Specify which HTML tags should show the button
- **Double-Click Support**: Add paragraphs by double-clicking empty editor space
- **Position Detection**: Automatically detects whether to insert before or after the element
- **Customizable Sensitivity**: Adjust the hover distance threshold

## Configuration Options

### `addNewLine`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Enable/disable the plugin

```javascript
const editor = Jodit.make('#editor', {
    addNewLine: false // Disable the plugin
});
```

### `addNewLineTagsTriggers`
- **Type**: `HTMLTagNames[]`
- **Default**: `['table', 'iframe', 'img', 'hr', 'pre', 'jodit']`
- **Description**: HTML tags that trigger the floating button

```javascript
const editor = Jodit.make('#editor', {
    addNewLineTagsTriggers: ['table', 'img', 'video'] // Custom trigger tags
});
```

### `addNewLineOnDBLClick`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Insert paragraph on double-click in empty editor space

```javascript
const editor = Jodit.make('#editor', {
    addNewLineOnDBLClick: false // Disable double-click feature
});
```

### `addNewLineDeltaShow`
- **Type**: `number`
- **Default**: `20`
- **Description**: Distance in pixels from element edge to show the button

```javascript
const editor = Jodit.make('#editor', {
    addNewLineDeltaShow: 30 // Larger activation area
});
```

## Usage Examples

### Basic Usage

```javascript
// Plugin enabled by default
const editor = Jodit.make('#editor');
```

### Custom Configuration

```javascript
const editor = Jodit.make('#editor', {
    addNewLine: true,
    addNewLineTagsTriggers: ['table', 'img'],
    addNewLineDeltaShow: 15,
    addNewLineOnDBLClick: true
});
```

### Disable for Specific Elements

```javascript
const editor = Jodit.make('#editor', {
    addNewLineTagsTriggers: ['table'] // Only show button for tables
});
```

### Complete Disable

```javascript
const editor = Jodit.make('#editor', {
    addNewLine: false,
    // or
    disablePlugins: ['addNewLine']
});
```

## How It Works

1. **Hover Detection**: When you move your mouse near the top or bottom edge of a trigger element (within `addNewLineDeltaShow` pixels), the floating button appears
2. **Click Action**: Clicking the button inserts a new paragraph (`<p>` or configured `enter` tag) before or after the element
3. **Cursor Positioning**: The cursor is automatically placed in the new paragraph
4. **Smart Hiding**: The button hides when you scroll, click elsewhere, or make content changes

## Notes

- The button only appears for elements specified in `addNewLineTagsTriggers`
- Works in both readonly and edit modes (hidden in readonly)
- The button respects the `enter` configuration option for paragraph tag type
