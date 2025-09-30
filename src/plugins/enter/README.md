# Enter Plugin

Handles Enter key press behavior, ensuring consistent cross-browser insertion of paragraphs, line breaks, and block splitting.

## Description

This is one of the most important core plugins. It normalizes Enter key behavior across all browsers. By default, pressing Enter inserts a `<p>` tag. The plugin handles various scenarios: splitting blocks, creating new paragraphs, processing list items, inserting line breaks with Shift+Enter, and wrapping unwrapped text.

## Features

- **Paragraph Insertion**: Creates new block elements on Enter
- **Block Splitting**: Splits existing blocks at cursor position
- **List Handling**: Manages list item creation and empty list removal
- **BR Mode**: Insert `<br>` with Shift+Enter
- **Text Wrapping**: Wraps unwrapped text nodes
- **Special Tags**: Moves cursor out of `<a>` tags
- **Empty List Handling**: Removes empty list items or unindents
- **Unsplittable Boxes**: Handles `<td>`, `<th>`, `<blockquote>` specially

## Configuration Options

### `enter`

Default tag to insert when Enter is pressed.

- **Type**: `'p' | 'div' | 'br'`
- **Default**: `'p'`

```javascript
const editor = Jodit.make('#editor', {
  enter: 'p' // or 'div' or 'br'
});
```

**Modes:**
- `'p'`: Insert `<p>` paragraphs (default)
- `'div'`: Insert `<div>` blocks
- `'br'`: Insert `<br>` line breaks (like plain text editor)

### `enterBlock`

Block element used for wrapping when in BR mode.

- **Type**: `'p' | 'div'`
- **Default**: Derived from `enter` option (falls back to `'p'` if `enter` is `'br'`)

```javascript
const editor = Jodit.make('#editor', {
  enter: 'br',
  enterBlock: 'div' // Used for wrapping text nodes
});
```

**Purpose:** When `enter: 'br'` is set, this defines what block element wraps naked text nodes.

## Commands

### `enter`

Executes Enter key logic programmatically.

```javascript
editor.execCommand('enter');
```

## Usage Examples

### Default Behavior (Paragraph Mode)

```javascript
const editor = Jodit.make('#editor', {
  enter: 'p' // default
});

// Press Enter in middle of text
// Before: <p>Hello| World</p>
// After:  <p>Hello</p><p>| World</p>
```

### DIV Mode

```javascript
const editor = Jodit.make('#editor', {
  enter: 'div'
});

// Press Enter
// Before: <div>Text|</div>
// After:  <div>Text</div><div>|</div>
```

### BR Mode (Plain Text Style)

```javascript
const editor = Jodit.make('#editor', {
  enter: 'br'
});

// Press Enter
// Before: <p>Text|</p>
// After:  <p>Text<br>|</p>
```

### Shift+Enter (Line Break)

```javascript
const editor = Jodit.make('#editor', {
  enter: 'p'
});

// Press Shift+Enter (inserts <br> regardless of mode)
// Before: <p>Text|</p>
// After:  <p>Text<br>|</p>
```

### Block Splitting

```javascript
const editor = Jodit.make('#editor');
editor.value = '<h1>Heading Text</h1>';

// Press Enter in middle: <h1>Head|ing Text</h1>
// Result: <h1>Head</h1><h1>|ing Text</h1>
```

### Empty Block at End

```javascript
const editor = Jodit.make('#editor');
editor.value = '<h1>Heading</h1>';

// Press Enter at end: <h1>Heading|</h1>
// Result: <h1>Heading</h1><p>|</p>
```

### List Behavior

```javascript
const editor = Jodit.make('#editor');
editor.value = '<ul><li>Item 1</li><li>|</li></ul>';

// Press Enter on empty list item
// Result: <ul><li>Item 1</li></ul><p>|</p>
// (empty list item converted to paragraph)
```

### Listen to Enter Events

```javascript
const editor = Jodit.make('#editor');

editor.e.on('beforeEnter', (e) => {
  console.log('About to process Enter');
  // Return false to prevent default behavior
  // return false;
});

editor.e.on('afterEnter', (e) => {
  console.log('Enter processing complete');
});
```

### Custom Empty List Detection

```javascript
const editor = Jodit.make('#editor', {
  events: {
    enterIsEmptyListLeaf: (li) => {
      // Custom logic to determine if list item is empty
      return li.textContent.trim() === '';
    }
  }
});
```

### Disable Plugin

```javascript
const editor = Jodit.make('#editor', {
  disablePlugins: ['enter']
  // Enter key uses browser default behavior
});
```

## How It Works

### Main Flow

1. **Keydown Detection**: `@watch(':keydown.enter')` intercepts Enter key
2. **Before Event**: Fires `beforeEnter` event (can return false to prevent)
3. **Delete Selection**: If text is selected, deletes it first
4. **Focus**: Ensures editor has focus
5. **Process Enter**: Calls `onEnter()` with complex logic
6. **After Event**: Fires `afterEnter` event
7. **Sync**: Synchronizes editor values (fires change)

### Enter Processing (`onEnter`)

1. **Insert Fake Node**: Places temporary marker at cursor
2. **Move Cursor Out**: Exits special tags like `<a>`
3. **Get Block Wrapper**: Finds parent block element
4. **Check BR Mode**: If BR mode or Shift pressed, inserts `<br>` and exits
5. **Wrap Text**: If no block wrapper, wraps naked text
6. **Insert Paragraph**: If still no block, creates new block
7. **Check Unsplittable**: Handles special boxes (`<td>`, `<th>`, `<blockquote>`)
8. **Empty List Check**: Processes empty list items
9. **Split Fragment**: Splits block at cursor position
10. **Cleanup**: Removes fake node, positions cursor

### BR Check (`checkBR`)

Conditions for inserting `<br>` instead of splitting:
- `enter: 'br'` option is set
- Shift key is pressed
- Inside `<td>`, `<th>`, `<blockquote>`

### Block Splitting (`splitFragment`)

```javascript
// Before: <h1>Hel|lo</h1>
// Splits into:
// <h1>Hel</h1>
// <h1>|lo</h1>

// At end: <h1>Hello|</h1>
// Creates new paragraph:
// <h1>Hello</h1>
// <p>|</p>
```

### List Processing (`processEmptyLILeaf`)

When Enter pressed on empty `<li>`:
1. Check if `<li>` is truly empty via `enterIsEmptyListLeaf` event
2. If empty and nested, unindent (move to parent level)
3. If empty at root level, convert to paragraph

### Text Wrapping (`wrapText`)

Wraps naked text nodes in appropriate block:
```javascript
// Before: Text node|
// After: <p>Text node|</p>
```

Uses `enterBlock` option to determine wrapper tag.

### Move Cursor Out (`moveCursorOutFromSpecialTags`)

If cursor is inside `<a>` tag at end, moves cursor after the tag:
```javascript
// Before: <a href="...">Link|</a>
// After: <a href="...">Link</a>|
// This prevents expanding the link when typing
```

## Events

### `beforeEnter`

Fired before processing Enter key.

**Parameters:**
- `e: KeyboardEvent` - The keyboard event

**Return:**
- `false` - Prevents default Enter behavior
- `void` or other - Continues normal processing

```javascript
editor.e.on('beforeEnter', (e) => {
  if (someCondition) {
    // Custom behavior
    return false; // Prevent plugin from handling
  }
});
```

### `afterEnter`

Fired after Enter key processing completes.

**Parameters:**
- `e: KeyboardEvent` - The keyboard event

```javascript
editor.e.on('afterEnter', (e) => {
  console.log('Enter processed');
});
```

### `enterIsEmptyListLeaf`

Determines if a list item should be considered empty.

**Parameters:**
- `li: HTMLElement` - The list item element

**Return:**
- `boolean` - True if empty, false otherwise

```javascript
editor.e.on('enterIsEmptyListLeaf', (li) => {
  return li.textContent.trim().length === 0;
});
```

## Edge Cases

### 1. Middle of Block
```html
<!-- Before -->
<h1>Te|xt</h1>

<!-- After Enter -->
<h1>Te</h1>
<h1>|xt</h1>
```

### 2. End of Block
```html
<!-- Before -->
<h1>Text|</h1>

<!-- After Enter -->
<h1>Text</h1>
<p>|</p>
```

### 3. Empty Block
```html
<!-- Before -->
<p>|</p>

<!-- After Enter -->
<p><br></p>
<p>|</p>
```

### 4. Inside Link
```html
<!-- Before -->
<a href="#">Link|</a>

<!-- After Enter -->
<a href="#">Link</a><p>|</p>
```

### 5. Empty List Item
```html
<!-- Before -->
<ul><li>Item</li><li>|</li></ul>

<!-- After Enter -->
<ul><li>Item</li></ul><p>|</p>
```

### 6. Table Cell
```html
<!-- Before -->
<td>Text|</td>

<!-- After Enter (Shift not pressed) -->
<td>Text<br>|</td>
```

### 7. Shift+Enter (Always BR)
```html
<!-- Before (any mode) -->
<p>Text|</p>

<!-- After Shift+Enter -->
<p>Text<br>|</p>
```

## Notes

- Registered command: `'enter'`
- Uses `@watch(':keydown.enter')` decorator
- Inserts temporary fake node for cursor tracking
- Deletes selected content before processing
- Synchronizes values after Enter (fires change event)
- BR mode: `enter: 'br'` acts like plain text editor
- Shift+Enter always inserts `<br>` regardless of mode
- Empty list items trigger `enterIsEmptyListLeaf` event
- Special tags (`<a>`) trigger cursor repositioning
- Unsplittable boxes (`<td>`, `<th>`, `<blockquote>`) insert `<br>`
- Uses helper functions from `./helpers` directory
- Returns `false` to prevent default browser behavior