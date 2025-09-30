# Source Plugin

Provides HTML source code editing mode using external code editors. This plugin allows users to switch between WYSIWYG and source code editing modes, with support for Ace Editor (default), plain textarea, or custom editor implementations.

## Features

- Toggle between WYSIWYG and source code modes
- Ace Editor integration via CDN
- Plain textarea fallback
- Custom editor implementation support
- Selection preservation across mode switches
- HTML beautification support
- Read-only mode synchronization
- ESC key to blur source editor
- Split mode support (WYSIWYG + source)
- Selection markers for cursor restoration
- Insert HTML in source mode
- Select all command in source mode
- Auto-sync between WYSIWYG and source
- Touch-friendly mode switching
- Shadow DOM fallback to textarea

## Configuration Options

### `sourceEditor`

**Type:** `'area' | 'ace' | ((jodit: IJodit) => ISourceEditor)`

**Default:** `'ace'`

Determines which source code editor to use:
- `'ace'`: Ace Editor loaded from CDN (default)
- `'area'`: Plain textarea
- Custom function: Returns custom editor implementation

**Example:**
```typescript
// Use Ace Editor (default)
const editor1 = Jodit.make('#editor1', {
    sourceEditor: 'ace'
});

// Use plain textarea
const editor2 = Jodit.make('#editor2', {
    sourceEditor: 'area'
});

// Use custom editor (CodeMirror example)
const editor3 = Jodit.make('#editor3', {
    sourceEditor: (jodit) => new MyCodeMirrorEditor(jodit)
});
```

### `sourceEditorNativeOptions`

**Type:** `object`

**Default:**
```typescript
{
    showGutter: true,
    theme: 'ace/theme/idle_fingers',
    mode: 'ace/mode/html',
    wrap: true,
    highlightActiveLine: true
}
```

Configuration options passed directly to Ace Editor. See [Ace Editor docs](https://ace.c9.io/#config) for all options.

**Properties:**
- `showGutter` (boolean): Show line numbers in gutter
- `theme` (string): Ace theme name (e.g., 'ace/theme/chrome')
- `mode` (string): Syntax highlighting mode (e.g., 'ace/mode/html')
- `wrap` (string | boolean | number): Line wrapping - "off", 80-100, true, "free"
- `highlightActiveLine` (boolean): Highlight current line

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    sourceEditorNativeOptions: {
        showGutter: true,
        theme: 'ace/theme/chrome',      // Light theme
        mode: 'ace/mode/html',
        wrap: 'free',                    // Free wrap
        highlightActiveLine: false
    }
});
```

### `beautifyHTML`

**Type:** `boolean`

**Default:** `true` (false in IE)

When enabled, beautifies HTML code in source mode using js-beautify library loaded from CDN. Improves code readability with proper indentation and formatting.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    beautifyHTML: true
});
// HTML will be auto-formatted when switching to source mode
```

### `beautifyHTMLCDNUrlsJS`

**Type:** `string[]`

**Default:**
```typescript
[
    'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.4/beautify.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.4/beautify-html.min.js'
]
```

CDN URLs for loading js-beautify library when `beautifyHTML` is enabled.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    beautifyHTML: true,
    beautifyHTMLCDNUrlsJS: [
        'https://my-cdn.com/beautify.min.js',
        'https://my-cdn.com/beautify-html.min.js'
    ]
});
```

### `sourceEditorCDNUrlsJS`

**Type:** `string[]`

**Default:**
```typescript
[
    'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.2/ace.js'
]
```

CDN URLs for loading Ace Editor when `sourceEditor: 'ace'`.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    sourceEditor: 'ace',
    sourceEditorCDNUrlsJS: [
        'https://my-cdn.com/ace.js'
    ]
});
```

## Controls

### `source` Control

**Icon:** `'source'`

**Tooltip:** `'Change mode'`

**Group:** `'source'`

**Mode:** `MODE_SPLIT`

Toggles editor mode between WYSIWYG and source code editing.

## Usage Examples

### Basic Usage with Ace Editor

```typescript
const editor = Jodit.make('#editor', {
    sourceEditor: 'ace'
});

// Click Source button in toolbar to toggle mode
// Editor loads Ace from CDN and displays HTML source
```

### Use Plain Textarea

```typescript
const editor = Jodit.make('#editor', {
    sourceEditor: 'area'
});

// Simple textarea for source editing
// No external dependencies
```

### Custom Ace Theme

```typescript
const editor = Jodit.make('#editor', {
    sourceEditor: 'ace',
    sourceEditorNativeOptions: {
        theme: 'ace/theme/chrome',           // Light Chrome theme
        showGutter: true,
        highlightActiveLine: true,
        wrap: 80                             // Wrap at 80 chars
    }
});

// See https://ace.c9.io/build/kitchen-sink.html for theme list
```

### Disable HTML Beautification

```typescript
const editor = Jodit.make('#editor', {
    beautifyHTML: false
});

// HTML displayed exactly as stored, no formatting
```

### Custom CodeMirror Editor

```typescript
class CodeMirrorEditor {
    constructor(jodit) {
        this.jodit = jodit;
        this.mirror = CodeMirror(/* ... */);
    }

    getValue() {
        return this.mirror.getValue();
    }

    setValue(raw) {
        this.mirror.setValue(raw);
    }

    insertRaw(raw) {
        this.mirror.replaceSelection(raw);
    }

    getSelectionStart() {
        const cursor = this.mirror.getCursor('start');
        return this.mirror.indexFromPos(cursor);
    }

    getSelectionEnd() {
        const cursor = this.mirror.getCursor('end');
        return this.mirror.indexFromPos(cursor);
    }

    setSelectionRange(start, end) {
        const startPos = this.mirror.posFromIndex(start);
        const endPos = this.mirror.posFromIndex(end);
        this.mirror.setSelection(startPos, endPos);
    }

    setPlaceHolder(title) {
        this.mirror.setOption('placeholder', title);
    }

    focus() {
        this.mirror.focus();
    }

    setReadOnly(isReadOnly) {
        this.mirror.setOption('readOnly', isReadOnly);
    }

    selectAll() {
        this.mirror.execCommand('selectAll');
    }

    get isReady() {
        return true;
    }

    onReadyAlways(callback) {
        callback();
    }
}

const editor = Jodit.make('#editor', {
    sourceEditor: (jodit) => new CodeMirrorEditor(jodit)
});
```

### Programmatic Mode Switch

```typescript
const editor = Jodit.make('#editor');

// Toggle to source mode
editor.toggleMode();

// Or use setMode
editor.setMode(Jodit.constants.MODE_SOURCE);

// Back to WYSIWYG
editor.setMode(Jodit.constants.MODE_WYSIWYG);

// Split mode (both visible)
editor.setMode(Jodit.constants.MODE_SPLIT);
```

### Insert HTML in Source Mode

```typescript
const editor = Jodit.make('#editor');
editor.setMode(Jodit.constants.MODE_SOURCE);

// Insert HTML at cursor position
editor.e.fire('insertHTML', '<strong>Bold text</strong>');

// Automatically updates WYSIWYG view
```

### Select All in Source Mode

```typescript
const editor = Jodit.make('#editor');
editor.setMode(Jodit.constants.MODE_SOURCE);

// Select all source code
editor.execCommand('selectall');
```

### Listen to Source Editor Ready

```typescript
const editor = Jodit.make('#editor');

editor.e.on('sourceEditorReady', () => {
    console.log('Source editor initialized and ready');
});
```

### Custom Beautify Function

```typescript
const editor = Jodit.make('#editor', {
    beautifyHTML: true
});

editor.e.on('beautifyHTML', (html) => {
    // Custom beautification logic
    return html.replace(/></g, '>\n<');
});
```

## How It Works

### Initialization

On plugin init:
1. Creates `.jodit-source` container in workplace
2. Creates initial textarea editor (default)
3. Attaches ESC key handler to blur source editor
4. Sets up placeholder, change, beautifyHTML events
5. If `sourceEditor !== 'area'`, loads external editor (Ace)
6. When editor ready, replaces textarea with external editor
7. Fires `sourceEditorReady` event

### Editor Factory

The `createSourceEditor()` factory:
- If `sourceEditor` is function: calls it to get custom editor
- If `sourceEditor === 'ace'` and no shadow root: creates `AceEditor`
- Otherwise: creates `TextAreaEditor` (fallback)
- Calls `init()` and `setReadOnly()` on editor
- Returns `ISourceEditor` implementation

### Mode Switching

When user clicks Source button or calls `toggleMode()`:

**Before Mode Switch** (`beforeSetMode` event):
1. **From WYSIWYG**: Saves selection, syncs value, updates source via `fromWYSIWYG()`
2. **From Source**: Inserts selection markers at cursor position, converts to WYSIWYG

**After Mode Switch** (`afterSetMode` event):
1. **To WYSIWYG**: Restores selection from saved state
2. **To Source**: Finds selection markers in HTML, removes them, sets cursor position

### Selection Preservation

When switching from source to WYSIWYG:
1. Gets cursor/selection from source editor
2. Normalizes position to avoid splitting tags
3. Inserts `<span data-jodit-selection_marker="start">` marker
4. If range selection, inserts end marker too
5. Converts source to WYSIWYG via `toWYSIWYG()`
6. Markers replaced with temp strings: `{start-jodit-selection}`, `{end-jodit-selection}`
7. If beautifyHTML enabled, beautifies while preserving markers
8. Finds marker positions in beautified HTML
9. Removes markers from HTML
10. Sets selection range in source editor at marker positions

When switching from WYSIWYG to source:
1. Calls `editor.s.save()` to insert DOM selection markers
2. Syncs WYSIWYG value to editor
3. Updates source via `fromWYSIWYG(true)` (force)
4. On `afterSetMode`, calls `editor.s.restore()` to restore selection in WYSIWYG

### Position Normalization

The `getNormalPosition()` method:
- Adjusts cursor position to avoid splitting HTML tags
- Replaces script/style/iframe content with invisible spaces for calculation
- Walks backward from position to find safe insertion point
- Returns position after `>` or before `<` to avoid tag corruption

### Value Synchronization

**fromWYSIWYG()**: WYSIWYG → Source
- Gets editor value via `getEditorValue(false, SOURCE_CONSUMER)`
- Compares with current source value
- Updates source editor if different
- Uses lock flag to prevent circular updates

**toWYSIWYG()**: Source → WYSIWYG
- Gets value from source editor
- Compares with old value
- Sets `editor.value = sourceValue`
- Updates old value cache
- Uses lock flag to prevent circular updates

### Auto-sync Triggers

Source editor synced from WYSIWYG on:
- `change` event (user edits WYSIWYG)
- Mode switch to `MODE_SOURCE` or `MODE_SPLIT`
- `sourceEditorReady` event

WYSIWYG synced from source on:
- Source editor value change (via source editor onChange)
- Mode switch from source to WYSIWYG

### HTML Beautification

When `beautifyHTML: true`:
1. Loads js-beautify from `beautifyHTMLCDNUrlsJS` on init
2. When loaded, registers `beautifyHTML` event handler
3. On mode switch to source, fires `beautifyHTML` event with HTML
4. Event handler calls `html_beautify(html)` from loaded library
5. Returns formatted HTML
6. Formatted HTML displayed in source editor

### Insert HTML in Source Mode

When `insertHTML` event fired in source mode:
1. Calls `sourceEditor.insertRaw(html)` to insert at cursor
2. Calls `toWYSIWYG()` to sync WYSIWYG view
3. Returns `false` to prevent default insertion

### Ace Editor Loading

For `sourceEditor: 'ace'`:
1. Creates `AceEditor` instance (loads ace.js from CDN if needed)
2. Applies `sourceEditorNativeOptions` to Ace instance
3. Sets up onChange handler to call `toWYSIWYG()`
4. Calls `onReadyAlways()` callback when loaded
5. Replaces initial textarea editor with Ace editor

### Readonly Synchronization

When `readonly` option changes:
- `onReadonlyReact()` called via `@watch(':readonly.source')`
- Calls `sourceEditor.setReadOnly(editor.o.readonly)`
- Source editor reflects readonly state

## Events

### `sourceEditorReady`

Fired when source editor (Ace or custom) is fully initialized and ready.

**Parameters:**
- `editor` (IJodit): The editor instance

**Example:**
```typescript
editor.e.on('sourceEditorReady', (editor) => {
    console.log('Source editor ready');
});
```

### `placeholder`

Plugin listens to this event to set placeholder text in source editor.

**Parameters:**
- `text` (string): Placeholder text

**Example:**
```typescript
editor.e.fire('placeholder', 'Enter HTML here...');
```

### `beautifyHTML`

Fired to beautify HTML code. Plugin uses this event to format HTML via js-beautify.

**Parameters:**
- `html` (string): HTML to beautify

**Returns:** Formatted HTML string

**Example:**
```typescript
editor.e.on('beautifyHTML', (html) => {
    // Custom formatting
    return myBeautifyFunction(html);
});
```

### `insertHTML`

Plugin intercepts this event in source mode to insert HTML at cursor position.

**Parameters:**
- `html` (string): HTML to insert

**Example:**
```typescript
editor.e.fire('insertHTML', '<p>New paragraph</p>');
```

## Commands

### `selectall`

Plugin intercepts this command in source mode to select all source code.

**Example:**
```typescript
editor.execCommand('selectall');
// Selects all text in source editor
```

## ISourceEditor Interface

Custom editors must implement this interface:

**Methods:**
- `getValue(): string` - Get current source code
- `setValue(raw: string): void` - Set source code
- `insertRaw(raw: string): void` - Insert HTML at cursor
- `getSelectionStart(): number` - Get selection start position
- `getSelectionEnd(): number` - Get selection end position
- `setSelectionRange(start: number, end: number): void` - Set selection range
- `setPlaceHolder(title: string): void` - Set placeholder text
- `focus(): void` - Focus the editor
- `setReadOnly(isReadOnly: boolean): void` - Set readonly state
- `selectAll(): void` - Select all content

**Properties:**
- `isReady: boolean` - Whether editor is initialized
- `isFocused: boolean` - Whether editor has focus

**Lifecycle:**
- `init(jodit: IJodit): void` - Initialize editor
- `onReadyAlways(callback: Function): void` - Call callback when ready
- `destruct(): void` - Cleanup on destroy
- `blur(): void` - Remove focus

## Edge Cases

1. **Shadow DOM**: Falls back to textarea when shadow root detected (Ace incompatible)
2. **IE Browser**: `beautifyHTML` defaults to false (performance)
3. **ESC Key**: Blurs source editor when ESC pressed in source mode
4. **Lock Flag**: Prevents circular updates between WYSIWYG and source
5. **Selection in Tags**: Normalized to avoid splitting tags during mode switch
6. **Invisible Spaces**: Used for position calculation in script/style/iframe tags
7. **Beautify Failure**: Silently falls back to unformatted HTML
8. **CDN Load Failure**: Textarea used if Ace fails to load
9. **Mode Switch**: Selection preserved across WYSIWYG ↔ source transitions
10. **Read-only Mode**: Synchronized to source editor

## Notes

- Plugin is class-based, extends `Plugin` base class
- Uses `@autobind` and `@watch` decorators
- Source button in 'source' toolbar group
- Event namespacing `.source` for clean removal
- Lock flag `__lock` prevents circular sync
- Old value cache `__oldMirrorValue` for change detection
- Selection markers: `{start-jodit-selection}`, `{end-jodit-selection}`
- Marker regex: `tempMarkerStartReg`, `tempMarkerEndReg`
- The `mirrorContainer` holds source editor
- Ace Editor theme list: https://ace.c9.io/build/kitchen-sink.html
- Ace mode for HTML: `ace/mode/html`
- Default Ace theme: `ace/theme/idle_fingers` (dark)
- Beautify library: js-beautify from cdnjs
- The `SOURCE_CONSUMER` constant identifies source mode requests
- Position normalization uses `INVISIBLE_SPACE` character
- ESC key handler attached to owner window
- The `createSourceEditor()` factory creates editor instances
- AceEditor and TextAreaEditor in `./editor/engines/`
- The plugin properly cleans up source editor on destruction
- Selection saved before mode switch, restored after
- Split mode shows both WYSIWYG and source simultaneously
- The `getNormalPosition()` prevents cursor in middle of tags
- Beautify event allows custom formatting logic
- Source editor container class: `jodit-source`
- The `controls.source` defines toolbar button behavior
- Default mode is `MODE_SPLIT` (shows both editors)
- The `isActive` function checks if source mode active
- Placeholder text forwarded to source editor
- Change event triggers sync from WYSIWYG to source

## Typical Use Case

Developers and power users need direct HTML access for precise control, debugging, or copying code. The source plugin provides this by:

1. Adding Source button to toggle HTML editing mode
2. Loading professional code editor (Ace) with syntax highlighting
3. Preserving cursor position when switching between modes
4. Auto-formatting HTML for readability (beautifyHTML)
5. Supporting custom editor implementations (CodeMirror, Monaco, etc.)

This improves user experience by:
- Providing familiar code editor interface
- Syntax highlighting for easier reading
- Line numbers and code folding
- Maintaining selection across mode switches
- Supporting both simple (textarea) and advanced (Ace) editors
- Allowing full HTML control when needed