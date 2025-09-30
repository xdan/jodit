# Image Properties Plugin

Provides an image properties dialog for editing image attributes and styles. This plugin opens a comprehensive dialog when users double-click on images, allowing them to modify source, dimensions, margins, alignment, links, and other properties.

## Features

- Image properties dialog with tabbed interface
- Edit image source (URL)
- Edit image dimensions with aspect ratio locking
- Edit margins with synchronized margins option
- Set border radius
- Configure image link and link behavior
- Edit image title and alt text
- Assign CSS classes from predefined list
- Set custom styles
- Edit element ID
- Configure image alignment
- Live preview of changes
- Integration with image editor for cropping/resizing
- File browser integration for changing image source
- Double-click to open dialog
- Preserve aspect ratio option
- Delete image from dialog

## Configuration Options

### `image`

**Type:** `ImagePropertiesOptions`

Configuration object for image properties dialog.

#### `image.dialogWidth`

**Type:** `number`

**Default:** `600`

Sets the width of the image properties dialog in pixels.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        dialogWidth: 800
    }
});
```

#### `image.openOnDblClick`

**Type:** `boolean`

**Default:** `true`

Opens the image properties dialog when user double-clicks on an image.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        openOnDblClick: true
    }
});
```

#### `image.editSrc`

**Type:** `boolean`

**Default:** `true`

Shows the image source URL input field in the dialog.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        editSrc: true
    }
});
```

#### `image.useImageEditor`

**Type:** `boolean`

**Default:** `true`

Shows the crop/resize button that opens the image editor.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        useImageEditor: true
    }
});
```

#### `image.editTitle`

**Type:** `boolean`

**Default:** `true`

Shows the image title input field.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        editTitle: true
    }
});
```

#### `image.editAlt`

**Type:** `boolean`

**Default:** `true`

Shows the alternative text (alt) input field for accessibility.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        editAlt: true
    }
});
```

#### `image.editLink`

**Type:** `boolean`

**Default:** `true`

Shows image link options including URL and "open in new tab" checkbox.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        editLink: true
    }
});
```

#### `image.editSize`

**Type:** `boolean`

**Default:** `true`

Shows width and height input fields with aspect ratio lock option.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        editSize: true
    }
});
```

#### `image.editBorderRadius`

**Type:** `boolean`

**Default:** `true`

Shows border radius input field.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        editBorderRadius: true
    }
});
```

#### `image.editMargins`

**Type:** `boolean`

**Default:** `true`

Shows margin input fields (top, right, bottom, left) with margin lock option.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        editMargins: true
    }
});
```

#### `image.editClass`

**Type:** `boolean`

**Default:** `true`

Shows CSS class name input/selector.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        editClass: true
    }
});
```

#### `image.availableClasses`

**Type:** `[string, string][] | string[]`

**Default:** `[]`

Pre-defined list of CSS classes available for selection. Can be provided as simple string array or as array of tuples `[className, humanLabel]` for custom labels.

**Example:**
```typescript
// Simple string array
const editor = Jodit.make('#editor', {
    image: {
        availableClasses: [
            'img-responsive',
            'img-thumbnail',
            'img-rounded'
        ]
    }
});

// With human-readable labels
const editor = Jodit.make('#editor', {
    image: {
        availableClasses: [
            ['img-small', 'Small (300px)'],
            ['img-medium', 'Medium (600px)'],
            ['img-large', 'Large (900px)'],
            ['img-full', 'Full Width']
        ]
    }
});
```

#### `image.editStyle`

**Type:** `boolean`

**Default:** `true`

Shows custom CSS style input field.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        editStyle: true
    }
});
```

#### `image.editId`

**Type:** `boolean`

**Default:** `true`

Shows element ID input field.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        editId: true
    }
});
```

#### `image.editAlign`

**Type:** `boolean`

**Default:** `true`

Shows alignment selector (left, center, right, etc.).

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        editAlign: true
    }
});
```

#### `image.showPreview`

**Type:** `boolean`

**Default:** `true`

Shows live preview of the image in the dialog.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        showPreview: true
    }
});
```

#### `image.selectImageAfterClose`

**Type:** `boolean`

**Default:** `true`

Automatically selects the image after closing the properties dialog.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    image: {
        selectImageAfterClose: true
    }
});
```

## Usage Examples

### Basic Usage

The plugin is enabled by default:

```typescript
const editor = Jodit.make('#editor');

editor.value = '<p><img src="photo.jpg" alt="Photo"></p>';

// Double-click on image to open properties dialog
```

### Minimal Configuration

Show only essential fields:

```typescript
const editor = Jodit.make('#editor', {
    image: {
        editSrc: true,
        editAlt: true,
        editSize: true,
        editTitle: false,
        editLink: false,
        editBorderRadius: false,
        editMargins: false,
        editClass: false,
        editStyle: false,
        editId: false,
        editAlign: false,
        useImageEditor: false
    }
});
```

### With Predefined Classes

```typescript
const editor = Jodit.make('#editor', {
    image: {
        availableClasses: [
            ['responsive', 'Responsive Image'],
            ['thumbnail', 'Thumbnail'],
            ['rounded', 'Rounded Corners'],
            ['shadow', 'With Shadow']
        ]
    }
});
```

### Disable Double-Click

Require manual opening instead of double-click:

```typescript
const editor = Jodit.make('#editor', {
    image: {
        openOnDblClick: false
    }
});

// Open programmatically
const img = editor.editor.querySelector('img');
if (img) {
    editor.e.fire('openImageProperties', img);
}
```

### Custom Dialog Width

```typescript
const editor = Jodit.make('#editor', {
    image: {
        dialogWidth: 900
    }
});
```

### Open Programmatically

```typescript
const editor = Jodit.make('#editor');

// Insert image
editor.s.insertImage('photo.jpg');

// Get the image element
const img = editor.editor.querySelector('img');

// Open properties dialog
editor.e.fire('openImageProperties', img);
```

### Without Image Editor

Disable crop/resize functionality:

```typescript
const editor = Jodit.make('#editor', {
    image: {
        useImageEditor: false
    }
});
```

### Prevent Selection After Close

```typescript
const editor = Jodit.make('#editor', {
    image: {
        selectImageAfterClose: false
    }
});
```

### Listen to Dialog Events

```typescript
const editor = Jodit.make('#editor');

// Listen for double-click event
editor.e.on('openOnDblClick', (image) => {
    console.log('Opening properties for:', image.src);

    // Return false to prevent opening
    // return false;
});

// Listen for image property updates
editor.e.on('updateImageProperties.imageproperties', (image) => {
    console.log('Image properties updated:', image);
});
```

### Complete Configuration Example

```typescript
const editor = Jodit.make('#editor', {
    image: {
        dialogWidth: 700,
        openOnDblClick: true,
        editSrc: true,
        useImageEditor: true,
        editTitle: true,
        editAlt: true,
        editLink: true,
        editSize: true,
        editBorderRadius: true,
        editMargins: true,
        editClass: true,
        availableClasses: [
            ['img-fluid', 'Fluid (100% width)'],
            ['img-50', '50% width'],
            ['img-rounded', 'Rounded Corners'],
            ['img-circle', 'Circle'],
            ['img-shadow', 'Drop Shadow']
        ],
        editStyle: true,
        editId: true,
        editAlign: true,
        showPreview: true,
        selectImageAfterClose: true
    }
});
```

## How It Works

### Plugin Initialization

1. **Event Binding**: Attaches `dblclick` event handler to editor
2. **State Management**: Initializes internal state for form values
3. **Dialog Creation**: Creates cached dialog with form and buttons
4. **Tab State**: Manages active tab ('Image' or 'Advanced')

### Double-Click Behavior

When user double-clicks on an image:

1. **Event Capture**: `dblclick` event on `editor.editor` element
2. **Target Validation**: Checks if target is `<img>` element
3. **Option Check**: Verifies `openOnDblClick` is `true`
4. **Event Hook**: Fires `openOnDblClick` event (can return `false` to cancel)
5. **State Setup**: Clones image and stores as `sourceImage` and `image`
6. **Dialog Open**: Opens properties dialog

### Dialog Structure

The dialog consists of:

1. **Header**: "Image properties" title
2. **Content**: Tabbed form with two tabs:
   - **Image Tab**: Source, dimensions, alignment, link, alt, title
   - **Advanced Tab**: Margins, border radius, class, ID, style
3. **Footer**: Three buttons:
   - **Cancel**: Closes dialog without changes
   - **Delete**: Removes image from editor
   - **Apply**: Applies changes to image

### Form State Management

The plugin maintains state in `ImagePropertiesState`:

```typescript
{
    image: HTMLImageElement,        // Working copy
    sourceImage: HTMLImageElement,  // Original image in editor
    ratio: number,                  // Natural width / height
    sizeIsLocked: boolean,         // Aspect ratio lock
    marginIsLocked: boolean,       // Margin sync lock
    values: {
        style: string,
        imageSrc: string,
        borderRadius: number,
        imageTitle: string,
        imageAlt: string,
        imageLink: string,
        imageLinkOpenInNewTab: boolean,
        imageWidth: number | string,
        imageHeight: number | string,
        marginTop: number | string,
        marginRight: number | string,
        marginBottom: number | string,
        marginLeft: number | string,
        classes: string,
        id: string,
        align: ImageHAlign
    }
}
```

### Value Reading

When dialog opens:

1. **Lock Dialog**: Disables all inputs and buttons
2. **Read Values**: Calls `readValuesFromImage()`:
   - Extracts all properties from the image element
   - Parses styles, attributes, dimensions
   - Populates form state
3. **Image Decode**: Waits for `image.decode()` to complete
4. **Aspect Ratio**: Calculates and applies aspect ratio if locked
5. **Unlock Dialog**: Enables inputs and buttons

### Value Writing

When user clicks Apply:

1. **Apply Changes**: Calls `applyValuesToImage()`
   - Updates image attributes (src, alt, title, id)
   - Sets dimensions
   - Applies margins
   - Sets border radius
   - Updates or creates link wrapper
   - Sets alignment
   - Applies custom styles
   - Sets CSS classes
2. **Synchronize**: Calls `editor.synchronizeValues()`
3. **Close Dialog**: Closes the dialog

### Aspect Ratio Lock

When `sizeIsLocked` is true:

1. **Width Change**: Automatically adjusts height: `height = width / ratio`
2. **Height Change**: Automatically adjusts width: `width = height * ratio`
3. **Watch Decorator**: Uses `@watch('state.image')` to monitor changes
4. **Live Update**: Changes apply in real-time to preview

### Margin Lock

When `marginIsLocked` is true:

- All four margin fields are synchronized
- Changing one updates all others to match

### Image Source Change

When image source URL changes:

1. **Update Working Copy**: Sets `image.src` to new URL
2. **Lock Dialog**: Disables controls during load
3. **Image Decode**: Waits for new image to load
4. **Recalculate Dimensions**: If aspect ratio locked, updates dimensions
5. **Fire Event**: Triggers `updateImageProperties.imageproperties`
6. **Unlock Dialog**: Re-enables controls

### Image Editor Integration

When crop/resize button clicked:

1. **Opens**: Separate image editor dialog (if `useImageEditor` is true)
2. **Allows**: Cropping, resizing, rotating
3. **Updates**: Image source after editing

### File Browser Integration

When file browser button clicked:

1. **Opens**: File selector popup
2. **Allows**: Selection from server files
3. **Updates**: Image source with selected file URL

### Delete Image

When delete button clicked:

1. **Remove**: Calls `editor.s.removeNode(sourceImage)`
2. **Close**: Closes dialog

### Selection After Close

If `selectImageAfterClose` is `true`:

1. **Check**: Verifies image still exists in document
2. **Select**: Calls `editor.s.select(sourceImage)`

## Events

### `openImageProperties`

Fired to programmatically open the image properties dialog.

**Handler signature:**
```typescript
(image: HTMLImageElement) => void
```

**Example:**
```typescript
const img = editor.editor.querySelector('img');
editor.e.fire('openImageProperties', img);
```

### `openOnDblClick`

Fired before opening dialog on double-click. Return `false` to cancel.

**Handler signature:**
```typescript
(image: HTMLImageElement) => false | void
```

**Example:**
```typescript
editor.e.on('openOnDblClick', (image) => {
    if (image.hasAttribute('data-locked')) {
        alert('This image is locked');
        return false; // Prevent opening
    }
});
```

### `updateImageProperties.imageproperties`

Fired after image properties are updated (e.g., after changing source).

**Handler signature:**
```typescript
(image: HTMLImageElement) => void
```

**Example:**
```typescript
editor.e.on('updateImageProperties.imageproperties', (image) => {
    console.log('Image updated:', image.src);
});
```

## Known Issues

### Material-UI Dialog Focus Issue

When using Jodit inside a Material-UI (MUI) modal/dialog, the image properties dialog may not allow focusing input fields. This occurs because MUI's `Modal` component enforces focus within itself.

**Solution:**

Enable the `disableEnforceFocus` prop on the MUI Modal/Dialog:

```typescript
<Dialog
    open={open}
    disableEnforceFocus={true}  // Allow focus outside
>
    <div id="editor"></div>
</Dialog>
```

**Reference:** [GitHub Issue #879](https://github.com/xdan/jodit/issues/879)

## Edge Cases

1. **Image Outside Editor**: Plugin only handles images inside `editor.editor` element

2. **Readonly Mode**: Dialog doesn't open in readonly mode, but image is still selected

3. **No Double-Click**: If `openOnDblClick` is `false`, double-clicking only selects the image

4. **Missing Image**: If source image is removed from DOM before closing dialog, selection is skipped

5. **Dialog Dimensions**: Dialog has `minWidth: min(400, screen.width)` and `minHeight: 590`

6. **Image Decode Error**: If new image fails to load, error is shown in dialog

7. **Aspect Ratio**: Natural dimensions are used for ratio calculation, not display dimensions

8. **State Isolation**: Each dialog opening uses fresh state cloned from the source image

9. **Form Validation**: Form validates before allowing submission

10. **Event Namespacing**: All events use `.imageproperties` namespace for clean removal

## Notes

- The plugin uses `@cache` decorator to create dialog and buttons only once
- Dialog is modal and can be maximized to fullsize
- Form includes live preview that updates as properties change
- Changes are only applied when user clicks Apply button
- Cancel button discards all changes
- The plugin properly cleans up dialog, form, and buttons on destruction
- State is reactive - changing form values automatically updates preview
- Image is cloned before editing to allow cancellation without affecting original
- The dialog is reusable - same dialog instance for all images
- Tab state persists across different image edits (last used tab is remembered)
- Dialog positioning is automatic based on available screen space
- All event listeners use namespaced events (`.imageproperties`) for proper cleanup
- The plugin integrates with Jodit's dialog system for consistent UI
- Available classes can have human-readable labels for better UX
- The dialog supports fullsize mode via fullsize button in header