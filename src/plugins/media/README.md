---
title: Media Plugin
description: Wraps video and audio elements in non-editable, draggable containers so users can select and manipulate media without editing its inner content.
keywords: jodit, media plugin, video, audio, contenteditable false, media wrapper, draggable
---

# Media Plugin

Processes and decorates video and audio elements in the editor. This plugin wraps media elements (`<video>`, `<audio>`, and other configured tags) in a non-editable container to improve user experience when selecting and manipulating media content.

## Features

- Automatic wrapping of media elements
- Non-editable media containers
- Draggable media elements
- Click-to-select functionality
- Preserves element styling
- Automatic cleanup on value extraction
- Customizable wrapper tag
- Configurable media element types
- Debounced processing for performance

## Configuration Options

### `mediaInFakeBlock`

**Type:** `boolean`

**Default:** `true`

When `true`, wraps media elements (video, audio, etc.) in non-editable container blocks for easier selection and manipulation.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    mediaInFakeBlock: true
});
```

### `mediaFakeTag`

**Type:** `string`

**Default:** `'jodit-media'`

The tag name used for the wrapper element around media content.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    mediaFakeTag: 'jodit-media-wrapper'
});
```

### `mediaBlocks`

**Type:** `string[]`

**Default:** `['video', 'audio']`

Array of tag names that should be treated as media elements and wrapped in fake blocks.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    mediaBlocks: ['video', 'audio', 'iframe', 'embed']
});
```

### `mediaWrappers`

**Type:** `{ [tag: string]: { tag: string; className: string } }`

**Default:** `{}`

Wrappers that media keep in the content, by the media's tag name, for content that holds its media in one, such as Froala's `<span class="fr-video">` around video, audio and embeds. The keys are tag names, as in `mediaBlocks` and the `popup` option. An element with a wrapper for its tag:

- Is wrapped in it instead of the editor-only `mediaFakeTag` when its tag is one of `mediaBlocks`, or left in it when it's already in one. Other elements, such as iframes by default, are only wrapped when the video popup inserts them.
- Goes in inside it when the video popup inserts it: an uploaded video, the embed for a link, or embed code that is one element.
- Opens the `jodit-media` popup for its wrapper when clicked, whose Align and Delete act on the wrapper rather than on the media inside it.

A wrapper is given `contenteditable="false"` and `draggable="true"`, which stay in the value.

**Example:**
```typescript
const frVideo = { tag: 'span', className: 'fr-video' };

const editor = Jodit.make('#editor', {
    mediaWrappers: { video: frVideo, audio: frVideo, iframe: frVideo }
});
```

### `alignClasses`

**Type:** `{ [tag: string]: { left?: string | string[]; right?: string | string[]; center?: string | string[]; normal?: string | string[] } }`

**Default:** `{}`

Class names to align elements with, by tag name, as `imageAlignClasses` does for images: `img`, and `video`, `audio` and `iframe` in the media popup. A media wrapper (see `mediaWrappers`), and Jodit's own `jodit` and `jodit-media` wrappers, are aligned with the classes for the media in them. Without a wrapper from `mediaWrappers`, the classes go on the media element. As with `imageAlignClasses`, an alignment can list several sets of classes to recognise, and aligning writes the first.

### `mediaDefaultAlign`

**Type:** `'normal' | 'left' | 'right' | 'center'`

**Default:** `'normal'`

Alignment given to the media the video popup inserts, with `alignClasses` when they're set for the media's type.

**Example:**
```typescript
const frVideo = { tag: 'span', className: 'fr-video' };
const froalaMedia = {
    left: 'fr-fvl fr-dvi',
    right: 'fr-fvr fr-dvi',
    center: ['fr-fvc fr-dvb', 'fr-dvb'],
    normal: 'fr-fvc fr-dvi'
};

const editor = Jodit.make('#editor', {
    mediaWrappers: { video: frVideo, audio: frVideo, iframe: frVideo },
    alignClasses: { video: froalaMedia, audio: froalaMedia, iframe: froalaMedia },
    mediaDefaultAlign: 'center'
});
```

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor', {
    mediaInFakeBlock: true
});

// Insert video element
editor.value = '<video src="video.mp4" controls></video>';
// Automatically wrapped in <jodit-media> container
```

### Disable Media Wrapping

```typescript
const editor = Jodit.make('#editor', {
    mediaInFakeBlock: false
});

// Media elements not wrapped
editor.value = '<video src="video.mp4" controls></video>';
```

### Custom Wrapper Tag

```typescript
const editor = Jodit.make('#editor', {
    mediaFakeTag: 'media-wrapper'
});

// Uses <media-wrapper> instead of <jodit-media>
editor.value = '<video src="video.mp4" controls></video>';
```

### Custom Media Types

```typescript
const editor = Jodit.make('#editor', {
    mediaBlocks: ['video', 'audio', 'iframe', 'object', 'embed']
});

// All specified elements will be wrapped
editor.value = `
    <video src="video.mp4" controls></video>
    <audio src="audio.mp3" controls></audio>
    <iframe src="https://example.com"></iframe>
`;
```

### Only Audio Elements

```typescript
const editor = Jodit.make('#editor', {
    mediaBlocks: ['audio']
});

// Only audio elements wrapped, video elements not affected
editor.value = `
    <video src="video.mp4" controls></video>
    <audio src="audio.mp3" controls></audio>
`;
```

### Complete Configuration

```typescript
const editor = Jodit.make('#editor', {
    mediaInFakeBlock: true,
    mediaFakeTag: 'jodit-media',
    mediaBlocks: ['video', 'audio', 'iframe']
});
```

## How It Works

### Plugin Initialization

When `mediaInFakeBlock` is `true`, the plugin:

1. **Event Registration**: Listens to `afterGetValueFromEditor`, `change`, `afterInit`, `afterSetMode`, and `changePlace` events
2. **Media Detection**: Searches for elements matching `mediaBlocks` selectors
3. **Wrapper Creation**: Wraps detected media elements in fake blocks
4. **Cleanup**: Removes wrapper tags when extracting editor value

### Media Element Wrapping

When a media element is detected:

1. **Existing Wrapper Check**: Checks if element already has `data-jodit_iframe_wrapper` parent
2. **Wrapper Creation** (if not already wrapped):
   - Creates element with tag name from `mediaFakeTag`
   - Sets attributes:
     - `data-jodit-temp="1"`: Marks as temporary element
     - `contenteditable="false"`: Makes non-editable
     - `draggable="true"`: Enables drag-and-drop
     - `data-jodit_fake_wrapper="1"`: Internal marker
3. **Style Preservation**: Copies `style` attribute from original element
4. **Dimension Setting**:
   - Display mode: Preserves `inline-block` or uses `block`
   - Width: Sets to `element.offsetWidth`
   - Height: Sets to `element.offsetHeight`
5. **DOM Insertion**: Inserts wrapper before original element and moves element inside
6. **Event Binding**: Adds click/touch handlers to place cursor after element

### Value Extraction Cleanup

When getting editor value (`afterGetValueFromEditor` event):

1. **Pattern Matching**: Uses regex to find all wrapper tags:
   ```javascript
   /<jodit-media[^>]+data-jodit_fake_wrapper[^>]+>([^]+?)<\/jodit-media>/ig
   ```
2. **Unwrapping**: Replaces wrapper with its inner content
3. **Clean Output**: Returns HTML without fake wrapper tags

### Click/Touch Handling

When user clicks/touches a wrapped media element:

1. **Event Trigger**: `mousedown.select` or `touchstart.select` event fires
2. **Cursor Positioning**: Calls `editor.s.setCursorAfter(element)`
3. **Selection**: Places cursor immediately after the media element

### Debounced Processing

The plugin uses debounced event handler with `editor.defaultTimeout` to:
- Prevent excessive re-processing during rapid changes
- Improve performance with multiple media elements
- Avoid redundant wrapper creation

### Data Binding

Uses `dataBind(elm, 'jodit_fake_wrapper', true)` to:
- Mark elements as already processed
- Prevent duplicate wrapping
- Track wrapper status efficiently

## Edge Cases

1. **Already Wrapped**: If element has `data-jodit_iframe_wrapper` parent, uses existing wrapper

2. **Source Mode**: Media processing is skipped when editor is in source code mode

3. **Destruction**: Processing stops if editor is destructed (`!editor.isDestructed`)

4. **Style Preservation**: Original element's `style` attribute is copied to wrapper

5. **Display Mode**: Wrapper respects original element's display mode (inline-block vs block)

6. **Dimensions**: Wrapper dimensions match original element's rendered size

7. **Nested Wrappers**: Plugin checks for existing wrappers to prevent nesting

8. **Value Extraction**: Wrapper tags are automatically removed from final HTML output

9. **Event Namespacing**: Uses `.select` namespace for clean event removal

10. **Multiple Elements**: Handles multiple media elements in same editor instance

## Notes

- Plugin is functional (not class-based), registered via `pluginSystem.add()`
- Wrapper elements are marked with `data-jodit-temp="1"` for temporary status
- The `contenteditable="false"` attribute prevents accidental editing of media elements
- Drag-and-drop is enabled via `draggable="true"` on wrapper
- Click handling improves UX by placing cursor after media element instead of inside
- The plugin automatically processes new media elements added via paste or API
- Wrapper tags are completely removed when getting editor value (clean HTML output)
- Processing is debounced to avoid performance issues with multiple rapid changes
- The `mediaBlocks` array can include any HTML tag names for custom media types
- Style and dimension preservation ensures media appears correctly in wrapped state
- Plugin works with both video and audio elements by default
- The fake wrapper approach solves browser inconsistencies with selecting/manipulating media elements
- Internal key `jodit_fake_wrapper` tracks processing status to prevent duplicate wrapping

## Typical Use Case

The media plugin solves a common problem in rich text editors: selecting and manipulating `<video>` and `<audio>` elements. By wrapping them in non-editable containers, users can:

- Click to select the entire media element (not the content inside)
- Drag and drop media elements easily
- Delete media elements with standard keyboard shortcuts
- Navigate around media elements with arrow keys
- Avoid accidentally editing media element attributes

The wrapper is transparent to the end user and automatically removed when saving content.