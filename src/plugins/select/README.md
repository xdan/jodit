---
title: Select Plugin
description: Normalizes selection for copy, cut, and triple-click, fires element-specific DOM events like clickImg, and handles outside-click and select-all behavior.
keywords: jodit, select plugin, selection normalization, event proxying, triple click, outside click
---

# Select Plugin

A utility plugin that normalizes selection behavior and provides event proxying for DOM element interactions. This plugin handles selection normalization for copy/cut operations, triple-click selection, and fires element-specific events for easier event handling.

## Features

- Event proxying for DOM elements
- Element-specific event firing (e.g., `clickImg`, `mousedownTable`)
- Selection normalization before copy/cut
- Triple-click selection normalization
- A double click past the end of a line puts the caret there, and a drag onto a video's line stops before the video
- A video or embed in the selection is shaded, as the browsers shade an image
- Select all command handling
- Outside click detection
- A click to the right of a table row sends typing into the next row, as Word does
- Event bubbling through DOM hierarchy
- Support for touch events
- Custom event naming with camelCase

## Configuration Options

### `select.normalizeSelectionBeforeCutAndCopy`

**Type:** `boolean`

**Default:** `false`

When enabled, expands selection to cover entire selected containers before copy/cut operations when selection spans from beginning to end of inline content.

**Behavior:**
- `<ul><li>|test|</li></ul>` becomes `|<ul><li>test</li></ul>|`
- `<ul><li>|test|</li><li>test</li></ul>` becomes `<ul>|<li>test</li><li>test</li>|</ul>`

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    select: {
        normalizeSelectionBeforeCutAndCopy: true
    }
});
```

### `select.normalizeTripleClick`

**Type:** `boolean`

**Default:** `true`

Normalizes selection after triple-click to select entire block element instead of just text content.

**Behavior:**
- Triple-click selects the entire block element
- `<ul><li>|test</li><li>|pop</li></ul>` becomes `<ul><li>|test|</li><li>pop</li></ul>`

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    select: {
        normalizeTripleClick: true
    }
});
```

## Usage Examples

### Basic Element Click Events

```typescript
const editor = Jodit.make('#editor');

// Listen for clicks on images
editor.e.on('clickImg', (img) => {
    console.log('Image clicked:', img.src);
});

// Listen for clicks on tables
editor.e.on('clickTable', (table) => {
    console.log('Table clicked');
});

// Listen for clicks on links
editor.e.on('clickA', (link) => {
    console.log('Link clicked:', link.href);
});
```

### Mouse Events on Elements

```typescript
const editor = Jodit.make('#editor');

// Mousedown on paragraph
editor.e.on('mousedownP', (p, e) => {
    console.log('Paragraph mousedown');
});

// Mouseup on div
editor.e.on('mouseupDiv', (div, e) => {
    console.log('Div mouseup');
});

// Touch events
editor.e.on('touchstartSpan', (span, e) => {
    console.log('Span touch start');
});

editor.e.on('touchendButton', (button, e) => {
    console.log('Button touch end');
});
```

### Editor Click Event

```typescript
const editor = Jodit.make('#editor');

// Click directly on editor (not on child elements)
editor.e.on('clickEditor', (editor, e) => {
    console.log('Clicked on editor root');
});
```

### Outside Click Detection

```typescript
const editor = Jodit.make('#editor');

editor.e.on('outsideClick', (e) => {
    console.log('Clicked outside editor');
    // Close popups, hide toolbars, etc.
});
```

### Selection Normalization

```typescript
const editor = Jodit.make('#editor', {
    select: {
        normalizeSelectionBeforeCutAndCopy: true,
        normalizeTripleClick: true
    }
});

// Copy/cut will expand selection to include containers
// Triple-click will select entire block
```

### Custom Event Handling

```typescript
const editor = Jodit.make('#editor');

// Event name format: eventType + NodeName (camelCase)
editor.e.on('mousedownTd', (td, e) => {
    console.log('Table cell mousedown');
    // Prevent default behavior
    return false;
});

editor.e.on('clickLi', (li, e) => {
    console.log('List item clicked');
    e.stopPropagation();
});
```

### Disable Triple Click Normalization

```typescript
const editor = Jodit.make('#editor', {
    select: {
        normalizeTripleClick: false
    }
});
// Triple-click uses browser default behavior
```

## How It Works

### Event Proxying

The plugin listens to these events on the editor:
- `click`
- `mousedown`
- `touchstart`
- `mouseup`
- `touchend`

For each event, it:
1. Starts at event target
2. Walks up DOM tree to editor root
3. For each element, fires `eventType + nodeName` (camelCase)
4. Stops if handler returns non-undefined value
5. If reaches editor root on click, fires `clickEditor`

### Event Name Format

Events follow camelCase pattern:
- `click` + `img` → `clickImg`
- `mousedown` + `table` → `mousedownTable`
- `touchstart` + `a` → `touchstartA`
- Node names converted to lowercase then camelCased

### Selection Normalization Before Copy/Cut

When `normalizeSelectionBeforeCutAndCopy` is enabled:

1. **Check Conditions**: Selection must not be collapsed and must be in editor
2. **Expand Selection**: Calls `s.expandSelection()`
3. **Effect**: Selection expands to include parent blocks if content fully selected

Example transformation:
```html
<!-- Before -->
<ul><li>|selected text|</li></ul>

<!-- After normalization -->
|<ul><li>selected text</li></ul>|
```

This ensures consistent copy/paste behavior when entire inline contents are selected.

### Triple Click Normalization

When `normalizeTripleClick` is enabled and user triple-clicks:

1. **Detect Triple Click**: `e.detail === 3`
2. **Check Position**: Selection starts at offset 0 in text node
3. **Select Block**: Selects closest block element or text node itself
4. **Result**: Entire block selected instead of line

This provides more intuitive selection behavior matching user expectations.

### Selections Past the End of a Line

A double click in the empty space after a line's text makes Chrome and Safari select only the line break, from the end of the text to the start of the next line a caret can go on. Nothing shows, as there's no caret, and typing replaces the break, joining the lines, along with any video between them. On `dblclick`, a selection in the editor that holds only a line break becomes a caret at its start, the end of the line. That means no characters but whitespace, and nothing held whole but a `<br>`, which Chrome selects on its own at a line's end or on an empty line, or a line holding only an uneditable element, as a video's. The selection must end in another block, or hold the `<br>`. A double click on a word or a space, a selection that holds an image, an `<hr>` or an empty cell, and the same line break selected with Shift+Right or a drag, stay as they are. Chrome selects the line break before an `<hr>` that's double clicked, so that becomes a caret at the end of the line above, and typing no longer deletes the `<hr>`.

The browsers have no caret position beside an uneditable block alone on its line, such as a video in its wrapper, so a drag that ends on that line runs on past the block, and typing deletes it. On `mouseup`, a selection that takes in such a block the pointer hasn't passed (it's still above the block's bottom, or below its top for a drag upwards) stops at the last place a caret can go in the block before the block's line: the end of its text, or before the `<br>` of an empty line. A drag upwards starts at the first such place in the block after it. Only that neighbouring block is looked in, and when it has no such place the selection stays as it is. A video Jodit selected itself on the press is left alone.

The browsers shade an image in the selection, but Chrome doesn't shade a video with controls, or one in a `jodit-media` wrapper, so a selection that took one in didn't show it. On `selectionchange`, in an editor that isn't read-only, each `video`, `iframe`, `audio`, `object` or `embed` whose uneditable wrapper a selection in the editor holds whole gets the same shade, `#b5d6fd` on white, from an SVG `filter`, and the browsers' own tint inside the wrapper, which Safari gives the wrapper's whole line, is turned off. It's a style in the editing document, written with the elements' CSS paths as the table module's cell selection is, so the content doesn't change, and the value, the history and a copied selection carry nothing of it. Media a click selected whole isn't shaded, as its resize frame shows it. A change, read-only and the source mode redo the style, as the selection may stay where it was. Its selectors are the media's full paths, so while the media is selected the shade outranks a `filter` it has of its own.

### Select All Command

The plugin intercepts `selectall` command:

1. **Focus Editor**: Ensures editor has focus
2. **Select Editor**: Selects entire editor content
3. **Expand Selection**: Normalizes selection boundaries
4. **Return False**: Prevents default command execution

### Outside Click Detection

The plugin fires `outsideClick` event when:
- User clicks outside editor
- Click target is not inside editor
- Click target is not inside a Popup UI element

This allows other plugins to respond to focus loss.

### Clicks to the Right of a Table

A click in the empty space to the right of a table makes Chrome and Safari put the caret after the table, whichever row was clicked, so typing starts a new line below it. As in Word, the caret goes where typing from beside that row goes instead, as the mouse goes down: the start of the next row's first cell, or for the last row the start of the line after the table, or just after the table when nothing that takes text follows it. A double click counts as a click.

The browser's own press is stopped there, as its drag would start after the table and take in the rows below first. A drag from beside a row selects from the end of the row to the mouse instead, and back beside the row it's the caret again.

### Before Cut Normalization

Before cut command executes:
- Checks if selection is not collapsed
- Verifies selection is within editor
- Calls normalization if conditions met

## Events

### `click[NodeName]`, `mousedown[NodeName]`, etc.

Fired when specific element type is clicked/interacted with. Node name is camelCased.

**Parameters:**
- `element` (HTMLElement): The clicked element
- `event` (MouseEvent): Original mouse event

**Example:**
```typescript
editor.e.on('clickImg', (img, e) => {
    console.log('Image:', img);
    console.log('Event:', e);
});
```

### `clickEditor`

Fired when user clicks directly on editor root (not on child elements).

**Parameters:**
- `editor` (HTMLElement): The editor element
- `event` (MouseEvent): Original click event

**Example:**
```typescript
editor.e.on('clickEditor', (editor, e) => {
    console.log('Clicked editor root');
});
```

### `outsideClick`

Fired when user clicks outside the editor and popups.

**Parameters:**
- `event` (MouseEvent): Original mouse event

**Example:**
```typescript
editor.e.on('outsideClick', (e) => {
    console.log('Outside click detected');
});
```

## Commands

### `selectall`

Plugin intercepts this command to provide normalized select all behavior.

**Example:**
```typescript
editor.execCommand('selectall');
// Selects entire editor content with expanded boundaries
```

## Edge Cases

1. **Event Bubbling Stop**: Returning non-undefined from handler stops bubbling up DOM tree

2. **Click on Editor**: `clickEditor` only fires if click reaches editor root

3. **Outside Click Popups**: Clicks in Popup elements don't trigger `outsideClick`

4. **Triple Click Detail**: Relies on `e.detail === 3` for detection

5. **Normalization Conditions**: Requires non-collapsed selection within editor

6. **Touch Events**: Supported alongside mouse events

7. **Multiple Elements**: Events fire for each element in bubble path

8. **Return False**: Can prevent default command behavior

## Notes

- Plugin is class-based, extends `Plugin` base class
- Uses `@autobind` and `@watch` decorators
- Event namespacing `.select` for clean removal
- Proxy events list: click, mousedown, touchstart, mouseup, touchend
- Event names created via `camelCase()` helper
- The `onStartSelection` method handles event proxying
- Outside click uses `@watch('ow:click')` for window clicks
- Triple click uses `@watch([':click'])` for editor clicks
- Copy/cut normalization uses `@watch([':copy', ':cut'])` decorators
- Select all uses `@watch([':beforeCommandSelectall'])` decorator
- Before cut uses `@watch([':beforeCommandCut'])` decorator
- The `expandSelection()` method expands to full element boundaries
- Popup detection uses `UIElement.closestElement()` method
- Node name converted to lowercase for event naming
- The plugin properly cleans up event listeners on destruction
- DOM traversal uses `target.parentElement` for bubbling
- Click event special case for editor root
- Event result checked for `undefined` to continue bubbling
- Outside click requires target not in editor or popup
- Selection normalization checks `isTrusted` and `isOrContains`
- Triple click checks `startOffset === 0` and `Dom.isText`
- Select all calls `s.select(editor, true)` for inclusive selection
- The `beforeCommandSelectAll` returns `false` to prevent default

## Typical Use Case

Developers need easier event handling for specific element types and consistent selection behavior. The select plugin provides this by:

1. Proxying DOM events to element-specific events
2. Normalizing selection for copy/cut operations
3. Handling triple-click selection properly
4. Providing outside click detection
5. Intercepting select all command

This improves developer experience by:
- Simplifying event listener code
- Avoiding manual DOM traversal
- Ensuring consistent selection behavior
- Supporting both mouse and touch events
- Providing semantic event names