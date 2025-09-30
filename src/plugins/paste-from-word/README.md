# Paste From Word Plugin

Processes pasting HTML content from Microsoft Word and Excel documents. This plugin detects Word/Excel-formatted HTML, prompts user for insertion method, and cleans up Microsoft Office-specific markup and styles.

## Features

- Automatic detection of Word/Excel HTML
- User prompt for insertion method (keep formatting, clean, or plain text)
- Word-specific HTML cleaning
- Excel paste support
- Style preservation or stripping options
- Custom action list for Word paste
- Default action configuration
- Beautify HTML integration
- Tag stripping for plain text mode
- Seamless integration with paste plugin

## Configuration Options

### `askBeforePasteFromWord`

**Type:** `boolean`

**Default:** `true`

When `true`, shows a dialog asking the user how to insert content when Word/Excel HTML is detected. Options defined in `pasteFromWordActionList`.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    askBeforePasteFromWord: true
});
```

### `processPasteFromWord`

**Type:** `boolean`

**Default:** `true`

When `true`, enables processing of HTML fragments copied from Microsoft Word/Excel. When `false`, Word HTML is treated as regular HTML.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    processPasteFromWord: true
});
```

### `defaultActionOnPasteFromWord`

**Type:** `InsertMode | null`

**Default:** `null`

Default insert method when pasting from Word/Excel and `askBeforePasteFromWord` is `false`. When `null`, falls back to `defaultActionOnPaste`. Possible values:
- `INSERT_AS_HTML`: Keep Word formatting
- `INSERT_AS_TEXT`: Clean Word markup
- `INSERT_ONLY_TEXT`: Insert only plain text
- `null`: Use `defaultActionOnPaste` instead

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    askBeforePasteFromWord: false,
    defaultActionOnPasteFromWord: Jodit.constants.INSERT_AS_TEXT
});
```

### `pasteFromWordActionList`

**Type:** `IUIOption[]`

**Default:**
```typescript
[
    { value: INSERT_AS_HTML, text: 'Keep' },
    { value: INSERT_AS_TEXT, text: 'Clean' },
    { value: INSERT_ONLY_TEXT, text: 'Insert only Text' }
]
```

Options displayed to user when pasting from Word/Excel (if `askBeforePasteFromWord` is `true`). Each option has:
- `value`: Insert mode constant
- `text`: Display text for the option

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    pasteFromWordActionList: [
        { value: Jodit.constants.INSERT_AS_HTML, text: 'Keep Formatting' },
        { value: Jodit.constants.INSERT_AS_TEXT, text: 'Clean Markup' },
        { value: Jodit.constants.INSERT_ONLY_TEXT, text: 'Plain Text' }
    ]
});
```

## Usage Examples

### Basic Word Paste Configuration

```typescript
const editor = Jodit.make('#editor', {
    askBeforePasteFromWord: true,
    processPasteFromWord: true
});

// Paste from Word
// User will be prompted with insertion options
```

### Always Clean Word HTML

```typescript
const editor = Jodit.make('#editor', {
    askBeforePasteFromWord: false,
    defaultActionOnPasteFromWord: Jodit.constants.INSERT_AS_TEXT
});

// Word content is automatically cleaned
```

### Always Keep Word Formatting

```typescript
const editor = Jodit.make('#editor', {
    askBeforePasteFromWord: false,
    defaultActionOnPasteFromWord: Jodit.constants.INSERT_AS_HTML
});

// Word formatting is preserved
```

### Custom Word Paste Options

```typescript
const editor = Jodit.make('#editor', {
    askBeforePasteFromWord: true,
    pasteFromWordActionList: [
        { value: Jodit.constants.INSERT_AS_HTML, text: 'Keep All Formatting' },
        { value: Jodit.constants.INSERT_AS_TEXT, text: 'Remove Word Markup' }
    ]
});
```

### Disable Word Detection

```typescript
const editor = Jodit.make('#editor', {
    processPasteFromWord: false
});

// Word HTML treated as regular HTML
```

### Use Default Paste Action

```typescript
const editor = Jodit.make('#editor', {
    askBeforePasteFromWord: false,
    defaultActionOnPasteFromWord: null,  // Use defaultActionOnPaste
    defaultActionOnPaste: Jodit.constants.INSERT_AS_TEXT
});
```

### With Beautify HTML Integration

```typescript
const editor = Jodit.make('#editor', {
    askBeforePasteFromWord: false,
    defaultActionOnPasteFromWord: Jodit.constants.INSERT_AS_HTML,
    events: {
        beautifyHTML: (html) => {
            // Custom HTML beautification
            return html.replace(/\s+/g, ' ').trim();
        }
    }
});
```

## How It Works

### Word Detection

The plugin uses `isHtmlFromWord()` helper to detect Word/Excel HTML by checking for:
- Microsoft Office XML namespaces
- Word-specific class names (`MsoNormal`, `MsoListParagraph`, etc.)
- Office-specific meta tags
- Conditional comments
- VML markup

### Processing Flow

1. **Paste Event**: User pastes content
2. **Word Detection**: Plugin checks if HTML is from Word/Excel
3. **Processing Decision**:
   - If `processPasteFromWord` is `false`: Skip Word processing
   - If not Word HTML: Skip Word processing
   - If `askBeforePasteFromWord` is `true`: Show dialog
   - If `askBeforePasteFromWord` is `false`: Use `defaultActionOnPasteFromWord` or `defaultActionOnPaste`
4. **Content Processing**: Apply selected insertion mode
5. **Insertion**: Insert processed HTML into editor

### Insert Modes

**INSERT_AS_HTML** (Keep formatting):
1. **Apply Styles**: Calls `applyStyles()` to convert inline styles
2. **Beautify**: Fires `beautifyHTML` event for custom processing
3. **Result**: Preserves Word formatting with minimal cleanup

**INSERT_AS_TEXT** (Clean markup):
1. **Clean From Word**: Calls `cleanFromWord()` to remove Word-specific markup
2. **Result**: Removes most Word cruft while keeping basic structure

**INSERT_ONLY_TEXT** (Plain text):
1. **Clean From Word**: Calls `cleanFromWord()` first
2. **Strip Tags**: Calls `stripTags()` to remove all HTML
3. **Result**: Only plain text content

### Word Cleaning Process

The `cleanFromWord()` function:
- Removes XML namespaces and VML
- Strips Word-specific class names
- Removes conditional comments
- Cleans up mso-* CSS properties
- Normalizes whitespace
- Removes empty elements
- Converts Word list markup to standard HTML lists
- Strips proprietary Word attributes

### Style Application

The `applyStyles()` function:
- Converts inline Word styles to clean CSS
- Normalizes font names
- Simplifies color values
- Removes redundant properties
- Preserves meaningful formatting

### Beautify HTML Event

When using `INSERT_AS_HTML` mode, the plugin fires `beautifyHTML` event:
- Allows custom HTML post-processing
- Receives cleaned HTML as parameter
- Should return processed HTML string
- Useful for additional formatting rules

## Events

### `beautifyHTML`

Fired when inserting Word HTML with `INSERT_AS_HTML` mode. Allows custom HTML beautification/processing before insertion.

**Parameters:**
- `html` (string): The HTML to beautify

**Returns:** Processed HTML string

**Example:**
```typescript
editor.e.on('beautifyHTML', (html) => {
    // Remove all empty paragraphs
    return html.replace(/<p>\s*<\/p>/g, '');
});
```

### `:processHTML`

Internal event watched by plugin via `@watch(':processHTML')` decorator. Fired by paste plugin to process pasted HTML.

**Parameters:**
- `e`: Paste event
- `text`: Pasted HTML string
- `texts`: Pasted data object

**Returns:** `true` if Word HTML was processed, `false` otherwise

## Edge Cases

1. **Not Word HTML**: If HTML doesn't match Word patterns, plugin does nothing (returns `false`)

2. **Disabled Processing**: If `processPasteFromWord` is `false`, all Word HTML treated as regular HTML

3. **Null Default Action**: If `defaultActionOnPasteFromWord` is `null`, uses `defaultActionOnPaste` instead

4. **Empty Content**: Empty Word HTML is inserted as empty content

5. **Mixed Content**: If paste contains Word HTML + other content, only Word HTML is specially processed

6. **Excel HTML**: Excel-generated HTML is also detected and processed

7. **Dialog Cancellation**: If user cancels Word paste dialog, content is not inserted

8. **Nested Lists**: Word lists are converted to standard HTML lists during cleaning

9. **Inline Styles**: Word inline styles are either preserved (INSERT_AS_HTML) or removed (INSERT_AS_TEXT)

10. **Beautify Return**: If `beautifyHTML` event returns non-string, original HTML is used

## Notes

- Plugin requires 'paste' plugin (declared via `static requires = ['paste']`)
- Plugin is class-based, extends `Plugin` base class
- Word detection is reliable for content copied directly from Word/Excel
- The `@watch(':processHTML')` decorator hooks into paste plugin's processing pipeline
- Cleaning process removes Microsoft Office-specific markup while preserving content
- The `INSERT_AS_HTML` mode applies cleaner styles via `applyStyles()`
- The `INSERT_AS_TEXT` mode uses `cleanFromWord()` for thorough cleanup
- The `INSERT_ONLY_TEXT` mode strips all tags after cleaning
- The plugin integrates seamlessly with the paste plugin's workflow
- Dialog message explains that content is from Word/Excel
- Default action list uses simpler labels than general paste actions
- The `isHtmlFromWord()` helper checks multiple Word/Excel indicators
- Style preservation (INSERT_AS_HTML) still removes problematic Word markup
- Plugin does not process Word documents pasted as files (only HTML clipboard content)
- The `beautifyHTML` event allows custom post-processing without overriding core logic
- Empty methods `afterInit()` and `beforeDestruct()` are placeholders for future use
- Plugin returns `true` from `processWordHTML()` to prevent further paste processing
- The paste plugin respects the plugin's return value and stops processing when `true`

## Typical Use Case

Users often copy content from Microsoft Word or Excel and paste it into the editor. This content contains:
- Excessive inline styles
- Microsoft Office XML namespaces
- Proprietary attributes
- VML graphics markup
- Conditional comments
- Empty spans and divs

The plugin:
1. Detects this Word/Excel HTML automatically
2. Prompts user for desired insertion method
3. Cleans up the markup appropriately
4. Inserts clean, standards-compliant HTML

This improves editor content quality and reduces bloat from Office applications.