# Progress Bar UI element

Displays a thin progress bar at the top of the editor workplace and provides a file upload animation.

## Usage

```typescript
const bar = jodit.progressbar;

// Show the progress bar
bar.show();

// Update progress (0–100)
bar.progress(45);

// Hide the progress bar
bar.hide();
```

## File upload animation

Animates a file icon that flies from a start point to an end point and fades out.
Coordinates are relative to the editor container. The animation element is rendered
in a separate container (like popups) so it is not clipped by `overflow` on the workplace.

```typescript
// Default: starts at top-center of the editor, flies up-right
bar.showFileUploadAnimation();

// Custom start position (relative to editor container)
bar.showFileUploadAnimation({ x: 100, y: 50 });

// Custom start and end positions
bar.showFileUploadAnimation(
    { x: 100, y: 50 },   // from
    { x: 300, y: -100 }  // to
);
```

If `from` is omitted, defaults to `{ x: containerWidth / 2, y: 0 }`.
If `to` is omitted, defaults to `{ x: from.x + 60, y: from.y - 80 }`.

Calling `destruct()` stops and removes any running animation.
