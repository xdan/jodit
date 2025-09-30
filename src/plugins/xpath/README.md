# XPath Plugin

Displays element hierarchy path in status bar showing breadcrumb trail from current cursor position to root. Clicking path items selects elements, right-click provides context menu.

## Features

- Breadcrumb path in status bar
- Shows element hierarchy from cursor to root
- Click element name to select it
- Right-click for context menu (Remove/Select)
- Select All button
- Updates on selection change
- XPath-based element identification
- WYSIWYG mode only

## Configuration Options

### `showXPathInStatusbar`

**Type:** `boolean`

**Default:** `true`

Show/hide the XPath breadcrumb trail in status bar.

**Example:**
```typescript
// Show XPath (default)
const editor1 = Jodit.make('#editor1', {
    showXPathInStatusbar: true
});

// Hide XPath
const editor2 = Jodit.make('#editor2', {
    showXPathInStatusbar: false
});
```

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor');

// Type in: <div><p><strong>text|</strong></p></div>
// Status bar shows: [Select All] body > div > p > strong
// Click "p" to select paragraph
// Click "div" to select div
```

### Context Menu

```typescript
const editor = Jodit.make('#editor');

// Right-click on any element name in path
// Menu shows:
//   - Remove (or Clear if body)
//   - Select
```

### Disable XPath

```typescript
const editor = Jodit.make('#editor', {
    showXPathInStatusbar: false
});
// Status bar shows no path
```

## How It Works

### Path Calculation

On these events: `mouseup`, `change`, `keydown`, `changeSelection`:

1. Gets current selection node
2. Walks up DOM tree to editor root
3. For each element:
   - Gets tag name (e.g., `p`, `div`)
   - Calculates XPath (e.g., `/div[1]/p[2]`)
   - Creates clickable breadcrumb item
4. Inserts items in reverse order (root → current)
5. Prepends "Select All" button

**Example Path:**
```
[Select All] div > p > strong
```

### Element Selection

Click on path item:
- Uses stored XPath to find element via `document.evaluate()`
- Selects element with `jodit.s.select(element)`
- Returns focus to editor

### Context Menu

Right-click on path item opens menu with:
- **Remove**: Deletes element (or clears content if root)
- **Select**: Selects element

### Select All Button

- Always present as first item
- Executes `selectall` command
- Styled as tiny button

## Edge Cases

1. **Source Mode**: Path hidden in source mode, only "Select All" shown
2. **Empty Editor**: Shows only "Select All" button
3. **Text Nodes**: Skipped, only element nodes shown
4. **Comment Nodes**: Skipped
5. **XPath Failure**: Falls back to direct element selection
6. **Mode Switch**: Recalculates path or hides based on mode
7. **Debounced**: Updates debounced by `2 * defaultTimeout` for performance

## Typical Use Case

Users editing complex nested HTML need to see document structure and quickly select parent elements. The xpath plugin provides this by showing clickable breadcrumb trail allowing selection of any ancestor element with single click.