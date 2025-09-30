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
- Auto-hide on click outside or editor changes

## Configuration Options

### `toolbarInline`

**Type:** `boolean` | **Default:** `true`

Enables inline popup toolbars.

### `toolbarInlineForSelection`

**Type:** `boolean` | **Default:** `false`

Shows inline toolbar when text is selected.

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
- **`img`** (images): Image manipulation tools
- **`cells`** (table cells): Table modification tools
- **`selection`**: Bold, italic, underline, lists, alignment, etc.
- **`toolbar`**: General inline toolbar
- **`iframe`/`jodit-media`**: Media element tools

## How It Works

1. **Click Detection**: Listens for clicks on configured element types
2. **Popup Display**: Shows popup near clicked element with appropriate toolbar
3. **Selection Handling**: Optionally shows toolbar for text selections
4. **Auto-Positioning**: Positions popup relative to target element bounds
5. **Auto-Hide**: Closes on outside click, editor changes, or explicit close events

## Events

### `showPopup`

Programmatically show popup for an element.

**Example:**
```typescript
editor.e.fire('showPopup', element, () => element.getBoundingClientRect(), 'img');
```

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