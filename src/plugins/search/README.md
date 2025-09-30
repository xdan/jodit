# Search Plugin

Provides find and replace functionality with a visual dialog interface. This plugin allows users to search for text in the editor, navigate between matches, and replace occurrences.

![search](https://user-images.githubusercontent.com/794318/34545433-cd0a9220-f10e-11e7-8d26-7e22f66e266d.gif)

## Features

- Visual search dialog with input fields
- Find text with highlighting
- Find next/previous navigation
- Replace functionality
- Match counter display
- Custom fuzzy search algorithm support
- LazyWalker for performance
- CSS Custom Highlight API support
- Auto-scrolling to matches
- Keyboard shortcuts
- Toolbar button with dropdown
- Search results caching
- Event-driven architecture

## Configuration Options

### `useSearch`

**Type:** `boolean`

**Default:** `true`

Enables or disables the search plugin entirely.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    useSearch: false
});
```

### `search.lazyIdleTimeout`

**Type:** `number`

**Default:** `0` (milliseconds)

Timeout for LazyWalker idle state during search. Higher values improve performance for large documents by spreading search work across frames.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    search: {
        lazyIdleTimeout: 100  // 100ms idle timeout
    }
});
```

### `search.useCustomHighlightAPI`

**Type:** `boolean`

**Default:** `true` if browser supports `CSS.highlights`, otherwise `false`

Uses browser's native CSS Custom Highlight API for highlighting matches instead of wrapping text in spans.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    search: {
        useCustomHighlightAPI: true
    }
});
```

### `search.fuzzySearch`

**Type:** `FuzzySearch`

**Default:** `undefined` (uses built-in fuzzy search)

Custom function to search for strings within text. Must implement the `FuzzySearch` interface: `(needle: string, haystack: string, offset: number) => [index: number, length: number]`.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    search: {
        fuzzySearch: (needle, haystack, offset) => {
            // Case-insensitive search
            const index = haystack.toLowerCase().indexOf(needle.toLowerCase(), offset);
            return [index, needle.length];
        }
    }
});
```

## Controls

### `find` Control

**Icon:** `'search'`

**Tooltip:** `'Find'`

**Group:** `'search'`

**Dropdown List:**
- `search`: "Find" - Opens search dialog
- `findNext`: "Find Next" - Finds next match
- `findPrevious`: "Find Previous" - Finds previous match
- `replace`: "Replace" - Opens replace dialog

Opens search/replace dialog or navigates through matches.

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor');
// Click Find button in toolbar
// Enter search query
// Use navigation buttons
```

### Disable Search

```typescript
const editor = Jodit.make('#editor', {
    useSearch: false
});
// or
const editor2 = Jodit.make('#editor2', {
    disablePlugins: ['search']
});
```

### Programmatic Search

```typescript
const editor = Jodit.make('#editor');
editor.value = '<p>this text contains some text</p>';

// Find and select first match
editor.e.fire('search', 'some text').then(() => {
    console.log('Selected!');
});
```

### Find Next/Previous

```typescript
const editor = Jodit.make('#editor');
editor.value = '<p>this text contains some text and some text</p>';

// Find first match
editor.e.fire('search', 'some text').then(() => {
    console.log('First match selected');

    // Find next match
    editor.e.fire('searchNext', 'some text').then(() => {
        console.log('Second match selected');
    });
});
```

### Open Search Dialog

```typescript
const editor = Jodit.make('#editor');

// Open search dialog
editor.execCommand('openSearchDialog');

// Open replace dialog
editor.execCommand('openReplaceDialog');
```

### Custom Fuzzy Search

```typescript
const editor = Jodit.make('#editor', {
    search: {
        fuzzySearch: (needle, haystack, offset) => {
            // Exact match only
            const index = haystack.indexOf(needle, offset);
            return [index, needle.length];
        }
    }
});
```

### Listen to Search Events

```typescript
const editor = Jodit.make('#editor');

editor.e.on('afterFindAndSelect', () => {
    console.log('Match selected');
});

editor.e.on('afterFindAndReplace', () => {
    console.log('Text replaced');
});
```

### Performance Tuning

```typescript
const editor = Jodit.make('#editor', {
    search: {
        lazyIdleTimeout: 200  // Spread search across frames
    }
});
```

## How It Works

### Search Dialog

The plugin provides a UI with:
- Search input field
- Replace input field (in replace mode)
- Find Next button
- Find Previous button
- Replace button
- Match counter (e.g., "1 of 5")

### Search Process

1. **Input Query**: User types in search field
2. **Find Matches**: Plugin walks DOM tree to find all occurrences
3. **Highlight**: Wraps matches in spans or uses Highlight API
4. **Cache Results**: Stores found ranges for reuse
5. **Navigate**: User clicks next/previous to cycle through matches
6. **Select**: Current match is selected in editor
7. **Scroll**: Editor scrolls to make selected match visible

### LazyWalker

For performance, search uses `LazyWalker`:
- Processes DOM nodes incrementally
- Yields to browser between chunks
- Prevents UI freezing on large documents
- Respects `lazyIdleTimeout` for frame splitting

### Match Finding

The `SentenceFinder` class:
1. Collects text nodes from editor
2. Builds continuous text content
3. Applies fuzzy search algorithm
4. Returns array of `ISelectionRange` for matches

### Highlighting Methods

**CSS Custom Highlight API** (`useCustomHighlightAPI: true`):
- Uses browser's native `CSS.highlights`
- No DOM modification
- Better performance
- Limited browser support

**Span Wrapping** (`useCustomHighlightAPI: false`):
- Wraps matches in `<span>` with `jd-tmp-selection` attribute
- Works in all browsers
- Cleaned up via `clearSelectionWrappers()`
- Removed from HTML output via `afterGetValueFromEditor` event

### Replace Operation

When replacing:
1. **Find Match**: Locates current match in ranges
2. **Delete Content**: Removes match text from range
3. **Insert Replacement**: Inserts new text node
4. **Clear Highlights**: Removes all highlight wrappers
5. **Set Cursor**: Positions cursor after replacement
6. **Re-search**: Finds matches again with updated content
7. **Sync**: Updates editor value

### Caching

Search results cached by query string:
- Key: search query
- Value: Promise<ISelectionRange[]>
- Invalidated on editor change
- Validation checks node connectivity

### Navigation

**Find Next:**
- Increments current index
- Wraps to 0 at end
- Selects range at new index
- Scrolls into view

**Find Previous:**
- Decrements current index
- Wraps to last at beginning
- Selects range at new index
- Scrolls into view

## Commands

### `openSearchDialog`

Opens the search dialog.

**Syntax:**
```typescript
editor.execCommand('openSearchDialog')
```

**Example:**
```typescript
editor.execCommand('openSearchDialog');
```

### `openReplaceDialog`

Opens the replace dialog (search dialog with replace field).

**Syntax:**
```typescript
editor.execCommand('openReplaceDialog')
```

**Example:**
```typescript
editor.execCommand('openReplaceDialog');
```

## Events

### `search`

Fired to find and select first match of query.

**Parameters:**
- `query` (string): Text to search for

**Returns:** Promise<boolean>

**Example:**
```typescript
editor.e.fire('search', 'hello').then((found) => {
    console.log(found ? 'Found' : 'Not found');
});
```

### `searchNext`

Fired to find and select next match.

**Parameters:**
- `query` (string, optional): Text to search for

**Example:**
```typescript
editor.e.fire('searchNext', 'hello');
```

### `searchPrevious`

Fired to find and select previous match.

**Parameters:**
- `query` (string, optional): Text to search for

**Example:**
```typescript
editor.e.fire('searchPrevious', 'hello');
```

### `afterFindAndSelect`

Fired after a match is selected.

**Example:**
```typescript
editor.e.on('afterFindAndSelect', () => {
    console.log('Match selected');
});
```

### `afterFindAndReplace`

Fired after text is replaced.

**Example:**
```typescript
editor.e.on('afterFindAndReplace', () => {
    console.log('Text replaced');
});
```

## Edge Cases

1. **Empty Query**: Returns empty results array

2. **No Matches**: Dialog shows "0 of 0"

3. **Query Change**: Clears highlights and re-searches

4. **Editor Change**: Invalidates cache

5. **Mode Switch**: Closes dialog on mode change

6. **Dialog Close**: Clears highlights and resets counters

7. **Node Disconnection**: Cache validation checks node connectivity

8. **Click in Editor**: Resets current index

9. **Large Documents**: LazyWalker prevents UI freezing

10. **Selection State**: Saved/restored during operations

## Notes

- Plugin is class-based, extends `Plugin` base class
- Uses `@watch`, `@autobind`, `@cache`, `@cached` decorators
- Search button in 'search' toolbar group
- Custom UI class `UISearch` for dialog
- Event namespacing `.search` for clean removal
- Cache stored as IDictionary keyed by query
- LazyWalker instances: `walker` (main), `walkerCount` (counting)
- The `SentenceFinder` class handles text node traversal
- Highlight wrappers have `jd-tmp-selection` attribute
- CSS Custom Highlight API check: `typeof globalWindow.Highlight !== 'undefined'`
- Cleanup via `clearSelectionWrappers()` and `clearSelectionWrappersFromHTML()`
- Drawing highlights uses `requestAnimationFrame` for performance
- Batch size: 5 ranges per frame
- The `highlightTextRanges()` helper creates highlight spans
- Current index is 1-based for display (0-based internally)
- The plugin properly cleans up event listeners on destruction
- Replace updates cursor position after insertion
- Scroll uses `scrollIntoViewIfNeeded()` helper
- Find operations return Promises for async completion
- The `findCurrentIndexInRanges()` method matches current selection
- Cache invalidation on change event
- Debounced counter updates on keydown/mousedown
- Selection info stored in `ui.selInfo`
- The `tryScrollToElement()` method handles scroll for matches
- Counter updates triggered via `ui:needUpdateCounters` event
- Replace triggered via `ui:pressReplaceButton` event
- The `wrapFrameRequest` tracks animation frame ID
- Previous query tracked to detect query changes
- Draw promise allows waiting for highlight completion

## Typical Use Case

Users need to locate specific text in documents and optionally replace it. The search plugin provides this by:

1. Providing visual search dialog
2. Highlighting all matches in editor
3. Showing match count (e.g., "3 of 15")
4. Allowing navigation between matches
5. Supporting find and replace operations

This improves user experience by:
- Making text easy to locate visually
- Supporting keyboard-driven workflow
- Handling large documents efficiently
- Providing familiar find/replace interface
- Auto-scrolling to matches