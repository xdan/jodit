---
title: Key Arrow Outside Plugin
description: Lets the cursor exit inline elements with the right arrow key by inserting an invisible space, preventing the caret from getting trapped.
keywords: jodit, key arrow outside, arrow key navigation, inline elements, cursor escape, invisible space
---

# Key Arrow Outside Plugin

Allows cursor to exit inline elements using the right arrow key. This plugin automatically inserts an invisible space after inline elements when pressing the right arrow key at the end of the element, enabling users to move outside and continue typing.

## Features

- Exit inline elements with right arrow key
- Automatic invisible space insertion for cursor movement
- Works with links, spans, and other inline elements
- Prevents cursor trapping inside inline elements
- Only activates when cursor is at element boundary
- The invisible space isn't part of the value, so no space is typed

## Configuration Options

This plugin has no configuration options. It works automatically when enabled.

## Usage Examples

### Basic Usage

The plugin works automatically without configuration:

```typescript
const editor = Jodit.make('#editor');

// Type text, apply bold, press right arrow at the end
// Cursor moves outside the bold element automatically
```

### Typical Scenario

```typescript
const editor = Jodit.make('#editor');

editor.value = '<p>Text <strong>bold text</strong></p>';
// Place cursor at end of "bold text" (inside <strong>)
// Press right arrow key
// Cursor moves outside <strong> tag
// Continue typing in normal text
```

### With Links

```typescript
const editor = Jodit.make('#editor');

editor.value = '<p>Click <a href="#">here</a></p>';
// Place cursor at end of "here" (inside <a>)
// Press right arrow key
// Cursor moves outside <a> tag
// Continue typing outside the link
```

## How It Works

### Plugin Mechanism

The plugin monitors keyboard events:

1. **Event Listening**: Watches `keydown` events via `@watch(':keydown')` decorator
2. **Key Detection**: Checks if pressed key is right arrow (`ArrowRight`)
3. **Selection Check**: Verifies selection is collapsed (cursor, not selection range)
4. **Boundary Detection**: Checks if cursor is at the end of a text node
5. **Inline Check**: Verifies parent element is inline block element
6. **Neighbor Check**: Confirms no adjacent elements exist after the inline element
7. **Space Insertion**: Inserts an invisible space (`INVISIBLE_SPACE`) after the inline element

### Conditions for Activation

The plugin inserts a space only when ALL conditions are met:

1. **Right Arrow Key**: User presses right arrow (not left, up, or down)
2. **Collapsed Selection**: Cursor position (not text selection)
3. **Text Node**: Current container is text node
4. **End Position**: Cursor is at end of text node (`endOffset === nodeValue.length`)
5. **Inline Parent**: Parent element is inline block (e.g., `<strong>`, `<em>`, `<a>`, `<span>`)
6. **No Right Neighbor**: No non-empty element exists after the inline element

### Invisible Space Usage

The plugin inserts `INVISIBLE_SPACE` (U+FEFF), which takes no room and isn't part of the editor's value. So pressing the right arrow and typing doesn't add a space: with `<p>Hello <strong>bold</strong></p>` and the cursor at the end of "bold", the right arrow and then `x` give `<p>Hello <strong>bold</strong>x</p>`. Earlier versions inserted a non-breaking space, which stayed in the content.

### DOM Modification

When conditions are met:

```typescript
Dom.after(parentNode, this.j.createInside.fake());
```

This inserts a text node containing the invisible space immediately after the inline element, and the right arrow moves the cursor past it, outside the element.

## Edge Cases

1. **Middle of Text**: Plugin does not activate if cursor is in the middle of text within inline element

2. **Left Arrow**: Plugin only handles right arrow; left arrow uses browser default behavior

3. **Text Selection**: Plugin does not activate when text is selected (only collapsed cursor)

4. **Nested Inlines**: Works with nested inline elements; exits the innermost element first

5. **Already Has Neighbor**: If element after inline element exists, plugin doesn't insert an invisible space

6. **Block Elements**: Plugin specifically checks for inline block elements; doesn't activate for block elements

7. **Empty Inline**: Works even if inline element is empty

8. **Non-Text Containers**: Plugin only activates when cursor is in text node (not element node)

## Notes

- Plugin uses `KEY_RIGHT` constant which represents the right arrow key
- The `Dom.isInlineBlock()` check identifies inline elements like `<strong>`, `<em>`, `<a>`, `<span>`, etc.
- The `Dom.findNotEmptyNeighbor()` ensures no adjacent content exists that would naturally allow cursor movement
- Insertion happens via `createInside.fake()` to ensure text node belongs to correct document context
- Plugin only handles right arrow navigation; browser handles all other navigation naturally
- The plugin improves UX by solving the common problem of getting "stuck" inside inline formatted elements
- Works automatically for all inline formatting applied through the editor (bold, italic, underline, links, etc.)
- No visual feedback is provided; the cursor simply moves as expected