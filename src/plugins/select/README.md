# Select Plugin

A utility plugin that normalizes selection behavior and provides event proxying for DOM element interactions. This plugin handles selection normalization for copy/cut operations, triple-click selection, and fires element-specific events for easier event handling.

## Features

- Event proxying for DOM elements
- Element-specific event firing (e.g., `clickImg`, `mousedownTable`)
- Selection normalization before copy/cut
- Triple-click selection normalization
- Select all command handling
- Outside click detection
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