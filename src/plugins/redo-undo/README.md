# Redo-Undo Plugin

Provides redo and undo functionality with toolbar buttons and keyboard shortcuts. This plugin integrates with the editor's history system to allow users to step backward and forward through their editing actions.

## Features

- Undo button in toolbar
- Redo button in toolbar
- Keyboard shortcuts for undo/redo
- Button state management (disabled when no history)
- Multiple hotkey combinations support
- Works with editor history system
- Custom SVG icons
- Toolbar group: history

## Configuration Options

This plugin has no direct configuration options. It uses the editor's history configuration which is part of the core system.

### History Configuration (Core)

These options are configured via `editor.o.history` and affect undo/redo behavior:

#### `history.enable`

**Type:** `boolean`

**Default:** `true`

Enables or disables the history tracking system.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    history: {
        enable: true
    }
});
```

#### `history.maxHistoryLength`

**Type:** `number`

**Default:** `Infinity`

Limits the number of history snapshots stored. Older snapshots are discarded when limit is exceeded.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    history: {
        maxHistoryLength: 100  // Store max 100 undo/redo snapshots
    }
});
```

#### `history.timeout`

**Type:** `number`

**Default:** `1000` (milliseconds)

Delay (in milliseconds) before creating a new history snapshot after a change. Prevents creating snapshots on every keystroke.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    history: {
        timeout: 500  // Create snapshots every 500ms of inactivity
    }
});
```

## Controls

### `undo` Control

**Icon:** `'undo'` (custom SVG)

**Tooltip:** `'Undo'`

**Group:** `'history'`

**Mode:** `MODE_SPLIT` (available in all modes)

**Hotkeys:** `['ctrl+z', 'cmd+z']`

**Disabled When:** No undo actions available (`!editor.history.canUndo()`)

Reverts the last editing action.

### `redo` Control

**Icon:** `'redo'` (custom SVG)

**Tooltip:** `'Redo'`

**Group:** `'history'`

**Mode:** `MODE_SPLIT` (available in all modes)

**Hotkeys:** `['ctrl+y', 'ctrl+shift+z', 'cmd+y', 'cmd+shift+z']`

**Disabled When:** No redo actions available (`!editor.history.canRedo()`)

Re-applies the last undone action.

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor');
// Make some changes...
// Click Undo button or press Ctrl+Z
// Click Redo button or press Ctrl+Y
```

### Programmatic Undo/Redo

```typescript
const editor = Jodit.make('#editor');

// Undo last action
editor.execCommand('undo');

// Redo last undone action
editor.execCommand('redo');
```

### Check History State

```typescript
const editor = Jodit.make('#editor');

// Check if undo is available
if (editor.history.canUndo()) {
    console.log('Undo is available');
    editor.history.undo();
}

// Check if redo is available
if (editor.history.canRedo()) {
    console.log('Redo is available');
    editor.history.redo();
}
```

### Custom Hotkeys

```typescript
Jodit.make('#editor', {
    controls: {
        undo: {
            hotkeys: ['ctrl+z', 'cmd+z', 'alt+backspace']
        },
        redo: {
            hotkeys: ['ctrl+y', 'cmd+y', 'ctrl+shift+z', 'cmd+shift+z']
        }
    }
});
```

### Configure History System

```typescript
const editor = Jodit.make('#editor', {
    history: {
        enable: true,
        maxHistoryLength: 50,  // Keep last 50 changes
        timeout: 2000          // Create snapshot after 2s of inactivity
    }
});

// Make changes...
editor.value = '<p>Test content</p>';

// Wait 2 seconds (timeout) for snapshot to be created
setTimeout(() => {
    editor.value = '<p>Modified content</p>';

    // Wait another 2 seconds
    setTimeout(() => {
        // Now undo is available
        editor.history.undo();  // Returns to "Test content"
    }, 2100);
}, 2100);
```

### Disable History System

```typescript
const editor = Jodit.make('#editor', {
    history: {
        enable: false  // No undo/redo functionality
    }
});
// Undo/redo buttons will be disabled
```

### History Length Limit

```typescript
const editor = Jodit.make('#editor', {
    history: {
        maxHistoryLength: 10  // Only keep last 10 changes
    }
});

// After 11 changes, the first change cannot be undone anymore
```

### Direct History API

```typescript
const editor = Jodit.make('#editor');

// Get history length
console.log(editor.history.length);

// Clear all history
editor.history.clear();

// Direct undo/redo methods
editor.history.undo();
editor.history.redo();
```

### Custom Toolbar with History Buttons

```typescript
Jodit.make('#editor', {
    buttons: ['bold', 'italic', '|', 'undo', 'redo'],
    toolbarAdaptive: false
});
```

## How It Works

### Plugin Initialization

1. **Icons Registration**: Registers custom SVG icons for undo/redo buttons
2. **Control Configuration**: Sets up button controls in `Config.prototype.controls`
3. **Button Registration**: Adds buttons to 'history' toolbar group
4. **Command Registration**: Registers 'undo' and 'redo' commands with hotkeys

### Command Registration

When plugin initializes:

```typescript
editor.registerCommand('redo', {
    exec: () => {
        editor.history.redo();
        return false;
    },
    hotkeys: ['ctrl+y', 'ctrl+shift+z', 'cmd+y', 'cmd+shift+z']
});

editor.registerCommand('undo', {
    exec: () => {
        editor.history.undo();
        return false;
    },
    hotkeys: ['ctrl+z', 'cmd+z']
});
```

### Button State Management

Buttons use `isDisabled` callback:
- **Undo button**: Disabled when `!editor.history.canUndo()`
- **Redo button**: Disabled when `!editor.history.canRedo()`

The buttons automatically update their disabled state as history changes.

### History System Integration

The plugin delegates to the editor's history system:
- `editor.history.undo()` - Steps backward
- `editor.history.redo()` - Steps forward
- `editor.history.canUndo()` - Checks if undo available
- `editor.history.canRedo()` - Checks if redo available

### Snapshot Creation

History snapshots are created:
1. After `timeout` milliseconds of inactivity (default 1000ms)
2. On selection changes, mouse events, keyboard events
3. Automatically managed by core History module
4. Stored in Stack with configurable max length

### Multiple Hotkey Support

The plugin supports cross-platform hotkeys:
- **Undo**: Ctrl+Z (Windows/Linux), Cmd+Z (Mac)
- **Redo**: Ctrl+Y, Ctrl+Shift+Z (Windows/Linux), Cmd+Y, Cmd+Shift+Z (Mac)

## Commands

### `undo`

Reverts the last editing action.

**Syntax:**
```typescript
editor.execCommand('undo')
```

**Hotkeys:** `['ctrl+z', 'cmd+z']`

**Example:**
```typescript
// Undo via command
editor.execCommand('undo');

// Undo via API
editor.history.undo();

// Check availability first
if (editor.history.canUndo()) {
    editor.execCommand('undo');
}
```

### `redo`

Re-applies the last undone action.

**Syntax:**
```typescript
editor.execCommand('redo')
```

**Hotkeys:** `['ctrl+y', 'ctrl+shift+z', 'cmd+y', 'cmd+shift+z']`

**Example:**
```typescript
// Redo via command
editor.execCommand('redo');

// Redo via API
editor.history.redo();

// Check availability first
if (editor.history.canRedo()) {
    editor.execCommand('redo');
}
```

## Events

The plugin itself doesn't fire custom events, but integrates with history system events.

### History System Events

These events are fired by the core history module:

#### `changeStack`

Fired when history stack changes (after undo/redo/clear).

**Example:**
```typescript
editor.e.on('changeStack', () => {
    console.log('History changed');
    console.log('Can undo:', editor.history.canUndo());
    console.log('Can redo:', editor.history.canRedo());
});
```

#### `internalChange`

Fired on internal content changes that trigger snapshot creation.

**Example:**
```typescript
editor.e.on('internalChange', () => {
    console.log('Content changed, snapshot may be created');
});
```

## Edge Cases

1. **No History**: Buttons are disabled if `history.enable` is `false`

2. **Empty Stack**: Undo button disabled at initial state, redo disabled until first undo

3. **History Limit**: When `maxHistoryLength` exceeded, oldest snapshots discarded

4. **Rapid Changes**: Snapshot creation is debounced by `timeout` to prevent excessive snapshots

5. **Selection Only**: Selection changes create snapshots to restore cursor position

6. **Command Return**: Commands return `false` to prevent default behavior

7. **Cross-Platform**: Supports both Windows/Linux (Ctrl) and Mac (Cmd) modifiers

8. **Disabled Editor**: History continues tracking even when editor is disabled

9. **Source Mode**: History works in both WYSIWYG and source code modes

10. **Button Groups**: Buttons placed in 'history' group for toolbar organization

## Notes

- Plugin is class-based, extends `Plugin` base class
- Uses custom SVG icons for undo/redo buttons
- Buttons registered in 'history' toolbar group
- Both buttons use `MODE_SPLIT` (available in all editor modes)
- Commands registered with multiple hotkey combinations
- Button state (enabled/disabled) managed via `isDisabled` callbacks
- Plugin delegates all functionality to core `History` module
- History module uses `Stack` class for snapshot storage
- History module uses `Snapshot` class for capturing editor state
- Snapshots include content and selection information
- The `timeout` option uses debouncing to batch rapid changes
- History is per-editor instance (each editor has separate history)
- No persistence between page reloads (history is in-memory)
- The plugin has minimal code - mainly registers buttons and commands
- Core history system handles all snapshot creation and management
- Button tooltips are localized via i18n system
- The `maxHistoryLength` of `Infinity` means unlimited history by default
- Stack uses FIFO (first-in-first-out) when limit exceeded
- The plugin properly cleans up on editor destruction (minimal cleanup needed)
- History system event namespacing uses `.history` suffix
- Selection restoration ensures cursor returns to correct position after undo/redo
- The plugin returns `false` from command exec to stop event propagation
- Redo button supports 4 different hotkey combinations for compatibility
- The core History class extends `ViewComponent` for lifecycle management
- History snapshots capture both HTML content and selection/cursor state

## Typical Use Case

Users need to correct mistakes or experiment with changes without losing previous work. The redo-undo plugin provides this by:

1. Automatically tracking all editing actions
2. Providing toolbar buttons for easy access
3. Supporting standard keyboard shortcuts
4. Managing button states (enabled/disabled)
5. Preserving selection and cursor position

This improves user experience by:
- Enabling risk-free experimentation
- Providing familiar undo/redo functionality
- Supporting keyboard-driven workflows
- Preventing data loss from mistakes
- Following platform conventions (Ctrl/Cmd modifiers)