# Drag and Drop Plugin

Handles drag and drop operations for images, content fragments, and FileBrowser items within the editor.

## Description

This plugin enables drag and drop functionality for:
- Moving images within the editor
- Copying images from FileBrowser
- Dragging selected content (text, HTML) to a new position
- Moving vs copying modes (Ctrl key toggles copy mode)
- Dropping external HTML/plain text content

**Note**: There's a TODO comment in the code suggesting this plugin should eventually replace `drag-and-drop-element` plugin for complete custom moving functionality.

## Features

- **Image Dragging**: Drag images within editor or from FileBrowser
- **Content Fragment Dragging**: Move selected HTML content
- **Copy Mode**: Hold Ctrl/Cmd to copy instead of move
- **Cursor Tracking**: Cursor updates in real-time during drag
- **External Content**: Drop HTML/text from outside editor
- **Range Preservation**: Maintains selection range during drag
- **Auto-insert**: Automatically inserts content at drop position
- **Event Integration**: Fires `paste` and `afterInsertImage` events

## Drag Modes

### Move Mode (Default for editor content)
- Drag content from editor without Ctrl key
- Original content is removed (extracted)
- Content appears at new position

### Copy Mode
- Hold Ctrl/Cmd while dragging editor content
- External content (FileBrowser, outside editor) always copies
- Original content remains in place
- Duplicate appears at drop position

## Usage Examples

### Basic Image Drag

```javascript
const editor = Jodit.make('#editor');
editor.value = '<p>Text</p><img src="image.jpg" />';

// User can drag the image to reposition it within editor
// Without Ctrl: image moves
// With Ctrl: image is copied
```

### Drag from FileBrowser

```javascript
const editor = Jodit.make('#editor', {
  filebrowser: {
    ajax: {
      url: '/api/filebrowser'
    }
  }
});

// User opens FileBrowser, drags an image item into editor
// Image is automatically inserted as <img> or <a> tag
```

### Listen to Drop Events

```javascript
const editor = Jodit.make('#editor');

editor.e.on('afterInsertImage', (image) => {
  console.log('Image inserted via drag-drop:', image.src);
});

editor.e.on('paste', (event) => {
  console.log('External content dropped:', event);
});
```

### Disable Plugin

```javascript
const editor = Jodit.make('#editor', {
  disablePlugins: ['dragAndDrop']
  // Falls back to browser default drag-drop
});
```

## How It Works

### Drag Start (`onDragStart`)

1. Listens to `dragstart` on window, document, and editor
2. Removes any old draggable element
3. Checks if drag source is inside editor (`isFragmentFromEditor`)
4. Determines mode:
   - Editor content: Move mode (or Copy if Ctrl pressed)
   - External content: Always Copy mode
5. If editor content, stores current range in `bufferRange`
6. Records starting mouse position (`startDragPoint`)
7. If dragging FileBrowser item or `<img>`, clones it to `draggable`
8. Attaches drag event listeners

### Drag Over (`onDrag`)

1. Fires every ~10ms (throttled to `defaultTimeout / 10`)
2. If `draggable` exists, hides popups
3. Updates cursor position to follow mouse: `insertCursorAtPoint()`
4. Prevents default browser behavior

### Drop (`onDrop`)

1. Checks if dropping files (handled elsewhere if true)
2. If no files:
   - External drop (no `isFragmentFromEditor` and no `draggable`): fires `paste` event
   - Gets work fragment via `__getWorkFragment()`
   - Removes all current selections
   - Inserts cursor at drop point
   - Inserts fragment at new position
   - Prevents default behavior

3. Cleans up: removes listeners, resets flags

### Get Work Fragment (`__getWorkFragment`)

Determines what to insert based on drag source:

**Case 1: No draggable, has range (selected content)**
- Copy mode: `range.cloneContents()` - duplicates content
- Move mode: `range.extractContents()` - removes and returns content

**Case 2: Draggable image**
- Copy mode:
  - Check if file: create `<a href="...">` link
  - Otherwise: create `<img src="...">` image
- Move mode: Return original element reference

**Case 3: External HTML/text**
- Extract from `dataTransfer` (HTML or plain text)
- Create fragment from HTML string

### Insert Fragment (`__insertFragment`)

1. Inserts node at cursor position
2. If fragment has children, selects the inserted range
3. Fires `synchro` event
4. If image, fires `afterInsertImage` event

### Drag End (`onDragEnd`)

1. Removes temporary `draggable` element
2. Resets `isCopyMode` to false
3. Removes all drag event listeners

## Events

### `afterInsertImage`

Fired when an image is inserted via drag-drop.

```javascript
editor.e.on('afterInsertImage', (img) => {
  console.log('Image inserted:', img);
});
```

### `paste`

Fired when external content is dropped (not from editor).

```javascript
editor.e.on('paste', (event) => {
  console.log('External content dropped');
});
```

### `synchro`

Fired after content insertion to sync editor state.

## FileBrowser Integration

The plugin detects FileBrowser items:

```javascript
// Checks if target has class 'jodit-filebrowser-files__item'
isFileBrowserFilesItem(target)
```

When dragging from FileBrowser:
- Extracts `<img>` from item
- Uses `data-src` or `src` attribute
- Creates `<a>` for files (when `data-is-file="1"`)
- Creates `<img>` for images

## Configuration

This plugin has no configuration options. To disable:

```javascript
const editor = Jodit.make('#editor', {
  disablePlugins: ['dragAndDrop']
});
```

## Notes

- Uses `@throttle` decorator for `onDrag` (optimized to ~10ms intervals)
- Uses `@autobind` decorator for event handlers
- Stores original range in `bufferRange` during drag
- External content always uses copy mode
- Editor content defaults to move mode (Ctrl enables copy)
- Integrates with FileBrowser plugin
- Fires `hidePopup` during drag to dismiss open menus
- Cleans up all event listeners in `beforeDestruct()`
- TODO: Future plan to replace `drag-and-drop-element` plugin