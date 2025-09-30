# Class Span Plugin

Adds a dropdown button that applies CSS class names to selected text or elements.

## Description

This plugin provides a toolbar button with a dropdown list of predefined CSS classes. When a class is selected, it wraps the selected text in a `<span>` element with the chosen class, or applies the class to the nearest HTML element.

## Features

- **Dropdown List**: Choose from predefined CSS classes
- **Active State Detection**: Button highlights when cursor is in element with applied class
- **Customizable List**: Configure your own class names and labels
- **Visual Preview**: Class names are styled in the dropdown (using the actual class)
- **Command**: `applyClassName` command for programmatic usage

## Default Classes

By default, the plugin includes these classes:
- `enabled`
- `disabled`
- `activated`
- `text-left`
- `text-center`
- `text-right`
- `warning`
- `error`

## Configuration

### Custom Class List

```javascript
const editor = Jodit.make('#editor', {
  controls: {
    classSpan: {
      list: {
        'my-highlight': 'Highlight',
        'my-warning': 'Warning',
        'my-success': 'Success',
        'my-error': 'Error',
        'text-large': 'Large Text'
      }
    }
  }
});
```

### With Custom Labels

```javascript
const editor = Jodit.make('#editor', {
  controls: {
    classSpan: {
      list: {
        'badge': 'Badge Style',
        'badge-primary': 'Primary Badge',
        'badge-secondary': 'Secondary Badge',
        'text-muted': 'Muted Text',
        'text-danger': 'Danger Text'
      }
    }
  }
});
```

## Usage Examples

### Programmatic Application

```javascript
const editor = Jodit.make('#editor');

// Apply class to selection
editor.s.select(someElement);
editor.execCommand('applyClassName', '', 'my-custom-class');
```

### Remove from Toolbar

```javascript
const editor = Jodit.make('#editor', {
  buttons: Jodit.defaultOptions.buttons.filter(btn => btn !== 'classSpan')
});
```

### Custom Button Position

```javascript
const editor = Jodit.make('#editor', {
  buttons: ['bold', 'italic', 'classSpan', 'link']
});
```

## Styling Classes

To see classes in the dropdown, define them in your CSS:

```css
.my-highlight {
  background-color: yellow;
  font-weight: bold;
}

.my-warning {
  color: #ff9800;
  border-bottom: 2px solid #ff9800;
}

.my-success {
  color: #4caf50;
}

.text-large {
  font-size: 1.2em;
}
```

## Button Configuration

The button is registered in the `script` toolbar group by default.

### Control Configuration

```typescript
{
  command: 'applyClassName',
  list: string[] | Record<string, string>, // class names or class-label pairs
  tooltip: 'Insert className',
  childTemplate: (editor, key, value) => string // dropdown item template
}
```

## Notes

- Uses `commitStyle` internally to apply classes
- Classes are applied via the `class` attribute
- Can apply to inline text (creates `<span>`) or block elements
- Button shows active state when cursor is in element with one of the listed classes
- The dropdown shows visual preview of each class using `childTemplate`
