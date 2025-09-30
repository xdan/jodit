# Resize Handler Plugin

Adds a draggable resize handle in the bottom-right corner of the editor when it has a fixed height or width. This plugin allows users to resize the editor dimensions by dragging the handle.

## Features

- Visual resize handle in bottom-right corner
- Drag to resize editor horizontally
- Drag to resize editor vertically
- Both axes can be enabled independently
- Locks editor during resize
- Touch event support
- Hidden in fullscreen mode
- Requires fixed height or width
- Custom SVG icon
- Status bar modification for styling
- Mouse/touch event support

## Configuration Options

### `allowResizeX`

**Type:** `boolean`

**Default:** `false`

Enables or disables horizontal (width) resizing of the editor via the resize handle.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    allowResizeX: true,
    width: 600  // Fixed width required
});
```

### `allowResizeY`

**Type:** `boolean`

**Default:** `true`

Enables or disables vertical (height) resizing of the editor via the resize handle.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    allowResizeY: true,
    height: 400  // Fixed height required
});
```

## Usage Examples

### Basic Vertical Resize

```typescript
const editor = Jodit.make('#editor', {
    height: 400,
    allowResizeY: true,
    allowResizeX: false
});
// Drag handle vertically to resize height
```

### Horizontal Resize Only

```typescript
const editor = Jodit.make('#editor', {
    width: 600,
    allowResizeX: true,
    allowResizeY: false
});
// Drag handle horizontally to resize width
```

### Both Axes Resize

```typescript
const editor = Jodit.make('#editor', {
    height: 400,
    width: 600,
    allowResizeX: true,
    allowResizeY: true
});
// Drag handle diagonally to resize both dimensions
```

### Disable All Resizing

```typescript
const editor = Jodit.make('#editor', {
    height: 400,
    allowResizeX: false,
    allowResizeY: false
});
// No resize handle appears
```

### With Minimum/Maximum Sizes

```typescript
const editor = Jodit.make('#editor', {
    height: 400,
    allowResizeY: true,
    minHeight: 200,
    maxHeight: 800
});
// Resize constrained by min/max limits
```

### Auto Height (No Vertical Resize)

```typescript
const editor = Jodit.make('#editor', {
    height: 'auto',
    width: 600,
    allowResizeX: true,
    allowResizeY: true  // Automatically disabled for auto height
});
// Only horizontal resize available
```

### Listen to Resize Events

```typescript
const editor = Jodit.make('#editor', {
    height: 400,
    allowResizeY: true
});

editor.e.on('resize', () => {
    console.log('Editor resized');
    console.log('New height:', editor.container.offsetHeight);
});
```

### Programmatic Size Changes

```typescript
const editor = Jodit.make('#editor', {
    height: 400,
    allowResizeY: true
});

// Set new height
editor.e.fire('setHeight', 500);

// Set new width
editor.e.fire('setWidth', 700);
```

## How It Works

### Handle Display Conditions

The resize handle appears only when:

1. **Fixed Size**: Editor has `height !== 'auto'` OR `width !== 'auto'`
2. **Resize Enabled**: At least one of `allowResizeX` or `allowResizeY` is `true`
3. **Auto Height Exception**: If `height === 'auto'` AND `width !== 'auto'`, `allowResizeY` is automatically disabled

If these conditions aren't met, no handle is created.

### Handle Creation

When conditions are met:

1. **Create Element**: Creates div with class `jodit-editor__resize`
2. **Add Icon**: Inserts SVG resize icon
3. **Append**: Adds handle to editor container
4. **Status Bar Mod**: Sets `resize-handle` modifier on status bar for styling

### Drag Operation

#### Start Resize (mousedown/touchstart)

1. **Record Start Position**: Stores `clientX`, `clientY`
2. **Record Start Dimensions**: Stores container `offsetWidth` and `offsetHeight`
3. **Lock Editor**: Calls `editor.lock()` to prevent editing
4. **Attach Move Handler**: Listens to `mousemove`/`touchmove` on window
5. **Prevent Default**: Stops default browser behavior

#### During Resize (mousemove/touchmove)

1. **Calculate Delta**: `deltaY = e.clientY - start.y`, `deltaX = e.clientX - start.x`
2. **Update Height** (if `allowResizeY`): Fires `setHeight` event with `start.h + deltaY`
3. **Update Width** (if `allowResizeX`): Fires `setWidth` event with `start.w + deltaX`
4. **Fire Resize Event**: Triggers `resize` event after dimension changes

#### End Resize (mouseup/touchend)

1. **Remove Move Handler**: Stops listening to `mousemove`/`touchmove`
2. **Unlock Editor**: Calls `editor.unlock()` to allow editing
3. **Reset State**: Sets `isResized` to `false`

### Fullscreen Handling

The handle visibility is managed during fullscreen toggle:

```typescript
editor.e.on('toggleFullSize', () => {
    handle.style.display = editor.isFullSize ? 'none' : 'block';
});
```

Handle is hidden in fullscreen mode and shown when returning to normal mode.

### Size Events

The plugin fires these events during resize:

- **`setHeight`**: Fired with new height value
- **`setWidth`**: Fired with new width value
- **`resize`**: Fired after dimensions change

These events are handled by the `size` module which actually applies the new dimensions.

### Auto Height Behavior

Special case handling:

```typescript
if (height === 'auto' && width !== 'auto') {
    allowResizeY = false;
}
```

When editor has auto height, vertical resizing is automatically disabled even if `allowResizeY` is `true`.

## Events

### `resize`

Fired during resize operation after dimensions are updated.

**Example:**
```typescript
editor.e.on('resize', () => {
    console.log('Editor dimensions changed');
    console.log('Width:', editor.container.offsetWidth);
    console.log('Height:', editor.container.offsetHeight);
});
```

### `setHeight`

Fired with new height value during vertical resize.

**Parameters:**
- `height` (number): New height in pixels

**Example:**
```typescript
editor.e.on('setHeight', (height) => {
    console.log('Height changed to:', height);
});
```

### `setWidth`

Fired with new width value during horizontal resize.

**Parameters:**
- `width` (number): New width in pixels

**Example:**
```typescript
editor.e.on('setWidth', (width) => {
    console.log('Width changed to:', width);
});
```

### `toggleFullSize`

Plugin listens to this event to hide/show handle during fullscreen toggle.

**Example:**
```typescript
editor.e.on('toggleFullSize', () => {
    console.log('Fullscreen toggled');
});
```

## Edge Cases

1. **Auto Height**: Vertical resize automatically disabled when `height: 'auto'`

2. **No Fixed Size**: Handle doesn't appear if both height and width are `'auto'`

3. **Both Disabled**: Handle doesn't appear if both `allowResizeX` and `allowResizeY` are `false`

4. **Fullscreen Mode**: Handle is hidden when editor is fullscreen

5. **Touch Events**: Plugin supports both mouse and touch events

6. **Locked Editor**: Editor is locked during resize to prevent editing

7. **Window Mouse Up**: Mouse up event attached to window to catch releases outside editor

8. **Start Position**: Records both position and dimensions at drag start

9. **Delta Calculation**: Uses client coordinates for accurate cross-browser positioning

10. **Status Bar Modifier**: Adds `resize-handle` modifier to status bar for CSS targeting

## Notes

- Plugin is class-based, extends `Plugin` base class with `@autobind` decorator
- Requires `size` module (specified in `static requires: string[]`)
- Handle has class `jodit-editor__resize` for styling
- Uses custom SVG icon via `Icon.get('resize_handler')`
- Handle positioned in bottom-right corner via CSS
- The `isResized` boolean flag tracks active resize state
- Start position stored as `IPointBound` with x, y, w, h properties
- Mouse events attached to window (`j.ow`) to catch movements outside editor
- Touch events supported: `touchstart`, `touchmove`, `touchend`
- Editor lock prevents content editing during resize operation
- The plugin integrates with editor's lock/unlock system
- Status bar gets `resize-handle` modifier via `statusbar.setMod()`
- Handle display toggled based on fullscreen state
- Event namespacing `.resizeHandler` used for clean removal
- The plugin properly cleans up handle and event listeners on destruction
- Size changes are delegated to size module via events
- The `size` module handles actual dimension application and constraints
- Auto height detection prevents unwanted vertical resize
- Handle creation is conditional based on configuration
- The plugin uses `e.preventDefault()` to stop default drag behavior
- Container dimensions used as resize base (not editor dimensions)
- Handle appended to editor container (not workplace)
- The `onHandleResize` method fires multiple events per move
- Width and height updates are independent and conditional
- The plugin doesn't validate or constrain dimensions directly
- Min/max size enforcement handled by size module
- Handle removed via `Dom.safeRemove()` on destruction
- Window event listeners properly removed in `beforeDestruct`

## Typical Use Case

Users need to adjust the editor size to fit their content or screen layout. The resize-handler plugin provides this by:

1. Adding a visual handle in the bottom-right corner
2. Allowing drag-to-resize in one or both dimensions
3. Locking editor during resize to prevent accidental edits
4. Supporting both mouse and touch interfaces
5. Hiding automatically in fullscreen mode

This improves user experience by:
- Providing familiar resize interaction (like window resizing)
- Allowing quick size adjustments without settings
- Supporting both desktop and mobile workflows
- Preventing content loss during resize
- Maintaining editor usability across different viewport sizes