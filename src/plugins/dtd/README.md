# DTD Plugin

Enforces HTML Document Type Definition (DTD) standards by validating block element nesting and removing invalid `<br>` elements.

## Description

This plugin ensures HTML compliance with DTD standards by intercepting node insertion events. It prevents invalid block element nesting (e.g., `<table>` inside `<p>`) and removes extra `<br>` tags after pasting. The plugin uses two hooks: `beforeInsertNode` and `afterInsertNode`.

**Example violation prevented:**
```html
<!-- Invalid HTML -->
<p><table><tr><td>Data</td></tr></table></p>

<!-- Plugin moves cursor after <p> and removes empty <p> -->
<table><tr><td>Data</td></tr></table>
```

## Features

- **Block Nesting Validation**: Prevents invalid block-in-block nesting
- **Extra BR Removal**: Cleans up unnecessary `<br>` tags after insertion
- **Block Limits Check**: Uses configurable list of valid container elements
- **Auto-cursor Positioning**: Moves cursor to valid position when nesting fails
- **Empty Block Cleanup**: Removes empty parent blocks after repositioning

## Configuration Options

### `dtd.removeExtraBr`

Remove extra `<br>` elements inside block elements after pasting.

- **Type**: `boolean`
- **Default**: `true`

```javascript
const editor = Jodit.make('#editor', {
  dtd: {
    removeExtraBr: true
  }
});
```

**What it does:**
- After inserting a node, checks if there's an extra `<br>` sibling
- If found in a block element (not `<table>`, `<pre>`, `<blockquote>`, `<code>`), removes it
- Repositions cursor before the removed `<br>`

### `dtd.checkBlockNesting`

Check when inserting a block element if it can be inside another block element.

- **Type**: `boolean`
- **Default**: `true`

```javascript
const editor = Jodit.make('#editor', {
  dtd: {
    checkBlockNesting: true
  }
});
```

**What it does:**
- Before inserting a block element, finds the parent block
- Checks if parent is in `blockLimits` list
- If not in list, moves cursor after parent
- Removes parent if it's empty

### `dtd.blockLimits`

List of elements that can contain other blocks.

- **Type**: `IDictionary<1>`
- **Default**: 26 container elements

```javascript
const editor = Jodit.make('#editor', {
  dtd: {
    blockLimits: {
      article: 1,
      aside: 1,
      audio: 1,
      body: 1,
      caption: 1,
      details: 1,
      dir: 1,
      div: 1,
      dl: 1,
      fieldset: 1,
      figcaption: 1,
      figure: 1,
      footer: 1,
      form: 1,
      header: 1,
      hgroup: 1,
      main: 1,
      menu: 1,
      nav: 1,
      ol: 1,
      section: 1,
      table: 1,
      td: 1,
      th: 1,
      tr: 1,
      ul: 1,
      video: 1
    }
  }
});
```

## Usage Examples

### Default Behavior

```javascript
const editor = Jodit.make('#editor');

// Try to insert table inside paragraph
editor.value = '<p>Text</p>';
editor.s.setCursorIn(editor.editor.firstChild); // Inside <p>
editor.s.insertNode(editor.createInside.element('table'));

// Result: <table> inserted after <p>, not inside it
// Empty <p> is removed
```

### Disable Block Nesting Check

```javascript
const editor = Jodit.make('#editor', {
  dtd: {
    checkBlockNesting: false
  }
});

// Now invalid nesting is allowed
// <p><table>...</table></p> can be created
```

### Disable Extra BR Removal

```javascript
const editor = Jodit.make('#editor', {
  dtd: {
    removeExtraBr: false
  }
});

// Extra <br> tags won't be removed after paste
```

### Custom Block Limits

```javascript
const editor = Jodit.make('#editor', {
  dtd: {
    blockLimits: {
      div: 1,
      section: 1,
      article: 1,
      body: 1
      // Only these elements can contain blocks
      // <p>, <table>, etc. cannot
    }
  }
});
```

### Allow Blocks Inside Paragraphs

```javascript
const editor = Jodit.make('#editor', {
  dtd: {
    blockLimits: {
      ...Jodit.defaultOptions.dtd.blockLimits,
      p: 1 // Add <p> to allowed containers
    }
  }
});

// Now <p><div>content</div></p> is allowed
```

### Disable Plugin Completely

```javascript
const editor = Jodit.make('#editor', {
  disablePlugins: ['dtd']
});

// No DTD validation
```

## How It Works

### Before Insert Hook (`beforeInsertNode`)

Watches `:beforeInsertNode` event and runs validation cases:

**Check Block Nesting (`checkBlockNesting`):**

1. If `dtd.checkBlockNesting` is false, skip
2. If node is not a block element, skip
3. Find furthest parent block element
4. Check if parent is in `blockLimits` dictionary
5. If not in dictionary:
   - Move cursor after parent
   - If parent is empty, remove it

```javascript
// Example: Inserting <table> inside <p>
// <p>|</p>  (cursor inside)

// Plugin checks: is 'p' in blockLimits? No.
// Action: Move cursor after <p>
// <p></p>|  (cursor after)
// Remove empty <p>
// |  (cursor in editor root)
// Insert <table>
// <table>...</table>
```

### After Insert Hook (`afterInsertNode`)

Watches `:afterInsertNode` event and runs cleanup cases:

**Remove Extra BR (`removeExtraBr`):**

1. If `dtd.removeExtraBr` is false, skip
2. If node itself is `<br>`, skip
3. Find furthest parent block element
4. If parent is `<table>`, `<pre>`, `<blockquote>`, or `<code>`, skip
5. Find next non-empty sibling
6. If sibling is `<br>`:
   - Move cursor before `<br>`
   - Remove `<br>`

**BR boxes (excluded from cleanup):**
- `<table>` - BR needed for empty cells
- `<pre>` - BR represents intentional line breaks
- `<blockquote>` - BR may be intentional formatting
- `<code>` - BR represents line breaks in code

## Events

This plugin watches two internal events:

### `:beforeInsertNode`

Fired before a node is inserted into the editor.

```javascript
editor.e.fire(':beforeInsertNode', node);
```

### `:afterInsertNode`

Fired after a node is inserted into the editor.

```javascript
editor.e.fire(':afterInsertNode', node);
```

## Edge Cases Handled

### 1. Invalid Table Nesting
```html
<!-- User tries to insert -->
<p>|cursor<table>...</table></p>

<!-- Plugin result -->
<table>...</table>
```

### 2. Extra BR After Paste
```html
<!-- After paste -->
<div>Content<br></div>

<!-- Plugin removes BR -->
<div>Content</div>
```

### 3. Preserved BR in PRE
```html
<!-- After paste inside <pre> -->
<pre>Line 1<br>Line 2<br></pre>

<!-- BR preserved (brBoxes exclusion) -->
<pre>Line 1<br>Line 2<br></pre>
```

### 4. Empty Parent Cleanup
```html
<!-- Before: cursor inside empty <p> -->
<p>|</p>

<!-- Insert <table> -->
<!-- Result: empty <p> removed -->
<table>...</table>
```

### 5. Nested DIVs (Valid)
```html
<!-- DIV is in blockLimits -->
<div>
  <div>
    <p>Nested blocks allowed</p>
  </div>
</div>
```

## Configuration

Full configuration with all options:

```javascript
const editor = Jodit.make('#editor', {
  dtd: {
    removeExtraBr: true,
    checkBlockNesting: true,
    blockLimits: {
      article: 1,
      aside: 1,
      audio: 1,
      body: 1,
      caption: 1,
      details: 1,
      dir: 1,
      div: 1,
      dl: 1,
      fieldset: 1,
      figcaption: 1,
      figure: 1,
      footer: 1,
      form: 1,
      header: 1,
      hgroup: 1,
      main: 1,
      menu: 1,
      nav: 1,
      ol: 1,
      section: 1,
      table: 1,
      td: 1,
      th: 1,
      tr: 1,
      ul: 1,
      video: 1
    }
  }
});
```

## Notes

- Uses `@watch` decorator for event hooks
- Runs before/after insert validation cases
- Tag names in `blockLimits` are case-insensitive (converted to lowercase)
- Only affects block elements (inline elements pass through)
- Handles document fragments by checking first child
- BR removal excludes: `<table>`, `<pre>`, `<blockquote>`, `<code>`
- Empty block removal only happens when not a table cell
- Plugin has empty `afterInit()` and `beforeDestruct()` methods
- Extensible via `before-insert/` and `after-insert/` case modules