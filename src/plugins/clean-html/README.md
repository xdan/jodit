# Clean HTML Plugin

Automatically cleans and sanitizes HTML content to prevent XSS attacks and unwanted markup. Provides tag/attribute filtering, format removal, and HTML normalization.

## Description

This plugin continuously monitors and cleans HTML content in the editor. It removes dangerous scripts, normalizes markup, and enforces tag/attribute restrictions. Also adds an "Eraser" button for removing formatting from selected text.

## Features

- **XSS Protection**: Removes dangerous scripts and event handlers
- **Tag Filtering**: Allow/deny specific HTML tags
- **Attribute Control**: Control which attributes are permitted
- **Format Removal**: "Eraser" button to clear formatting
- **Auto-cleaning**: Cleans HTML on change, paste, and mode switch
- **Tag Normalization**: Replace old tags (`<i>` → `<em>`, `<b>` → `<strong>`)
- **Empty Element Removal**: Removes unnecessary empty tags
- **Sandbox Mode**: Optional iframe sandbox for extra security

## Configuration Options

### `cleanHTML.timeout`
- **Type**: `number`
- **Default**: `300`
- **Description**: Delay (ms) before applying cleaning after changes

```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    timeout: 500 // Clean after 500ms of inactivity
  }
});
```

### `cleanHTML.replaceNBSP`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Replace `&nbsp;` with regular spaces

```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    replaceNBSP: false // Keep non-breaking spaces
  }
});
```

### `cleanHTML.fillEmptyParagraph`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Remove empty `<p>` tags (except at start)

### `cleanHTML.removeEmptyElements`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Remove all empty elements

### `cleanHTML.replaceOldTags`
- **Type**: `IDictionary<HTMLTagNames> | false`
- **Default**: `{ i: 'em', b: 'strong' }`
- **Description**: Replace deprecated tags with modern equivalents

```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    replaceOldTags: {
      i: 'em',
      b: 'strong',
      strike: 's'
    }
  }
});
```

### `cleanHTML.useIframeSandbox`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Use iframe sandbox for safer HTML testing (slower)

```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    useIframeSandbox: true // Extra security, reduced performance
  }
});
```

### `cleanHTML.removeOnError`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Remove `onerror` attributes from tags

### `cleanHTML.safeJavaScriptLink`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Sanitize `javascript:` URLs in `href` attributes

### `cleanHTML.allowTags`
- **Type**: `false | string | IDictionary<string>`
- **Default**: `false`
- **Description**: Explicitly allowed tags and attributes

For instance, you can explicitly define which tags or attributes are allowed or disallowed:

```javascript
Jodit.make('#editor', {
	cleanHTML: {
		allowTags: {
			p: true,
			a: {
				href: true
			},
			table: true,
			tbody: true,
			tr: true,
			td: true,
			th: false,
			img: {
				src: '1.png'
			}
		}
	}
});
```

You can also disable specific tags. For example, let's disable script tags and images:

```javascript
Jodit.make('#editor', {
	cleanHTML: {
		denyTags: 'script,img'
	}
});
```

Alternatively, you can use an object to specify the denied tags:

```javascript
Jodit.make('#editor', {
	cleanHTML: {
		denyTags: {
			script: true,
			img: true
		}
	}
});
```

The plugin settings can be accessed under the namespace [[Config.cleanHTML]].

**String format:**
```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    allowTags: 'p,a[href],table,tr,td,img[src=1.png]'
    // Allow only <p>, <a>, <table>, <tr>, <td>, <img>
    // For <a>: only href attribute
    // For <img>: only src="1.png"
  }
});
```

### `cleanHTML.denyTags`
- **Type**: `false | string | IDictionary<string>`
- **Default**: `'script'`
- **Description**: Explicitly denied tags

**String format:**
```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    denyTags: 'script,img'
  }
});
```

**Object format:**
```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    denyTags: {
      script: true,
      img: true
    }
  }
});
```

### `cleanHTML.disableCleanFilter`
- **Type**: `Nullable<Set<string>>`
- **Default**: `null`
- **Description**: Disable specific cleaning filters

## Usage Examples

### Basic XSS Protection

```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    denyTags: 'script,iframe',
    removeOnError: true,
    safeJavaScriptLink: true
  }
});
```

### Strict Whitelisting

```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    allowTags: {
      p: true,
      strong: true,
      em: true,
      a: {
        href: true,
        target: '_blank' // Only allow target="_blank"
      }
    }
  }
});

editor.value = '<p>Hello <strong>world</strong> <script>alert(1)</script></p>';
console.log(editor.value); // <p>Hello <strong>world</strong> </p>
```

### Allow Specific Attributes

```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    allowTags: {
      img: {
        src: true,
        alt: true,
        width: true,
        height: true
      },
      a: {
        href: true
      }
    }
  }
});
```

### Eraser Button (Remove Formatting)

The plugin adds an "eraser" button to the toolbar:

```javascript
const editor = Jodit.make('#editor');
// User clicks eraser button or uses:
editor.execCommand('removeFormat');
```

### Priority: allowTags vs denyTags

**Important**: `allowTags` takes priority over `denyTags`. If `allowTags` is set, all tags not in the whitelist are removed.

```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    allowTags: {
      script: true,
    },
    denyTags: {
      script: true, // This is ignored!
    }
  }
});

editor.value = '<script>alert(1)</script><p>test</p>';
console.log(editor.value); // <script>alert(1)</script>
// Only script tag is allowed, <p> is removed
```

## Button

- **Name**: `eraser`
- **Group**: `font-style`
- **Command**: `removeFormat`
- **Tooltip**: "Clear Formatting"

## Notes

- Plugin runs continuously with lazy evaluation (`LazyWalker`)
- Cleaning is throttled by `timeout` option
- Uses visitor pattern for extensible filtering rules
- Filters can be found in `helpers/visitor/filters/`
- Essential for security in user-generated content scenarios
