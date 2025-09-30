# Video Plugin

Adds toolbar button for inserting YouTube/Vimeo videos via URL or embed code. The plugin provides a tabbed dialog where users can paste video URLs or custom iframe embed code.

## Features

- Insert videos from YouTube/Vimeo URLs
- Insert custom video embed code
- Tabbed interface (Link/Code tabs)
- Automatic URL to embed conversion
- Configurable default video dimensions
- Custom URL parser support
- Form validation for URLs
- Insert button integration

## Configuration Options

### `video.parseUrlToVideoEmbed`

**Type:** `(url: string, { width, height }?) => string`

**Default:** `convertMediaUrlToVideoEmbed` helper function

Custom function for converting video URLs to embed iframe code. Default function handles YouTube and Vimeo.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    video: {
        parseUrlToVideoEmbed: (url, { width, height }) => {
            // Custom conversion logic
            return `<iframe src="${url}" width="${width}" height="${height}"></iframe>`;
        }
    }
});
```

### `video.defaultWidth`

**Type:** `number`

**Default:** `400`

Default width in pixels for inserted video iframes.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    video: {
        defaultWidth: 640
    }
});
```

### `video.defaultHeight`

**Type:** `number`

**Default:** `345`

Default height in pixels for inserted video iframes.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    video: {
        defaultHeight: 360
    }
});
```

## Controls

### `video` Control

**Icon:** `'video'`

**Tooltip:** `'Insert youtube/vimeo video'`

**Group:** `'media'`

**Tags:** `['iframe']`

Opens tabbed dialog with Link and Code input options.

## Usage Examples

### Insert YouTube URL

```typescript
const editor = Jodit.make('#editor');

// Click Video button
// Enter: https://www.youtube.com/watch?v=VIDEO_ID
// Click Insert
// Iframe embed code inserted
```

### Insert Vimeo URL

```typescript
const editor = Jodit.make('#editor');

// Click Video button
// Enter: https://vimeo.com/VIDEO_ID
// Iframe embed code automatically generated
```

### Insert Custom Embed Code

```typescript
const editor = Jodit.make('#editor');

// Click Video button
// Switch to "Code" tab
// Paste custom iframe HTML
// Click Insert
```

### Custom Dimensions

```typescript
const editor = Jodit.make('#editor', {
    video: {
        defaultWidth: 800,
        defaultHeight: 450
    }
});

// All inserted videos use 800x450 dimensions
```

## Typical Use Case

Users need to embed YouTube/Vimeo videos in content. The video plugin provides this by adding a button that opens a dialog where users can paste video URLs which are automatically converted to embeddable iframe code with configurable dimensions.