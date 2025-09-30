# Iframe Plugin

Enables the Jodit editor to run inside an iframe instead of using a DIV element. This provides complete CSS isolation, allowing custom styles for the editor content without affecting or being affected by the host page's styles.

## Features

- Complete CSS isolation from the host page
- Custom stylesheets for editor content
- Inline style injection
- Custom DOCTYPE and base URL support
- Automatic height adjustment
- Edit full HTML documents (including html, head, body tags)
- Sandbox attribute support for security
- Event forwarding from iframe to host
- Customizable iframe document structure
- ResizeObserver integration for auto-height

## Configuration Options

### `iframe`

**Type:** `boolean`

**Default:** `false`

Enables iframe mode. When `true`, the editor content is rendered inside an iframe instead of a regular DIV.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    iframe: true
});
```

### `iframeBaseUrl`

**Type:** `string`

**Default:** `''`

Sets the base URL for the iframe document. This affects how relative URLs in the content are resolved.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    iframe: true,
    iframeBaseUrl: 'https://example.com/content/'
});
```

### `iframeTitle`

**Type:** `string`

**Default:** `'Jodit Editor'`

Sets the title of the iframe document.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    iframe: true,
    iframeTitle: 'My Custom Editor'
});
```

### `iframeDoctype`

**Type:** `string`

**Default:** `'<!DOCTYPE html>'`

Sets the DOCTYPE declaration for the iframe document.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    iframe: true,
    iframeDoctype: '<!DOCTYPE html>'
});
```

### `iframeStyle`

**Type:** `string`

**Default:** (see notes)

Custom inline CSS to be injected into the iframe document. The default includes basic styling for html, body, tables, paragraphs, and disabled states.

**Default value:**
```css
html{margin:0;padding:0;min-height:100%;}
body{box-sizing:border-box;font-size:13px;line-height:1.6;padding:10px;margin:0;background:transparent;color:#000;position:relative;z-index:2;user-select:auto;overflow:auto;outline:none;}
table{width:100%;border:none;border-collapse:collapse;empty-cells:show;max-width:100%;}
th,td{padding:2px 5px;border:1px solid #ccc;user-select:text;}
p{margin-top:0;}
.jodit_disabled{user-select:none;}
```

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    iframe: true,
    iframeStyle: 'body{font-family:Arial;font-size:14px;background:#fff;}'
});
```

### `iframeCSSLinks`

**Type:** `string[]`

**Default:** `[]`

Array of external CSS file URLs to load into the iframe document.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    iframe: true,
    iframeCSSLinks: [
        '/css/editor-content.css',
        'https://fonts.googleapis.com/css?family=Roboto'
    ]
});
```

### `iframeSandbox`

**Type:** `string | null`

**Default:** `null`

Sets the sandbox attribute for the iframe. When set to an empty string, all restrictions are enabled. When `null`, no sandbox attribute is added.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    iframe: true,
    iframeSandbox: 'allow-same-origin allow-scripts'
});
```

### `iframeDefaultSrc`

**Type:** `string`

**Default:** `'about:blank'`

Sets the initial src attribute of the iframe.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    iframe: true,
    iframeDefaultSrc: 'about:blank'
});
```

### `editHTMLDocumentMode`

**Type:** `boolean`

**Default:** `false`

When enabled, allows editing the entire HTML document structure (including `<html>`, `<head>`, and `<body>` tags). Requires the source element to be a TEXTAREA or INPUT.

**Example:**
```typescript
const editor = Jodit.make('textarea', {
    iframe: true,
    editHTMLDocumentMode: true
});
```

## Usage Examples

### Basic Iframe Mode

```typescript
const editor = Jodit.make('#editor', {
    iframe: true
});
```

### With Custom Styles

```typescript
const editor = Jodit.make('#editor', {
    iframe: true,
    iframeStyle: `
        body {
            font-family: 'Georgia', serif;
            font-size: 16px;
            line-height: 1.8;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
        }
    `
});
```

### With External Stylesheets

```typescript
const editor = Jodit.make('#editor', {
    iframe: true,
    iframeCSSLinks: [
        '/css/editor-content.css',
        '/css/print.css'
    ]
});
```

### With Base URL

```typescript
const editor = Jodit.make('#editor', {
    iframe: true,
    iframeBaseUrl: 'https://example.com/articles/',
    iframeTitle: 'Article Editor'
});
```

### Edit Full HTML Documents

```typescript
// Source element must be textarea or input
const editor = Jodit.make('textarea', {
    iframe: true,
    editHTMLDocumentMode: true
});

// Can edit full HTML including head and body
editor.value = `
<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
    <meta charset="UTF-8">
</head>
<body>
    <h1>Content</h1>
</body>
</html>
`;
```

### With Sandbox Restrictions

```typescript
const editor = Jodit.make('#editor', {
    iframe: true,
    iframeSandbox: 'allow-same-origin allow-scripts allow-forms'
});
```

### Auto-Height Iframe

```typescript
const editor = Jodit.make('#editor', {
    iframe: true,
    height: 'auto' // Iframe automatically adjusts to content height
});
```

### Combined Configuration

```typescript
const editor = Jodit.make('#editor', {
    iframe: true,
    iframeTitle: 'Content Editor',
    iframeBaseUrl: '/content/',
    iframeStyle: `
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        h1 { color: #2c3e50; }
        a { color: #3498db; }
    `,
    iframeCSSLinks: [
        '/css/editor.css'
    ],
    height: 'auto'
});
```

## How It Works

### Plugin Initialization

When iframe mode is enabled:

1. **Iframe Creation**: Creates an `<iframe>` element with:
   - `src="about:blank"`
   - `class="jodit-wysiwyg_iframe"`
   - `allowtransparency="true"`
   - Tabindex from configuration
   - Frameborder="0"
   - Optional sandbox attribute

2. **Document Generation**: Fires `generateDocumentStructure.iframe` event to create the iframe's HTML structure:
   ```html
   <!DOCTYPE html>
   <html dir="..." class="jodit" lang="...">
   <head>
       <title>...</title>
       <base href="..."/>
   </head>
   <body class="jodit-wysiwyg"></body>
   </html>
   ```

3. **Style Injection**: Adds styles to the iframe document:
   - Injects `iframeStyle` as inline `<style>` tag
   - Loads external stylesheets from `iframeCSSLinks`

4. **Editor Setup**: Sets `editor.editor` to `doc.body` inside the iframe

### Document Structure

The iframe document includes:
- Custom DOCTYPE
- HTML element with `dir` attribute from configuration
- `lang` attribute from language settings
- `jodit` class on html element
- Title tag with configured title
- Optional base tag with base URL
- Body with `jodit-wysiwyg` class

### Edit HTML Document Mode

When `editHTMLDocumentMode` is enabled:

1. **Validation**: Checks that source element is TEXTAREA or INPUT

2. **Value Getting**: When getting editor value:
   - Returns the entire document structure: `DOCTYPE + documentElement.outerHTML`
   - Clears Jodit markers and internal classes
   - Removes contenteditable attributes
   - Cleans up Jodit-specific styles and scripts

3. **Value Setting**: When setting editor value:
   - Detects if value contains `<html>` or `<body>` tags
   - If yes, rewrites the entire document structure
   - If no, only updates body innerHTML
   - Compares with previous value to avoid unnecessary updates

4. **Marker Cleaning**: Removes:
   - Span markers added by Jodit
   - contenteditable attributes
   - min-height styles from body
   - jodit and jodit-wysiwyg classes
   - Jodit-specific style and script tags

### Auto-Height Adjustment

When `height: 'auto'` is configured:

1. **Hide Overflow**: Sets `overflow-y: hidden` on document element

2. **Resize Handler**: Creates throttled resize function that:
   - Gets editor body's computed style
   - Calculates margin offset (top + bottom)
   - Sets iframe height to body offsetHeight + margins

3. **Event Listeners**: Attaches resize handler to:
   - Editor events: `change`, `afterInit`, `afterSetMode`, `resize`
   - Iframe and window `load` events
   - Document `readystatechange` and `DOMContentLoaded` events

4. **ResizeObserver**: If available, uses ResizeObserver to watch body size changes

### Event Forwarding

The plugin forwards iframe events to the host:

- Mouse events: `mousedown`, `mouseup`, `mousemove`, `click`
- Touch events: `touchstart`, `touchend`
- Keyboard events: `keydown`, `keyup`
- Scroll events

This ensures editor event handlers work correctly despite iframe isolation.

### Contenteditable Toggle

The iframe body's contenteditable attribute is updated when:
- Editor mode changes (WYSIWYG vs Source)
- Editor becomes readonly/editable
- Editor initializes

### Focus Handling

When the iframe document is clicked:
- Checks if editor is focused
- If not, focuses the editor
- Sets cursor position in body if body is the editor element

## Events

### `generateDocumentStructure.iframe`

Fired when creating the iframe's HTML document structure.

**Handler signature:**
```typescript
(doc: Document | undefined, editor: IJodit) => void
```

**Example:**
```typescript
editor.e.on('generateDocumentStructure.iframe', (doc, editor) => {
    // Customize document structure
    const meta = doc.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1';
    doc.head.appendChild(meta);
});
```

### `createEditor`

The plugin hooks into the `createEditor` event to create the iframe instead of using a regular DIV.

## Edge Cases

1. **Mode Switching**: When switching between source and WYSIWYG modes, focus is restored to the editor

2. **EditHTMLDocumentMode Requirements**: This mode only works with TEXTAREA or INPUT source elements; throws error otherwise

3. **Value Comparison**: In edit HTML mode, values are compared to prevent unnecessary document rewrites

4. **Empty CSS Links**: If `iframeCSSLinks` is empty, no link tags are added

5. **Null Sandbox**: When `iframeSandbox` is `null`, no sandbox attribute is added

6. **Auto-Height Throttling**: Resize events are throttled to avoid performance issues

7. **ResizeObserver Fallback**: Auto-height works without ResizeObserver but may be less responsive

8. **Base URL**: If `iframeBaseUrl` is empty, no base tag is added

9. **Event Context**: Events inside iframe are forwarded to the main window context

10. **Focus State**: Clicking iframe document automatically focuses the editor

## Notes

- Iframe mode provides complete CSS isolation - host page styles don't affect editor content
- External stylesheets must be CORS-compatible to load in the iframe
- The iframe document has its own `window` and `document` objects
- Sandbox attribute restricts iframe capabilities; use carefully to maintain editor functionality
- Edit HTML document mode allows full control over HTML structure but requires careful handling
- Auto-height mode uses ResizeObserver when available for better performance
- Event forwarding ensures plugins and handlers work correctly despite iframe isolation
- The plugin properly cleans up ResizeObserver on editor destruction
- Iframe body gets `jodit-wysiwyg` class for consistent styling
- The contenteditable attribute is managed automatically based on editor mode and readonly state
- Marker cleaning removes all Jodit-internal markup when getting value in edit HTML mode