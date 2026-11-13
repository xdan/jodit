---
title: Inline Popup Plugin
description: Displays context-sensitive inline popup toolbars near images, links, table cells, and text selections with customizable button sets.
keywords: jodit, inline popup, inline toolbar, context toolbar, selection toolbar, image popup, link popup
---

# Inline Popup Plugin

Provides context-sensitive inline popup toolbars for various elements in the editor. This plugin displays customizable toolbars when clicking on images, links, table cells, or selecting text.

## Features

- Inline popup toolbars for specific elements (images, links, tables, etc.)
- Selection toolbar for highlighted text
- Customizable button sets for each element type
- Automatic positioning near target element
- Exclude specific elements from popup display
- Disable specific buttons in inline toolbar
- Function-based dynamic content
- Mobile-optimized with extra buttons
- Auto-hide on click outside, editor changes, or when a key moves the caret off the element
- A key that moves the caret into a link opens its popup, as a click does
- Stays open after one of its buttons runs, beside its element or the selection, so the next can follow

## Configuration Options

### `toolbarInline`

**Type:** `boolean` | **Default:** `true`

Enables inline popup toolbars.

### `toolbarInlineForSelection`

**Type:** `boolean` | **Default:** `false`

Shows inline toolbar when text is selected.

### `toolbarInlineKeepOpen`

**Type:** `boolean` | **Default:** `true`

Keeps an inline toolbar open after one of its buttons runs, beside its element (a table cell, an image, a video, a link) or the selection. A list that a button opened, such as the cell toolbar's Add row, still closes once something is chosen in it. The toolbar closes on a click outside it, on a key that moves the caret off the element, and when a button removes the element, as Delete does.

Set it to `false` to close the toolbar after every button.

While it is on, a button in an inline toolbar doesn't fire `closeAllPopups` after it runs, unless it removed the element. To act after a button runs, listen for `afterExec` (a button with an `exec`) or `afterCommand` (a button that runs a command).

**Example:**
```typescript
Jodit.make('#editor', {
    toolbarInlineKeepOpen: false
});
```

### `toolbarInlineDisableFor`

**Type:** `string | string[]` | **Default:** `[]`

Element types to exclude from inline popups.

**Example:**
```typescript
Jodit.make('#editor', {
    toolbarInlineDisableFor: ['img', 'table']
});
```

### `toolbarInlineDisabledButtons`

**Type:** `string[]` | **Default:** `['source']`

Buttons to exclude from inline toolbars.

### `popup`

**Type:** `IDictionary<Array<string> | Function>`

**Default:** Configured for `a`, `img`, `cells`, `selection`, `toolbar`, `iframe`

Defines toolbar buttons or content for each element type.

**Example:**
```typescript
Jodit.make('#editor', {
    popup: {
        a: Jodit.atom(['link', 'unlink']),
        img: ['delete', 'resize', 'crop'],
        selection: ['bold', 'italic', 'underline']
    }
});
```

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor', {
    toolbarInline: true,
    toolbarInlineForSelection: true
});
```

### Custom Popup for Links

```typescript
Jodit.make('#editor', {
    popup: {
        a: Jodit.atom(['link', 'unlink', 'delete'])
    }
});
```

### Dynamic Popup Content

```typescript
Jodit.make('#editor', {
    popup: {
        img: (editor, target, close) => {
            return ['delete', 'crop', { text: 'Custom', exec: () => {} }];
        }
    }
});
```

### Disable For Specific Elements

```typescript
Jodit.make('#editor', {
    toolbarInlineDisableFor: ['table', 'img']
});
```

## Default Popup Configurations

- **`a`** (links): Link editing and unlinking tools
- **`img`** (images): Image manipulation tools: Delete, Edit (the image properties dialog), Caption (see the `imageCaption` plugin), Vertical align and Align. For a captioned image, Delete and Align act on the element holding the image and its caption, Vertical align is disabled, and the popup opens below the caption
- **`cells`** (table cells): Table modification tools, and a Header row toggle (`headerrow`), which leaves the popup open to show its new state
- **`selection`**: Bold, italic, underline, lists, alignment, etc.
- **`toolbar`**: General inline toolbar
- **`iframe`/`jodit-media`**: Media element tools: Replace (the video popup's tabs), Delete, Edit (the video properties dialog) and Align

## How It Works

1. **Click Detection**: Listens for clicks on configured element types
2. **Popup Display**: Shows popup near clicked element with appropriate toolbar
3. **Selection Handling**: Optionally shows toolbar for text selections
4. **Auto-Positioning**: Positions popup relative to target element bounds, leaving room for the resizer's handles round an element in `allowResizeTags` or a media wrapper, so the popup doesn't cover them
5. **Auto-Hide**: Closes on outside click, editor changes, a key that moves the caret off the element, or explicit close events

## Events

### `showPopup`

Programmatically show popup for an element.

**Example:**
```typescript
editor.e.fire('showPopup', element, () => element.getBoundingClientRect(), 'img');
```

The popup is made again only for another element or type. Pass `true` as a fourth argument to make it again for the same element, as the anchor plugin does so that its form shows the anchor's name as it is now:

```typescript
editor.e.fire('showPopup', anchor, () => anchor.getBoundingClientRect(), 'anchor', true);
```

What a function in `popup` returns is taken out of the popup, not destructed, when it shows something else, so the function can return the same element again.

### `hidePopup`

Programmatically hide the popup.

**Example:**
```typescript
editor.e.fire('hidePopup');
```

## Notes

- Use `Jodit.atom()` to replace default popup configuration entirely
- Without `Jodit.atom()`, custom configuration merges with defaults
- Popup automatically repositions on window resize
- Function-based popups receive editor, target element, and close callback
- Mobile view includes additional buttons not in inline toolbar
- Plugin requires `select` module as dependency