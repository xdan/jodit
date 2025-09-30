# Stat Plugin

Displays real-time statistics in the status bar showing character count and word count. This plugin helps users track document length and stay within limits for content requirements.

## Features

- Character counter in status bar
- Word counter in status bar
- Multiple counting modes:
  - Text characters only (default)
  - HTML characters (includes tags)
  - Text with/without spaces
- Real-time updates on content change
- Throttled calculations for performance
- Multi-place editor support
- Internationalized labels
- Configurable display options

## Configuration Options

### `showCharsCounter`

**Type:** `boolean`

**Default:** `true`

When enabled, displays character count in the status bar. Shows text-only characters by default (without HTML tags).

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    showCharsCounter: true
});

// Status bar shows: "Chars: 11" for "<div>Hello world!</div>"
```

### `countHTMLChars`

**Type:** `boolean`

**Default:** `false`

When enabled, counts all characters including HTML tags and attributes. When disabled (default), only counts visible text characters.

**Example:**
```typescript
// Count only text characters (default)
const editor1 = Jodit.make('#editor1', {
    countHTMLChars: false
});
// "<div>Hello world!</div>" = 11 chars (text only)

// Count all HTML characters
const editor2 = Jodit.make('#editor2', {
    countHTMLChars: true
});
// "<div>Hello world!</div>" = 24 chars (including tags)
```

### `countTextSpaces`

**Type:** `boolean`

**Default:** `false`

When enabled, includes spaces in the character count. When disabled (default), spaces are excluded from count. Only applies when `countHTMLChars` is `false`.

**Example:**
```typescript
// Don't count spaces (default)
const editor1 = Jodit.make('#editor1', {
    countTextSpaces: false
});
// "Hello world!" = 11 chars (no space)

// Count spaces
const editor2 = Jodit.make('#editor2', {
    countTextSpaces: true
});
// "Hello world!" = 12 chars (includes space)
```

### `showWordsCounter`

**Type:** `boolean`

**Default:** `true`

When enabled, displays word count in the status bar. Words are separated by whitespace.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    showWordsCounter: true
});

// Status bar shows: "Words: 2" for "Hello world!"
```

## Usage Examples

### Show Both Counters (Default)

```typescript
const editor = Jodit.make('#editor', {
    showCharsCounter: true,
    showWordsCounter: true
});

// Status bar displays:
// "Chars: 11  Words: 2"
```

### Show Only Character Counter

```typescript
const editor = Jodit.make('#editor', {
    showCharsCounter: true,
    showWordsCounter: false
});

// Status bar displays only:
// "Chars: 11"
```

### Show Only Word Counter

```typescript
const editor = Jodit.make('#editor', {
    showCharsCounter: false,
    showWordsCounter: true
});

// Status bar displays only:
// "Words: 2"
```

### Count HTML Characters

```typescript
const editor = Jodit.make('#editor', {
    showCharsCounter: true,
    countHTMLChars: true
});

// For content: <div>Hello world!</div>
// Status bar shows: "Chars: 24" (includes <div> tags)
```

### Count Text with Spaces

```typescript
const editor = Jodit.make('#editor', {
    showCharsCounter: true,
    countHTMLChars: false,
    countTextSpaces: true
});

// For content: <p>Hello world!</p>
// Status bar shows: "Chars: 12" (includes space between words)
```

### Count Text without Spaces

```typescript
const editor = Jodit.make('#editor', {
    showCharsCounter: true,
    countHTMLChars: false,
    countTextSpaces: false
});

// For content: <p>Hello world!</p>
// Status bar shows: "Chars: 11" (excludes space)
```

### Disable All Counters

```typescript
const editor = Jodit.make('#editor', {
    showCharsCounter: false,
    showWordsCounter: false
});

// Status bar has no stat counters
```

### Full Configuration

```typescript
const editor = Jodit.make('#editor', {
    showCharsCounter: true,
    countHTMLChars: true,
    countTextSpaces: true,
    showWordsCounter: true
});

// Shows both counters with HTML char counting
// "Chars: 24  Words: 2" for <div>Hello world!</div>
```

## How It Works

### Initialization

On plugin `afterInit`:
1. Creates two `<span>` elements for counters
2. Stores references in `charCounter` and `wordCounter`
3. Registers events: `afterInit`, `changePlace`, `afterAddPlace` → `reInit()`
4. Calls `reInit()` to set up initial state

### ReInit Process

The `reInit()` method:
1. If `showCharsCounter` enabled: appends `charCounter` to status bar
2. If `showWordsCounter` enabled: appends `wordCounter` to status bar
3. Removes old event listeners on `change` and `keyup`
4. Registers new throttled `calc` handler for `change` and `keyup`
5. Calls `calc()` to compute initial values

### Calculation (Throttled)

The `calc()` method (throttled by `defaultTimeout`):

**Character Count:**
1. If `countHTMLChars` is true:
   - Uses `jodit.value` (full HTML)
   - Counts all characters including tags
2. If `countHTMLChars` is false:
   - Uses `jodit.text` (text only)
   - If `countTextSpaces` is true:
     - Removes invisible spaces (zero-width, etc.)
     - Removes line breaks (`\r\n`)
     - Counts remaining characters
   - If `countTextSpaces` is false:
     - Removes all spaces (via `SPACE_REG_EXP`)
     - Counts remaining characters
3. Updates `charCounter.textContent` with formatted string: `"Chars: %d"`

**Word Count:**
1. Uses `jodit.text` (text only)
2. Removes invisible spaces
3. Splits text by `SPACE_REG_EXP` (whitespace regex)
4. Filters out empty strings
5. Counts array length
6. Updates `wordCounter.textContent` with formatted string: `"Words: %d"`

### Update Triggers

Counters recalculate on:
- `change` event (content modified)
- `keyup` event (after user types)
- `afterInit` event (editor initialized)
- `changePlace` event (current place changed)
- `afterAddPlace` event (new place added)

### Throttling

The `calc` method is throttled:
- Uses `jodit.async.throttle()`
- Delay: `jodit.defaultTimeout` (typically 100-200ms)
- Prevents excessive calculations during rapid typing
- Ensures smooth performance with large documents

### Multi-Place Support

When editor has multiple places:
- `afterAddPlace` event triggers `reInit()`
- Counters added to each place's status bar
- Each place shows its own character/word count
- Calculations independent per place

### Internationalization

Counter labels use `jodit.i18n()`:
- Default English: `"Chars: %d"`, `"Words: %d"`
- Translatable via language files
- `%d` placeholder replaced with count

### Counting Logic

**Character Counting Modes:**

| Mode | countHTMLChars | countTextSpaces | Example Input | Count |
|------|----------------|-----------------|---------------|-------|
| Text without spaces | `false` | `false` | `<p>Hi yo</p>` | 4 |
| Text with spaces | `false` | `true` | `<p>Hi yo</p>` | 5 |
| HTML | `true` | N/A | `<p>Hi yo</p>` | 12 |

**Word Counting:**
- Always based on text content (no HTML)
- Splits on whitespace (space, tab, newline)
- Empty strings filtered out
- Single word: 1, "Hello world": 2

### Cleanup

On `beforeDestruct`:
- Safely removes `charCounter` from DOM
- Safely removes `wordCounter` from DOM
- Unregisters all event listeners
- Nullifies counter references

## Edge Cases

1. **Empty Content**: Shows "Chars: 0  Words: 0"
2. **HTML Tags Only**: `<div></div>` = 0 chars (text mode), 11 chars (HTML mode)
3. **Multiple Spaces**: Counted as one word separator
4. **Newlines**: Not counted as characters in text mode
5. **Invisible Spaces**: Zero-width spaces removed before counting
6. **Special Characters**: Counted as characters (emoji, Unicode, etc.)
7. **Status Bar Disabled**: Counters not shown if status bar disabled
8. **Multiple Places**: Each place has independent counters
9. **Large Documents**: Throttling prevents performance issues
10. **No Text**: "  " (only spaces) = 0 words

## Notes

- Plugin is class-based, extends `Plugin` base class
- No decorators used
- Counter elements: `<span>` created by `jodit.c.span()`
- Status bar append with `true` flag (prepend to right side)
- The `calc` method throttled with `defaultTimeout`
- Uses `INVISIBLE_SPACE_REG_EXP()` to remove zero-width spaces
- Uses `SPACE_REG_EXP()` for whitespace matching
- Word split regex handles space, tab, newline, etc.
- The `reInit()` method handles multi-place setup
- Event listeners: `change`, `keyup`, `afterInit`, `changePlace`, `afterAddPlace`
- Counters show formatted internationalized strings
- The plugin properly cleans up DOM elements on destruction
- Text extraction via `jodit.text` property (gets visible text)
- HTML extraction via `jodit.value` property (gets full HTML)
- Character count includes letters, numbers, punctuation
- Word count excludes empty strings from split result
- Throttle prevents recalculation on every keystroke
- Status bar elements appended in order: chars first, then words
- The `filter((e: string) => e.length)` removes empty array items
- Line breaks removed via `.replace(/[\r\n]/g, '')` in text+spaces mode
- Counter references stored as `Nullable<HTMLElement>`
- The plugin supports dynamic place addition/removal

## Typical Use Case

Content creators need to track document length for word limits, SEO requirements, or content guidelines. The stat plugin provides this by:

1. Displaying real-time character count in status bar
2. Displaying real-time word count in status bar
3. Updating counts as user types
4. Offering flexible counting modes (text vs HTML, with/without spaces)
5. Supporting multi-language label translation

This improves user experience by:
- Helping users meet content length requirements
- Providing immediate feedback on document size
- Supporting multiple counting standards
- Preventing exceeding character limits
- No manual counting or external tools needed