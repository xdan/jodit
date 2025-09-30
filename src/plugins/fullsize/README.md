# Fullsize Plugin

Provides fullscreen mode functionality for the Jodit editor. This plugin allows users to expand the editor to fill the entire browser window, providing a distraction-free editing experience.

## Features

- Toggle between normal and fullscreen modes
- Automatic window resize handling in fullscreen mode
- Global fullsize mode that affects parent elements
- Preserves original editor dimensions when exiting fullscreen
- Toolbar button with dynamic icon (fullsize/shrink)
- Multiple editor instance support with shared fullsize tracking
- Optional auto-start in fullscreen mode
- Works in both WYSIWYG and source code modes

## Configuration Options

### `fullsize`

**Type:** `boolean`

**Default:** `false`

Opens the editor in fullscreen mode immediately on initialization.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    fullsize: true
});
```

### `globalFullSize`

**Type:** `boolean`

**Default:** `true`

When enabled, all parent elements of the editor container receive the `jodit_fullsize-box_true` class in fullscreen mode. This class applies `z-index: 100000 !important` to ensure the editor appears above all other content.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    globalFullSize: true
});
```

**Example (disabled):**
```typescript
const editor = Jodit.make('#editor', {
    globalFullSize: false
});
```

## Usage Examples

### Basic Usage

The plugin is enabled by default and provides a fullsize button in the toolbar:

```typescript
const editor = Jodit.make('#editor');
// Click the fullsize button in the toolbar to toggle fullscreen mode
```

### Start in Fullscreen Mode

```typescript
const editor = Jodit.make('#editor', {
    fullsize: true
});
```

### Programmatic Toggle

```typescript
const editor = Jodit.make('#editor');

// Toggle fullscreen mode
editor.toggleFullSize();

// Enable fullscreen
editor.toggleFullSize(true);

// Disable fullscreen
editor.toggleFullSize(false);

// Check if in fullscreen mode
if (editor.isFullSize) {
    console.log('Editor is in fullscreen mode');
}
```

### Using Events

```typescript
const editor = Jodit.make('#editor');

// Toggle using event
editor.e.fire('toggleFullSize');

// Enable using event
editor.e.fire('toggleFullSize', true);

// Disable using event
editor.e.fire('toggleFullSize', false);
```

### Without Global Fullsize

When `globalFullSize` is disabled, only the editor container expands:

```typescript
const editor = Jodit.make('#editor', {
    globalFullSize: false
});

editor.toggleFullSize(true);
```

### Listen for Fullsize Changes

```typescript
const editor = Jodit.make('#editor');

editor.e.on('toggleFullSize', (enabled) => {
    if (enabled) {
        console.log('Entered fullscreen mode');
    } else {
        console.log('Exited fullscreen mode');
    }
});

// Fires after resize completes
editor.e.on('afterResize', () => {
    console.log('Editor resized');
});
```

### Custom Button Configuration

```typescript
const editor = Jodit.make('#editor', {
    controls: {
        fullsize: {
            tooltip: 'Toggle fullscreen mode'
        }
    }
});
```

## How It Works

### Plugin Initialization

1. **Button Registration**: Registers the `fullsize` toolbar button
2. **State Variables**: Initializes tracking variables:
   - `isEnabled`: Current fullscreen state
   - `oldHeight`: Original editor height
   - `oldWidth`: Original editor width
   - `wasToggled`: Whether fullscreen was ever activated
3. **Event Handlers**: Sets up event listeners for window resize and editor lifecycle events
4. **Global Stack**: Uses a shared `fullsizeStack` Set to track all fullscreen editors

### Entering Fullscreen Mode

When fullscreen is enabled:

1. **Save Dimensions**: Stores the current container height and width
2. **Apply Fullscreen Styles**: Adds the `jodit_fullsize` class to the container
3. **Resize Container**: Sets container dimensions to match window inner dimensions:
   - `height: window.innerHeight`
   - `width: window.innerWidth`
4. **Update Stack**: Adds the container to the global `fullsizeStack`
5. **Global Mode**: If `globalFullSize` is enabled and this is the first fullscreen editor:
   - Traverses up the DOM tree from the container
   - Adds `jodit_fullsize-box_true` class to all parent elements
   - Stops at document node or document fragment
6. **Toolbar Adjustment**: Ensures toolbar is properly positioned and sets width to `auto`
7. **Update State**: Sets `editor.o.fullsize = true`
8. **Fire Events**: Triggers `afterResize` event

### Exiting Fullscreen Mode

When fullscreen is disabled:

1. **Remove Fullscreen Styles**: Removes the `jodit_fullsize` class from the container
2. **Restore Dimensions**: Restores original height and width (or 'auto' if not set)
3. **Update Stack**: Removes the container from `fullsizeStack`
4. **Global Mode**: If `globalFullSize` is enabled and this is the last fullscreen editor:
   - Traverses up the DOM tree
   - Removes `jodit_fullsize-box_true` class from all parent elements
5. **Update State**: Sets `editor.o.fullsize = false`
6. **Fire Events**: Triggers `afterResize` event

### Window Resize Handling

When `globalFullSize` is enabled:

1. **Listen to Window Resize**: Attaches a listener to the window's resize event
2. **Auto-Adjust**: In fullscreen mode, automatically adjusts container to new window dimensions
3. **Preserve State**: When not in fullscreen, original dimensions are preserved

### Button State Update

The fullsize button updates dynamically:

1. **Icon Change**: Shows "fullsize" icon normally, "shrink" icon when in fullscreen
2. **Activation State**: Button appears activated when in fullscreen mode
3. **Text Mode**: If `textIcons` is enabled, shows "fullsize" or "shrink" text

### Multiple Editor Support

The plugin handles multiple editor instances:

1. **Shared Stack**: Uses a global `fullsizeStack` Set to track all fullscreen editors
2. **Global Mode Logic**: Only applies global parent styles when:
   - Entering fullscreen and it's the first editor (stack size becomes 1)
   - Exiting fullscreen and it's the last editor (stack size becomes 0)
3. **Independent Operation**: Each editor can be in fullscreen independently

## Methods

### `editor.toggleFullSize()`

Toggles between fullscreen and normal modes.

**Syntax:**
```typescript
editor.toggleFullSize(enable?: boolean): void
```

**Parameters:**
- `enable` (boolean, optional): If specified, explicitly sets fullscreen mode. If omitted, toggles current state.

**Example:**
```typescript
// Toggle
editor.toggleFullSize();

// Enable fullscreen
editor.toggleFullSize(true);

// Disable fullscreen
editor.toggleFullSize(false);
```

### `editor.isFullSize`

**Type:** `boolean` (read-only property)

Returns whether the editor is currently in fullscreen mode.

**Example:**
```typescript
if (editor.isFullSize) {
    console.log('Currently in fullscreen');
}
```

## Events

### `toggleFullSize`

Fired when fullscreen mode is toggled.

**Handler signature:**
```typescript
(enable: boolean) => void
```

**Example:**
```typescript
editor.e.on('toggleFullSize', (enabled) => {
    console.log(`Fullscreen: ${enabled}`);
});
```

### `afterResize`

Fired after the editor is resized (when entering/exiting fullscreen or window is resized).

**Example:**
```typescript
editor.e.on('afterResize', () => {
    console.log('Editor was resized');
});
```

## Edge Cases

1. **Multiple Editors**: When multiple editors are on the same page, global fullsize mode is coordinated so parent elements are styled only when at least one editor is fullscreen

2. **Window Resize**: In fullscreen mode with `globalFullSize` enabled, the editor automatically adjusts to window resize events

3. **Original Dimensions**: If the editor had no explicit dimensions set, it restores to 'auto' when exiting fullscreen

4. **Nested Containers**: The plugin traverses all parent elements up to the document node, ensuring proper z-index stacking

5. **Toolbar Repositioning**: When entering fullscreen, the toolbar is repositioned within the editor's toolbar container

6. **Editor Destruction**: If an editor is destroyed while in fullscreen mode, it automatically exits fullscreen and cleans up

7. **Initial Fullsize**: When `fullsize: true` is set in options, fullscreen is applied after both `afterInit` and `afterOpen` events

8. **CSS Specificity**: Global fullsize styles use `!important` to ensure they override other styles

## Notes

- The plugin works in both WYSIWYG and source code modes
- Fullscreen mode uses CSS classes rather than the native Fullscreen API for better control
- The `jodit_fullsize-box_true` class applied to parent elements sets `z-index: 100000 !important`
- Original dimensions are preserved using inline styles, not computed styles
- The plugin uses a module-level `fullsizeStack` Set to coordinate across multiple editor instances
- Window resize event listener is only attached when `globalFullSize` is enabled
- Toolbar width is set to 'auto' in fullscreen mode to allow it to span the full width
- The button's icon/text updates automatically based on the current state
- The plugin properly cleans up event listeners when the editor is destroyed
- Fullscreen state is stored in `editor.o.fullsize` and can be checked via `editor.isFullSize`