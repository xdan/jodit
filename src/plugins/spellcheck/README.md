# Spellcheck Plugin

Enables or disables browser's native spell checking for the editor. This plugin adds a toolbar button to toggle the `spellcheck` HTML attribute on the editor element, allowing users to control whether the browser highlights spelling errors.

## Features

- Toggle browser spellcheck on/off
- Toolbar button with active state indicator
- Keyboard command support
- Persists across editor mode changes
- Works with browser's native spell checker
- Active state visual feedback
- Multi-place editor support
- Updates on WYSIWYG editor preparation

## Configuration Options

### `spellcheck`

**Type:** `boolean`

**Default:** `false`

Controls whether the editor has its spelling and grammar checked by the browser. When `true`, the browser's native spell checker is enabled and will underline misspelled words.

**Example:**
```typescript
// Enable spellcheck by default
const editor = Jodit.make('#editor', {
    spellcheck: true
});

// Disable spellcheck (default)
const editor2 = Jodit.make('#editor2', {
    spellcheck: false
});
```

## Controls

### `spellcheck` Control

**Icon:** `'spellcheck'`

**Tooltip:** `'Spellcheck'`

**Group:** `'state'`

**Command:** `'toggleSpellcheck'`

Toggles the spellcheck attribute on/off. Shows active state when spellcheck is enabled.

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor', {
    spellcheck: true
});

// Browser will underline misspelled words
// Users can right-click for spelling suggestions
```

### Disable Spellcheck

```typescript
const editor = Jodit.make('#editor', {
    spellcheck: false
});

// No spell checking - browser won't show spelling errors
```

### Toggle via Button

```typescript
const editor = Jodit.make('#editor');

// User clicks Spellcheck button in toolbar
// Spellcheck toggles on/off
// Button shows active state when enabled
```

### Programmatic Toggle

```typescript
const editor = Jodit.make('#editor');

// Enable spellcheck programmatically
editor.execCommand('toggleSpellcheck');

// Toggle again to disable
editor.execCommand('toggleSpellcheck');
```

### Check Current State

```typescript
const editor = Jodit.make('#editor');

// Get current spellcheck state
if (editor.o.spellcheck) {
    console.log('Spellcheck enabled');
} else {
    console.log('Spellcheck disabled');
}
```

### Listen to State Changes

```typescript
const editor = Jodit.make('#editor');

// Listen for toolbar updates (triggered after toggle)
editor.e.on('updateToolbar', () => {
    console.log('Spellcheck state:', editor.o.spellcheck);
});
```

### Enable for Multiple Places

```typescript
const editor = Jodit.make('#editor', {
    spellcheck: true
});

// Add another editing place
editor.addPlace('#second-place');

// Spellcheck automatically applied to new place
```

## How It Works

### Initialization

On plugin `afterInit`:
1. Registers event listeners:
   - `afterInit`: Apply spellcheck on initial load
   - `afterAddPlace`: Apply spellcheck when new place added
   - `prepareWYSIWYGEditor`: Apply spellcheck when WYSIWYG editor prepared
2. Calls `toggleSpellcheck()` to set initial state
3. Registers `toggleSpellcheck` command with handler that:
   - Flips `jodit.o.spellcheck` boolean
   - Calls `toggleSpellcheck()` to apply change
   - Fires `updateToolbar` event to update button state

### Toggle Mechanism

The `toggleSpellcheck()` method:
- Gets current `jodit.o.spellcheck` value
- Sets `spellcheck` HTML attribute on editor element to this value
- Uses `attr(element, 'spellcheck', value)` helper

**Result:**
- When `true`: Editor HTML becomes `<div contenteditable="true" spellcheck="true">`
- When `false`: Editor HTML becomes `<div contenteditable="true" spellcheck="false">`

### Browser Behavior

When `spellcheck="true"`:
- Browser's native spell checker activated
- Misspelled words underlined with red squiggly line (browser-dependent styling)
- Right-click on word shows context menu with spelling suggestions
- Grammar checking may also be enabled (browser-dependent)

When `spellcheck="false"`:
- Browser spell checker deactivated
- No spelling errors highlighted
- No spelling suggestions in context menu

### Button State

The button control's `isActive()` function:
- Returns `editor.o.spellcheck`
- Button shows active visual state when `true`
- Button shows inactive state when `false`

### Multi-Place Support

When editor has multiple places:
- `afterAddPlace` event fires when new place added
- Plugin applies spellcheck setting to new place's editor
- All places have consistent spellcheck state

### Command Registration

The `toggleSpellcheck` command:
1. Toggles `jodit.o.spellcheck` option
2. Calls `toggleSpellcheck()` to update DOM attribute
3. Fires `updateToolbar` event to refresh button state

## Commands

### `toggleSpellcheck`

Toggles the spellcheck state on/off.

**Example:**
```typescript
// Enable spellcheck
editor.execCommand('toggleSpellcheck');

// Disable spellcheck (call again)
editor.execCommand('toggleSpellcheck');

// Or check state first
if (!editor.o.spellcheck) {
    editor.execCommand('toggleSpellcheck');
}
```

## Events

### `updateToolbar`

Plugin fires this event after toggling spellcheck to update button visual state.

**Example:**
```typescript
editor.e.on('updateToolbar', () => {
    console.log('Toolbar updated, spellcheck:', editor.o.spellcheck);
});
```

## Edge Cases

1. **Default Off**: Spellcheck disabled by default to avoid performance issues
2. **Browser Support**: Relies on browser's native spellcheck (all modern browsers)
3. **Language Detection**: Browser auto-detects language from content or uses system language
4. **Grammar Checking**: Some browsers include grammar checking (Chrome, Edge)
5. **Custom Dictionaries**: Uses browser's custom dictionary if configured
6. **No Visual Override**: Cannot customize underline appearance (browser-controlled)
7. **Multiple Places**: All places share same spellcheck state
8. **Mode Changes**: Spellcheck persists across WYSIWYG/source mode switches
9. **Readonly Mode**: Spellcheck still active in readonly mode (browser decides visibility)
10. **iframe Mode**: Works in iframe mode as attribute set on contenteditable element

## Notes

- Plugin is class-based, extends `Plugin` base class
- Uses `@autobind` decorator for method binding
- Button in 'state' toolbar group
- Event namespacing: no explicit namespace (uses default)
- The `toggleSpellcheck()` method uses `attr()` helper
- Spellcheck attribute: HTML5 global attribute
- W3Schools reference: http://www.w3schools.com/tags/att_global_spellcheck.asp
- Language files extended via `extendLang(langs)`
- Button icon: `spellcheck.svg`
- Control config defines `isActive()`, `icon`, `name`, `command`, `tooltip`
- The plugin properly handles multi-place editors
- No cleanup needed on destruction (attribute removal not required)
- Updates on `prepareWYSIWYGEditor` for iframe mode
- The `spellcheck` attribute accepts "true", "false", or "" (default)
- Browser spellcheck triggered on text input/paste
- Suggestions depend on browser and OS language settings
- Cannot override browser's spellcheck dictionary programmatically
- Some browsers support grammar checking beyond spelling
- Mobile browsers may have different spellcheck UX (autocorrect)

## Typical Use Case

Users want to catch spelling errors while typing, similar to word processors. The spellcheck plugin provides this by:

1. Adding Spellcheck button to toolbar
2. Enabling browser's native spell checker
3. Showing red underlines for misspelled words
4. Providing spelling suggestions on right-click
5. Allowing users to toggle spellcheck on/off

This improves user experience by:
- Preventing spelling errors in published content
- Providing familiar spell-checking interface
- Leveraging browser's built-in dictionaries
- Supporting multiple languages automatically
- Allowing users to disable when not needed (e.g., code editing)
- No additional libraries or API calls required