# Sticky Plugin

Makes the toolbar "stick" to the top of the viewport when scrolling, keeping it visible and accessible at all times. This plugin is especially useful for editors with large content where users need constant access to formatting tools.

## Features

- Toolbar remains fixed at top during scroll
- Automatic activation when scrolling past editor
- Configurable top offset for fixed headers
- Mobile device detection and disable option
- Dummy box to prevent content jump (IE)
- Smooth sticky/unsticky transitions
- Width auto-adjustment on resize
- WYSIWYG mode only (no sticky in source mode)
- Toggle event for external listeners
- Sticky state query support

## Configuration Options

### `toolbarSticky`

**Type:** `boolean`

**Default:** `true`

Enables or disables sticky toolbar behavior. When enabled, toolbar becomes fixed to viewport top when scrolling.

**Example:**
```typescript
// Enable sticky toolbar (default)
const editor = Jodit.make('#editor', {
    toolbarSticky: true
});

// Disable sticky toolbar
const editor2 = Jodit.make('#editor2', {
    toolbarSticky: false
});
```

### `toolbarDisableStickyForMobile`

**Type:** `boolean`

**Default:** `true`

When enabled, disables sticky toolbar on mobile devices. Mobile detection based on `sizeSM` config option compared to container width.

**Example:**
```typescript
// Disable sticky on mobile (default)
const editor = Jodit.make('#editor', {
    toolbarDisableStickyForMobile: true
});

// Enable sticky on mobile too
const editor2 = Jodit.make('#editor2', {
    toolbarDisableStickyForMobile: false
});
```

### `toolbarStickyOffset`

**Type:** `number`

**Default:** `0` (pixels)

Top offset for sticky toolbar position. Useful when site has fixed header that would otherwise cover the toolbar.

**Example:**
```typescript
// No offset (default)
const editor1 = Jodit.make('#editor1', {
    toolbarStickyOffset: 0
});

// 100px offset for fixed site header
const editor2 = Jodit.make('#editor2', {
    toolbarStickyOffset: 100
});

// Joomla example with admin bar
const editor3 = Jodit.make('#editor3', {
    toolbarSticky: true,
    toolbarStickyOffset: 50  // Height of Joomla admin bar
});
```

## Usage Examples

### Basic Sticky Toolbar

```typescript
const editor = Jodit.make('#editor', {
    toolbarSticky: true
});

// Toolbar sticks to top when scrolling past editor
// User always has access to formatting buttons
```

### Disable Sticky

```typescript
const editor = Jodit.make('#editor', {
    toolbarSticky: false
});

// Toolbar scrolls away with content
// Normal inline toolbar behavior
```

### With Fixed Site Header

```typescript
// Site has 60px fixed header at top
const editor = Jodit.make('#editor', {
    toolbarSticky: true,
    toolbarStickyOffset: 60
});

// Toolbar sticks 60px from top
// Doesn't hide behind site header
```

### Enable Sticky on Mobile

```typescript
const editor = Jodit.make('#editor', {
    toolbarSticky: true,
    toolbarDisableStickyForMobile: false
});

// Sticky works on all devices including mobile
```

### Disable Sticky on Mobile Only

```typescript
const editor = Jodit.make('#editor', {
    toolbarSticky: true,
    toolbarDisableStickyForMobile: true  // Default
});

// Sticky on desktop, normal on mobile
```

### Listen to Sticky State Changes

```typescript
const editor = Jodit.make('#editor', {
    toolbarSticky: true
});

editor.e.on('toggleSticky', (isSticky) => {
    if (isSticky) {
        console.log('Toolbar is now sticky');
    } else {
        console.log('Toolbar is normal');
    }
});
```

### Query Current Sticky State

```typescript
const editor = Jodit.make('#editor');

// Check if toolbar is currently stuck
const isStuck = editor.e.fire('getStickyState');
console.log('Is toolbar stuck?', isStuck);
```

### Large Content Example

```typescript
const editor = Jodit.make('#editor', {
    toolbarSticky: true,
    toolbarStickyOffset: 0,
    height: 800
});

// User types long document
// Scrolls down to edit bottom sections
// Toolbar remains visible at top for formatting
```

## How It Works

### Initialization

On plugin `afterInit`:
1. Registers scroll/resize event listeners on owner window:
   - `scroll.sticky` - Window scroll
   - `wheel.sticky` - Mouse wheel
   - `mousewheel.sticky` - Legacy mouse wheel
   - `resize.sticky` - Window resize
2. Registers `getStickyState` event handler (returns `__isToolbarStuck`)
3. All scroll handlers throttled for performance

### Scroll Detection

The `__onScroll()` method (throttled):

1. **Check Conditions:**
   - `toolbarSticky` must be enabled
   - `toolbar` must exist
   - Editor must be in WYSIWYG mode (not source)

2. **Calculate Positions:**
   - `scrollWindowTop`: Current scroll position (window.pageYOffset or documentElement.scrollTop)
   - `offsetEditor`: Editor container position relative to document

3. **Determine Sticky State:**
   - Should be sticky if ALL true:
     - Editor is in WYSIWYG mode
     - Scroll position + offset > editor top (scrolled past editor start)
     - Scroll position + offset < editor top + height (not scrolled past editor end)
     - NOT (mobile disable enabled AND is mobile device)

4. **Apply or Remove Sticky:**
   - If state changed: call `addSticky()` or `removeSticky()`
   - Fire `toggleSticky` event with new state

### Add Sticky

The `addSticky()` method:
1. If not already stuck:
   - Creates dummy box (IE only) if needed
   - Adds `.jodit_sticky` class to container
   - Sets `__isToolbarStuck = true`
2. Always (even if already stuck):
   - Sets toolbar `top` CSS to `toolbarStickyOffset` (or null if 0)
   - Sets toolbar `width` to container width - 2px (for borders)
   - Sets dummy box `height` to toolbar height (prevents content jump)

### Remove Sticky

The `removeSticky()` method:
1. Returns if not stuck (no-op)
2. Clears toolbar CSS:
   - Sets `width` to empty string (auto)
   - Sets `top` to empty string (auto)
3. Removes `.jodit_sticky` class from container
4. Sets `__isToolbarStuck = false`

### Mobile Detection

The `__isMobile()` method:
- Returns true if: `editor.options.sizeSM >= editor.container.offsetWidth`
- `sizeSM` default is 768px (typical mobile breakpoint)
- Detects narrow viewports as mobile

### Dummy Box (IE)

For old Internet Explorer (non-ES-next):
- Creates invisible dummy div: `.jodit_sticky-dummy_toolbar`
- Inserted before toolbar in container
- Height set to match toolbar height
- Prevents content jump when toolbar becomes fixed
- Not needed in modern browsers (handled by CSS)

### CSS Classes

When sticky active:
- Container gets `.jodit_sticky` class
- CSS sets toolbar `position: fixed` and `z-index`
- Width and top applied inline for precise control

### Width Management

Toolbar width recalculated:
- On every sticky state change
- On window resize (via scroll handler)
- Set to `container.offsetWidth - 2` (accounts for 2px borders)
- Ensures toolbar doesn't overflow container

### Throttling

The `__onScroll` method decorated with `@throttle()`:
- Uses default throttle delay
- Prevents excessive calculations during scroll
- Improves performance, especially on mobile

### Cleanup

On `beforeDestruct`:
- Removes dummy box from DOM
- Unregisters all `.sticky` namespaced events
- Removes all event listeners from owner window

## Events

### `toggleSticky`

Fired when sticky state changes (activated or deactivated).

**Parameters:**
- `doSticky` (boolean): `true` if toolbar became sticky, `false` if unstuck

**Example:**
```typescript
editor.e.on('toggleSticky', (isSticky) => {
    console.log('Sticky state changed:', isSticky);
    if (isSticky) {
        // Toolbar is now fixed to top
    } else {
        // Toolbar returned to normal position
    }
});
```

### `getStickyState`

Query event to check current sticky state.

**Returns:** `boolean` - Current sticky state

**Example:**
```typescript
const isStuck = editor.e.fire('getStickyState');
if (isStuck) {
    console.log('Toolbar is currently sticky');
}
```

## Edge Cases

1. **Source Mode**: Sticky disabled when editor in source mode (only WYSIWYG)
2. **No Toolbar**: Plugin does nothing if `toolbar: false` in config
3. **Mobile**: Automatically disabled on mobile if `toolbarDisableStickyForMobile: true`
4. **Editor Top**: Sticky only activates when scrolled past editor start
5. **Editor Bottom**: Sticky deactivates when scrolled past editor end
6. **Resize**: Toolbar width recalculated on window resize
7. **Multiple Editors**: Each editor has independent sticky state
8. **Fixed Headers**: Use `toolbarStickyOffset` to avoid overlap
9. **IE Dummy Box**: Only created in old IE to prevent content jump
10. **Scroll Events**: Throttled to prevent performance issues

## Notes

- Plugin is class-based, extends `Plugin` base class
- Uses `@throttle` decorator for scroll handler
- Event namespacing: `.sticky` for clean removal
- CSS class: `.jodit_sticky` on container when active
- Dummy box class: `.jodit_sticky-dummy_toolbar` (IE only)
- Mobile detection via `sizeSM` config (default 768px)
- Width calculation: `container.offsetWidth - 2` (for borders)
- Top position: `toolbarStickyOffset` or null
- Sticky only in WYSIWYG mode, not in source/split modes
- The `NEED_DUMMY_BOX` constant checks for IE (!IS_ES_NEXT && IS_IE)
- Scroll position calculated with fallback chain
- Uses `offset()` helper to get editor position
- The `addSticky` and `removeSticky` methods are public
- Scroll events: scroll, wheel, mousewheel, resize
- All attached to owner window (`jodit.ow`)
- The plugin properly cleans up dummy box on destruction
- Toolbar container accessed via `jodit.toolbarContainer`
- The `__isToolbarStuck` flag tracks current state
- State change only triggers if different from current
- Width set on every sticky application (handles resize)
- Top offset can be 0 for no offset (null in CSS)
- The `css()` helper used for inline style manipulation
- The `Dom.safeRemove()` safely removes dummy box
- Sticky state fires event for external integrations
- Query event allows checking state without direct access

## Typical Use Case

Users working with long documents need constant access to formatting tools. The sticky plugin provides this by:

1. Keeping toolbar visible at top when scrolling
2. Preventing need to scroll back up for formatting
3. Supporting site layouts with fixed headers via offset
4. Automatically disabling on mobile to save screen space
5. Smooth activation/deactivation as user scrolls

This improves user experience by:
- Maintaining access to all editor functions while scrolling
- Reducing vertical scrolling to reach toolbar
- Adapting to site layout with offset option
- Respecting mobile viewport constraints
- Providing consistent formatting access in long documents