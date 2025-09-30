# Resizer Plugin

Adds interactive resizing capability for images, iframes, tables, and custom elements in the editor. This plugin displays a visual frame with corner handles around selected elements, allowing users to drag and resize them.

## Features

- Visual resize frame with 4 corner handles
- Drag-to-resize support for images, iframes, tables
- Aspect ratio preservation (configurable)
- Alt key for custom aspect ratio override
- Size display during resize
- Minimum width/height constraints
- Image attribute vs style width/height
- Iframe wrapper for proper resizing
- Delete key support for selected elements
- Touch event support
- Read-only mode handling
- Fullscreen compatibility
- Auto-hide on scroll
- Keyboard controls

## Configuration Options

### `allowResizeTags`

**Type:** `Set<HTMLTagNames>`

**Default:** `new Set(['img', 'iframe', 'table', 'jodit'])`

Set of HTML tag names that can be resized by the plugin.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    allowResizeTags: new Set(['img', 'iframe', 'table'])
});
```

### `resizer.showSize`

**Type:** `boolean`

**Default:** `true`

Shows dimension display (e.g., "200x150") in the center of the resize frame during resizing.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    resizer: {
        showSize: true
    }
});
```

### `resizer.hideSizeTimeout`

**Type:** `number`

**Default:** `1000` (milliseconds)

Timeout in milliseconds before hiding the size display after resize ends.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    resizer: {
        hideSizeTimeout: 2000  // Hide after 2 seconds
    }
});
```

### `resizer.useAspectRatio`

**Type:** `boolean | Set<HTMLTagNames>`

**Default:** `new Set(['img'])`

Controls whether aspect ratio is preserved during resize. Can be:
- `false`: Never preserve aspect ratio
- `true`: Always preserve aspect ratio for all elements
- `Set<HTMLTagNames>`: Preserve only for specified tags

**Example:**
```typescript
// Preserve aspect ratio for images only (default)
const editor1 = Jodit.make('#editor1', {
    resizer: {
        useAspectRatio: new Set(['img'])
    }
});

// Preserve for all resizable elements
const editor2 = Jodit.make('#editor2', {
    resizer: {
        useAspectRatio: true
    }
});

// Never preserve aspect ratio
const editor3 = Jodit.make('#editor3', {
    resizer: {
        useAspectRatio: false
    }
});

// Preserve for images and tables
const editor4 = Jodit.make('#editor4', {
    resizer: {
        useAspectRatio: new Set(['img', 'table'])
    }
});
```

### `resizer.forImageChangeAttributes`

**Type:** `boolean`

**Default:** `true`

When `true`, changes image `width` and `height` HTML attributes instead of (or in addition to) CSS styles.

**Example:**
```typescript
// Change HTML attributes
const editor1 = Jodit.make('#editor1', {
    resizer: {
        forImageChangeAttributes: true
    }
});
// Result: <img src="..." width="200" height="150">

// Change CSS styles only
const editor2 = Jodit.make('#editor2', {
    resizer: {
        forImageChangeAttributes: false
    }
});
// Result: <img src="..." style="width: 200px; height: 150px">
```

### `resizer.min_width`

**Type:** `number`

**Default:** `10` (pixels)

Minimum width in pixels that elements can be resized to.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    resizer: {
        min_width: 50  // Can't resize narrower than 50px
    }
});
```

### `resizer.min_height`

**Type:** `number`

**Default:** `10` (pixels)

Minimum height in pixels that elements can be resized to.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    resizer: {
        min_height: 50  // Can't resize shorter than 50px
    }
});
```

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor', {
    allowResizeTags: new Set(['img', 'table']),
    resizer: {
        showSize: true,
        useAspectRatio: new Set(['img'])
    }
});

// Click on image or table to show resize handles
// Drag corner handles to resize
```

### Resize Images Only

```typescript
const editor = Jodit.make('#editor', {
    allowResizeTags: new Set(['img']),
    resizer: {
        forImageChangeAttributes: true,
        useAspectRatio: true,
        min_width: 20,
        min_height: 20
    }
});
```

### Custom Aspect Ratio (Alt Key)

```typescript
const editor = Jodit.make('#editor', {
    allowResizeTags: new Set(['img']),
    resizer: {
        useAspectRatio: true
    }
});

// Normal drag: maintains aspect ratio
// Hold Alt key while dragging: free resize without aspect ratio
```

### Disable Size Display

```typescript
const editor = Jodit.make('#editor', {
    resizer: {
        showSize: false
    }
});
// No dimension text shown during resize
```

### Larger Minimum Sizes

```typescript
const editor = Jodit.make('#editor', {
    resizer: {
        min_width: 100,
        min_height: 100
    }
});
// Elements can't be smaller than 100x100px
```

### Listen to Resize Events

```typescript
const editor = Jodit.make('#editor');

editor.e.on('resize', () => {
    console.log('Element resized');
});

editor.e.on('changesize', (element) => {
    console.log('Size changed:', element.offsetWidth, element.offsetHeight);
});
```

### Delete Selected Element

```typescript
const editor = Jodit.make('#editor');

// Click on an image to show resize frame
// Press Delete key to remove the element
```

### Style vs Attribute for Images

```typescript
// Use HTML attributes (default)
const editor1 = Jodit.make('#editor1', {
    resizer: {
        forImageChangeAttributes: true
    }
});
// Inserts: <img width="200" height="150">

// Use CSS styles
const editor2 = Jodit.make('#editor2', {
    resizer: {
        forImageChangeAttributes: false
    }
});
// After insert, converts width attribute to style
```

## How It Works

### Element Selection

When user clicks in editor:

1. **Traverse DOM**: Walks up from click target to editor root
2. **Check Tag**: Tests if element matches `allowResizeTags`
3. **Bind Element**: Calls `__bind()` to prepare element for resizing
4. **Show Frame**: Displays resize frame around element

### Resize Frame Structure

The frame HTML structure:

```html
<div class="jodit-resizer" title="Press Alt for custom resizing">
    <div class="jodit-resizer__top-left"></div>
    <div class="jodit-resizer__top-right"></div>
    <div class="jodit-resizer__bottom-right"></div>
    <div class="jodit-resizer__bottom-left"></div>
    <span>100x100</span>
</div>
```

- 4 corner handles for dragging
- Center span for size display
- Positioned absolutely over element

### Resize Operation

#### Start Resize (mousedown on handle)

1. **Record State**: Stores start position (`startX`, `startY`), dimensions (`width`, `height`), and aspect ratio
2. **Lock Editor**: Calls `editor.lock()` to prevent editing
3. **Hide Popups**: Closes any open popups
4. **Attach Move Handler**: Listens to `mousemove`/`touchmove` on window

#### During Resize (mousemove)

1. **Calculate Deltas**: `diff_x = clientX - startX`, `diff_y = clientY - startY`
2. **Determine Direction**: Uses handle class name (`top/bottom`, `left/right`)
3. **Apply Aspect Ratio** (if enabled and not Alt mode):
   - If horizontal drag: `new_w = width + diff_x`, `new_h = new_w / ratio`
   - If vertical drag: `new_h = height + diff_y`, `new_w = new_h * ratio`
4. **Free Resize** (if Alt mode or aspect ratio disabled):
   - `new_w = width + (left ? -1 : 1) * diff_x`
   - `new_h = height + (top ? -1 : 1) * diff_y`
5. **Enforce Constraints**:
   - Minimum width/height from config
   - Maximum width from editor width
6. **Apply Size**: Updates element width/height via `applySize()`
7. **Show Dimensions**: Displays current size in frame

#### End Resize (mouseup)

1. **Remove Move Handler**: Stops listening to mouse move
2. **Unlock Editor**: Allows editing again
3. **Synchronize Values**: Updates editor value
4. **Reset State**: Clears resize mode flags

### Aspect Ratio Logic

**When Preserved:**
- `useAspectRatio === true`, OR
- `useAspectRatio` is a Set containing element's tag
- AND Alt key is NOT pressed

**Calculation:**
- Ratio = `width / height` at resize start
- Width-driven: `height = width / ratio`
- Height-driven: `width = height * ratio`

**Alt Key Override:**
- Press Alt during resize to temporarily disable aspect ratio
- Release Alt to re-enable with new ratio calculation

### Iframe Handling

Iframes receive special treatment:

1. **Wrapper Creation**: Wraps iframe in `<jodit>` element
2. **Attributes**: Sets `data-jodit_iframe_wrapper="1"`, `contenteditable="false"`, `draggable="true"`
3. **Style Copy**: Copies iframe styles to wrapper
4. **Resize Target**: Resizes wrapper instead of iframe directly
5. **Sync Dimensions**: Updates iframe width/height attributes when wrapper resizes
6. **Cleanup**: Removes wrapper from HTML output via `afterGetValueFromEditor` event

### Image Size Handling

Two modes for images:

**Attribute Mode** (`forImageChangeAttributes: true`):
- Sets `width` and `height` HTML attributes
- Also sets style if element already has style property
- Result: `<img width="200" height="150">`

**Style Mode** (`forImageChangeAttributes: false`):
- Sets CSS `width` and `height` styles
- On image insert, converts attributes to styles
- Result: `<img style="width: 200px; height: 150px">`

### Delete Key Handling

When element is selected and Delete key pressed:

- **Non-table elements**: Selects element (browser then deletes)
- **Jodit wrapper**: Directly removes element and hides frame
- **Tables**: Delete key ignored (table has own deletion logic)

### Position Updates

Frame position updated when:
- Element resized
- Editor content changed
- Window resized
- Editor resized
- Image finished loading

Calculation:
1. Get element position relative to document
2. Get workplace position relative to document
3. Frame position = element position - workplace position

### Size Viewer

The size display (`<span>`):
- Shows "WIDTHxHEIGHT" format (e.g., "250x180")
- Appears during resize with `opacity: 1`
- Hides after `hideSizeTimeout` milliseconds
- Hidden if element too small to contain text
- Positioned in center of resize frame

## Events

### `resize`

Fired when element is resized via drag handles or frame is repositioned.

**Example:**
```typescript
editor.e.on('resize', () => {
    console.log('Resize event fired');
});
```

### `changesize`

Fired on the element when its size changes. Used internally for iframe synchronization.

**Parameters:**
- Target element

**Example:**
```typescript
editor.e.on(element, 'changesize', () => {
    console.log('Element size changed');
});
```

### `hideResizer`

Fired when resize frame is hidden. Can be triggered via `@watch` decorator.

**Example:**
```typescript
editor.e.fire('hideResizer');
// Hides the resize frame
```

### `afterInsertImage`

Plugin listens to this event to handle initial image size setup.

**Example:**
```typescript
editor.e.on('afterInsertImage', (image) => {
    console.log('Image inserted:', image);
});
```

## Edge Cases

1. **Read-Only Mode**: Resize frame doesn't appear when editor is read-only

2. **Scroll During Display**: Frame hides when user scrolls (unless actively resizing)

3. **Missing Parent**: Frame hides if element is removed from DOM

4. **100% Width**: If resized width exceeds parent, sets to "100%"

5. **Alt Key Toggle**: Can press/release Alt during resize to change mode mid-drag

6. **Minimum Constraints**: Resize stops if dimensions would go below min_width/min_height

7. **Image Loading**: Waits for image load before showing frame for incomplete images

8. **Iframe Wrapper**: Special wrapper removed from HTML output automatically

9. **Multiple Tables**: Each table can be resized independently

10. **Touch Events**: Full support for touchstart/touchmove/touchend

11. **IE Compatibility**: Prevents native IE image resizer with preventDefault

12. **Fullscreen Mode**: Frame z-index adjusted to appear above fullscreen editor

## Notes

- Plugin is class-based, extends `Plugin` base class
- Uses `@autobind` decorator for event handlers
- Uses `@watch` decorators for `:click`, `:afterInsertImage`, `:change`, `:hideResizer` events
- Resize frame has class `jodit-resizer`
- Corner handles have classes like `jodit-resizer__top-left`
- Lock key is `'resizer'` for editor locking
- Data bind key is `'__jodit-resizer_binded'` to mark processed elements
- Alt key constant is `KEY_ALT` from constants
- The `isResizeMode` flag tracks active drag state
- The `isAltMode` flag tracks Alt key press state
- The `isShown` flag tracks frame visibility
- Start coordinates stored in `startX`, `startY`
- Pointer coordinates updated in `pointerX`, `pointerY`
- Original dimensions stored in `width`, `height`, `ratio`
- Handle element reference stored during drag
- Mouse events attached to window (`j.ow`) for global movement tracking
- Touch events supported: `touchstart`, `touchmove`, `touchend`
- The plugin integrates with editor's lock/unlock system
- Iframe offset handled differently with `options.iframe` check
- Size viewer opacity transitions for smooth show/hide
- The `applySize()` method handles both attribute and style updates
- Frame removed from DOM when hidden via `Dom.safeRemove()`
- Event namespacing `.resizer` ensures clean removal
- Global `eventEmitter` used for `hideHelpers` coordination
- The `afterGetValueFromEditor` event cleans up iframe wrappers from output
- Wrapper active state tracked via `data-jodit-wrapper_active` attribute
- The plugin properly cleans up all event listeners on destruction
- Delete key only works for non-table elements
- Frame position uses `offset()` helper for accurate coordinates
- Resize constraints check both minimum and parent width
- Aspect ratio recalculated when Alt key released
- Image complete property checked before showing frame
- The plugin supports custom `jodit` tag for iframe wrappers
- Size viewer hidden if dimensions too small to fit text
- Frame title attribute provides user hint about Alt key

## Typical Use Case

Users need to adjust image, table, and iframe sizes to fit their content layout. The resizer plugin provides this by:

1. Showing visual resize frame on element click
2. Providing 4 corner handles for intuitive drag-resizing
3. Preserving aspect ratio (when configured) for proper proportions
4. Displaying live dimensions during resize
5. Supporting keyboard controls (Alt, Delete)

This improves user experience by:
- Eliminating need for manual width/height attribute editing
- Providing immediate visual feedback during resize
- Maintaining image quality through aspect ratio preservation
- Supporting both precise (Alt) and proportional resizing
- Working consistently across images, tables, and iframes