# Placeholder Plugin

Displays a placeholder text inside the editor when it's empty, similar to standard textarea placeholder behavior. The placeholder automatically shows/hides based on editor content and adapts its positioning and styling to match the editor's first element.

## Features

- Automatic show/hide based on editor content
- Uses original textarea placeholder if available
- Customizable placeholder text
- RTL (right-to-left) language support
- Style matching with first editor element
- Position and padding adaptation
- Read-only mode handling
- Mode-aware (WYSIWYG only)
- Debounced toggle for performance
- Event-driven updates

## Configuration Options

### `showPlaceholder`

**Type:** `boolean`

**Default:** `true`

When `true`, enables placeholder display in empty editor. When `false`, placeholder feature is completely disabled.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    showPlaceholder: true
});
```

### `useInputsPlaceholder`

**Type:** `boolean`

**Default:** `true`

When `true`, uses the `placeholder` attribute from the original textarea/input element if it was set. When `false`, only uses the `placeholder` configuration option.

**Example:**
```html
<textarea id="editor" placeholder="Enter your content here..."></textarea>

<script>
const editor = Jodit.make('#editor', {
    useInputsPlaceholder: true  // Will use "Enter your content here..."
});
</script>
```

### `placeholder`

**Type:** `string`

**Default:** `'Type something'`

Default placeholder text to display. Can be overridden by original element's placeholder attribute if `useInputsPlaceholder` is `true`.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    placeholder: 'Start typing your content...'
});
```

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor', {
    showPlaceholder: true,
    placeholder: 'Type something'
});
```

### Use Textarea Placeholder

```html
<textarea id="editor" placeholder="Write your story here..."></textarea>

<script>
Jodit.make('#editor', {
    showPlaceholder: true,
    useInputsPlaceholder: true
});
</script>
```

### Custom Placeholder

```typescript
const editor = Jodit.make('#editor', {
    showPlaceholder: true,
    useInputsPlaceholder: false,
    placeholder: 'Start typing your document...'
});
```

### Disable Placeholder

```typescript
const editor = Jodit.make('#editor', {
    showPlaceholder: false
});
```

### RTL Language Support

```typescript
const editor = Jodit.make('#editor', {
    showPlaceholder: true,
    placeholder: 'ابدأ الكتابة هنا...',
    direction: 'rtl'
});
```

### Listen to Placeholder Changes

```typescript
const editor = Jodit.make('#editor', {
    showPlaceholder: true,
    placeholder: 'Type something'
});

editor.e.on('placeholder', (text) => {
    console.log('Placeholder text:', text);
});
```

## How It Works

### Initialization

1. **Check Enabled**: Exits if `showPlaceholder` is `false`
2. **Create Element**: Creates `<span>` with class `jodit-placeholder`
3. **Set Text**: Uses localized placeholder text
4. **RTL Handling**: Sets `right: 0px` and `direction: rtl` if editor is RTL
5. **Event Setup**: Registers event listeners for content changes

### Placeholder Text Priority

The plugin determines placeholder text in this order:

1. Original element's `placeholder` attribute (if `useInputsPlaceholder` is `true`)
2. `placeholder` configuration option
3. Localized via `i18n()`

### Empty Detection

The `isEditorEmpty()` function checks if editor is empty:

1. **No Children**: Returns `true` if no first child
2. **Inseparable Tags**: Returns `false` if first child is media element (img, video, etc.)
3. **Tables**: Returns `false` if first child is table
4. **Text Node**: Checks if text node is empty (only whitespace)
5. **Element Check**: Recursively checks if all children are empty or `<br>` tags

### Show/Hide Logic

**Show when:**
- Editor is empty (passes `isEditorEmpty()` check)
- Editor is in WYSIWYG mode
- Editor is not read-only

**Hide when:**
- Editor has content
- Editor is in source code mode
- Editor is read-only
- Editor is being destructed

### Style Adaptation

When showing placeholder:

1. **Position**: Appends to `workplace` (not inside editor)
2. **Font Size**: Matches first child element or editor
3. **Line Height**: Matches first child element or editor
4. **Text Align**: Matches current block or editor
5. **Padding**: Matches editor padding (top, left, right)
6. **Margins**: Uses max of editor and first child margins (top, left)

### Event Triggers

Placeholder updates on:
- `change` - Content changed
- `focus` - Editor focused
- `keyup` - Key released
- `mouseup` - Mouse button released
- `keydown` - Key pressed
- `mousedown` - Mouse button pressed
- `afterSetMode` - Editor mode changed
- `changePlace` - Editor moved
- `input` - Native input event (on editor element)
- `readonly` - Read-only state changed
- Window `load` - Page loaded

### Debouncing

The `toggle()` method uses `@debounce` decorator:
- Delay: `defaultTimeout / 10` (typically 10ms)
- Leading edge: `true` (executes immediately on first call)
- Prevents excessive DOM updates during rapid events

### RTL Support

For right-to-left languages:
- Sets `style.right = '0px'`
- Sets `style.direction = 'rtl'`
- Positions placeholder on right side

## Events

### `placeholder`

Fired when placeholder text is determined/changed.

**Parameters:**
- `text` (string): The placeholder text

**Example:**
```typescript
editor.e.on('placeholder', (text) => {
    console.log('Placeholder:', text);
});
```

### `readonly`

Plugin listens to this event to hide placeholder in read-only mode.

**Example:**
```typescript
editor.e.on('readonly', (isReadOnly) => {
    console.log('Read-only changed:', isReadOnly);
});
```

## Edge Cases

1. **Read-Only Mode**: Placeholder is hidden when editor is read-only

2. **Source Mode**: Placeholder is hidden in source code editing mode

3. **Inseparable Tags**: Editor with single image/video/iframe is not considered empty

4. **Tables**: Editor with table is not considered empty

5. **BR Tags**: Multiple `<br>` tags are considered empty content

6. **Whitespace**: Text nodes with only whitespace are considered empty

7. **Markers**: Selection markers are ignored when checking emptiness

8. **First Child Styles**: Placeholder inherits font-size and line-height from first child if available

9. **RTL Direction**: Placeholder automatically positioned on right for RTL languages

10. **Mode Switching**: Placeholder automatically hides when switching to source mode

## Notes

- Plugin is class-based, extends `Plugin` base class
- Placeholder element has `data-ref="placeholder"` attribute
- Placeholder uses `jodit-placeholder` CSS class for styling
- The placeholder is positioned absolutely and overlays the editor
- Initial `display: none` prevents flash of unstyled content
- Plugin uses event namespacing (`.placeholder`) for clean removal
- The `@debounce` decorator optimizes performance during rapid events
- Placeholder text is localized via `i18n()` for multilingual support
- The plugin checks for markers (selection indicators) when determining emptiness
- Placeholder is removed from DOM when hidden (not just hidden with CSS)
- Style calculation uses `getComputedStyle` for accurate values
- Margins use `Math.max()` to handle both editor and child margins
- Plugin listens to native `input` and `keydown` events on editor element
- The `isEditorEmpty()` function is exported for external use
- Placeholder adapts to first element's typography for visual consistency
- Window load event ensures proper display after full page initialization
- The plugin properly cleans up all event listeners on destruction
- Placeholder element is created once and reused (not recreated on each show)
- The `toggle()` method is the central logic for show/hide decisions
- INSEPARABLE_TAGS constant defines media elements that indicate non-empty state

## Typical Use Case

Users often need visual guidance when starting to edit in an empty editor. The placeholder plugin provides this by:

1. Showing helpful text when editor is empty
2. Automatically hiding when user starts typing
3. Reappearing if user deletes all content
4. Matching the editor's visual style for seamless integration

This improves user experience by:
- Providing clear instructions or context
- Indicating the editor is ready for input
- Maintaining consistent visual language with standard form elements
- Supporting multilingual interfaces through localization