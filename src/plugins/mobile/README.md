# Mobile Plugin

Provides adaptive toolbar and mobile touch emulation for the Jodit editor. This plugin automatically adjusts the toolbar button set based on editor width, hiding overflow buttons under a "dots" menu, and emulates tap events for better mobile device support.

## Features

- Adaptive toolbar that responds to editor width
- Breakpoint-based button sets (XS, SM, MD, LG)
- Overflow button menu ("dots" button)
- Touch event emulation for mobile devices
- Tap-to-place-cursor functionality
- Automatic toolbar rebuilding on resize
- Customizable button sets per breakpoint
- Diff button calculation for overflow menu
- Window resize monitoring

## Configuration Options

### `toolbarAdaptive`

**Type:** `boolean`

**Default:** `true`

Enables adaptive toolbar that changes button sets based on editor width. When `true`, the toolbar automatically switches between `buttonsXS`, `buttonsSM`, `buttonsMD`, and `buttons` based on the editor's container width.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    toolbarAdaptive: true
});
```

### `mobileTapTimeout`

**Type:** `number`

**Default:** `300`

Timeout in milliseconds for emulating tap event on mobile devices. When a user taps within this timeout window after a previous tap, the cursor is placed at the tap location.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    mobileTapTimeout: 500  // 500ms tap timeout
});
```

### `buttonsMD`

**Type:** `ButtonsOption`

**Default:** Configured button groups (font-style, list, font, media, state, insert, indent, color, history, other, dots)

Button set displayed when editor width is ≥ `sizeMD` (usually 768px). Includes most toolbar groups with empty button arrays (uses default buttons from groups).

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    buttonsMD: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'ul',
        'ol',
        'link',
        'dots'
    ]
});
```

### `buttonsSM`

**Type:** `ButtonsOption`

**Default:** Configured button groups (font-style, list, font, state, indent, color, history, dots)

Button set displayed when editor width is ≥ `sizeSM` (usually 576px) and < `sizeMD`. Fewer groups than medium size.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    buttonsSM: [
        'bold',
        'italic',
        'underline',
        'ul',
        'ol',
        'dots'
    ]
});
```

### `buttonsXS`

**Type:** `ButtonsOption`

**Default:** Configured button groups (font-style, list, font, color, dots)

Button set displayed when editor width is < `sizeSM`. Minimal button set for very small screens.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    buttonsXS: [
        'bold',
        'italic',
        'dots'
    ]
});
```

## Usage Examples

### Basic Adaptive Toolbar

```typescript
const editor = Jodit.make('#editor', {
    toolbarAdaptive: true
});

// Toolbar automatically adjusts based on container width
```

### Custom Button Sets for Each Breakpoint

```typescript
const editor = Jodit.make('#editor', {
    toolbarAdaptive: true,
    buttons: [
        'bold', 'italic', 'underline', 'strikethrough',
        'superscript', 'subscript', 'ul', 'ol',
        'align', 'link', 'image'
    ],
    buttonsMD: [
        'bold', 'italic', 'underline',
        'ul', 'ol', 'link', 'dots'
    ],
    buttonsSM: [
        'bold', 'italic', 'ul', 'ol', 'dots'
    ],
    buttonsXS: [
        'bold', 'italic', 'dots'
    ]
});
```

### Disable Adaptive Toolbar

```typescript
const editor = Jodit.make('#editor', {
    toolbarAdaptive: false
});

// Toolbar always shows all buttons regardless of width
```

### Custom Tap Timeout

```typescript
const editor = Jodit.make('#editor', {
    mobileTapTimeout: 400  // Longer timeout for tap detection
});
```

### Disable Tap Emulation

```typescript
const editor = Jodit.make('#editor', {
    mobileTapTimeout: 0  // Disable tap-to-place-cursor
});
```

### Mobile-Optimized Configuration

```typescript
const editor = Jodit.make('#editor', {
    toolbarAdaptive: true,
    mobileTapTimeout: 350,
    buttonsXS: [
        'bold', 'italic', 'underline',
        'dots'
    ],
    buttonsSM: [
        'bold', 'italic', 'underline',
        'ul', 'ol', 'link',
        'dots'
    ],
    buttonsMD: [
        'bold', 'italic', 'underline', 'strikethrough',
        'ul', 'ol', 'link', 'image',
        'align', 'undo', 'redo',
        'dots'
    ]
});
```

### Button Groups Configuration

```typescript
const editor = Jodit.make('#editor', {
    toolbarAdaptive: true,
    buttonsMD: [
        {
            group: 'font-style',
            buttons: ['bold', 'italic', 'underline']
        },
        {
            group: 'list',
            buttons: ['ul', 'ol']
        },
        '---',  // Separator
        'dots'
    ]
});
```

### Disable via Plugin System

```typescript
const editor = Jodit.make('#editor', {
    disablePlugins: ['mobile']
});

// Mobile plugin completely disabled
```

## How It Works

### Adaptive Toolbar System

The plugin monitors editor width and switches button sets at breakpoints:

1. **Width Detection**: Measures `editor.container.parentElement.offsetWidth`
2. **Breakpoint Evaluation**:
   - Fullsize or ≥ `sizeLG`: Uses `buttons` (default full set)
   - ≥ `sizeMD`: Uses `buttonsMD`
   - ≥ `sizeSM`: Uses `buttonsSM`
   - < `sizeSM`: Uses `buttonsXS`
3. **Toolbar Rebuild**: If button set changed, rebuilds toolbar with new buttons
4. **Overflow Handling**: Buttons not in current set appear under "dots" button

### Resize Event Handling

The plugin listens to multiple events:

- **`resize`**: Editor container resized
- **`afterInit`**: Initial setup after editor creation
- **`recalcAdaptive`**: Manual recalculation trigger
- **`changePlace`**: Editor moved to different location
- **`afterAddPlace`**: New place added
- **Window `resize`**: Browser window resized
- **Window `load`**: Page finished loading

### Tap Emulation

For mobile touch devices:

1. **Touch Detection**: Listens to `touchend` events
2. **Time Tracking**: Records timestamp of each touch
3. **Tap Recognition**: If two touches occur within `mobileTapTimeout * 1.5`, it's a tap
4. **Cursor Placement**: Places cursor at `(e.clientX, e.clientY)` position
5. **Timeout Reset**: Updates timeout after each valid tap

The tap logic:
```javascript
const diff = now - timeout;
if (diff > mobileTapTimeout && diff < mobileTapTimeout * 1.5) {
    editor.s.insertCursorAtPoint(e.clientX, e.clientY);
}
```

### Dots Button Popup

The "dots" control shows overflow buttons:

1. **Diff Calculation**: Fires `getDiffButtons.mobile` event to find buttons not in current set
2. **Popup Toolbar**: Creates separate toolbar collection for overflow menu
3. **Button Filtering**: Shows only buttons from full set not in current adaptive set
4. **Width Calculation**: Popup width based on first button width: `(w + 4) * 3 + 'px'`
5. **Rebuild on Open**: Recalculates overflow buttons each time popup opens

### Button Diffing

The plugin calculates which buttons to show in dots menu:

1. **Flatten Current**: Converts current button set to flat Set of button names
2. **Flatten Store**: Converts stored adaptive button set to flat Set
3. **Reduce Diff**: Filters buttons present in current but not in adaptive set
4. **Return Array**: Returns difference as array for dots popup

### Events

#### `getDiffButtons.mobile`

Fired to get buttons that should appear in dots popup (buttons in full set but not in current adaptive set).

**Parameters:**
- `toolbar`: The toolbar collection requesting diff buttons

**Returns:** `ButtonsGroups` - Array of buttons not in current adaptive set

**Example:**
```typescript
editor.e.on('getDiffButtons.mobile', (toolbar) => {
    console.log('Calculating overflow buttons for toolbar', toolbar);
});
```

#### `recalcAdaptive`

Fired to trigger adaptive toolbar recalculation. Plugin listens to this event and rebuilds toolbar based on current width.

**Example:**
```typescript
// Manually trigger recalculation
editor.e.fire('recalcAdaptive');
```

## Controls

### `dots` Control

**Mode:** `MODE_SOURCE + MODE_WYSIWYG`

**Popup:** Dynamic toolbar with overflow buttons

**Tooltip:** `'Show all'`

Shows a popup toolbar containing buttons that don't fit in the current adaptive button set. The popup content is dynamically calculated based on the difference between full button set and current adaptive set.

## Edge Cases

1. **No Toolbar**: If `toolbar` option is `false`, adaptive behavior is skipped

2. **Fullsize Mode**: When editor is fullsize, always uses full `buttons` set regardless of width

3. **Store Comparison**: Uses `toString()` comparison to detect button set changes (avoids unnecessary rebuilds)

4. **Popup Closure**: All popups are closed before toolbar rebuild (`closeAllPopups`)

5. **Extra Buttons**: `extraButtons` are always appended to adaptive button set

6. **Remove Buttons**: `removeButtons` are applied after selecting adaptive set

7. **Touch Events**: Tap emulation only works with `touchend` events that have `changedTouches`

8. **Timeout Window**: Tap must occur between `mobileTapTimeout` and `mobileTapTimeout * 1.5` after previous tap

9. **Parent Width**: Uses parent element width if available, falls back to container width

10. **Empty Button Groups**: Default button configs use empty `buttons: []` arrays (filled with group defaults)

## Notes

- Plugin is functional (not class-based), registered via `pluginSystem.add()`
- Adaptive toolbar requires `toolbarAdaptive: true` to be enabled
- The "dots" button is automatically added to adaptive button sets
- Button sets are evaluated in order: XS → SM → MD → LG (full)
- Default button configurations use button groups with empty arrays
- Tap emulation helps place cursor on mobile devices where click events may not work reliably
- The plugin closes all popups before rebuilding toolbar to prevent orphaned popups
- Toolbar rebuild is triggered by both editor resize and window resize events
- The `getDiffButtons.mobile` event allows other code to know which buttons are in overflow
- Store comparison using `toString()` is efficient but may not detect deep object changes
- Popup width calculation assumes buttons are roughly 36px wide
- The tap timeout range is `[mobileTapTimeout, mobileTapTimeout * 1.5]`
- Setting `mobileTapTimeout` to `0` disables tap emulation
- Button groups use separators: `'---'` (horizontal), `'\n'` (line break), `'|'` (vertical)
- The plugin works on both desktop (responsive) and mobile devices
- Extra buttons are always visible, even in smallest breakpoint
- Remove buttons work across all breakpoints

## Typical Use Case

The mobile plugin solves two key problems:

1. **Responsive Toolbar**: Automatically adapts toolbar for different screen sizes, ensuring usability on mobile devices and narrow desktop layouts
2. **Mobile Touch**: Emulates tap events to place cursor accurately on touch devices where native cursor placement may be unreliable

Users on small screens see only essential buttons (bold, italic, dots), while desktop users see the full toolbar. Overflow buttons remain accessible via the dots menu.