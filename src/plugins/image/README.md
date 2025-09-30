# Image Plugin

Provides functionality to insert images into the Jodit editor. This plugin adds a toolbar button with a popup interface that supports multiple ways of adding images: by URL, file upload, and file browser integration.

## Features

- Insert images by URL
- Upload images from local computer
- Drag and drop image upload
- File browser integration for server-side image selection
- Automatic protocol detection for URLs
- Default image width configuration
- Update existing images by editing their source
- Support for alternative text (alt attribute)
- Visual file selector widget with tabs

## Configuration Options

### `imageDefaultWidth`

**Type:** `number`

**Default:** `300`

Sets the default width (in pixels) for images inserted into the editor. This applies to images inserted via URL or file browser, but not to images uploaded directly (which preserve their original dimensions unless resized).

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    imageDefaultWidth: 500
});
```

## Usage Examples

### Basic Usage

The plugin is enabled by default and provides an image button in the toolbar:

```typescript
const editor = Jodit.make('#editor');
// Click the image button in the toolbar to open the image insertion dialog
```

### Custom Default Width

```typescript
const editor = Jodit.make('#editor', {
    imageDefaultWidth: 400
});
```

### Insert Image by URL

```typescript
const editor = Jodit.make('#editor');

// Open image dialog programmatically
clickButton('image', editor);

// User enters URL and alt text in the popup form
// Image is inserted at cursor position
```

### With File Upload

The image dialog automatically includes upload functionality if uploader is configured:

```typescript
const editor = Jodit.make('#editor', {
    uploader: {
        url: '/upload/images',
        format: 'json'
    },
    imageDefaultWidth: 350
});
```

### With File Browser

Configure file browser for server-side image selection:

```typescript
const editor = Jodit.make('#editor', {
    filebrowser: {
        ajax: {
            url: '/filebrowser'
        }
    },
    imageDefaultWidth: 300
});
```

### Insert Image Programmatically

```typescript
const editor = Jodit.make('#editor');

// Insert image using selection API
editor.s.insertImage('https://example.com/image.jpg', null, 300);

// Insert with custom styles
editor.s.insertImage(
    'https://example.com/image.jpg',
    { 'border': '1px solid #ccc' },
    400
);
```

### Update Existing Image

When an image is already selected, the image dialog allows editing its source:

```typescript
const editor = Jodit.make('#editor');

editor.value = '<p><img src="old.jpg" alt="Old Image"></p>';

// Select the image and click the image button
// Dialog pre-fills with current image data
// Update URL or alt text and submit
```

### Without Default Width

Set `imageDefaultWidth` to `null` to preserve original image dimensions:

```typescript
const editor = Jodit.make('#editor', {
    imageDefaultWidth: null
});
```

### Custom Control Configuration

Customize the image button tooltip:

```typescript
const editor = Jodit.make('#editor', {
    controls: {
        image: {
            tooltip: 'Add Image'
        }
    }
});
```

## How It Works

### Plugin Initialization

1. **Icon Registration**: Loads the image SVG icon
2. **Control Definition**: Defines the `image` control with popup behavior
3. **Button Registration**: Registers the `image` toolbar button in the `media` group

### Image Button Popup

When the image button is clicked:

1. **Source Detection**: Checks if the current selection is an image or contains images
2. **State Management**: Saves current selection state
3. **Widget Creation**: Opens `FileSelectorWidget` with three possible tabs:
   - **URL Tab**: Manual URL entry with alternative text field
   - **Upload Tab**: Drag-and-drop file upload interface
   - **File Browser Tab**: Server-side file browser integration

### URL Tab Behavior

When using the URL tab:

1. **Form Validation**: Validates URL format before submission
2. **Protocol Detection**: If URL lacks protocol and matches domain pattern, prepends `//`
3. **Image Creation**: Creates `<img>` element with `src` and `alt` attributes
4. **Insertion**:
   - If editing existing image: Updates the image's attributes
   - If new image: Inserts at cursor position with `insertImage()` method
5. **Width Application**: Applies `imageDefaultWidth` as inline style if specified

### Upload Tab Behavior

When files are uploaded:

1. **Uploader Binding**: Binds uploader to drag-drop area
2. **File Processing**: Uploads files to server via configured uploader
3. **Response Handling**: Processes server response and inserts image URLs
4. **Batch Insert**: Multiple files can be uploaded and inserted at once

### File Browser Tab Behavior

When using file browser:

1. **Browser Opening**: Opens configured file browser dialog
2. **File Selection**: User selects one or more images from server
3. **URL Construction**: Combines `baseurl` with selected file paths
4. **Batch Insert**: Inserts all selected images with default width

### Protocol Detection

The plugin automatically adds `//` prefix to URLs without protocol:

```typescript
// Input: 'example.com/image.jpg'
// Output: '//example.com/image.jpg'
```

This allows images to be loaded with the same protocol as the page (HTTP or HTTPS).

### Image Insertion

Images are inserted using `editor.s.insertImage()`:

```typescript
editor.s.insertImage(
    url,           // Image URL or HTMLImageElement
    null,          // Optional styles dictionary
    width          // Optional width (from imageDefaultWidth config)
);
```

## Control Configuration

### `image` Control

The image control is defined in `Config.prototype.controls.image`:

**Properties:**
- `popup`: Function that returns the popup widget
- `tags`: `['img']` - Associates control with image elements
- `tooltip`: `'Insert Image'` - Default tooltip text

**Popup Function Parameters:**
- `editor`: Current editor instance
- `current`: Currently selected element (may be image)
- `close`: Function to close the popup

## Methods

### `editor.s.insertImage()`

Inserts an image at the current cursor position.

**Syntax:**
```typescript
editor.s.insertImage(
    url: string | HTMLImageElement,
    styles?: Nullable<IDictionary<string>>,
    defaultWidth?: Nullable<number | string>
): void
```

**Parameters:**
- `url` (string | HTMLImageElement): Image URL or image element to insert
- `styles` (object, optional): Dictionary of CSS styles to apply
- `defaultWidth` (number | string, optional): Width to set on the image

**Example:**
```typescript
// Insert with URL
editor.s.insertImage('https://example.com/photo.jpg', null, 300);

// Insert with styles
editor.s.insertImage('https://example.com/photo.jpg', {
    'border': '2px solid red',
    'border-radius': '5px'
}, 400);

// Insert image element
const img = editor.createInside.element('img');
img.src = 'https://example.com/photo.jpg';
editor.s.insertImage(img);
```

## Widget: FileSelectorWidget

The `FileSelectorWidget` creates a tabbed interface for image selection:

**Tabs:**
1. **Upload**: Appears if `uploader.url` or `uploader.insertImageAsBase64URI` is configured
2. **URL**: Always available - manual URL entry with alt text
3. **File Browser**: Appears if `filebrowser` is configured

**Callbacks:**
- `url`: Called when URL form is submitted
- `upload`: Called when files are uploaded
- `filebrowser`: Called when images are selected from file browser

## Edge Cases

1. **URL Without Protocol**: URLs like `example.com/image.jpg` are automatically prefixed with `//` to use the page's current protocol

2. **Editing Existing Image**: When an image is selected, the popup pre-fills with current image data, allowing the user to update the source

3. **Multiple Files**: The upload and file browser interfaces support selecting/uploading multiple images at once

4. **Image in Selection**: If the current selection contains an image (or is an image), that image is used as the source for editing

5. **Empty URL**: Form validation prevents submission with an empty URL, showing an error state

6. **Width Configuration**: If `imageDefaultWidth` is not specified or is `null`, images are inserted without explicit width

7. **Selection Restoration**: The plugin saves selection state before opening the popup and restores it before inserting images

8. **Protocol Regex**: The protocol detection uses regex `/^[a-z\d_-]+(\.[a-z\d_-]+)+/i` to identify URLs without protocol

## Notes

- The plugin uses `FileSelectorWidget` which is shared with the `file` plugin
- Images are always inserted as `<img>` elements with inline styles when width is specified
- The popup automatically closes after successful image insertion
- Default width is applied as inline `style="width:{width}px"` attribute
- The plugin works with both direct DOM elements and image URLs
- Selection state is preserved across popup interactions
- The image button appears in the `media` toolbar group
- Protocol-relative URLs (`//example.com/image.jpg`) work with both HTTP and HTTPS pages
- Multiple upload/selection is supported - each image is inserted sequentially
- The widget validates URL format before allowing submission
- Alternative text can be specified for accessibility
- The plugin integrates with the editor's uploader and file browser modules