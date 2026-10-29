---
title: Tab Plugin
description: Handles the Tab and Shift+Tab keys inside list items to indent and outdent them, creating or removing nested sublists while preserving the cursor, and optionally inserts spaces for Tab elsewhere.
keywords: jodit, tab plugin, list indent, nested list, outdent, sublist, tab spaces
---

# Tab Plugin

Handles Tab key behavior inside lists, allowing users to indent/outdent list items by pressing Tab/Shift+Tab, creating nested sublists. With `tab.spaces`, Tab elsewhere inserts spaces or indents a selection.

## Features

- Tab key creates nested sublists in `<li>` elements
- Shift+Tab removes list nesting (outdents)
- Works with `indent`/`outdent` commands
- Cursor position preservation
- Handles both `<ul>` and `<ol>` lists
- Maintains list attributes when creating sublists
- Supports partially filled lists
- Fires `afterTab` event
- Configurable enable/disable
- Optional `tab.spaces`: Tab outside lists and tables inserts spaces, and indents a selection

## Configuration Options

### `tab.tabInsideLiInsertNewList`

**Type:** `boolean`

**Default:** `true`

When enabled, pressing Tab inside a list item creates a nested sublist. When disabled, Tab behaves as default (browser behavior).

**Example:**
```typescript
// Enable Tab indentation in lists (default)
const editor = Jodit.make('#editor', {
    tab: {
        tabInsideLiInsertNewList: true
    }
});

// Disable Tab handling, use browser default
const editor2 = Jodit.make('#editor2', {
    tab: {
        tabInsideLiInsertNewList: false
    }
});
```

### `tab.spaces`

**Type:** `number`

**Default:** `0`

Outside lists and table cells, Tab isn't handled, so the browser moves the focus on, as forms expect. With `spaces` above 0:

- **Tab at a caret** inserts that many non-breaking spaces. Where white space is kept, as in a `<pre>`, it inserts a tab character instead.
- **Shift+Tab at a caret** takes out what Tab put in: a tab or up to that many spaces just before the caret, if one of them is non-breaking, so a space between words stays; or else a tab or up to that many spaces at the start of its line; or else the indent of its block.
- **Neither key moves the focus on.** Escape and then Tab or Shift+Tab does, as in code editors, from a table cell too. An Escape that closes a popup doesn't count, a modifier key in between doesn't matter, and any other key or a click cancels it. `Alt+F10` moves the focus to the toolbar. WCAG's "No Keyboard Trap" (2.1.2) asks that people are told how to leave, so say so where the editor is.
- **Tab with a selection** indents the selected blocks, and **Shift+Tab** outdents them, through the `indent` and `outdent` commands.
- **Backspace** just after that many spaces, non-breaking or not, removes them together, as it would a tab.
- **A tab in pasted text** becomes the spaces, as HTML would show it as one space. Tabs that already show stay: in `white-space: pre` or `pre-wrap`, such as Safari's `Apple-tab-span` and Google Docs' spans, in a `<pre>`, or pasted into one. So do tabs that only lay out the HTML, and those in a `<style>` or `<script>`.

In a list, Tab still nests an item that has one before it. In a list's first item it indents the whole list, as Word does, and Shift+Tab there outdents it. In a table cell, Tab still moves to the next cell.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    tab: {
        spaces: 4
    }
});
```

## Usage Examples

### Basic Tab Indentation

```typescript
const editor = Jodit.make('#editor');

// Create list:
// <ul>
//   <li>Item 1</li>
//   <li>|Item 2</li>  (cursor here)
// </ul>

// Press Tab

// Result:
// <ul>
//   <li>Item 1
//     <ul>
//       <li>Item 2</li>
//     </ul>
//   </li>
// </ul>
```

### Shift+Tab Outdentation

```typescript
const editor = Jodit.make('#editor');

// Create nested list:
// <ul>
//   <li>Item 1
//     <ul>
//       <li>|Item 2</li>  (cursor here)
//     </ul>
//   </li>
// </ul>

// Press Shift+Tab

// Result:
// <ul>
//   <li>Item 1</li>
//   <li>Item 2</li>
// </ul>
```

### Multiple Levels

```typescript
// Press Tab multiple times for deeper nesting:
// <ul>
//   <li>Level 1
//     <ul>
//       <li>Level 2
//         <ul>
//           <li>Level 3</li>
//         </ul>
//       </li>
//     </ul>
//   </li>
// </ul>
```

### Ordered Lists

```typescript
// Works with <ol> too:
// <ol>
//   <li>First</li>
//   <li>|Second</li>
// </ol>

// Press Tab

// Result:
// <ol>
//   <li>First
//     <ol>
//       <li>Second</li>
//     </ol>
//   </li>
// </ol>
```

### Listen to Tab Events

```typescript
const editor = Jodit.make('#editor');

editor.e.on('afterTab', (isShift) => {
    if (isShift) {
        console.log('Outdented (Shift+Tab)');
    } else {
        console.log('Indented (Tab)');
    }
});
```

### Disable Tab Handling

```typescript
const editor = Jodit.make('#editor', {
    tab: {
        tabInsideLiInsertNewList: false
    }
});

// Tab key uses browser default (focus next element)
// No list nesting on Tab
```

## How It Works

### Event Interception

Plugin intercepts:
1. `keydown` event with Tab key via `@watch(':keydown.tab')`
2. `beforeCommand` event for `indent`/`outdent` commands via `@watch(':beforeCommand.tab')`
3. `backSpaceBeforeCases` event, to remove a Tab's spaces in one press
4. `beforePasteInsert` event, to turn tabs in pasted text into spaces

The first two call `__onShift()` method with shift flag. When it doesn't handle a Tab, `onTabSpaces()` does, if `tab.spaces` is set.

### Tab Spaces

The functions in `./cases/tab-spaces.ts` do nothing while `tab.spaces` is 0:

- `onTabSpaces()` skips table cells. With a selection it runs `indent` or `outdent`. In a list's first item it indents or outdents the list. Otherwise, for Tab, it inserts the spaces, or a tab where the computed `white-space` keeps it. For Shift+Tab it takes out a tab or the spaces before the caret, then those at the start of the line (after a `<br>`, or a newline where white space is kept), then the block's indent, and keeps the focus even if there was nothing to take out. After an Escape, a `keydown` handler without a namespace, so ahead of table navigation, stops the editor's handlers for the next Tab and leaves it to the browser.
- `removeTabSpaces()` looks back from the caret through the text nodes before it. If the last `spaces` characters are spaces or non-breaking spaces, it removes them.
- `tabsToSpaces()` parses the pasted HTML in a `<template>`, so nothing loads or runs, and replaces the tabs in text nodes that have other characters too, unless their own styles or a `<pre>` keep white space. It leaves the HTML as it was if the caret is somewhere that keeps white space.

### Tab Press Handler

The `onTabInsideLi()` function:

1. **Check Config:**
   - Returns `false` if `tabInsideLiInsertNewList` is disabled

2. **Insert Fake Cursors:**
   - Creates two fake marker nodes at selection start/end
   - Used to preserve cursor position during DOM manipulation

3. **Find Parent LI:**
   - Gets closest `<li>` ancestor of cursor
   - For Tab: checks if previous sibling exists (can't indent first item)
   - For Shift+Tab: checks if parent `<li>` exists (nested list)

4. **Validate Cursor Position:**
   - Ensures cursor still inside same LI after fake insertion
   - Handles nested LI scenarios

5. **Find Parent List:**
   - Gets closest `<ul>` or `<ol>` ancestor
   - For Shift+Tab: ensures list is nested in another LI

6. **Execute Operation:**
   - Tab: calls `appendNestedList()`
   - Shift+Tab: calls `removeNestedList()`

7. **Restore Cursor:**
   - Creates range between fake markers
   - Selects range
   - Removes fake markers

8. **Fire Event:**
   - If operation succeeded: fires `afterTab` event with shift flag

### Append Nested List (Tab)

The `appendNestedList()` function:

1. Gets previous sibling LI (where to nest into)
2. Checks if previous LI already has nested list as last child
3. **If nested list exists:** Moves current LI into it
4. **If no nested list:** Creates new list element:
   - Clones parent list tag name (`<ul>` or `<ol>`)
   - Copies all attributes from parent list
   - Appends current LI to new list
   - Appends new list to previous LI

**Example:**
```html
<!-- Before Tab -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>  <!-- cursor here -->
</ul>

<!-- After Tab -->
<ul>
  <li>Item 1
    <ul>  <!-- new nested list -->
      <li>Item 2</li>
    </ul>
  </li>
</ul>
```

### Remove Nested List (Shift+Tab)

The `removeNestedList()` function:

1. Gets parent LI (the one containing the list)
2. Collects all leaf children (LI elements) from current list
3. Moves current LI after parent LI (outdents)
4. **If first item or only item:** Removes entire nested list
5. **If middle/last item with siblings after:**
   - Clones list structure
   - Appends remaining items to cloned list
   - Appends cloned list to outdented LI

**Example (middle item):**
```html
<!-- Before Shift+Tab on Item 2 -->
<ul>
  <li>Item 1
    <ul>
      <li>Item 2</li>  <!-- cursor here -->
      <li>Item 3</li>
    </ul>
  </li>
</ul>

<!-- After Shift+Tab -->
<ul>
  <li>Item 1</li>
  <li>Item 2
    <ul>  <!-- cloned list with remaining items -->
      <li>Item 3</li>
    </ul>
  </li>
</ul>
```

### Fake Cursor Markers

- Created via `jodit.createInside.fake()`
- Inserted at selection start and end
- Preserve exact cursor position during DOM changes
- Removed after operation completes
- Range recreated between markers for cursor restoration

### Command Integration

Plugin also handles `indent`/`outdent` commands:
- `indent` command treated as Tab (shift = false)
- `outdent` command treated as Shift+Tab (shift = true)
- Same logic applied
- Returns `false` to prevent default command execution

## Events

### `afterTab`

Fired after successful Tab or Shift+Tab operation in list.

**Parameters:**
- `shift` (boolean): `true` for Shift+Tab (outdent), `false` for Tab (indent)

**Example:**
```typescript
editor.e.on('afterTab', (shift) => {
    console.log(shift ? 'Outdented' : 'Indented');
});
```

## Edge Cases

1. **First Item Tab**: Can't indent first item (no previous sibling), Tab ignored, or indents the whole list with `tab.spaces`
2. **Top-Level Shift+Tab**: Can't outdent top-level LI (no parent LI), Shift+Tab ignored, or with `tab.spaces` takes out spaces or outdents an indented list from its first item, and keeps the focus
3. **Cursor Not in LI**: Tab uses browser default behavior, unless `tab.spaces` is set
4. **Multiple List Levels**: Works at any nesting depth
5. **Cursor in Middle**: Works regardless of cursor position in LI text
6. **Empty LI**: Works with empty list items
7. **Attribute Preservation**: New lists copy attributes from parent list
8. **Range Selection**: Uses range start position for operation
9. **Nested Lists**: Handles existing nested lists correctly
10. **List Type Mixing**: Maintains list type (UL vs OL) when nesting

## Notes

- Plugin is class-based, extends `Plugin` base class
- Uses `@watch` decorator for event handling
- Event namespacing: `.tab` for keydown/command
- Tab key constant: `KEY_TAB`
- Fake markers preserve cursor position during DOM manipulation
- The `onTabInsideLi()` function in `./cases/on-tab-inside-li.ts`
- Uses `Dom.closest()` to find ancestor elements
- The `Dom.isLeaf()` checks if element is LI
- Attributes copied via `Array.from(list.attributes).reduce()`
- The `assert()` helper ensures required elements exist
- List cloning uses `cloneNode()` for structure preservation
- The `Dom.after()` moves LI outside nested list
- Range manipulation via `jodit.s.createRange()`
- Plugin handles both tab keypress and indent/outdent commands
- Returns `false` to prevent default browser Tab behavior
- The `finally` block ensures cursor restoration even on errors
- Configured by `tabInsideLiInsertNewList` and `spaces`
- Works with both unordered (`<ul>`) and ordered (`<ol>`) lists

## Typical Use Case

Users creating structured documents need to organize list items hierarchically with sublists. The tab plugin provides this by:

1. Making Tab key indent list items (create sublists)
2. Making Shift+Tab outdent list items (remove nesting)
3. Preserving cursor position during operations
4. Maintaining list structure and attributes
5. Providing familiar word processor-like behavior

This improves user experience by:
- Enabling quick list hierarchy creation
- Familiar Tab/Shift+Tab keyboard shortcuts
- No need for toolbar buttons to indent/outdent
- Seamless nested list management
- Maintains focus on content creation