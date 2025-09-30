# File Plugin

Provides a toolbar button and popup for inserting file links into the editor via FileBrowser or URL input.

## Description

This plugin adds a "file" button that opens a popup with file selection options. Users can browse files from a server (via FileBrowser), upload files, or enter a URL manually. When a file is selected, it's inserted as an `<a>` link. If editing an existing link, it updates that link instead of creating a new one.

## Features

- **File Button**: Opens file selection popup
- **FileBrowser Integration**: Browse and select files from server
- **Upload Support**: Upload files directly from popup
- **URL Input**: Manually enter file URL and title
- **Edit Existing Links**: Updates `<a>` tags if cursor is inside one
- **Auto Link Creation**: Creates `<a href="url">title</a>` elements

## Button

- **Name**: `file`
- **Group**: `media`
- **Tooltip**: "Insert file"
- **Tags**: `['a']` - activates when cursor is in anchor tag

## Usage Examples

### Basic Usage

```javascript
const editor = Jodit.make('#editor');

// User clicks "file" button
// Popup opens with URL input and FileBrowser option
// User enters URL: https://example.com/document.pdf
// User enters title: "Download PDF"
// Link inserted: <a href="https://example.com/document.pdf" title="Download PDF">Download PDF</a>
```

### With FileBrowser

```javascript
const editor = Jodit.make('#editor', {
  filebrowser: {
    ajax: {
      url: '/api/filebrowser'
    }
  }
});

// User clicks "file" button
// User clicks "Browse" to open FileBrowser
// User selects file(s) from server
// Links inserted for each selected file
```

### Disable Button

```javascript
const editor = Jodit.make('#editor', {
  buttons: Jodit.defaultOptions.buttons.filter(btn => btn !== 'file')
});
```

### Custom Toolbar Position

```javascript
const editor = Jodit.make('#editor', {
  buttons: ['bold', 'italic', 'file', 'link', 'image']
});
```

### Editing Existing Link

```javascript
const editor = Jodit.make('#editor');
editor.value = '<a href="old.pdf">Old File</a>';

// User places cursor inside link
// User clicks "file" button
// Popup shows current link data
// User changes URL to "new.pdf" and title to "New File"
// Link updates: <a href="new.pdf" title="New File">New File</a>
```

## How It Works

### Button Click

1. User clicks "file" button
2. Plugin checks if cursor is inside or near an `<a>` tag
3. If found, stores reference to existing anchor (`sourceAnchor`)
4. Opens `FileSelectorWidget` popup with options

### Popup Options

The popup provides three methods to insert/update files:

**1. URL Input**
- User enters file URL and optional title
- Calls `url` callback with URL and text

**2. Upload**
- User uploads file from computer
- After upload, calls `url` callback

**3. FileBrowser**
- User browses files on server
- User selects one or multiple files
- Calls `filebrowser` callback with selected files

### Insert Flow

**If `sourceAnchor` exists (editing):**
```javascript
sourceAnchor.setAttribute('href', url);
sourceAnchor.setAttribute('title', text);
// Updates existing link
```

**If no `sourceAnchor` (new link):**
```javascript
editor.s.insertNode(
  editor.createInside.fromHTML(
    `<a href="${url}" title="${title}">${title || url}</a>`
  )
);
// Inserts new link at cursor
```

### FileBrowser Callback

When files selected from FileBrowser:
```javascript
data.files.forEach(file => {
  const url = data.baseurl + file;
  const title = file; // filename as title
  insert(url, title);
});
```

Creates multiple links if multiple files selected.

### Link Structure

Generated link HTML:
```html
<a href="URL" title="TITLE">TITLE or URL</a>
```

- `href`: File URL
- `title`: File description (optional)
- Text content: Title if provided, otherwise URL

## Widget Integration

Uses `FileSelectorWidget` from `jodit/modules/widget`:

```javascript
FileSelectorWidget(
  editor,
  {
    filebrowser: (data) => { /* handle FileBrowser selection */ },
    upload: true, // Enable upload tab
    url: (url, text) => { /* handle URL input */ }
  },
  sourceAnchor, // Existing anchor or null
  close,        // Close callback
  false         // isImageMode = false (file mode)
);
```

## Configuration

This plugin has no specific configuration options. It uses:
- `filebrowser` configuration for FileBrowser functionality
- Standard button configuration

To disable:

```javascript
const editor = Jodit.make('#editor', {
  disablePlugins: ['file']
});
```

## Notes

- Button activates when cursor is in `<a>` tag (tags: `['a']`)
- Creates `<a>` elements, not file embeds
- Supports multiple file selection via FileBrowser
- Updates existing links instead of creating duplicates
- Uses `FileSelectorWidget` (shared with image plugin)
- File URLs can be absolute or relative
- Title attribute and text content both set to same value
- If no title provided, uses URL as text content
- Closes popup automatically after file insertion/update