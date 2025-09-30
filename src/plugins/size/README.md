# Size Plugin

Manages editor dimensions including height, width, and their constraints. This plugin calculates workspace sizes, handles dimension changes, and optionally persists height in browser storage.

## Features

- Set editor height and width
- Min/max constraints for dimensions
- Auto height mode
- Persistent height storage
- Workspace height calculation
- Toolbar/statusbar space handling
- Fullscreen mode support
- Window load detection
- Debounced resize handling
- Inline mode skip
- Event-driven size updates

## Configuration Options

### `height`

**Type:** `number | string`

**Default:** `'auto'`

Editor height. Can be number (pixels), string with units, or `'auto'` for content-based height.

**Example:**
```typescript
Jodit.make('#editor', {
    height: 400        // 400px
    // or
    height: '50vh'     // 50% of viewport height
    // or
    height: 'auto'     // Auto-adjust to content
});
```

### `width`

**Type:** `number | string`

**Default:** `'auto'` or `'100%'` depending on context

Editor width. Can be number (pixels) or string with units.

**Example:**
```typescript
Jodit.make('#editor', {
    width: 800         // 800px
    // or
    width: '100%'      // Full container width
});
```

### `minHeight`

**Type:** `number | string`

**Default:** `200`

Minimum editor height in pixels or with units.

**Example:**
```typescript
Jodit.make('#editor', {
    minHeight: 300     // Min 300px
    // or
    minHeight: '30%'   // Min 30% of parent
});
```

### `maxHeight`

**Type:** `number | string`

**Default:** `'auto'`

Maximum editor height in pixels, with units, or `'auto'` for no limit.

**Example:**
```typescript
Jodit.make('#editor', {
    maxHeight: 800     // Max 800px
    // or
    maxHeight: 'auto'  // No maximum
});
```

### `minWidth`

**Type:** `number | string`

**Default:** `200`

Minimum editor width in pixels or with units.

**Example:**
```typescript
Jodit.make('#editor', {
    minWidth: 400      // Min 400px
});
```

### `maxWidth`

**Type:** `number | string`

**Default:** `'100%'`

Maximum editor width in pixels or with units.

**Example:**
```typescript
Jodit.make('#editor', {
    maxWidth: 1200     // Max 1200px
    // or
    maxWidth: '100%'   // Container width
});
```

### `saveHeightInStorage`

**Type:** `boolean`

**Default:** `false`

When `true` and `height !== 'auto'`, saves height to browser storage and restores on reload.

**Example:**
```typescript
Jodit.make('#editor', {
    height: 400,
    saveHeightInStorage: true
});
// Height persists across page reloads
```

## Usage Examples

### Basic Fixed Size

```typescript
const editor = Jodit.make('#editor', {
    height: 400,
    width: 800
});
```

### With Constraints

```typescript
const editor = Jodit.make('#editor', {
    height: 'auto',
    minHeight: 300,
    maxHeight: 800,
    minWidth: 400,
    maxWidth: 1200
});
```

### Full Configuration

```typescript
const editor = Jodit.make('#editor', {
    saveHeightInStorage: true,
    height: 500,
    width: '100%',
    minWidth: 600,
    minHeight: 300,
    maxWidth: 1400,
    maxHeight: 900
});
```

### Persistent Height

```typescript
const editor = Jodit.make('#editor', {
    height: 400,
    saveHeightInStorage: true
});
// User resizes editor via resize-handler plugin
// Height saved to localStorage
// Next page load: height restored from storage
```

### Programmatic Size Change

```typescript
const editor = Jodit.make('#editor');

// Set height
editor.e.fire('setHeight', 500);

// Set width
editor.e.fire('setWidth', 800);
```

### Responsive Design

```typescript
const editor = Jodit.make('#editor', {
    width: '100%',
    height: 'auto',
    minHeight: 200,
    maxHeight: '80vh'
});
```

## How It Works

### Initialization

On plugin init:
1. Skips if inline mode
2. Loads height from storage if `saveHeightInStorage` enabled
3. Sets editor min-height to 100%
4. Applies min/max constraints to container
5. Sets initial height and width
6. Registers event listeners

### Height Setting

When `setHeight` event fires:
1. Checks numeric constraints (min/max)
2. Applies height to container
3. Saves to storage if enabled
4. Triggers workspace resize
5. Fires `resize` event if dimensions changed

### Width Setting

When `setWidth` event fires:
1. Checks numeric constraints (min/max)
2. Applies width to container
3. Triggers workspace resize
4. Fires `resize` event if dimensions changed

### Workspace Calculation

The `__resizeWorkspaceImd()` method:
1. Calculates non-work height (toolbar + statusbar + 2px)
2. Applies minHeight to workplace, iframe, editor
3. Applies maxHeight to workplace, iframe, editor
4. Sets workplace height:
   - If height !== 'auto' or fullscreen: container height - non-work height
   - Otherwise: 'auto'
5. Fires `resize` if dimensions changed

### Non-Work Height

Includes:
- Toolbar container height
- Status bar height
- 2 pixels for borders/padding

### Debouncing

Uses two resize methods:
- `__resizeWorkspaceImd`: Immediate resize
- `__resizeWorkspaces`: Debounced wrapper (defaultTimeout delay)

Debounced version used for frequent events like scroll, window load.

### Storage Persistence

When `saveHeightInStorage: true`:
- Height saved to `editor.storage` on change
- Restored on init if found
- Only works when height !== 'auto'

## Events

### `setHeight`

Fired to programmatically change editor height.

**Parameters:**
- `height` (number | string): New height value

**Example:**
```typescript
editor.e.on('setHeight', (height) => {
    console.log('Height changed to:', height);
});

editor.e.fire('setHeight', 500);
```

### `setWidth`

Fired to programmatically change editor width.

**Parameters:**
- `width` (number | string): New width value

**Example:**
```typescript
editor.e.on('setWidth', (width) => {
    console.log('Width changed to:', width);
});

editor.e.fire('setWidth', 800);
```

### `setMinHeight`

Fired when minimum workspace height is calculated.

**Parameters:**
- `minHeight` (number): Minimum workspace height in pixels

**Example:**
```typescript
editor.e.on('setMinHeight', (minHeight) => {
    console.log('Min workspace height:', minHeight);
});
```

### `setMaxHeight`

Fired when maximum workspace height is calculated.

**Parameters:**
- `maxHeight` (number): Maximum workspace height in pixels

**Example:**
```typescript
editor.e.on('setMaxHeight', (maxHeight) => {
    console.log('Max workspace height:', maxHeight);
});
```

### `resize`

Fired when editor dimensions actually change.

**Example:**
```typescript
editor.e.on('resize', () => {
    console.log('Editor resized');
});
```

## Edge Cases

1. **Inline Mode**: Plugin does nothing in inline mode
2. **Auto Height**: No height constraints applied
3. **Fullscreen**: Uses container height minus non-work height
4. **Storage**: Only saves numeric heights, not 'auto'
5. **Constraints**: Numeric min/max only enforced for numeric values
6. **Window Load**: Recalculates on window load event
7. **Missing Container**: Guards against null container
8. **Destruction**: Checks `isDestructed` before operations
9. **Min > Max**: No validation, both applied independently
10. **Negative Values**: Not validated, passed to CSS

## Notes

- Plugin is class-based, extends `Plugin` base class
- Uses `@autobind` and `@throttle` decorators
- Event namespacing `.size` for clean removal
- Initialize method throttled to prevent excessive calls
- Resize workspace debounced with `defaultTimeout`
- Storage key is `'height'`
- Non-work height includes 2px constant for borders
- Applies sizes to container, workplace, iframe, and editor
- Editor always gets `minHeight: 100%` CSS
- The `isNumber()` helper checks for numeric values
- Constraints only enforced for numeric dimensions
- String values (like '50%') passed directly to CSS
- Window load event uses `ow` (owner window)
- Multiple events trigger workspace resize
- Top priority for afterInit and changePlace events
- Fires resize only if dimensions actually changed
- The plugin properly cleans up event listeners on destruction
- Storage uses editor's storage instance
- Height loaded from storage before applying options
- CSS helper used for all style manipulations
- ClientHeight/clientWidth tracked for change detection

## Typical Use Case

Developers need to control editor dimensions with constraints and optional persistence. The size plugin provides this by:

1. Setting initial dimensions
2. Enforcing min/max constraints
3. Calculating workspace based on UI elements
4. Handling programmatic size changes
5. Optionally persisting height

This improves developer experience by:
- Simplifying dimension management
- Automatic workspace calculation
- Responsive design support
- User preference persistence
- Integration with resize-handler plugin