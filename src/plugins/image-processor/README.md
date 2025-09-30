# Image Processor Plugin

Handles image processing in the Jodit editor. This plugin automatically manages images in the document, including click handling, selection, load event handling, and conversion of data URIs to blob URLs for better performance.

## Features

- Automatic click handler attachment to all images
- Image selection on click/touch
- Automatic editor resize on image load
- Data URI to Blob URL conversion for performance optimization
- Blob URL lifecycle management
- Bidirectional conversion (view ↔ source)
- Memory cleanup on editor destruction
- Automatic image tracking and binding

## Configuration Options

### `imageProcessor`

**Type:** `{ replaceDataURIToBlobIdInView: boolean }`

**Default:** `{ replaceDataURIToBlobIdInView: true }`

Configuration object for the image processor plugin.

#### `imageProcessor.replaceDataURIToBlobIdInView`

**Type:** `boolean`

**Default:** `true`

When enabled, the plugin converts image `src` attributes that contain data URIs (base64 encoded images) to blob URLs in the editor view. This provides significant performance benefits for documents with large base64 images.

**How it works:**
- **In Editor View**: Images display with `blob:` URLs (e.g., `blob:http://localhost:2000/03377cf0-6260-4351-82ad-8a8901ea104f`)
- **In Source/Value**: Images retain original `data:` URIs (e.g., `data:image/png;base64,iVBORw0KG...`)
- The conversion is transparent - when you get `editor.value`, you receive the original data URIs

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    imageProcessor: {
        replaceDataURIToBlobIdInView: true // Default value
    }
});
```

## Usage Examples

### Basic Usage

The plugin is enabled by default and works automatically:

```typescript
const editor = Jodit.make('#editor');

// Insert image with data URI
editor.value = '<p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="/></p>';

// In view: src="blob:http://localhost:2000/..."
// In value: src="data:image/png;base64,..."
```

### Disable Blob Conversion

Disable data URI to blob conversion to use original base64 images:

```typescript
const editor = Jodit.make('#editor', {
    imageProcessor: {
        replaceDataURIToBlobIdInView: false
    }
});
```

### Working with Data URIs

```typescript
const editor = Jodit.make('#editor', {
    imageProcessor: {
        replaceDataURIToBlobIdInView: true
    }
});

// Set content with base64 image
editor.value = '<p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="/></p>';

// Get value - returns original data URI
console.log(editor.value);
// Output: <p><img src="data:image/png;base64,iVBORw0KG...="/></p>

// Get native editor value - shows blob URL
console.log(editor.getNativeEditorValue());
// Output: <p><img src="blob:http://localhost:2000/03377cf0-6260-4351-82ad-8a8901ea104f"></p>

// Get element value - returns original data URI
console.log(editor.getElementValue());
// Output: <p><img src="data:image/png;base64,iVBORw0KG...="/></p>
```

### Programmatic Image Insertion

```typescript
const editor = Jodit.make('#editor');

// Insert image with data URI
const dataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';

editor.s.insertHTML(`<img src="${dataUri}" alt="Test image">`);

// Plugin automatically converts to blob URL in the view
// But preserves data URI in the actual value
```

### Image Selection Behavior

All images are automatically selectable:

```typescript
const editor = Jodit.make('#editor');

editor.value = '<p><img src="image.jpg"></p>';

// Clicking/touching any image automatically selects it
// No additional code needed
```

### Handling Image Load Events

The plugin automatically handles image loading:

```typescript
const editor = Jodit.make('#editor');

// When images load, editor automatically resizes
editor.value = '<p><img src="large-image.jpg"></p>';

// Editor will fire 'resize' event after the image loads
editor.e.on('resize', () => {
    console.log('Editor resized after image load');
});
```

## How It Works

### Plugin Initialization

1. **Lifecycle Hooks**: Sets up watchers for editor events
2. **Change Detection**: Monitors `:change`, `:afterInit`, and `:changePlace` events
3. **Value Hooks**: Watches `:afterGetValueFromEditor` and `:beforeSetElementValue` events

### Image Processing on Change

When the editor content changes:

1. **Image Discovery**: Finds all `<img>` elements in the editor
2. **Binding Check**: Checks if each image is already processed using data binding
3. **First-Time Processing**: For new images:
   - Marks as processed with `JODIT_IMAGE_PROCESSOR_BINDED` flag
   - Attaches `load` event listener if image not fully loaded
   - Converts data URI to blob if image has `data:` protocol
   - Attaches click/touch handlers for selection

### Data URI to Blob Conversion

When an image with data URI is detected:

1. **Feature Detection**: Checks for `ArrayBuffer` and `URL` support
2. **Blob Creation**: Converts base64 data to binary `Blob`:
   - Extracts MIME type from data URI
   - Decodes base64 string using `atob()`
   - Creates `ArrayBuffer` with binary data
   - Constructs `Blob` object with correct MIME type
3. **Object URL**: Creates blob URL using `URL.createObjectURL()`
4. **Image Update**: Replaces image `src` with blob URL
5. **Mapping Storage**: Stores mapping in `editor.buffer` for later restoration:
   ```typescript
   {
       'blob:http://localhost:2000/uuid': 'data:image/png;base64,...'
   }
   ```

### Blob to Data URI Restoration

When getting editor value:

1. **Event Trigger**: Catches `:beforeSetElementValue` event
2. **Mapping Lookup**: Retrieves blob-to-data URI mapping from buffer
3. **Replacement**: Replaces all blob URLs with original data URIs in the HTML string
4. **Loop Protection**: Uses `while` loop to handle multiple occurrences

### Image Selection

When an image is clicked or touched:

1. **Event Handler**: Attached `mousedown` and `touchstart` events
2. **Selection**: Calls `editor.s.select(elm)` to select the image
3. **Consistent Behavior**: Works for all images, regardless of data URI conversion

### Image Load Handling

For images that haven't finished loading:

1. **Completion Check**: Tests `img.complete` property
2. **Event Attachment**: Attaches `load` event listener
3. **Resize Trigger**: Fires `resize` event when image loads
4. **Cleanup**: Removes event listener after first load
5. **Destruct Check**: Verifies editor is not in destruction before firing events

### Memory Management

On editor destruction:

1. **Buffer Access**: Retrieves blob URL mappings from buffer
2. **URL Revocation**: Calls `URL.revokeObjectURL()` for each blob URL
3. **Buffer Cleanup**: Deletes mapping from buffer
4. **Memory Release**: Ensures browser can free memory for blob objects

## Internal Constants

### `JODIT_IMAGE_PROCESSOR_BINDED`

Private constant used to mark images as processed. Prevents duplicate event handler attachment.

### `JODIT_IMAGE_BLOB_ID`

Buffer key for storing blob URL to data URI mappings.

## Events

### `resize`

Fired when an image finishes loading.

**Example:**
```typescript
editor.e.on('resize', () => {
    console.log('Editor resized (possibly due to image load)');
});
```

### `internalUpdate`

Fired after converting data URI to blob URL.

**Example:**
```typescript
editor.e.on('internalUpdate', () => {
    console.log('Internal update (blob conversion occurred)');
});
```

## Methods

### Internal Helper: `dataURItoBlob()`

Converts a data URI string to a Blob object.

**Syntax:**
```typescript
function dataURItoBlob(dataURI: string): Blob
```

**Process:**
1. Splits data URI to extract base64 data and MIME type
2. Decodes base64 using `atob()`
3. Creates `ArrayBuffer` with binary data
4. Returns `Blob` with correct MIME type

### Internal Helper: `replaceDataURIToBlobUUID()`

Replaces image's data URI with blob URL.

**Process:**
1. Checks `replaceDataURIToBlobIdInView` option
2. Verifies browser support for `ArrayBuffer` and `URL`
3. Converts data URI to blob
4. Creates object URL
5. Updates image `src`
6. Stores mapping in buffer

## Edge Cases

1. **Browser Support**: Conversion only occurs if `ArrayBuffer` and `URL` are supported. Falls back gracefully in older browsers.

2. **Duplicate Processing**: Uses data binding to track processed images and avoid duplicate event handlers.

3. **Multiple Data URIs**: The plugin correctly handles multiple images with data URIs in a single document.

4. **Value Retrieval**: Different methods return different formats:
   - `editor.value` and `editor.getElementValue()`: Original data URIs
   - `editor.getNativeEditorValue()`: Blob URLs

5. **Editor Destruction**: All blob URLs are properly revoked to prevent memory leaks.

6. **Incomplete Images**: Load event handlers are only attached to images that haven't finished loading (`!img.complete`).

7. **Multiple Replacements**: Uses `while` loop during restoration to handle cases where the same blob URL appears multiple times.

8. **Event Cleanup**: Load event listeners are removed after first execution to prevent memory leaks.

9. **Source Consumer**: Only converts blob to data when the consumer is not `SOURCE_CONSUMER` (i.e., when getting value for external use, not internal source mode).

10. **Empty Buffer**: Gracefully handles cases where no blob mappings exist.

## Notes

- The plugin uses debouncing on the change handler to optimize performance
- Blob URLs are significantly more efficient for rendering large base64 images
- The conversion is completely transparent to the user
- Original data URIs are always preserved in the editor's value
- Memory is automatically managed - blob URLs are revoked on editor destruction
- The plugin uses the `@watch` decorator for automatic event binding
- Image selection works consistently across touch and mouse devices
- The `load` event handler includes a destruct check to prevent errors during editor cleanup
- Blob URL mappings are stored in `editor.buffer` for persistence across value get/set operations
- The plugin properly handles the bidirectional conversion without data loss
- Works seamlessly with other image-related plugins like `image` and `image-properties`