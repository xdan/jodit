# Justify Plugin

Provides text alignment functionality for the Jodit editor. This plugin adds an align button with dropdown options to align text left, center, right, or justify within block elements.

## Features

- Align button with dropdown menu
- Left, center, right, and justify alignment
- Dynamic button icon/text based on current alignment
- Automatic block wrapping when needed
- Multiple selection support
- Preserves selection across operations
- Visual indication of current alignment

## Configuration Options

No additional configuration options. The plugin uses the built-in control configurations for alignment buttons.

## Controls

### `align` (Main Control)

Dropdown button showing current alignment with options for all alignment types.

**Default list:** `['center', 'left', 'right', 'justify']`

### Individual Alignment Controls

- **`left`**: Align left (command: `justifyLeft`)
- **`center`**: Align center (command: `justifyCenter`)
- **`right`**: Align right (command: `justifyRight`)
- **`justify`**: Justify text (command: `justifyFull`)

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor');
// Use align button in toolbar
```

### Programmatic Alignment

```typescript
const editor = Jodit.make('#editor');

// Align left
editor.execCommand('justifyLeft');

// Align center
editor.execCommand('justifyCenter');

// Align right
editor.execCommand('justifyRight');

// Justify
editor.execCommand('justifyFull');
```

### Custom Align Button

```typescript
Jodit.make('#editor', {
    controls: {
        align: {
            list: ['left', 'center', 'right']  // Exclude justify
        }
    }
});
```

## Commands

### `justifyLeft`

Aligns text to the left.

### `justifyCenter`

Centers text.

### `justifyRight`

Aligns text to the right.

### `justifyFull`

Justifies text (distributes evenly).

## How It Works

1. **Selection Processing**: Finds block element(s) containing cursor/selection
2. **Block Wrapping**: Creates block wrapper if needed (using `enterBlock` config)
3. **Alignment Application**: Sets `text-align` CSS property on block element
4. **Button Update**: Updates button icon/text to reflect current alignment
5. **Active State**: Shows button as active when alignment differs from default

### Default Values

The `align` control treats these values as "default" (not aligned):
- `left`
- `start`
- `inherit`

When current alignment matches default, button appears inactive.

## Edge Cases

1. **No Block**: Wraps inline content in block before applying alignment
2. **Multiple Selections**: Applies alignment to all selected blocks
3. **Default Alignment**: Considers `left`, `start`, and `inherit` as default states
4. **Button Display**: Shows current alignment in button icon or text (if `textIcons` enabled)

## Notes

- Alignment is applied via `text-align` CSS property
- The plugin automatically wraps inline content in blocks when needed
- Button appears in the `indent` toolbar group
- Current alignment is detected from computed styles
- Multiple blocks can be aligned simultaneously
- Selection is preserved across alignment operations