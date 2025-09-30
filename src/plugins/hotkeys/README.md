# Hotkeys Plugin

Provides keyboard shortcut functionality for the Jodit editor. This plugin allows users to bind keyboard combinations to editor commands and enables the execution of commands via customizable hotkeys.

## Features

- Map keyboard shortcuts to editor commands
- Support for multiple shortcuts per command
- Modifier key support (Ctrl, Alt, Shift, Meta/Cmd)
- Cross-platform shortcut aliases (Ctrl/Cmd)
- Special key detection (ESC, F1-F12, arrows, etc.)
- Event-based hotkey handling
- Customizable hotkey mappings
- Escape key special handling
- Key normalization for consistent behavior

## Configuration Options

### `commandToHotkeys`

**Type:** `IDictionary<string | string[]>`

**Default:**
```typescript
{
    removeFormat: ['ctrl+shift+m', 'cmd+shift+m'],
    insertOrderedList: ['ctrl+shift+7', 'cmd+shift+7'],
    insertUnorderedList: ['ctrl+shift+8', 'cmd+shift+8'],
    selectall: ['ctrl+a', 'cmd+a']
}
```

Maps editor commands to keyboard shortcuts. Each command can have a single shortcut (string) or multiple shortcuts (array of strings).

**Shortcut Format:**
- Single key: `'a'`, `'1'`, `'f5'`
- With modifiers: `'ctrl+b'`, `'alt+shift+d'`
- Multiple shortcuts: `['ctrl+b', 'cmd+b']`

**Supported Modifiers:**
- `ctrl` - Control key (Windows/Linux)
- `cmd` - Command/Meta key (Mac)
- `alt` - Alt/Option key
- `shift` - Shift key
- `meta` - Meta/Command key (alternative to `cmd`)

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    commandToHotkeys: {
        bold: 'ctrl+b',
        italic: ['ctrl+i', 'cmd+i'],
        underline: 'ctrl+u'
    }
});
```

## Usage Examples

### Basic Usage

The plugin is enabled by default with preset hotkeys:

```typescript
const editor = Jodit.make('#editor');
// Ctrl+A (or Cmd+A on Mac) - Select all
// Ctrl+Shift+M - Remove formatting
// Ctrl+Shift+7 - Insert ordered list
// Ctrl+Shift+8 - Insert unordered list
```

### Custom Command Hotkeys

```typescript
const editor = Jodit.make('#editor', {
    commandToHotkeys: {
        bold: ['ctrl+b', 'cmd+b'],
        italic: ['ctrl+i', 'cmd+i'],
        underline: ['ctrl+u', 'cmd+u'],
        strikethrough: ['ctrl+shift+s', 'cmd+shift+s']
    }
});
```

### Multiple Shortcuts for One Command

```typescript
const editor = Jodit.make('#editor', {
    commandToHotkeys: {
        // Both shortcuts will work
        insertOrderedList: ['ctrl+shift+7', 'ctrl+shift+o', 'cmd+shift+7']
    }
});
```

### Override Default Hotkeys

```typescript
const editor = Jodit.make('#editor', {
    commandToHotkeys: {
        // Change the default selectall hotkey
        selectall: ['ctrl+shift+a', 'cmd+shift+a']
    }
});
```

### Custom Commands with Hotkeys

```typescript
const editor = Jodit.make('#editor', {
    commandToHotkeys: {
        myCustomCommand: ['ctrl+shift+x', 'cmd+shift+x']
    }
});

// Register the custom command
editor.registerCommand('myCustomCommand', () => {
    alert('Custom command executed!');
    return false;
});
```

### Using Function Keys

```typescript
const editor = Jodit.make('#editor', {
    commandToHotkeys: {
        fullsize: 'f11',
        preview: 'f12',
        source: 'f10'
    }
});
```

### Event-Based Hotkey Handling

```typescript
const editor = Jodit.make('#editor');

// Listen for specific hotkey
editor.e.on('ctrl+b.hotkey', (eventType, stop) => {
    console.log('Ctrl+B pressed');
    // Prevent default behavior
    return false;
});

// Listen for any hotkey without binding to command
editor.e.on('ctrl+shift+t.hotkey', () => {
    console.log('Custom hotkey pressed');
    return false;
});
```

### Programmatic Hotkey Registration

```typescript
const editor = Jodit.make('#editor');

// Register a hotkey for a command
editor.registerHotkeyToCommand('ctrl+shift+p', 'insertParagraph');

// Register multiple hotkeys
editor.registerHotkeyToCommand(['ctrl+g', 'cmd+g'], 'insertImage');
```

### Escape Key Handling

```typescript
const editor = Jodit.make('#editor');

// Listen for ESC key
editor.e.on('escape', (event) => {
    console.log('Escape key pressed');
    // Close popups, dialogs, etc.
});
```

### Complex Modifier Combinations

```typescript
const editor = Jodit.make('#editor', {
    commandToHotkeys: {
        // Ctrl+Alt+Key combinations
        customAction1: 'ctrl+alt+x',
        // Ctrl+Shift+Alt combinations
        customAction2: 'ctrl+shift+alt+z',
        // Meta (Command) key combinations
        customAction3: 'meta+shift+k'
    }
});
```

## How It Works

### Plugin Initialization

1. **Command Registration**: Iterates through `commandToHotkeys` configuration
2. **Hotkey Binding**: Registers each hotkey to its corresponding command using `registerHotkeyToCommand()`
3. **Event Listeners**: Sets up keyboard event listeners on the editor and window

### Key Press Detection

When a key is pressed:

1. **Special Key Check**: Looks up the key code in the `specialKeys` mapping
2. **Character Extraction**: Gets the character from `event.key` or converts from `event.which`
3. **Modifier Detection**: Checks for active modifiers (Ctrl, Alt, Shift, Meta)
4. **Key Combination Building**: Combines modifiers and key into a string (e.g., `'ctrl+shift+b'`)
5. **Normalization**: Normalizes key aliases using `normalizeKeyAliases()`:
   - Converts `cmd` to `meta` internally
   - Standardizes key order
   - Handles platform-specific differences

### Hotkey Execution

When a hotkey is detected:

1. **Event Fire**: Fires an event with pattern `{shortcut}.hotkey` (e.g., `'ctrl+b.hotkey'`)
2. **Handler Invocation**: Calls registered handlers for that hotkey
3. **Stop Propagation Control**: Uses a `stop` object with `shouldStop` flag:
   - If handler returns `false` and `shouldStop` is `true`: prevents default and stops propagation
   - If handler returns `false` and `shouldStop` is `false`: only prevents default
4. **Key State Tracking**: Sets `itIsHotkey` flag to track hotkey activation
5. **Keyup Handling**: On keyup, if a hotkey was active, stops propagation

### Special Keys Mapping

The plugin recognizes these special keys by their key codes:

- **Navigation**: `left`, `up`, `right`, `down`, `home`, `end`, `pageup`, `pagedown`
- **Function Keys**: `f1` through `f12`
- **Editing**: `backspace`, `del`, `insert`, `return`, `tab`, `space`, `esc`
- **Modifiers**: `shift`, `ctrl`, `alt`, `meta`
- **Other**: `capslock`, `numlock`, `scroll`, `pause`
- **Symbols**: `;`, `=`, `,`, `-`, `.`, `/`, `` ` ``, `[`, `\`, `]`, `'`
- **Numpad**: `0`-`9`, `*`, `+`, `-`, `.`, `/`

### Escape Key Handling

The ESC key has special handling:

1. **Direct Event**: Immediately fires `'escape'` event without command processing
2. **Global Listening**: Listens on both editor and window objects
3. **Priority**: ESC handling bypasses normal hotkey processing

### Event Propagation

The plugin uses `{ top: true }` option for keyboard events:

- Ensures hotkey handlers run before other keyboard handlers
- Allows hotkeys to prevent default browser behavior
- Controls whether the event continues to other handlers

## Methods

### `editor.registerHotkeyToCommand()`

Registers a keyboard shortcut to execute a command.

**Syntax:**
```typescript
editor.registerHotkeyToCommand(
    hotkeys: string | string[],
    commandName: string
): void
```

**Parameters:**
- `hotkeys` (string | string[]): Single hotkey or array of hotkeys
- `commandName` (string): The command to execute

**Example:**
```typescript
editor.registerHotkeyToCommand('ctrl+b', 'bold');
editor.registerHotkeyToCommand(['ctrl+i', 'cmd+i'], 'italic');
```

## Events

### `{shortcut}.hotkey`

Fired when a specific keyboard shortcut is pressed.

**Handler signature:**
```typescript
(eventType: string, stop: { shouldStop: boolean }) => false | void
```

**Parameters:**
- `eventType`: The type of keyboard event ('keydown')
- `stop`: Object with `shouldStop` flag to control propagation

**Example:**
```typescript
editor.e.on('ctrl+b.hotkey', (eventType, stop) => {
    console.log('Bold hotkey pressed');
    // Return false to prevent default and stop propagation
    return false;
});

// Prevent default but allow propagation
editor.e.on('ctrl+i.hotkey', (eventType, stop) => {
    stop.shouldStop = false; // Allow other handlers to run
    return false; // But still prevent browser default
});
```

### `escape`

Fired when the ESC key is pressed.

**Handler signature:**
```typescript
(event: KeyboardEvent) => void
```

**Example:**
```typescript
editor.e.on('escape', (event) => {
    console.log('ESC key pressed');
    // Close dialogs, popups, etc.
});
```

## Edge Cases

1. **Key Order**: In event names, modifiers must be in order: `meta`, `ctrl`, `alt`, `shift`, then the key

2. **Ctrl vs Command**: In configuration, use `ctrl` and `cmd` separately. Internally they're normalized to `control` and `meta`

3. **Multiple Handlers**: If multiple handlers are registered for the same hotkey, they all execute unless one stops propagation

4. **Platform Differences**: The plugin automatically handles Windows/Linux (Ctrl) vs Mac (Cmd) differences

5. **Special Key Priority**: ESC key bypasses normal hotkey processing and fires directly

6. **Browser Defaults**: Some hotkeys may conflict with browser defaults (e.g., Ctrl+S for save). The plugin can override these if handlers return `false`

7. **Case Insensitivity**: Key characters are converted to lowercase for consistent matching

8. **Numpad Keys**: Numpad keys are mapped to their corresponding characters

9. **Key State Tracking**: The plugin tracks whether a hotkey was pressed to properly handle keyup events

10. **Event Timing**: Hotkey handlers are registered with `{ top: true }` to run before other keyboard handlers

## Notes

- The plugin normalizes all hotkey strings to ensure consistent matching across platforms
- Modifier keys must be specified before the main key (e.g., `'ctrl+shift+b'`, not `'b+ctrl+shift'`)
- Multiple shortcuts can be assigned to the same command by providing an array
- Hotkeys work in both WYSIWYG and source code modes
- The plugin respects the order: Meta > Ctrl > Alt > Shift > Key
- Custom commands must be registered before their hotkeys will work
- The plugin uses event delegation with namespaces (`.hotkeys`) for clean removal on destruction
- All keyboard events are captured on both the editor's container and the window
- The `specialKeys` mapping covers all common special keys but can be extended if needed
- Hotkey events can prevent default browser behavior by returning `false`
- The plugin properly cleans up all event listeners when the editor is destroyed