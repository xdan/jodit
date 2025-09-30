# Debug Plugin

Developer tool for visualizing DOM tree structure, selection state, and real-time event monitoring.

## Description

This plugin adds a debug panel to the editor workplace that displays:
- **DOM Tree Visualization**: Live hierarchical view of editor content
- **Selection State**: Current range start/end positions
- **Event Log**: Real-time stream of all editor events with timestamps

**Note**: This plugin is commented out by default (`// pluginSystem.add('debug', Debug)`) and must be manually enabled for development purposes.

## Features

- **Live DOM Tree**: Visual hierarchy with cursor position markers
- **Selection Info**: Shows `startContainer`, `startOffset`, `endContainer`, `endOffset`
- **Event Stream**: Logs 40+ editor and browser events in real-time
- **Event Details**: Shows keyboard modifiers, command names, target elements
- **Auto-scrolling**: Event log automatically scrolls to newest events
- **Clear Button**: Clear event log with one click
- **Cursor Visualization**: Shows `|` marker for selection boundaries
- **Invisible Space Detection**: Marks invisible spaces as `INV`

## Enabling the Plugin

The plugin is disabled by default. To enable:

```javascript
// In debug.ts, uncomment the last line:
pluginSystem.add('debug', Debug);
```

Or manually register:

```javascript
import { Debug } from 'jodit/src/plugins/debug/debug';
import { pluginSystem } from 'jodit/core/global';

pluginSystem.add('debug', Debug);

const editor = Jodit.make('#editor');
```

## Debug Panel Layout

The debug panel has 3 sections:

### 1. DOM Tree (`.jodit-debug__tree`)
- Shows nested structure of editor content
- Highlights selected nodes
- Shows cursor position with `|` marker
- Text nodes display their content
- Empty text nodes marked in red

### 2. Selection Info (`.jodit-debug__sel`)
```
start TEXT 5
end P 2
```
- First line: start container node name and offset
- Second line: end container node name and offset

### 3. Event Log (`.jodit-debug__events`)
```
10:35:42 keydown Ctrl+B BODY
10:35:42 beforeCommand bold
10:35:42 afterCommand bold
```
- Timestamp + event type
- Additional details (keyboard modifiers, commands, etc.)
- Target element node name
- Clear button (x) to empty the log

## Monitored Events

The plugin monitors 40+ events:

**Lifecycle**: `activate`, `afterInit`, `deactivate`

**Focus**: `beforeactivate`, `beforedeactivate`, `beforefocus`, `beforeblur`, `focus`, `blur`, `focusin`, `focusout`

**Input**: `beforeinput`, `input`, `change`, `compositionstart`, `compositionupdate`, `compositionend`

**Keyboard**: `keydown`, `keypress`, `keyup`

**Mouse**: `click`, `dblclick`, `mousedown`, `mouseup`, `contextmenu`

**Clipboard**: `copy`, `cut`, `paste`

**Drag & Drop**: `dragstart`, `dragover`, `drop`

**Selection**: `selectionchange`, `selectionstart`

**Commands**: `beforeCommand`, `afterCommand`

**Other**: `resize`, `touchstart`, `touchend`, `wheel`, `updateDebug`

## Usage Examples

### Enable for Development

```javascript
// Uncomment in src/plugins/debug/debug.ts
pluginSystem.add('debug', Debug);

const editor = Jodit.make('#editor');
// Debug panel appears at bottom of editor
```

### Trigger Manual Update

```javascript
const editor = Jodit.make('#editor');

// Force debug panel update
editor.e.fire('updateDebug');
```

### Styling the Debug Panel

```css
/* Customize debug panel appearance */
.jodit-debug {
  background: #f5f5f5;
  border-top: 2px solid #ccc;
  font-family: monospace;
}

.jodit-debug__tree {
  max-height: 300px;
  overflow-y: auto;
}

.jodit-debug__events {
  max-height: 200px;
  font-size: 11px;
}
```

## How It Works

### DOM Tree Rendering

1. Listens to `keydown`, `keyup`, `keypress`, `change`, `afterInit`, `updateDebug`, `selectionchange`
2. When events fire, calls `updateTree()`
3. `render()` recursively walks the DOM tree
4. Text nodes show content with cursor markers (`|`)
5. Empty text nodes marked as `<span style='color:red'>empty</span>`
6. Invisible spaces replaced with `INV`
7. Selected nodes highlighted with `.jodit-debug__tree-element_selected`

### Event Logging

1. Listens to all 40+ events
2. When event fires, calls `onSomeEvent()`
3. Creates timestamp: `new Date().toLocaleTimeString()`
4. Formats event with `renderEvent()`:
   - For keyboard events: shows modifiers (Ctrl+, Shift+, Alt+) and key name
   - For commands: shows command name
   - Shows target element node name
5. Appends to event log
6. Auto-scrolls to bottom
7. Limits log to 100 entries (removes oldest)

### Clear Button

```javascript
clear.addEventListener('click', () => {
  events.innerHTML = '';
  events.appendChild(clear); // Re-add clear button
});
```

## Notes

- **Not for Production**: This plugin is for development/debugging only
- **Commented Out**: Must be manually enabled by uncommenting `pluginSystem.add('debug', Debug)`
- **Performance**: Monitoring all events may impact editor performance
- **Event Limit**: Log keeps only last 100 events to prevent memory issues
- **No Configuration**: Plugin has no configurable options
- **CSS Styling**: Uses `debug.less` for panel styling
- **Selection Sync**: Updates on document-level `selectionchange` events