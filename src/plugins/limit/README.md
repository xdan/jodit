# Limit Plugin

Provides character and word count limits for the Jodit editor. This plugin restricts the amount of content users can enter by setting maximum word or character counts, with options to include or exclude HTML markup in the count.

## Features

- Limit word count
- Limit character count
- Optional HTML markup inclusion in limits
- Prevents keyboard input beyond limits
- Prevents paste operations beyond limits
- Restores content on paste if limit exceeded
- Events for limit detection and denial
- Respects command keys (Ctrl/Cmd shortcuts)
- Automatic change prevention

## Configuration Options

### `limitWords`

**Type:** `false | number`

**Default:** `false`

Limits the number of words in the editor. Words are separated by spaces. When `limitHTML` is `false`, HTML tags and attributes are not counted. When `limitHTML` is `true`, tags and attributes are included in word count.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    limitWords: 100
});
```

### `limitChars`

**Type:** `false | number`

**Default:** `false`

Limits the number of characters in the editor. When `limitHTML` is `false`, only text content characters are counted (spaces and special characters are filtered out, HTML tags and attributes are ignored). When `limitHTML` is `true`, the entire HTML string is counted.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    limitChars: 500
});
```

### `limitHTML`

**Type:** `false`

**Default:** `false`

Controls what content is counted against limits. When `false`, only text content is counted (HTML tags and attributes excluded). When `true`, the full HTML markup is included in counts.

**Important:** The type is `false`, not `boolean`. This option can only be set to `false` (default) and cannot be changed to `true` based on the type definition.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    limitChars: 500,
    limitHTML: false  // Count only text content
});
```

## Usage Examples

### Word Limit Only

```typescript
const editor = Jodit.make('#editor', {
    limitWords: 100
});
```

### Character Limit Only

```typescript
const editor = Jodit.make('#editor', {
    limitChars: 400
});
```

### Both Limits

```typescript
const editor = Jodit.make('#editor', {
    limitWords: 100,
    limitChars: 500
});
```

### With Event Handling

```typescript
const editor = Jodit.make('#editor', {
    limitWords: 100
});

editor.e.on('limit.limit', editor.async.debounce(() => {
    editor.message.error('Limit reached!');
}, 300));

editor.e.on('denyWords.limit', () => {
    console.log('Word limit exceeded');
});

editor.e.on('denyChars.limit', () => {
    console.log('Character limit exceeded');
});

editor.e.on('denyPaste.limit', () => {
    editor.message.info('Cannot paste: would exceed limit');
});
```

### Prevent Paste Beyond Limit

```typescript
const editor = Jodit.make('#editor', {
    limitChars: 200
});

// Paste operation will be reverted if it exceeds limit
editor.e.on('denyPaste.limit', () => {
    alert('Pasted content exceeds character limit');
});
```

## How It Works

### Limit Checking

The plugin monitors several events:

1. **`beforePaste`**: Saves snapshot before paste operation
2. **`keydown/keyup/beforeEnter`**: Checks limits before allowing key press
3. **`change`**: Validates limits on any content change, reverts if exceeded
4. **`afterPaste`**: Validates pasted content, restores snapshot if limit exceeded

### Word Counting

Words are counted by:

1. **Content Selection**: Uses `jodit.text` (when `limitHTML` is `false`) or `jodit.value` (when `limitHTML` is `true`)
2. **Cleaning**: Removes invisible spaces using `INVISIBLE_SPACE_REG_EXP`
3. **Splitting**: Splits text by `SPACE_REG_EXP` (spaces and whitespace)
4. **Filtering**: Filters out empty strings
5. **Counting**: Returns array length as word count

### Character Counting

Characters are counted by:

1. **Word Array**: Gets words using word counting logic
2. **Joining**: Joins words without separators (`words.join('')`)
3. **Length**: Returns string length as character count

This means spaces between words are NOT counted as characters (they are removed during word splitting).

### Strict vs Non-Strict Comparison

The plugin uses two comparison modes:

- **Non-Strict** (for keypress/beforeEnter): `count >= limit` - prevents reaching the limit
- **Strict** (for paste/change): `count > limit` - allows reaching exact limit

### Command Key Handling

The plugin does NOT prevent input when:

- Command keys are pressed (arrows, function keys, etc.)
- Ctrl or Cmd modifier is held (allows shortcuts like Ctrl+C, Ctrl+V)
- Meta key is held

This allows navigation and clipboard operations even when limit is reached.

### Paste Prevention

When paste would exceed limit:

1. **Snapshot**: Content snapshot is taken before paste (`beforePaste` event)
2. **Paste Occurs**: Content is pasted normally
3. **Validation**: `afterPaste` checks if limit exceeded
4. **Restore**: If limit exceeded, snapshot is restored (paste is reverted)
5. **Event**: `denyPaste.limit` event is fired

### Change Prevention

On content changes:

1. **New Value**: Gets new editor content
2. **Old Value**: Receives previous content from event parameter
3. **Check**: Validates if new content exceeds limit (strict mode)
4. **Revert**: If exceeded, sets `jodit.value = oldValue`

## Events

### `limit.limit`

Fired whenever any limit is reached.

**Example:**
```typescript
editor.e.on('limit.limit', () => {
    console.log('A limit was reached');
});
```

### `denyWords.limit`

Fired when word limit is exceeded.

**Example:**
```typescript
editor.e.on('denyWords.limit', () => {
    editor.message.error('Word limit exceeded!');
});
```

### `denyChars.limit`

Fired when character limit is exceeded.

**Example:**
```typescript
editor.e.on('denyChars.limit', () => {
    editor.message.error('Character limit exceeded!');
});
```

### `denyPaste.limit`

Fired when paste operation would exceed limits.

**Example:**
```typescript
editor.e.on('denyPaste.limit', () => {
    editor.message.info('Cannot paste: would exceed limits');
});
```

## Edge Cases

1. **Command Keys**: Navigation keys, function keys, and Ctrl/Cmd shortcuts are always allowed even at limit

2. **Exact Limit**: Users can reach exact limit (e.g., type 100 words when limit is 100) but cannot exceed it

3. **Paste Behavior**: Paste is allowed to complete, then reverted if it exceeds limit (not prevented before paste)

4. **Both Limits**: When both `limitWords` and `limitChars` are set, BOTH must be satisfied

5. **HTML Counting**: When `limitHTML` is `false`, HTML tags like `<strong>`, `<p>`, etc. are not counted

6. **Space Handling**: Spaces between words are NOT counted as characters (removed during processing)

7. **Invisible Spaces**: Special invisible space characters are filtered out before counting

8. **Change Event**: External changes (via API calls) are also validated and can be reverted

9. **False Values**: Setting limit to `false` disables that limit (not the same as setting to 0)

## Notes

- Both word and character limits can be active simultaneously
- Command keys and keyboard shortcuts (Ctrl/Cmd) are never blocked
- Character count excludes spaces between words
- Word count filters out empty strings from splitting
- Paste operations are allowed to complete before being validated and potentially reverted
- The plugin uses history snapshots for paste reversal
- Event handlers should use debouncing to avoid excessive notifications
- The `limitHTML` type is `false` only, not `boolean` - verify the actual implementation
- Plugin uses namespaced events (`.limit`) for clean removal
- All event listeners are cleaned up on editor destruction