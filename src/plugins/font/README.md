# Font Plugin

Provides font family and font size controls for the Jodit editor. This plugin registers two buttons (`font` and `fontsize`) that allow users to change the font family and font size of selected text.

## Features

- Apply font family to selected text
- Apply font size to selected text
- Customizable font family list with font preview
- Customizable font size list
- Shows current font family and size in toolbar
- Automatic font availability detection
- Normalizes font size values to px or pt
- Highlights active font family/size in dropdown

## Configuration Options

### `defaultFontSizePoints`

**Type:** `'px' | 'pt'`

**Default:** `'px'`

Specifies the unit for font size values. Can be either pixels (`'px'`) or points (`'pt'`).

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    defaultFontSizePoints: 'pt'
});
```

### Control Configuration: `fontsize`

The `fontsize` control can be customized through the `controls` configuration:

**Properties:**
- `command`: `'fontsize'` - The command to execute
- `list`: Array of font size values (numbers)
- `textTemplate`: Function to format the button text
- `childTemplate`: Function to format dropdown items
- `tooltip`: Tooltip text for the button
- `data.cssRule`: CSS property name (`'font-size'`)
- `data.normalise`: Function to normalize font size values

**Default list:** `[8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 32, 34, 36, 48, 60, 72, 96]`

### Control Configuration: `font`

The `font` control can be customized through the `controls` configuration:

**Properties:**
- `command`: `'fontname'` - The command to execute
- `list`: Object mapping font families to display names
- `textTemplate`: Function to format the button text
- `childTemplate`: Function to format dropdown items with font preview
- `tooltip`: Tooltip text for the button
- `data.cssRule`: CSS property name (`'font-family'`)
- `data.normalize`: Function to normalize font family values

**Default list:**
```typescript
{
    '': 'Default',
    'Arial, Helvetica, sans-serif': 'Arial',
    "'Courier New', Courier, monospace": 'Courier New',
    'Georgia, Palatino, serif': 'Georgia',
    "'Lucida Sans Unicode', 'Lucida Grande', sans-serif": 'Lucida Sans Unicode',
    'Tahoma, Geneva, sans-serif': 'Tahoma',
    "'Times New Roman', Times, serif": 'Times New Roman',
    "'Trebuchet MS', Helvetica, sans-serif": 'Trebuchet MS',
    'Helvetica, sans-serif': 'Helvetica',
    'Impact, Charcoal, sans-serif': 'Impact',
    'Verdana, Geneva, sans-serif': 'Verdana'
}
```

## Usage Examples

### Basic Usage

The plugin is enabled by default and provides toolbar buttons for font family and font size:

```typescript
const editor = Jodit.make('#editor');
// Font and fontsize buttons are available in the toolbar
```

### Custom Font Size List

```typescript
const editor = Jodit.make('#editor', {
    controls: {
        fontsize: {
            list: [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32]
        }
    }
});
```

### Custom Font Family List

```typescript
const editor = Jodit.make('#editor', {
    controls: {
        font: {
            list: {
                '': 'Default',
                'Helvetica, sans-serif': 'Helvetica',
                'Arial, Helvetica, sans-serif': 'Arial',
                'Georgia, serif': 'Georgia',
                'Impact, Charcoal, sans-serif': 'Impact',
                'Tahoma, Geneva, sans-serif': 'Tahoma',
                "'Times New Roman', Times, serif": 'Times New Roman',
                'Verdana, Geneva, sans-serif': 'Verdana'
            }
        }
    }
});
```

### Using Points Instead of Pixels

```typescript
const editor = Jodit.make('#editor', {
    defaultFontSizePoints: 'pt',
    controls: {
        fontsize: {
            list: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36]
        }
    }
});
```

### Programmatic Usage

```typescript
const editor = Jodit.make('#editor');

// Apply font size
editor.execCommand('fontsize', false, '16px');

// Apply font family
editor.execCommand('fontname', false, 'Arial, Helvetica, sans-serif');
```

### Custom Font Size with Different Units

```typescript
const editor = Jodit.make('#editor', {
    defaultFontSizePoints: 'px'
});

// The plugin will normalize the size value
editor.s.select();
editor.execCommand('fontsize', false, '20');
// Result: font-size: 20px
```

## How It Works

### Plugin Initialization

1. **Button Registration**: The plugin registers two toolbar buttons: `font` and `fontsize`
2. **Command Registration**: Registers command handlers for `fontsize` and `fontname` commands
3. **Icon Setup**: Loads SVG icons for both buttons

### Font Size Application

When the `fontsize` command is executed:

1. **Normalization**: The size value is normalized using `normalizeSize()`:
   - Adds the unit suffix (px or pt) based on `defaultFontSizePoints` configuration
   - If the value already has `pt` suffix and the config uses `pt`, the suffix is preserved
   - Otherwise, the configured unit is appended

2. **Style Commit**: Applies the style using `editor.s.commitStyle()`:
   - Sets the `fontSize` CSS property on selected text
   - Wraps selected text in appropriate elements if needed
   - Preserves existing formatting

3. **Synchronization**: Calls `editor.synchronizeValues()` to update the editor state

### Font Family Application

When the `fontname` command is executed:

1. **Style Commit**: Applies the style using `editor.s.commitStyle()`:
   - Sets the `fontFamily` CSS property on selected text
   - Wraps selected text in appropriate elements if needed

2. **Synchronization**: Updates the editor state

### Active State Detection

**Font Size:**
- Reads the `font-size` CSS property from the current selection
- Compares with values in the `list` configuration
- Normalizes values for comparison (removes pt suffix if configured)
- Highlights the matching size in the dropdown

**Font Family:**
- Reads the `font-family` CSS property from the current selection
- Normalizes values by:
  - Converting to lowercase
  - Removing quotes
  - Replacing non-alphanumeric characters with commas
- Compares normalized values to determine active state

### Font Availability Detection

For the font family dropdown, the plugin checks if fonts are available:

1. Uses `document.fonts.check()` API to verify font availability
2. Excludes fonts with "dings" in the name (like Wingdings)
3. If available, applies the font family to the dropdown item for preview
4. Falls back to default rendering if detection fails or font is unavailable

## Commands

### `fontsize`

Applies font size to the selected text.

**Syntax:**
```typescript
editor.execCommand('fontsize', false, size);
```

**Parameters:**
- `size` (string): The font size value (e.g., '16px', '12pt', or '14')

**Example:**
```typescript
editor.s.select(); // Select some text
editor.execCommand('fontsize', false, '18px');
```

### `fontname`

Applies font family to the selected text.

**Syntax:**
```typescript
editor.execCommand('fontname', false, fontFamily);
```

**Parameters:**
- `fontFamily` (string): The font family value (e.g., 'Arial, Helvetica, sans-serif')

**Example:**
```typescript
editor.s.select(); // Select some text
editor.execCommand('fontname', false, 'Georgia, serif');
```

## Edge Cases

1. **No Selection**: If no text is selected, the font/size will be applied to newly typed text at the cursor position

2. **Partial Selection**: When only part of text with varying fonts/sizes is selected, the plugin applies the new value to the entire selection

3. **Nested Styles**: The plugin properly handles nested font styles, replacing inner styles with the new value

4. **Invalid Font Families**: Font families that don't exist on the system will fall back to the browser's default font

5. **Font Detection Failures**: If `document.fonts.check()` fails or is not supported, the dropdown items won't show font preview but will still function

6. **Unit Conversion**: The plugin doesn't convert between px and pt; it applies the configured unit to numeric values

7. **Removing Font Styles**: Selecting the default (empty) option from the font dropdown removes the font-family style

8. **Block Elements**: Font styles are applied to inline elements; block-level formatting is preserved

## Notes

- The plugin uses `commitStyle()` which intelligently applies inline styles without breaking block structure
- Font sizes in the list are numbers; the plugin automatically appends the configured unit (px or pt)
- The font family normalization ensures consistent comparison even with different quote styles or spacing
- Font availability detection uses modern browser APIs and gracefully degrades in older browsers
- The plugin doesn't validate if font sizes are reasonable; you can include any numeric values in the list
- Custom font families should include appropriate fallback fonts for better cross-platform compatibility
- The button state shows the computed font size/family at the current cursor position or selection
- Both controls support custom `textTemplate` and `childTemplate` for advanced UI customization