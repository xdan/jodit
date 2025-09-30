# Paste Plugin

Handles pasting text and HTML fragments from the clipboard. This plugin provides extensive control over how pasted content is processed, with options for prompting users on paste method, cleaning HTML, converting plain text, and custom paste actions.

## Features

- Clipboard paste handling with multiple insertion modes
- User prompt for HTML paste method (keep formatting, as text, only text)
- Paste choice memorization per fragment
- HTML processing and cleaning
- Plain text newline-to-BR conversion
- Tag preservation control for text mode
- Custom paste actions via events
- Scroll to pasted content
- Paste button with clipboard API support
- Paste storage integration
- Browser clipboard API fallback

## Configuration Options

### `askBeforePasteHTML`

**Type:** `boolean`

**Default:** `true`

When `true`, prompts user with insertion method options when pasting HTML in WYSIWYG mode. Options defined in `pasteHTMLActionList`.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    askBeforePasteHTML: true
});
```

### `memorizeChoiceWhenPasteFragment`

**Type:** `boolean`

**Default:** `false`

When `true`, remembers the user's choice for pasting a specific HTML fragment. If the same fragment is pasted again, uses the previously selected option without prompting.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    memorizeChoiceWhenPasteFragment: true
});
```

### `processPasteHTML`

**Type:** `boolean`

**Default:** `true`

When `true`, processes pasted HTML content (cleaning, filtering, etc.). When `false`, HTML is inserted as-is without processing.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    processPasteHTML: true
});
```

### `nl2brInPlainText`

**Type:** `boolean`

**Default:** `true`

When `true`, converts newlines to `<br>` tags when pasting plain text. When `false`, newlines are preserved as-is.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    nl2brInPlainText: true
});
```

### `pasteExcludeStripTags`

**Type:** `HTMLTagNames[]`

**Default:** `['br', 'hr']`

List of HTML tag names that will NOT be removed when pasting with `INSERT_AS_TEXT` mode. All other tags are stripped, but these tags are preserved.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    pasteExcludeStripTags: ['br', 'hr', 'strong', 'em']
});
```

### `pasteHTMLActionList`

**Type:** `IUIOption[]`

**Default:**
```typescript
[
    { value: INSERT_AS_HTML, text: 'Keep' },
    { value: INSERT_AS_TEXT, text: 'Insert as Text' },
    { value: INSERT_ONLY_TEXT, text: 'Insert only Text' }
]
```

Options displayed to user when pasting HTML (if `askBeforePasteHTML` is `true`). Each option has:
- `value`: Insert mode constant
- `text`: Display text for the option

**Available constants:**
- `INSERT_AS_HTML`: Keep original HTML with all formatting and tags
- `INSERT_AS_TEXT`: Convert HTML to plain text with basic formatting (like `<b>`, `<i>`)
- `INSERT_ONLY_TEXT`: Insert only text content, strip all HTML tags
- `INSERT_CLEAR_HTML`: Clean and sanitize HTML (removes Word/external formatting, keeps structure)

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    pasteHTMLActionList: [
        { value: Jodit.constants.INSERT_AS_HTML, text: 'Keep Formatting' },
        { value: Jodit.constants.INSERT_AS_TEXT, text: 'As Text' },
        { value: Jodit.constants.INSERT_ONLY_TEXT, text: 'Plain Text Only' }
    ]
});
```

### `scrollToPastedContent`

**Type:** `boolean`

**Default:** `true`

When `true`, automatically scrolls the editor to show pasted content after insertion.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    scrollToPastedContent: true
});
```

### `defaultActionOnPaste`

**Type:** `InsertMode`

**Default:** `INSERT_AS_HTML`

Default action when `askBeforePasteHTML` is `false`. Possible values:
- `INSERT_AS_HTML`: Insert with HTML formatting
- `INSERT_AS_TEXT`: Insert as text (strip tags except `pasteExcludeStripTags`)
- `INSERT_ONLY_TEXT`: Insert only text (strip all tags)
- Custom string for custom actions

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    askBeforePasteHTML: false,
    defaultActionOnPaste: Jodit.constants.INSERT_AS_TEXT
});
```

## Usage Examples

### Basic Paste Configuration

```typescript
const editor = Jodit.make('#editor', {
    askBeforePasteHTML: true,
    memorizeChoiceWhenPasteFragment: true,
    processPasteHTML: true,
    nl2brInPlainText: true,
    pasteExcludeStripTags: ['br', 'hr'],
    scrollToPastedContent: true
});
```

### Disable Paste Prompt

```typescript
const editor = Jodit.make('#editor', {
    askBeforePasteHTML: false,
    defaultActionOnPaste: Jodit.constants.INSERT_AS_HTML
});
```

### Always Paste as Plain Text

```typescript
const editor = Jodit.make('#editor', {
    askBeforePasteHTML: false,
    defaultActionOnPaste: Jodit.constants.INSERT_ONLY_TEXT
});
```

### Custom Paste Action

```typescript
Jodit.make('#editor', {
    askBeforePasteHTML: true,
    pasteHTMLActionList: [
        { value: Jodit.constants.INSERT_AS_HTML, text: 'Keep' },
        { value: Jodit.constants.INSERT_AS_TEXT, text: 'Insert as Text' },
        { value: 'custom', text: 'Custom' }
    ],
    events: {
        onCustomPasteHTMLOption: (action, html) => {
            if (action === 'custom') {
                // Remove all <span> tags
                return html.replace(/<span[^>]*>([^<]+)<\/span>/g, '$1');
            }
        }
    }
});
```

### Advanced Custom Paste Processor

```typescript
Jodit.make('#editor', {
    pasteHTMLActionList: [
        {
            text: 'Convert Spans to Paragraphs',
            value: 'custom'
        }
    ],
    events: {
        onCustomPasteHTMLOption: (action, html) => {
            if (action === 'custom') {
                const div = document.createElement('div');
                div.innerHTML = html;
                const spans = div.querySelectorAll('span');
                for (let i = 0; i < spans.length; i++) {
                    const span = spans[i];
                    const p = document.createElement('p');
                    p.innerHTML = span.innerHTML;
                    span.parentNode.replaceChild(p, span);
                }
                return div.innerHTML;
            }
        }
    }
});
```

### Skip Prompt with Custom Default Action

```typescript
Jodit.make('#editor', {
    askBeforePasteHTML: false,
    defaultActionOnPaste: 'custom',
    events: {
        onCustomPasteHTMLOption: (action, html) => {
            if (action === 'custom') {
                // Custom processing
                return html.replace(/<font[^>]*>/g, '').replace(/<\/font>/g, '');
            }
        }
    }
});
```

### Preserve Specific Tags in Text Mode

```typescript
const editor = Jodit.make('#editor', {
    askBeforePasteHTML: true,
    pasteExcludeStripTags: ['br', 'hr', 'strong', 'em', 'u', 'a'],
    defaultActionOnPaste: Jodit.constants.INSERT_AS_TEXT
});
```

### Disable Plugin

```typescript
Jodit.make('#editor', {
    disablePlugins: ['paste']
});
```

## How It Works

### Paste Event Flow

1. **Paste Event**: User triggers paste (Ctrl+V, right-click paste, or paste button)
2. **Content Detection**: Plugin detects content type (HTML, plain text, or files)
3. **Processing Decision**:
   - If `askBeforePasteHTML` is `true` and content is HTML: Show prompt
   - If `askBeforePasteHTML` is `false`: Use `defaultActionOnPaste`
   - If memorization enabled and fragment seen before: Use remembered choice
4. **Content Processing**: Apply selected insertion mode
5. **Insertion**: Insert processed content at cursor position
6. **Scroll**: If `scrollToPastedContent` is `true`, scroll to pasted content
7. **Event Firing**: Fire `afterPaste` event

### Insert Modes

**INSERT_AS_HTML** (Keep formatting):
- Processes HTML if `processPasteHTML` is `true`
- Cleans/sanitizes HTML
- Preserves formatting and structure
- Default mode

**INSERT_AS_TEXT** (Insert as Text):
- Strips most HTML tags
- Preserves tags listed in `pasteExcludeStripTags`
- Converts plain text newlines to `<br>` if `nl2brInPlainText` is `true`
- Maintains basic structure

**INSERT_ONLY_TEXT** (Insert only Text):
- Strips ALL HTML tags
- Converts to plain text
- Converts newlines to `<br>` if `nl2brInPlainText` is `true`
- Loses all formatting

### Custom Paste Actions

Custom actions are handled via `onCustomPasteHTMLOption` event:

1. **Action Registration**: Add custom option to `pasteHTMLActionList`
2. **Event Handler**: Define `onCustomPasteHTMLOption` event handler
3. **Processing**: Event receives action value and HTML string
4. **Return Value**: Handler returns processed HTML string
5. **Insertion**: Processed HTML is inserted into editor

### Paste Choice Memorization

When `memorizeChoiceWhenPasteFragment` is `true`:

1. **Hash Calculation**: Calculates hash of pasted HTML fragment
2. **Choice Storage**: Stores user's chosen action with hash as key
3. **Lookup**: On subsequent paste of same fragment, checks hash
4. **Auto-Apply**: If hash found, applies stored choice without prompting

### Clipboard API Support

The paste button tries multiple methods to access clipboard:

1. **Modern API**: `navigator.clipboard.read()` for full clipboard access
2. **Text API**: `navigator.clipboard.readText()` as fallback
3. **Buffer Fallback**: Internal `editor.buffer` for manual copy operations
4. **ExecCommand**: Browser's `execCommand('paste')` as last resort
5. **Error Handling**: Shows alert if all methods fail

## Controls

### `paste` Control

**Tooltip:** `'Paste from clipboard'`

**List:**
- Main action: Paste from clipboard
- `pasteStorage`: Open paste storage (if available)

Pastes content from clipboard using best available method. Shows paste storage option if paste storage plugin is enabled and has entries.

## Events

### `onCustomPasteHTMLOption`

Fired when custom paste action is selected from `pasteHTMLActionList`.

**Parameters:**
- `action` (string): The custom action value
- `html` (string): The HTML to be pasted

**Returns:** Processed HTML string

**Example:**
```typescript
editor.e.on('onCustomPasteHTMLOption', (action, html) => {
    if (action === 'removeDivs') {
        return html.replace(/<\/?div[^>]*>/g, '');
    }
    return html;
});
```

### `afterPaste`

Fired after content is successfully pasted.

**Example:**
```typescript
editor.e.on('afterPaste', () => {
    console.log('Content pasted successfully');
});
```

## Edge Cases

1. **Empty Clipboard**: If clipboard is empty, shows browser error or does nothing

2. **Permission Denied**: If browser blocks clipboard access, falls back to execCommand or shows alert

3. **Binary Data**: Files and images are handled separately (not by this plugin)

4. **Same Fragment**: With memorization enabled, identical HTML uses remembered choice

5. **Custom Actions**: Must return processed HTML string; returning undefined causes error

6. **Plain Text Paste**: Always converts newlines to `<br>` if `nl2brInPlainText` is `true`

7. **No Prompt Mode**: `askBeforePasteHTML: false` always uses `defaultActionOnPaste`

8. **Tag Preservation**: `pasteExcludeStripTags` only applies to `INSERT_AS_TEXT` mode

9. **Scroll Behavior**: `scrollToPastedContent` scrolls only if content is outside viewport

10. **Processing Toggle**: `processPasteHTML: false` bypasses all HTML cleaning

## Notes

- Plugin handles all paste operations in the editor
- Insert mode constants are available at `Jodit.constants.INSERT_AS_HTML`, `INSERT_AS_TEXT`, `INSERT_ONLY_TEXT`
- The paste button attempts multiple clipboard access methods for compatibility
- Choice memorization uses content hash for identification
- Custom actions require `onCustomPasteHTMLOption` event handler
- The `pasteStorage` option appears in paste button dropdown if paste-storage plugin is enabled
- HTML processing includes sanitization, tag filtering, and attribute cleaning
- Plain text mode respects `nl2brInPlainText` for newline handling
- The plugin fires `afterPaste` event after successful paste for tracking
- Paste storage integration allows accessing previously pasted items
- Browser security restrictions may limit clipboard API access (HTTPS required for modern API)
- The plugin uses `execCommand('paste')` as fallback for older browsers
- Memorized choices are stored per editor instance (not persisted)
- Custom action values can be any string (not just constants)
- The `text` property in `pasteHTMLActionList` supports localization
- Plugin properly handles pasting from external sources (Word, Excel, web pages)
- The `INSERT_AS_TEXT` mode preserves specified tags while removing others
- Paste button shows as disabled if paste storage is empty

## Paste Modes Comparison

| Mode | HTML Tags | Formatting | Structure | Use Case |
|------|-----------|------------|-----------|----------|
| INSERT_AS_HTML | Preserved | Kept | Maintained | Paste from rich sources |
| INSERT_AS_TEXT | Partially stripped* | Basic | Simplified | Clean paste with structure |
| INSERT_ONLY_TEXT | All stripped | None | Lost | Plain text only |

\* Preserves tags in `pasteExcludeStripTags`