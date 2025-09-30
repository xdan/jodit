# Format Block Plugin

Provides block-level formatting controls for the Jodit editor. This plugin allows users to change the type of block elements (paragraphs, headings, quotes, code blocks, etc.) at the cursor position or for selected content.

## Features

- Convert between different block-level HTML elements
- Support for headings (H1-H6), paragraphs, blockquotes, and preformatted text
- Customizable list of available block formats
- Visual preview of each format in the dropdown
- Shows current block format in the toolbar
- Highlights active format in the dropdown
- Preserves content when changing block types

## Configuration Options

### Control Configuration: `paragraph`

The `paragraph` control can be customized through the `controls` configuration:

**Properties:**
- `command`: `'formatBlock'` - The command to execute
- `list`: Object mapping HTML tag names to display labels
- `childTemplate`: Function to render dropdown items with format preview
- `tooltip`: Tooltip text for the button
- `data.currentValue`: Default value when no block is selected (default: `'p'`)

**Default list:**
```typescript
{
    p: 'Paragraph',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    blockquote: 'Quote',
    pre: 'Code'
}
```

## Usage Examples

### Basic Usage

The plugin is enabled by default and provides a toolbar button for block formatting:

```typescript
const editor = Jodit.make('#editor');
// Paragraph button is available in the toolbar
```

### Custom Block Format List

Add additional block formats to the existing list:

```typescript
const editor = Jodit.make('#editor', {
    controls: {
        paragraph: {
            list: {
                pre: 'Source code',
                h5: 'Heading 5',
                h6: 'Heading 6'
            }
        }
    }
});
```

### Complete List Override

Replace the entire list with custom formats using `Jodit.atom`:

```typescript
const editor = Jodit.make('#editor', {
    controls: {
        paragraph: {
            list: Jodit.atom({
                p: 'Paragraph',
                h1: 'Heading 1',
                h2: 'Heading 2',
                h3: 'Heading 3',
                h4: 'Heading 4',
                h5: 'Heading 5',
                h6: 'Heading 6',
                blockquote: 'Quote',
                div: 'Div',
                pre: 'Source code'
            })
        }
    }
});
```

### Custom Display Labels

Customize the labels shown in the dropdown:

```typescript
const editor = Jodit.make('#editor', {
    controls: {
        paragraph: {
            list: Jodit.atom({
                p: 'Normal Text',
                h1: 'Title',
                h2: 'Subtitle',
                h3: 'Section Header',
                blockquote: 'Citation',
                pre: 'Code Block'
            })
        }
    }
});
```

### Programmatic Usage

```typescript
const editor = Jodit.make('#editor');

// Convert current block to heading 1
editor.execCommand('formatblock', false, 'h1');

// Convert to paragraph
editor.execCommand('formatblock', false, 'p');

// Convert to blockquote
editor.execCommand('formatblock', false, 'blockquote');
```

### Minimal List

Create a simplified format list with only essential options:

```typescript
const editor = Jodit.make('#editor', {
    controls: {
        paragraph: {
            list: Jodit.atom({
                p: 'Normal',
                h2: 'Heading',
                blockquote: 'Quote'
            })
        }
    }
});
```

### With Custom Tooltip

```typescript
const editor = Jodit.make('#editor', {
    controls: {
        paragraph: {
            list: {
                p: 'Paragraph',
                h1: 'Heading 1',
                h2: 'Heading 2',
                blockquote: 'Quote'
            },
            tooltip: 'Change paragraph format'
        }
    }
});
```

## How It Works

### Plugin Initialization

1. **Button Registration**: The plugin registers the `paragraph` toolbar button
2. **Command Registration**: Registers a handler for the `formatblock` command
3. **Icon Setup**: Loads the paragraph SVG icon

### Block Format Application

When the `formatblock` command is executed:

1. **Style Commit**: Uses `editor.s.commitStyle()` with the `element` parameter:
   - Identifies the current block element containing the cursor or selection
   - Replaces the block element's tag name with the specified tag
   - Preserves all content and inline formatting within the block
   - Handles multiple blocks if selection spans multiple elements

2. **Synchronization**: Calls `editor.synchronizeValues()` to update the editor state

3. **Return Value**: Returns `false` to prevent default browser behavior

### Current Value Detection

The `value` function determines the current block format:

1. **Selection Check**: Gets the current cursor position or selection start
2. **Block Search**: Uses `Dom.closest()` to find the nearest block element
3. **Tag Extraction**: Returns the lowercase tag name of the block element
4. **Fallback**: If no block found, returns the `data.currentValue` (default: 'p')

### Button State Update

The `update` function updates the button display:

1. **Value Check**: Gets the current block format value
2. **List Lookup**: Checks if the value exists in the `list` configuration
3. **Text Update**: If `textIcons` is enabled, updates the button text to show the format label
4. **Returns**: `false` to allow default update behavior

### Active State Detection

**Child Active State:**
- Compares the current value with the button's argument (the format being checked)
- Highlights the matching format in the dropdown

**Button Active State:**
- Checks if the current value differs from `editor.o.enter` (the default enter tag)
- Verifies the value exists in the `list` configuration
- Activates the button when a non-default format is applied

### Dropdown Item Rendering

The `childTemplate` function creates preview elements:

1. **Element Creation**: Wraps the label in the actual HTML tag (e.g., `<h1>Label</h1>`)
2. **Style Reset**: Applies `margin:0; padding:0` to prevent layout issues
3. **Localization**: Translates the label using `editor.i18n()`
4. **Preview**: Users see how each format looks before selecting it

## Commands

### `formatblock`

Changes the block-level element type at the cursor position or for selected content.

**Syntax:**
```typescript
editor.execCommand('formatblock', false, tagName);
```

**Parameters:**
- `tagName` (string): The HTML tag name to apply (e.g., 'h1', 'p', 'blockquote')

**Example:**
```typescript
// Convert to heading 2
editor.execCommand('formatblock', false, 'h2');

// Convert to blockquote
editor.execCommand('formatblock', false, 'blockquote');

// Convert back to paragraph
editor.execCommand('formatblock', false, 'p');
```

## Edge Cases

1. **No Selection**: When no text is selected, the format is applied to the current block containing the cursor

2. **Multiple Blocks**: When selection spans multiple blocks, each block is converted to the specified format

3. **Nested Blocks**: The plugin identifies the nearest block element and converts it; inline elements are preserved

4. **Invalid Tag Names**: If an invalid or unsupported tag is specified, behavior depends on the browser's `formatBlock` implementation

5. **Lists**: Converting list items may have unexpected results; the plugin works best with standard block elements

6. **Empty Blocks**: Converting empty blocks works correctly and maintains the structure

7. **Block with Complex Content**: All inline formatting, links, images, and other inline elements are preserved when changing block type

8. **Table Cells**: Block formatting inside table cells works but is limited to the cell's content

## Notes

- The plugin uses `commitStyle()` which intelligently handles block element conversion
- The dropdown shows a visual preview of each format by rendering the actual HTML element
- The button text can be updated dynamically to show the current format when `textIcons` is enabled
- Block format changes are applied to entire block elements, not just selected text
- The `Jodit.atom()` wrapper is used to completely replace the default list instead of merging with it
- Custom block types can be added, but they should be valid HTML block-level elements
- The plugin respects the editor's locale settings and translates format labels automatically
- Converting between formats preserves all attributes and inline styles of the content
- The current format is detected by traversing up the DOM tree to find the nearest block element
- If the cursor is not in a block element (edge case), the `data.currentValue` default is used