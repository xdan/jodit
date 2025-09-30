# Drag and Drop Element Plugin

Enables dragging and dropping specific HTML elements (images, media, custom elements) within the editor.

## Description

This plugin allows users to drag and drop specific HTML elements within the editor. It creates a visual ghost element during drag, supports copy mode (Ctrl key), and intelligently handles element positioning. Unlike the `drag-and-drop` plugin, this focuses on moving/copying entire elements rather than content fragments.

## Features

- **Element Dragging**: Move specific HTML tags within editor
- **Visual Ghost**: Shows semi-transparent clone during drag
- **Copy Mode**: Hold Ctrl/Cmd to copy instead of move
- **Drag Threshold**: 10px movement required before drag starts
- **Three-State System**: IDLE → WAIT_DRAGGING → DRAGGING
- **Smart Anchor Handling**: Drags `<a>` tag if it only contains the target element
- **Editor Locking**: Locks editor during drag operation
- **Auto-cleanup**: Removes empty parent elements after move

## Configuration

### `draggableTags`

List of HTML tag names that can be dragged.

- **Type**: `string | string[]`
- **Default**: `['img', 'jodit-media', 'jodit']`

```javascript
const editor = Jodit.make('#editor', {
  draggableTags: ['img', 'video', 'audio', 'iframe']
});
```

**String format (comma-separated):**
```javascript
const editor = Jodit.make('#editor', {
  draggableTags: 'img,video,table'
});
```

**Array format:**
```javascript
const editor = Jodit.make('#editor', {
  draggableTags: ['img', 'jodit-media', 'jodit', 'table']
});
```

## Usage Examples

### Default Configuration

```javascript
const editor = Jodit.make('#editor');
// Can drag: <img>, <jodit-media>, <jodit>
```

### Custom Draggable Tags

```javascript
const editor = Jodit.make('#editor', {
  draggableTags: ['img', 'table', 'blockquote', 'pre']
});

editor.value = `
  <img src="photo.jpg" />
  <table><tr><td>Data</td></tr></table>
`;
// User can now drag images, tables, blockquotes, and pre elements
```

### Disable All Dragging

```javascript
const editor = Jodit.make('#editor', {
  draggableTags: [] // No elements are draggable
});
```

### Allow Only Images

```javascript
const editor = Jodit.make('#editor', {
  draggableTags: 'img'
});
```

### Listen to Drop Events

```javascript
const editor = Jodit.make('#editor');

editor.e.on('afterInsertImage', (img) => {
  console.log('Image repositioned:', img.src);
});

editor.e.on('synchro', () => {
  console.log('Editor content synchronized after drag-drop');
});
```

### Disable Plugin

```javascript
const editor = Jodit.make('#editor', {
  disablePlugins: ['dragAndDropElement']
});
```

## How It Works

### Drag States

The plugin uses a three-state system:

```typescript
enum DragState {
  IDLE = 0,           // No drag operation
  WAIT_DRAGGING = 1,  // Mouse down, waiting for movement
  DRAGGING = 2        // Actively dragging
}
```

### Drag Start (`onDragStart`)

1. Listens to `mousedown` and `dragstart` events
2. Checks if target matches `draggableTags` list
3. Finds the draggable element (or its parent if wrapped in `<a>`)
4. Stores starting mouse position (`startX`, `startY`)
5. Checks if Ctrl/Cmd pressed (copy mode)
6. Clones the element to `draggable` ghost
7. Sets state to `WAIT_DRAGGING`
8. Attaches mouse move listeners

**Special anchor handling:**
```javascript
// If element is sole child of <a> tag, drag the <a> instead
if (Dom.isTag(lastTarget.parentElement, 'a') &&
    lastTarget.parentElement.firstChild === lastTarget &&
    lastTarget.parentElement.lastChild === lastTarget) {
  lastTarget = lastTarget.parentElement;
}
```

### Drag (`onDrag`)

1. Fires every ~10ms (throttled to `defaultTimeout / 10`)
2. **In WAIT_DRAGGING state:**
   - Calculates distance moved: `√(Δx² + Δy²)`
   - If distance < 10px (`diffStep`), does nothing
   - If distance ≥ 10px, switches to DRAGGING state and locks editor

3. **In DRAGGING state:**
   - Fires `hidePopup hideResizer` events
   - If ghost not yet in DOM:
     - Styles ghost element (fixed position, 0.7 opacity, high z-index)
     - Appends to container
   - Updates ghost position to follow mouse
   - Updates cursor position: `insertCursorAtPoint()`

### Drop (`onDrop`)

1. Checks if drag was successful (state must be DRAGGING)
2. Gets original element via `dataBind(draggable, 'target')`
3. If copy mode, clones the element
4. Inserts element at cursor position
5. If parent element is now empty (and not a table cell), removes it
6. If element is `<img>`, fires `afterInsertImage` event
7. Fires `synchro` event
8. Cleans up drag state

### Drag End (`onDragEnd`)

1. Removes all drag event listeners
2. Unlocks editor
3. Sets state to IDLE
4. Removes ghost element from DOM
5. Resets `draggable` to null

## Drag Threshold

The plugin requires 10 pixels of mouse movement before activating drag:

```javascript
private diffStep = 10;

// Calculate distance
Math.sqrt(Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)) < 10
```

This prevents accidental drags when user is just clicking.

## Visual Ghost Element

During drag, a semi-transparent clone follows the cursor:

```javascript
css(this.draggable, {
  zIndex: 10000000000000,     // Very high z-index
  pointerEvents: 'none',       // Don't intercept mouse events
  position: 'fixed',           // Fixed positioning
  opacity: 0.7,                // 70% opacity
  left: event.clientX,         // Follow cursor X
  top: event.clientY,          // Follow cursor Y
  width: target.offsetWidth,   // Match original size
  height: target.offsetHeight
});
```

## Events

### `afterInsertImage`

Fired when an `<img>` element is dropped.

```javascript
editor.e.on('afterInsertImage', (img) => {
  console.log('Image moved/copied:', img);
});
```

### `synchro`

Fired after element is dropped to synchronize editor state.

```javascript
editor.e.on('synchro', () => {
  console.log('Editor synchronized');
});
```

### `hidePopup hideResizer`

Fired during drag to hide any open popups or resizers.

## Edge Cases Handled

### 1. Anchor-Wrapped Images
```html
<!-- Before drag -->
<a href="link.html"><img src="photo.jpg" /></a>

<!-- Plugin drags the entire <a> tag, not just <img> -->
```

### 2. Empty Parent Cleanup
```html
<!-- After moving the only child from a paragraph -->
<!-- The empty <p></p> is automatically removed -->
<!-- Unless it's a table cell, which is preserved -->
```

### 3. Copy Mode
```javascript
// Without Ctrl: element moves from old to new position
// With Ctrl: element is cloned, original remains
```

### 4. Drag Threshold
```javascript
// Click and release immediately: no drag
// Click and move 5px: no drag
// Click and move 10px+: drag activates
```

## Configuration

This plugin has one configuration option:

```javascript
const editor = Jodit.make('#editor', {
  draggableTags: ['img', 'jodit-media', 'jodit'] // Default
});
```

To disable:

```javascript
const editor = Jodit.make('#editor', {
  disablePlugins: ['dragAndDropElement']
});
```

## Notes

- Uses `@throttle` decorator for `onDrag` (optimized to ~10ms intervals)
- Uses `@autobind` decorator for event handlers
- Locks editor during active drag operation
- Tag matching is case-insensitive
- Ghost element has `pointerEvents: 'none'` to avoid interfering with drop detection
- Cleans up empty parent elements after move (except table cells)
- Integrates with editor's container system via `getContainer()`
- Different from `drag-and-drop` plugin: this moves elements, that handles fragments/files
- 10px threshold prevents accidental drags on simple clicks