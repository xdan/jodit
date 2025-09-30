# Preview Plugin

Adds a preview button that opens a modal dialog displaying the editor's content as it would appear to end users. This plugin allows previewing the final output without leaving the editor.

## Features

- Preview button in toolbar
- Modal dialog displaying content
- Full WYSIWYG rendering
- Works in both source and WYSIWYG modes
- Configurable dialog size (1024x600px default)
- Clean up on dialog close
- Supports custom content via command
- Eye icon for button

## Configuration Options

This plugin has no additional configuration options beyond the control configuration.

## Controls

### `preview` Control

**Icon:** `'eye'`

**Command:** `'preview'`

**Mode:** `MODE_SOURCE + MODE_WYSIWYG` (available in both modes)

**Tooltip:** `'Preview'`

Opens a modal dialog showing a preview of the editor's content.

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor');
// Click Preview button in toolbar
```

### Programmatic Preview

```typescript
const editor = Jodit.make('#editor');

// Open preview dialog
editor.execCommand('preview');
```

### Preview Custom Content

```typescript
const editor = Jodit.make('#editor');

// Preview specific HTML
editor.execCommand('preview', false, '<h1>Custom Preview Content</h1>');
```

### Custom Button Configuration

```typescript
Jodit.make('#editor', {
    buttons: ['bold', 'italic', 'preview'],
    controls: {
        preview: {
            icon: 'eye',
            tooltip: 'Show Preview'
        }
    }
});
```

## How It Works

### Preview Dialog Creation

When preview command is executed:

1. **Dialog Creation**: Creates new dialog via `editor.dlg()`
2. **Size Setting**: Sets dialog size to 1024x600px
3. **Modal Mode**: Sets dialog as modal (blocks editor interaction)
4. **Title**: Sets header to localized "Preview"
5. **Content Rendering**: Calls `previewBox()` helper to render content
6. **Cleanup**: Registers cleanup function for dialog close event

### Content Source

The preview uses:
- `defaultValue` parameter if provided to command
- Otherwise, current editor content (`editor.value`)

### Preview Rendering

The `previewBox()` helper:
- Creates preview container
- Applies editor styles to preview
- Renders HTML content
- Returns cleanup function
- Uses 'px' as dimension unit

### Dialog Lifecycle

1. **Open**: Dialog opens with preview content
2. **Display**: Content rendered in modal dialog
3. **User Interaction**: User can view (but not edit) content
4. **Close**: User closes dialog
5. **Cleanup**: Registered cleanup function executes

## Commands

### `preview`

Opens preview dialog displaying editor content.

**Syntax:**
```typescript
editor.execCommand('preview', false, content?: string)
```

**Parameters:**
- `content` (optional): Custom HTML to preview instead of editor content

**Example:**
```typescript
// Preview current editor content
editor.execCommand('preview');

// Preview custom HTML
editor.execCommand('preview', false, '<div>Custom content</div>');
```

## Edge Cases

1. **Empty Editor**: Preview shows empty content (blank dialog)

2. **Source Mode**: Preview button works in source mode too (parses HTML)

3. **Custom Content**: Providing `defaultValue` overrides editor content

4. **Modal Dialog**: Dialog blocks all editor interaction until closed

5. **Size Fixed**: Dialog size is hardcoded (1024x600px)

6. **Multiple Previews**: Opening preview while one is open closes previous

7. **Cleanup**: Resources cleaned up via `afterClose` event handler

## Notes

- Plugin is functional (not class-based), registered via `pluginSystem.add()`
- Preview button appears in toolbar with eye icon
- Dialog size is fixed at 1024x600px (not configurable)
- The `previewBox()` helper is shared with print plugin
- Preview content is read-only (not editable)
- Dialog title uses localized "Preview" text
- The plugin uses modal dialog to prevent editor interaction during preview
- Dialog automatically cleans up resources on close
- Preview rendering uses same styles as editor for consistency
- The command accepts optional HTML parameter for custom previews
- Button is available in both SOURCE and WYSIWYG modes
- Dialog content container retrieved via `dialog.getElm('content')`
- The `previewBox()` function returns array: `[element, cleanupFunction]`
- Cleanup function registered with `dialog.e.on(dialog, 'afterClose', ...)`
- Preview does not modify editor content (read-only view)
- No configuration options for dialog size or behavior
- Plugin has no initialization or destruction logic (registers button/command only)

## Typical Use Case

Users need to see how their content will appear to end readers before publishing. The preview plugin provides this by:

1. Opening a clean view of the content
2. Removing editor UI elements
3. Showing the final rendered output
4. Allowing quick inspection without leaving the editor

This is useful for:
- Checking formatting and layout
- Verifying images and media display correctly
- Ensuring content appears as intended
- Quick quality assurance before saving/publishing