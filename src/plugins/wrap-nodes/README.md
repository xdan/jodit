# Wrap Nodes Plugin

Automatically wraps unwrapped text nodes and inline elements in block-level containers (paragraphs). This ensures editor content maintains proper HTML structure with block elements.

## Features

- Auto-wraps loose text nodes
- Wraps inline elements without block parents
- Uses configured enter tag (`<p>`, `<div>`, etc.)
- Processes on focus, keydown, drop, paste
- Handles empty editor initialization
- Fixes orphaned list items
- Configurable excluded elements
- Preserves cursor position

## Configuration Options

### `wrapNodes.exclude`

**Type:** `Set<HTMLTagNames>`

**Default:** `new Set(['hr', 'style', 'br'])`

Set of tag names that should NOT be wrapped in block containers.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    wrapNodes: {
        exclude: new Set(['hr', 'br', 'img'])
    }
});
```

### `wrapNodes.emptyBlockAfterInit`

**Type:** `boolean`

**Default:** `true`

If editor is empty on init, insert an empty block element (with `<br>`) so user can start typing.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    wrapNodes: {
        emptyBlockAfterInit: true
    }
});
// Empty editor gets: <p><br></p>
```

## How It Works

### Post-Process Wrapping

On these events: `afterInit`, `postProcessSetEditorValue`, `afterCommitStyle`, `backSpaceAfterDelete`:

1. Walks through editor's direct children
2. Finds unwrapped text nodes or inline elements
3. Creates block element (from `enter` config: `<p>`, `<div>`, etc.)
4. Moves consecutive suitable nodes into block
5. Normalizes block (merges adjacent text nodes)

**Example:**
```html
<!-- Before -->
Text node
<span>inline</span>
More text

<!-- After (with enter='p') -->
<p>Text node <span>inline</span> More text</p>
```

### Pre-Process Empty Editor

On these events: `drop`, `focus`, `keydown`, `mousedown`, `afterInit`, `backSpaceAfterDelete`:

- If editor empty and option enabled: inserts `<p><br></p>` (or configured enter tag)
- Cursor positioned before `<br>`
- User can immediately start typing

### Orphaned List Items

Special handling for `<li>` elements outside `<ul>`/`<ol>`:
- Automatically wraps in `<ul>` element
- Collects consecutive orphaned `<li>` elements
- Creates proper list structure

## Edge Cases

1. **Enter Mode BR**: Plugin disabled when `enter: 'br'` (no block wrapping)
2. **Excluded Tags**: Elements in `exclude` set not wrapped
3. **Temporary Elements**: Jodit temporary markers not wrapped
4. **Block Elements**: Existing block elements unchanged
5. **Source Mode**: Only runs in WYSIWYG mode
6. **Empty Editor**: Gets initial block if `emptyBlockAfterInit: true`
7. **Cursor Preservation**: Selection saved/restored during wrapping

## Typical Use Case

Browsers can create unwrapped text nodes when pasting or editing. The wrap-nodes plugin ensures all content is properly wrapped in block elements (paragraphs) maintaining clean HTML structure and consistent styling.