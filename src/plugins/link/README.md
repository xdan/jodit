# Link Plugin

Provides comprehensive link management functionality for the Jodit editor. This plugin adds toolbar buttons for creating, editing, and removing hyperlinks, with features like automatic URL conversion from pasted content, video embed detection, customizable link form with class name support, and link navigation control.

## Features

- Link creation dialog with customizable form
- Link editing for existing links
- Unlink button to remove hyperlinks
- Keyboard shortcuts (Ctrl+K / Cmd+K) for quick link insertion
- Automatic URL conversion from pasted content
- Video URL detection and embed conversion (YouTube, Vimeo, etc.)
- Link navigation on double-click (optional)
- Read-only mode link click prevention (optional)
- Class name management (input or select mode)
- "Open in new tab" checkbox
- "No follow" checkbox for SEO control
- Form field references for programmatic access
- Custom form template support

## Configuration Options

### `link`

**Type:** `object`

Main configuration object for link plugin with the following properties:

#### `formTemplate`

**Type:** `(editor: IJodit) => IUIForm`

**Default:** Built-in form template function

Custom form template function that returns a UIForm. The default template includes URL input, text input, optional class name field, target checkbox, nofollow checkbox, and action buttons.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    link: {
        formTemplate: (editor) => {
            // Return custom UIForm
            return new UIForm(editor, [
                new UIInput(editor, { name: 'url', label: 'URL' })
            ]);
        }
    }
});
```

#### `followOnDblClick`

**Type:** `boolean`

**Default:** `false`

When `true`, double-clicking a link opens it in a new window/tab.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    link: {
        followOnDblClick: true
    }
});
```

#### `processVideoLink`

**Type:** `boolean`

**Default:** `true`

When `true`, automatically converts video URLs (YouTube, Vimeo, etc.) to embed codes when pasted.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    link: {
        processVideoLink: true
    }
});
```

#### `processPastedLink`

**Type:** `boolean`

**Default:** `true`

When `true`, automatically wraps pasted URLs in `<a>` tags.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    link: {
        processPastedLink: true
    }
});
```

#### `noFollowCheckbox`

**Type:** `boolean`

**Default:** `true`

When `true`, shows "No follow" checkbox in link dialog. Sets `rel="nofollow"` attribute when checked.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    link: {
        noFollowCheckbox: true
    }
});
```

#### `openInNewTabCheckbox`

**Type:** `boolean`

**Default:** `true`

When `true`, shows "Open in new tab" checkbox in link dialog. Sets `target="_blank"` attribute when checked.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    link: {
        openInNewTabCheckbox: true
    }
});
```

#### `modeClassName`

**Type:** `'input' | 'select'`

**Default:** `'input'`

Controls how class name field appears in link dialog:
- `'input'`: Shows text input for class name
- `'select'`: Shows dropdown select for class name (use with `selectOptionsClassName`)

**Note:** Setting this to a falsy value (like `null` or `undefined`) will hide the class name field, but TypeScript types only allow `'input'` or `'select'`

**Example:**
```typescript
// Text input mode
const editor1 = Jodit.make('#editor1', {
    link: {
        modeClassName: 'input'
    }
});

// Select dropdown mode
const editor2 = Jodit.make('#editor2', {
    link: {
        modeClassName: 'select',
        selectOptionsClassName: [
            { value: 'btn-primary', text: 'Primary Button' },
            { value: 'btn-secondary', text: 'Secondary Button' }
        ]
    }
});
```

#### `selectMultipleClassName`

**Type:** `boolean`

**Default:** `true`

When `modeClassName` is `'select'`, enables multiple selection for class names.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    link: {
        modeClassName: 'select',
        selectMultipleClassName: true,
        selectOptionsClassName: [
            { value: 'red', text: 'Red' },
            { value: 'bold', text: 'Bold' },
            { value: 'underline', text: 'Underline' }
        ]
    }
});
```

#### `selectSizeClassName`

**Type:** `number`

**Default:** `3`

When `modeClassName` is `'select'`, sets the visible size (number of options) for the select dropdown.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    link: {
        modeClassName: 'select',
        selectSizeClassName: 5,
        selectOptionsClassName: [
            { value: 'class1', text: 'Class 1' },
            { value: 'class2', text: 'Class 2' },
            { value: 'class3', text: 'Class 3' },
            { value: 'class4', text: 'Class 4' },
            { value: 'class5', text: 'Class 5' }
        ]
    }
});
```

#### `selectOptionsClassName`

**Type:** `IUIOption[]`

**Default:** `[]`

When `modeClassName` is `'select'`, provides options for the class name dropdown. Each option has `value` and `text` properties.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    link: {
        modeClassName: 'select',
        selectOptionsClassName: [
            { value: 'btn btn-primary', text: 'Primary Button' },
            { value: 'btn btn-secondary', text: 'Secondary Button' },
            { value: 'btn btn-success', text: 'Success Button' },
            { value: 'link-external', text: 'External Link' },
            { value: 'link-internal', text: 'Internal Link' }
        ]
    }
});
```

#### `hotkeys`

**Type:** `string | string[]`

**Default:** `['ctrl+k', 'cmd+k']`

Keyboard shortcuts for opening link dialog. Supports multiple key combinations.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    link: {
        hotkeys: ['ctrl+k', 'cmd+k', 'ctrl+l']
    }
});
```

#### `preventReadOnlyNavigation`

**Type:** `boolean`

**Default:** `true`

When `true`, prevents following links by clicking them when editor is in read-only mode.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    link: {
        preventReadOnlyNavigation: false  // Allow link navigation in read-only mode
    }
});
```

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor');
// Use link button in toolbar or press Ctrl+K/Cmd+K
```

### Custom Link Form

```typescript
const editor = Jodit.make('#editor', {
    link: {
        formTemplate: (editor) => {
            return new UIForm(editor, [
                new UIInput(editor, {
                    name: 'url',
                    label: 'Enter URL',
                    placeholder: 'https://example.com'
                }),
                new UIInput(editor, {
                    name: 'content',
                    label: 'Link Text'
                })
            ]);
        }
    }
});
```

### Link with Class Name Dropdown

```typescript
const editor = Jodit.make('#editor', {
    link: {
        modeClassName: 'select',
        selectMultipleClassName: false,
        selectSizeClassName: 4,
        selectOptionsClassName: [
            { value: 'btn-primary', text: 'Primary Link' },
            { value: 'btn-secondary', text: 'Secondary Link' },
            { value: 'external-link', text: 'External Link' },
            { value: 'download-link', text: 'Download Link' }
        ]
    }
});
```

### Disable URL Processing

```typescript
const editor = Jodit.make('#editor', {
    link: {
        processPastedLink: false,  // Don't wrap pasted URLs
        processVideoLink: false     // Don't convert video URLs to embeds
    }
});
```

### Enable Link Navigation

```typescript
const editor = Jodit.make('#editor', {
    link: {
        followOnDblClick: true,  // Double-click to follow links
        preventReadOnlyNavigation: false  // Allow clicking links in read-only mode
    }
});
```

### Simplified Link Form

```typescript
const editor = Jodit.make('#editor', {
    link: {
        noFollowCheckbox: false,
        openInNewTabCheckbox: false
    }
});
```

### Custom Keyboard Shortcuts

```typescript
const editor = Jodit.make('#editor', {
    link: {
        hotkeys: ['ctrl+shift+l', 'cmd+shift+l']
    }
});
```

### Programmatic Link Creation

```typescript
const editor = Jodit.make('#editor');

// Open link dialog programmatically
editor.execCommand('openLinkDialog');

// Listen to link form generation
editor.e.on('generateLinkForm.link', (form, isSelectionA) => {
    console.log('Link form generated', form, isSelectionA);
});

// Listen to link application
editor.e.on('applyLink', (jodit, elm, form) => {
    console.log('Link applied', elm);
    if (form) {
        console.log('Form data:', form);
    }
});
```

### Video Link Conversion

```typescript
const editor = Jodit.make('#editor', {
    link: {
        processVideoLink: true
    }
});

// Paste YouTube URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
// Automatically converts to embed code
```

### Paste Link Processing

```typescript
const editor = Jodit.make('#editor', {
    link: {
        processPastedLink: true
    }
});

// Paste plain URL: https://example.com
// Automatically wrapped in <a> tag

editor.e.on('processPaste.link', (e, text, insert) => {
    console.log('Processing pasted content:', text);
});
```

## How It Works

### Plugin Initialization

1. **Button Registration**: Registers `link` button in `insert` toolbar group
2. **Command Registration**: Registers `openLinkDialog` command with hotkeys
3. **Event Listeners**: Sets up listeners for:
   - `dblclick.link` (if `followOnDblClick` enabled)
   - `click.link` (for read-only navigation prevention)
   - `processPaste.link` (if `processPastedLink` enabled)
   - `generateLinkForm.link` (form customization)

### Link Dialog Flow

1. **Dialog Opening**: User clicks link button or presses hotkey
2. **Context Detection**: Checks if cursor is inside existing link
3. **Form Generation**:
   - Fires `generateLinkForm.link` event
   - Creates form using `formTemplate`
   - Populates fields if editing existing link
4. **User Input**: User fills in URL, text, class name, checkboxes
5. **Form Submission**:
   - Validates required fields
   - Creates or updates `<a>` element
   - Applies class names, target, rel attributes
   - Fires `applyLink` event
6. **Selection Restore**: Restores cursor position after link creation

### Form Template Structure

The default form includes:

1. **URL Input**: Required text input with `url_input` ref
2. **Content Input**: Optional text input for link text with `content_input` ref
3. **Class Name Field**: Input or select based on `modeClassName`:
   - Input mode: Text field with `className_input` ref
   - Select mode: Dropdown with `className_select` ref, using `selectOptionsClassName`
4. **Target Checkbox**: "Open in new tab" with `target_checkbox` ref (if `openInNewTabCheckbox`)
5. **NoFollow Checkbox**: "No follow" with `nofollow_checkbox` ref (if `noFollowCheckbox`)
6. **Action Buttons**: Unlink and Insert/Update buttons

### Paste Processing

When `processPastedLink` is enabled:

1. **Paste Event**: `processPaste.link` event triggered
2. **URL Detection**: Checks if pasted text is valid URL
3. **Video Detection**: If `processVideoLink` enabled, checks for video URLs
4. **Video Conversion**: Converts video URLs to embed codes
5. **Link Wrapping**: Wraps plain URLs in `<a>` tags
6. **Content Insertion**: Inserts processed HTML

### Video URL Processing

Supports automatic embed conversion for:
- YouTube URLs
- Vimeo URLs
- Other video platforms

The plugin detects video URLs and converts them to appropriate embed codes.

### Link Navigation

**Double-Click Navigation** (when `followOnDblClick` is `true`):
1. User double-clicks link element
2. Plugin extracts `href` attribute
3. Opens link in new window/tab

**Read-Only Click Prevention** (when `preventReadOnlyNavigation` is `true`):
1. User clicks link in read-only editor
2. Plugin prevents default navigation
3. Link does not open

### Class Name Management

**Input Mode** (`modeClassName: 'input'`):
- User types class name(s) directly
- Multiple classes separated by spaces

**Select Mode** (`modeClassName: 'select'`):
- User selects from predefined options
- Single or multiple selection based on `selectMultipleClassName`
- Options defined in `selectOptionsClassName`

## Commands

### `openLinkDialog`

Opens the link creation/editing dialog.

**Syntax:**
```typescript
editor.execCommand('openLinkDialog')
```

**Hotkeys:** Configured via `link.hotkeys` option (default: `['ctrl+k', 'cmd+k']`)

**Example:**
```typescript
// Open dialog programmatically
editor.execCommand('openLinkDialog');

// With custom hotkey
const editor = Jodit.make('#editor', {
    link: {
        hotkeys: ['ctrl+l', 'cmd+l']
    }
});
```

## Controls

### `link` Control

**Command:** Opens link dialog popup

**Tooltip:** `'Insert link'`

**Icon:** `'link'`

**Toolbar Group:** `'insert'`

**Popup:** `true`

Opens a dialog with link creation form.

### `unlink` Control

**Command:** `'unlink'`

**Tooltip:** `'Unlink'`

**Icon:** `'unlink'`

**Exec Function:** Removes link element from selection

Removes hyperlink formatting from selected text or cursor position.

## Events

### `generateLinkForm.link`

Fired when link form is being generated. Allows customization of form before display.

**Parameters:**
- `form`: The UIForm instance
- `isSelectionA`: Boolean indicating if current selection is within an `<a>` tag

**Example:**
```typescript
editor.e.on('generateLinkForm.link', (form, isSelectionA) => {
    console.log('Editing existing link:', isSelectionA);
    // Customize form here
});
```

### `applyLink`

Fired when link is successfully applied or updated.

**Parameters:**
- `jodit`: The Jodit editor instance
- `elm`: The `<a>` element that was created or modified
- `form`: The form data object (or `null` when called from paste handler)

**Example:**
```typescript
editor.e.on('applyLink', (jodit, elm, form) => {
    console.log('Link applied:', elm.href);
    console.log('Link text:', elm.textContent);
    if (form) {
        console.log('Form data:', form);
    }
});
```

### `dblclick.link`

Fired when user double-clicks on a link (only when `followOnDblClick` is enabled).

**Example:**
```typescript
editor.e.on('dblclick.link', (e) => {
    console.log('Link double-clicked', e.target);
});
```

### `click.link`

Fired when user clicks on a link in read-only mode (when `preventReadOnlyNavigation` is enabled).

**Example:**
```typescript
editor.e.on('click.link', (e) => {
    console.log('Link clicked in read-only mode', e.target);
});
```

### `processPaste.link`

Fired when pasted content is being processed for links (when `processPastedLink` is enabled).

**Parameters:**
- `e`: Clipboard event
- `text`: Pasted text content
- `insert`: Function to insert processed HTML

**Example:**
```typescript
editor.e.on('processPaste.link', (e, text, insert) => {
    console.log('Processing pasted content:', text);
});
```

## Edge Cases

1. **Empty URL**: Form validation prevents submitting empty or invalid URLs

2. **Cursor Inside Link**: Editing existing link pre-fills form with current values

3. **Text Selection**: When text is selected, it becomes link text; otherwise, URL is used as text

4. **Class Name Input**: Accepts multiple space-separated class names in input mode

5. **Class Name Select**: In select mode with `selectMultipleClassName: true`, multiple classes can be selected

6. **Video URL Paste**: Video URLs are converted to embeds instead of plain links when `processVideoLink` is enabled

7. **Plain URL Paste**: Plain URLs are automatically wrapped in `<a>` tags when `processPastedLink` is enabled

8. **Read-Only Mode**: Links cannot be edited in read-only mode, and navigation is prevented when `preventReadOnlyNavigation` is true

9. **Double-Click Navigation**: Only works when `followOnDblClick` is enabled; otherwise, standard text selection occurs

10. **Nested Elements**: Plugin correctly handles links containing nested elements (spans, images, etc.)

11. **Form Refs**: Form fields use refs (`url_input`, `content_input`, `className_input`, etc.) for programmatic access

12. **Unlink Button**: In form, unlink button removes link and closes dialog

## Known Issues

- When opening an editor in a [mui](https://mui.com/material-ui/api/modal) dialog box and opening the link popup in it, the mui dialog does not allow focus to be passed out. As a result, no field inside form can be focused. Just enable the [disableEnforceFocus](https://mui.com/material-ui/api/modal/#props) option. See [Issue #879](https://github.com/xdan/jodit/issues/879)

## Notes

- Link button appears in the `insert` toolbar group
- Default hotkeys are `Ctrl+K` (Windows/Linux) and `Cmd+K` (Mac)
- The plugin uses popup-based UI for link dialog
- Form template is fully customizable via `formTemplate` option
- Class name feature supports both free-text input and predefined select options
- Video embed conversion requires `processVideoLink` to be enabled
- URL paste wrapping requires `processPastedLink` to be enabled
- The `rel="nofollow"` attribute is used for SEO purposes to indicate non-endorsed links
- The `target="_blank"` attribute opens links in new tab/window
- Plugin uses event namespacing (`.link`) for clean event removal
- All event listeners are automatically cleaned up on editor destruction
- The unlink control removes the entire `<a>` element, not just its attributes
- Link navigation in read-only mode can be controlled via `preventReadOnlyNavigation`
- Form field references allow programmatic access to form inputs for advanced customization
- The plugin properly handles both creation of new links and editing of existing links