# Symbols Plugin

Provides a toolbar button and dialog for inserting special characters (Unicode symbols, HTML entities, currency symbols, etc.) that are not available on standard keyboards.

## Features

- Special character picker dialog
- Large default character set (200+ symbols)
- Grid layout with preview
- Keyboard navigation (arrow keys, Enter)
- Multi-character selection (Shift+click)
- Customizable character list
- Popup or alert dialog display modes
- Hotkey support (Ctrl+Shift+I)
- Focus management
- Character hover preview

## Configuration Options

### `specialCharacters`

**Type:** `string[]`

**Default:** Array of 200+ characters including:
- ASCII symbols: `!@#$%^&*()` etc.
- Currency: `€¢£¥` etc.
- Math: `±×÷≈` etc.
- Accented letters: `àáâãäå` etc.
- Quotes: `''""` etc.
- Dashes: `–—` etc.
- HTML entities: `&copy;`, `&reg;`, `&trade;`, etc.

Array of special characters to display in the picker. Can be customized to add or remove characters.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    specialCharacters: [
        '€', '£', '¥', '©', '®', '™',
        '°', '±', '×', '÷', '≈', '≠',
        '←', '→', '↑', '↓', '⇐', '⇒',
        '★', '☆', '♠', '♣', '♥', '♦'
    ]
});
```

### `usePopupForSpecialCharacters`

**Type:** `boolean`

**Default:** `false`

When `true`, displays character picker in a popup (dropdown). When `false` (default), displays in an alert dialog.

**Example:**
```typescript
// Use alert dialog (default)
const editor1 = Jodit.make('#editor1', {
    usePopupForSpecialCharacters: false
});

// Use popup dropdown
const editor2 = Jodit.make('#editor2', {
    usePopupForSpecialCharacters: true
});
```

## Controls

### `symbols` Control

**Icon:** `'symbols'`

**Tooltip:** `'Insert Special Character'`

**Group:** `'insert'`

**Hotkeys:** `Ctrl+Shift+I`, `Cmd+Shift+I`

Opens character picker dialog or popup.

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor');

// Click Symbols button in toolbar
// Or press Ctrl+Shift+I
// Select character from grid
// Character inserted at cursor
```

### Custom Character Set

```typescript
const editor = Jodit.make('#editor', {
    specialCharacters: [
        // Math symbols
        '∑', '∏', '∫', '√', '∞',
        // Greek letters
        'α', 'β', 'γ', 'δ', 'ε', 'π', 'σ', 'ω',
        // Arrows
        '←', '→', '↑', '↓', '↔', '↕',
        // Currency
        '$', '€', '£', '¥', '₹', '₽'
    ]
});
```

### Use Popup Instead of Dialog

```typescript
const editor = Jodit.make('#editor', {
    usePopupForSpecialCharacters: true
});

// Symbols open in dropdown popup
// Doesn't cover editor content
```

### Multi-Character Insertion

```typescript
const editor = Jodit.make('#editor');

// Open symbols picker
// Hold Shift key
// Click multiple characters
// All selected characters inserted
// Dialog stays open while Shift held
```

### Listen to Dialog Events

```typescript
const editor = Jodit.make('#editor');

editor.e.on('generateSpecialCharactersTable', (container) => {
    console.log('Character table generated');
    return container;
});
```

## How It Works

### Initialization

On `afterInit`:
1. Registers `generateSpecialCharactersTable.symbols` event handler
2. Handler builds character picker UI when called

### Character Table Generation

When event fired (`generateSpecialCharactersTable.symbols`):

1. **Create Container:**
   - Outer div: `.jodit-symbols__container`
   - Table container: `.jodit-symbols__container_table`
   - Preview container: `.jodit-symbols__container_preview`
   - Table: `.jodit-symbols__table`
   - Preview div: `.jodit-symbols__preview`

2. **Build Grid:**
   - Iterates through `specialCharacters` array
   - Creates table rows with 17 cells each (`__countInRow`)
   - Each cell contains `<a>` element with character
   - Each link has `data-index` and `data-index-j` attributes
   - All links added to `chars` array for event handling

3. **Attach Event Handlers:**
   - `focus`: Shows character in preview pane
   - `mousedown`: Inserts character at cursor
   - `mouseenter`: Focuses the link
   - `keydown`: Handles keyboard navigation

4. **Return Container:**
   - Returns HTML element for display in popup/dialog

### Character Selection

On character click (`mousedown`):
1. Focuses editor selection
2. Inserts character HTML via `insertHTML()`
3. If Shift key NOT held: fires `close_dialog` event (closes picker)
4. Prevents default and stops propagation

### Keyboard Navigation

The `keydown` handler supports:

**Arrow Keys:**
- **Up/Down**: Move ±17 positions (±`__countInRow`)
  - Wraps to last/first row if at edge
  - Maintains column position when wrapping
- **Left/Right**: Move ±1 position
  - Wraps to last/first character if at edge

**Enter Key:**
- Fires `mousedown` event on focused character
- Inserts character and closes dialog (unless Shift held)

**Index Calculation:**
- Uses `data-index` for absolute position
- Uses `data-index-j` for column position
- Wrapping logic handles incomplete last row

### Preview Pane

- Located below character grid
- Updates on character `focus`
- Shows enlarged version of character
- Helps identify small or similar symbols

### Display Modes

**Alert Dialog Mode** (`usePopupForSpecialCharacters: false`):
- Calls `editor.alert()` with container
- Modal dialog overlays editor
- Title: "Select Special Character"
- CSS class: `jodit-symbols`
- Automatically focuses first character

**Popup Mode** (`usePopupForSpecialCharacters: true`):
- Wraps container in `.jodit-symbols` div
- Returns for button popup system
- Attaches `close_dialog` event listener
- Dropdown below button

### Multi-Selection

Shift key behavior:
- Normally: Click inserts and closes dialog
- With Shift: Click inserts but keeps dialog open
- Allows inserting multiple characters sequentially

## Events

### `generateSpecialCharactersTable`

Fired to request character picker UI generation.

**Returns:** `HTMLElement` - The character picker container

**Example:**
```typescript
const container = editor.e.fire('generateSpecialCharactersTable');
```

### `close_dialog`

Fired on character link to close dialog (when Shift not held).

**Example:**
```typescript
editor.e.on(container, 'close_dialog', () => {
    console.log('Dialog closing');
});
```

## Edge Cases

1. **Empty Character List**: Shows empty table if `specialCharacters` is empty array
2. **Large Character Set**: Grid grows vertically, may need scrolling
3. **Small Character Set**: May have incomplete last row, wrapping handles this
4. **Keyboard Focus**: First character automatically focused in alert mode
5. **Shift Key**: Must hold Shift during click to keep dialog open
6. **Preview**: Updates on any focus change (mouse or keyboard)
7. **Navigation Wrapping**: Arrows wrap at edges for continuous navigation
8. **Incomplete Row**: Last row may have fewer than 17 characters
9. **HTML Entities**: Displayed as rendered characters (e.g., `&copy;` → ©)
10. **Hotkey Conflict**: Ctrl+Shift+I may conflict with browser DevTools

## Notes

- Plugin is class-based, extends `Plugin` base class
- Button in 'insert' toolbar group
- Event namespacing: `.symbols` for clean removal
- Grid layout: 17 characters per row (`__countInRow`)
- Character links have `role="option"` and `tabindex="-1"`
- Preview updates on `focus` event (keyboard and mouse)
- Uses `insertHTML()` to insert character at cursor
- Shift detection via `e.shiftKey` on mousedown
- Arrow key navigation uses data attributes for position tracking
- Language files extended via `extendLang(langs)`
- The plugin properly cleans up event listener on destruction
- Default character set includes full ASCII + HTML entities + Unicode symbols
- Characters stored as HTML entities (e.g., `&euro;`) or raw characters
- Table built dynamically on each dialog open
- Preview pane shows character innerHTML
- Multi-char selection requires holding Shift throughout
- Dialog close via `close_dialog` event when Shift not pressed
- Popup mode returns container for button dropdown system
- Alert mode shows modal dialog with title and CSS class
- First character auto-focused in alert mode for immediate keyboard use

## Typical Use Case

Users need to insert special characters like copyright symbols, currency signs, accented letters, or mathematical operators that aren't on their keyboard. The symbols plugin provides this by:

1. Adding Symbols button to toolbar with hotkey
2. Displaying grid of available special characters
3. Supporting keyboard and mouse selection
4. Showing character preview for clarity
5. Allowing quick multi-character insertion with Shift

This improves user experience by:
- Providing easy access to Unicode and HTML entity characters
- Visual grid makes finding characters intuitive
- Keyboard navigation for power users
- Preview helps identify small/similar symbols
- Multi-insertion saves time when adding multiple symbols