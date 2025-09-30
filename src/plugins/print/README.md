# Print Plugin

Opens the browser's standard print dialog to print the editor's content. This plugin creates a temporary hidden iframe with formatted content and triggers the print function.

## Features

- Print button in toolbar
- Opens native browser print dialog
- Temporary iframe for clean printing
- Critical CSS generation for print
- Color adjustment for accurate printing
- Automatic cleanup after printing
- Works in both source and WYSIWYG modes
- Handles iframe editors specially
- Document structure generation support
- Print icon

## Configuration Options

This plugin has no additional configuration options beyond the control configuration.

## Controls

### `print` Control

**Icon:** `'print'`

**Mode:** `MODE_SOURCE + MODE_WYSIWYG` (available in both modes)

**Tooltip:** `'Print'`

**Exec:** Opens print dialog with editor content

Opens browser's native print dialog for printing editor content.

## Usage Examples

### Basic Usage

```typescript
const editor = Jodit.make('#editor');
// Click Print button in toolbar
```

### Programmatic Print

```typescript
const editor = Jodit.make('#editor');

// Trigger print dialog
editor.e.fire('print');
// Or click the print button programmatically
```

### Custom Button Configuration

```typescript
Jodit.make('#editor', {
    buttons: ['bold', 'italic', '|', 'print'],
    controls: {
        print: {
            tooltip: 'Print Content'
        }
    }
});
```

## How It Works

### Print Process

1. **Iframe Creation**: Creates hidden iframe with zero dimensions
2. **Positioning**: Places iframe off-screen (fixed position, right:0, bottom:0)
3. **Container Attachment**: Appends iframe to editor container
4. **Content Setup**: Writes/generates content in iframe document
5. **Style Injection**: Adds critical CSS and print-specific styles
6. **Print Trigger**: Calls `window.print()` on iframe window
7. **Cleanup**: Removes iframe after print completes

### Content Generation

**For iframe editors** (`editor.o.iframe` is `true`):
1. Fires `generateDocumentStructure.iframe` event
2. Sets `body.innerHTML` to editor value

**For regular editors**:
1. Writes complete HTML document structure
2. Includes language attribute
3. Generates critical CSS from editor styles
4. Uses `previewBox()` to render content in iframe body

### Critical CSS Generation

The `generateCriticalCSS()` function:
- Extracts styles from editor
- Includes only necessary styles for print
- Ensures proper formatting in print output

### Print Styles

Adds special `@media print` rule:
```css
@media print {
    body {
        -webkit-print-color-adjust: exact;
    }
}
```

This ensures colors and backgrounds print accurately.

### Cleanup Detection

Cleanup triggers on:
- `onbeforeunload` (iframe window)
- `onafterprint` (iframe window)
- `mousemove` (main window)

The `mousemove` event detects when user returns to main window after canceling/completing print.

### Iframe Lifecycle

1. **Create**: Iframe element created with `editor.create.element('iframe')`
2. **Style**: Positioned off-screen with zero dimensions
3. **Attach**: Appended to editor container
4. **Populate**: Content written to iframe document
5. **Focus**: Iframe window receives focus
6. **Print**: `print()` called on iframe window
7. **Remove**: Iframe safely removed after print

## Edge Cases

1. **Print Cancel**: Cleanup still occurs via `mousemove` detection

2. **Multiple Prints**: Each print creates new iframe (old one cleaned up)

3. **Iframe Editor**: Special handling for editors running in iframe mode

4. **Source Mode**: Print works in source mode (formats content first)

5. **Empty Content**: Prints blank page if editor is empty

6. **Color Printing**: `-webkit-print-color-adjust: exact` preserves colors

7. **Focus Management**: Iframe receives focus before print for proper dialog opening

8. **Container Detection**: Uses `getContainer()` to find appropriate parent

## Notes

- Plugin is functional (not class-based), registered via `pluginSystem.add()`
- Print button uses custom SVG icon
- Iframe is hidden (width: 0, height: 0, border: 0)
- Iframe positioned fixed at right:0, bottom:0 (off-screen)
- The `previewBox()` helper is shared with preview plugin
- Print dialog is native browser functionality
- Content is formatted for print (not raw HTML)
- Critical CSS ensures proper styling in print output
- The plugin uses event listeners to detect print completion
- Cleanup removes iframe from DOM using `Dom.safeRemove()`
- The `generateCriticalCSS()` function extracts necessary styles
- Print works in both standard and iframe editor modes
- Language attribute set via `defaultLanguage()` helper
- Button available in both SOURCE and WYSIWYG modes
- The iframe's contentWindow used for document manipulation
- Document structure event allows customization for iframe editors
- Print-specific CSS injected as `<style>` in iframe head
- Mouse movement detection helps cleanup when print canceled
- Multiple event types ensure reliable cleanup
- The plugin properly handles both iframe and non-iframe editor configurations

## Typical Use Case

Users need to print editor content for:
- Physical documentation
- PDF export (via print to PDF)
- Archive/record keeping
- Review/approval processes

The print plugin provides this by:
1. Creating clean print-ready version of content
2. Opening native print dialog
3. Preserving formatting and colors
4. Cleaning up after printing completes

This ensures:
- Professional-looking printed output
- Accurate color and style reproduction
- No editor UI elements in print
- Proper document structure for printing