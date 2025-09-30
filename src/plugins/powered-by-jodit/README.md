# Powered By Jodit Plugin

Displays a "Powered by Jodit" link in the editor's status bar. This plugin adds attribution to the Jodit project when status bar features are enabled.

## Features

- Adds "Powered by Jodit" link to status bar
- Opens link in new tab to https://xdsoft.net/jodit/
- Only shows when status bar is visible
- Conditional display based on status bar features
- Can be hidden via configuration
- Aligned to right side of status bar
- Uses uppercase text styling

## Configuration Options

### `hidePoweredByJodit`

**Type:** `boolean`

**Default:** `false` (implicitly, not set in Config.prototype)

When `true`, hides the "Powered by Jodit" link from the status bar. When `false` or not set, the link is shown if conditions are met.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    hidePoweredByJodit: true  // Hide the link
});
```

## Usage Examples

### Show Powered By Link

```typescript
const editor = Jodit.make('#editor', {
    showCharsCounter: true,  // Enable status bar feature
    hidePoweredByJodit: false  // Show link (default)
});
// Status bar will display: "Characters: 0 | Powered by Jodit"
```

### Hide Powered By Link

```typescript
const editor = Jodit.make('#editor', {
    showWordsCounter: true,  // Enable status bar
    hidePoweredByJodit: true  // Hide link
});
// Status bar will display: "Words: 0" (no Jodit link)
```

### With Multiple Status Bar Features

```typescript
const editor = Jodit.make('#editor', {
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: true
});
// Shows all counters plus "Powered by Jodit" link
```

### Inline Editor (No Link)

```typescript
const editor = Jodit.make('#editor', {
    inline: true,
    showCharsCounter: true
});
// Inline editors never show the link
```

## How It Works

### Display Conditions

The plugin shows the link only when **ALL** of these conditions are met:

1. **Not Hidden**: `hidePoweredByJodit` is `false` or not set
2. **Not Inline**: Editor is not in inline mode (`inline: false`)
3. **Status Bar Active**: At least one of these options is `true`:
   - `showCharsCounter`
   - `showWordsCounter`
   - `showXPathInStatusbar`

If any condition fails, the link is not displayed.

### Link Insertion

When conditions are met:

1. **Status Hook**: Waits for `ready` status via `hookStatus('ready')`
2. **HTML Creation**: Creates anchor element with:
   - Text: "POWERED BY JODIT" (uppercase via CSS)
   - Link: https://xdsoft.net/jodit/
   - Target: `_blank` (opens in new tab)
   - Class: `jodit-status-bar-link`
   - Tab index: `-1` (not in tab order)
3. **Append**: Adds to status bar with `append(element, true)`
   - Second parameter `true` means append to right side

### Status Bar Position

The link appears on the right side of the status bar, after all other status bar elements (counters, path display, etc.).

## Edge Cases

1. **Inline Mode**: Link never shows in inline editors, regardless of other settings

2. **No Status Bar**: If all status bar features are disabled, link doesn't show (status bar itself is hidden)

3. **Hidden Setting**: `hidePoweredByJodit: true` always prevents display

4. **Dynamic Enabling**: If status bar features are enabled after initialization, link won't appear (plugin runs once on init)

5. **Status Ready**: Plugin waits for `ready` status before appending link

6. **Multiple Editors**: Each editor instance can have its own link (or not)

## Notes

- Plugin is functional (not class-based), registered via `pluginSystem.add()`
- The link uses uppercase text via inline CSS (`text-transform: uppercase`)
- Link has `tabindex="-1"` to prevent keyboard focus
- The `target="_blank"` opens link in new tab/window
- Status bar must be visible (at least one counter enabled) for link to show
- Inline editors never have status bars, so never show the link
- The condition check uses type assertion `(o as any)` for status bar options
- Plugin uses `hookStatus('ready')` to ensure status bar is initialized
- The second parameter of `statusbar.append(element, true)` places link on right
- Class `jodit-status-bar-link` can be styled via CSS
- The link URL points to the official Jodit website
- Plugin has no configuration options for link text or URL customization
- The plugin runs once during editor initialization
- No events are fired by this plugin
- The plugin has no cleanup logic (link removed when editor destructed)

## Typical Use Case

This plugin provides attribution to the Jodit project in editors that have visible status bars. It:

1. Acknowledges the open-source project
2. Provides easy access to Jodit documentation
3. Only appears when status bar is already visible
4. Can be disabled by users who prefer not to show it

Users can disable it with `hidePoweredByJodit: true` if they don't want the attribution link.