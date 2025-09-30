# Ordered List Plugin

Adds enhanced unordered list (UL) and ordered list (OL) buttons with list-style-type dropdown support. This plugin allows users to create lists with different bullet/numbering styles through an intuitive popup menu.

## Features

- UL button with style-type dropdown (default, circle, disc, square)
- OL button with style-type dropdown (default, lower-alpha, lower-greek, lower-roman, upper-alpha, upper-roman)
- Remembers last selected list style per button
- Custom command handlers for list insertion
- Style application via `list-style-type` CSS property
- Tag-based button activation (highlights when cursor in list)
- Customizable list style options
- Style synchronization with editor value

## Configuration Options

This plugin has no additional configuration options beyond the control configurations for `ul` and `ol` buttons.

## Controls

### `ul` Control

**Command:** `'insertUnorderedList'`

**Tags:** `['ul']`

**Tooltip:** `'Insert Unordered List'`

**List Options:**
- `default`: Default (browser default)
- `circle`: Circle bullets
- `disc`: Dot bullets (filled circle)
- `square`: Quadrate bullets (square)

Creates unordered (bullet) lists with selectable bullet styles.

### `ol` Control

**Command:** `'insertOrderedList'`

**Tags:** `['ol']`

**Tooltip:** `'Insert Ordered List'`

**List Options:**
- `default`: Default (1, 2, 3...)
- `lower-alpha`: Lower Alpha (a, b, c...)
- `lower-greek`: Lower Greek (α, β, γ...)
- `lower-roman`: Lower Roman (i, ii, iii...)
- `upper-alpha`: Upper Alpha (A, B, C...)
- `upper-roman`: Upper Roman (I, II, III...)

Creates ordered (numbered) lists with selectable numbering styles.

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor');
// Use UL or OL buttons in toolbar
// Select list style from dropdown
```

### Custom UL Styles

```typescript
Jodit.make('#editor', {
    controls: {
        ul: {
            list: {
                default: 'Default',
                disc: 'Filled Circle',
                circle: 'Empty Circle',
                square: 'Square'
            }
        }
    }
});
```

### Custom OL Styles

```typescript
Jodit.make('#editor', {
    controls: {
        ol: {
            list: {
                default: 'Numbers',
                'lower-alpha': 'Lowercase Letters',
                'upper-alpha': 'Uppercase Letters',
                'lower-roman': 'Roman Numerals (lower)',
                'upper-roman': 'Roman Numerals (upper)'
            }
        }
    }
});
```

### Programmatic List Creation

```typescript
const editor = Jodit.make('#editor');

// Create unordered list with default style
editor.execCommand('insertUnorderedList', false, null);

// Create unordered list with circle bullets
editor.execCommand('insertUnorderedList', false, 'circle');

// Create ordered list with default style
editor.execCommand('insertOrderedList', false, null);

// Create ordered list with lower-alpha style
editor.execCommand('insertOrderedList', false, 'lower-alpha');
```

### Limited Style Options

```typescript
Jodit.make('#editor', {
    controls: {
        ul: {
            list: {
                default: 'Default',
                disc: 'Dot'
            }
        },
        ol: {
            list: {
                default: 'Default',
                'lower-alpha': 'a, b, c',
                'upper-alpha': 'A, B, C'
            }
        }
    }
});
```

### Listen to List Commands

```typescript
const editor = Jodit.make('#editor');

// Intercept before list insertion
editor.e.on('beforeCommand', (command, ...args) => {
    if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
        console.log('Creating list:', command, args);
    }
});
```

## How It Works

### Plugin Initialization

1. **Button Registration**: Registers `ul` and `ol` buttons in `list` toolbar group
2. **Command Registration**: Registers handlers for:
   - `insertUnorderedList`
   - `insertOrderedList`
3. **Icon Loading**: Sets custom icons for UL and OL buttons

### List Creation Flow

When user creates a list:

1. **Button Click**: User clicks UL or OL button, opens dropdown
2. **Style Selection**: User selects list style from dropdown options
3. **Command Execution**: Executes `insertUnorderedList` or `insertOrderedList` command with selected style
4. **Style Memorization**: Saves selected style for future uses (per button)
5. **Style Application**: Applies via `commitStyle()` with:
   - Element: `ul` or `ol`
   - Attributes: `{ style: { listStyleType: styleValue } }`
6. **Value Sync**: Calls `synchronizeValues()` to update editor value

### Memo Exec Function

The `memoExec` function:

1. **Key Generation**: Creates storage key `button${control.command}`
2. **Value Retrieval**: Gets value from:
   - `control.args[0]` (if provided), or
   - Previously stored value via `dataBind(jodit, key)`
3. **Value Storage**: Saves value using `dataBind(jodit, key, value)`
4. **Command Execution**: Executes command with:
   - Value as-is if not 'default'
   - `null` if value is 'default' (removes style)

### Command Handler

The `onCommand` method:

1. **Element Determination**: Checks command name:
   - `insertunorderedlist` → `ul`
   - `insertorderedlist` → `ol`
2. **Style Application**: Calls `commitStyle()` with:
   - Element type (ul/ol)
   - Style attribute: `listStyleType` set to type parameter or null
3. **Synchronization**: Updates editor's internal value
4. **Return False**: Prevents default browser list handling

### List Style Application

The plugin uses `commitStyle()` which:
- Toggles list formatting on/off
- Wraps selected content in list elements
- Applies `list-style-type` CSS property
- Handles nested lists and list item creation

### Tag-Based Activation

Buttons use `tags: ['ul']` and `tags: ['ol']`:
- Button highlights when cursor is inside corresponding list type
- Provides visual feedback of current list context
- Helps users understand current formatting state

## Commands

### `insertUnorderedList`

Creates or toggles unordered list with optional bullet style.

**Syntax:**
```typescript
editor.execCommand('insertUnorderedList', false, style?: string | null)
```

**Parameters:**
- `style`: List style type (`'circle'`, `'disc'`, `'square'`, etc.) or `null` for default

**Example:**
```typescript
// Default bullets
editor.execCommand('insertUnorderedList');

// Circle bullets
editor.execCommand('insertUnorderedList', false, 'circle');

// Square bullets
editor.execCommand('insertUnorderedList', false, 'square');
```

### `insertOrderedList`

Creates or toggles ordered list with optional numbering style.

**Syntax:**
```typescript
editor.execCommand('insertOrderedList', false, style?: string | null)
```

**Parameters:**
- `style`: List style type (`'lower-alpha'`, `'upper-roman'`, etc.) or `null` for default

**Example:**
```typescript
// Default numbering (1, 2, 3...)
editor.execCommand('insertOrderedList');

// Lowercase letters (a, b, c...)
editor.execCommand('insertOrderedList', false, 'lower-alpha');

// Roman numerals (I, II, III...)
editor.execCommand('insertOrderedList', false, 'upper-roman');
```

## Edge Cases

1. **Default Value**: Selecting 'default' style passes `null` to command (removes explicit style)

2. **Style Memorization**: Each button (ul/ol) remembers its last selected style independently

3. **Nested Lists**: Plugin works with nested lists; style applies to current list level

4. **Toggle Behavior**: Executing command on existing list toggles it off if same type

5. **Case Insensitive**: Command name comparison uses lowercase (`insertunorderedlist`)

6. **No Type Parameter**: If type is `null` or undefined, removes `list-style-type` style

7. **Selection Context**: Works with both collapsed cursor and text selections

8. **Mixed Lists**: Creating different list type converts existing list to new type

## Notes

- Plugin is class-based, extends `Plugin` base class
- Buttons appear in the `list` toolbar group
- The `@autobind` decorator binds `onCommand` method to plugin instance
- Custom icons are loaded from SVG files (`ol.svg`, `ul.svg`)
- The `commitStyle()` method handles all list formatting logic
- Style is applied via inline `style` attribute with `list-style-type` property
- The 'default' option in dropdowns corresponds to browser default rendering
- List styles are CSS standard values (`circle`, `disc`, `square`, `lower-alpha`, etc.)
- Plugin registers commands that override default browser list behavior
- The `synchronizeValues()` call ensures editor's value property reflects DOM changes
- Both buttons use the same `memoExec` function for consistent behavior
- Style memorization uses `dataBind()` for data storage on editor instance
- Plugin properly cleans up in `beforeDestruct()` (empty implementation)
- The `list` configuration property defines dropdown options (key-value pairs)
- Control tooltips are localizable via language files
- Tag detection (`tags: ['ul']`, `tags: ['ol']`) enables button highlighting in lists