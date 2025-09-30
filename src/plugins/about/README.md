# About Plugin

Adds an information button to the Jodit toolbar that displays editor details in a modal dialog.

## Description

The plugin registers a button with a question mark icon. When clicked, it opens a dialog showing:
- Jodit Editor version
- License type (MIT or custom)
- Homepage link (https://xdsoft.net/jodit/)
- Documentation link
- Copyright information

## Usage

### Basic Example

The plugin is enabled by default:

```javascript
const editor = Jodit.make('#editor');
// The about button is automatically available in the toolbar
```

### Disable the Plugin

```javascript
const editor = Jodit.make('#editor', {
    disablePlugins: ['about']
});
```

### Remove Button from Toolbar

```javascript
const editor = Jodit.make('#editor', {
    buttons: ['bold', 'italic', 'underline'] // about button not included
});
```

### Custom License

```javascript
const editor = Jodit.make('#editor', {
    license: 'YOUR-LICENSE-KEY' // Will be displayed in the about dialog
});
```

## Button Configuration

The button is registered in the `info` toolbar group. Available in both WYSIWYG and Source modes.
