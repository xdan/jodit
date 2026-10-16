---
title: Video Properties Plugin
description: A dialog, opened from the media popup's Edit button, for the size, poster and playback settings of a video, and the size of an embed or the playback settings of audio.
keywords: jodit, video properties, video dialog, autoplay, poster, loop, muted, controls, embed size
---

# Video Properties Plugin

Adds a dialog for editing a video after it has been inserted. It opens from the Edit button in the media popup (`jodit-media`, `jodit` and `iframe` in the `popup` option), which shows when a video, audio or an embedded iframe is clicked.

## Features

- Width and height, with the ratio locked
- The poster: shown when there is one, replaced by URL or by upload, and removed
- Autoplay, Loop, Muted and Controls
- Delete

What the dialog offers depends on the media:

| Media            | Size | Poster | Playback settings |
| ---------------- | ---- | ------ | ----------------- |
| `<video>`        | yes  | yes    | yes               |
| `<iframe>` embed | yes  |        |                   |
| `<audio>`        |      |        | yes               |

## Playback Settings

Browsers only autoplay muted media, so Autoplay also writes `muted`, and for a video `playsinline`, so that an iPhone plays it in the page rather than full screen. Muted shows as on while Autoplay is on, and an autoplaying video is read as not muted otherwise, so turning Autoplay off gives the sound back. `playsinline` stays when Autoplay is turned off.

Controls can only be turned off while Autoplay is on, or the media could never be played. Applying the dialog gives controls to media that has neither.

Each attribute is only changed when its setting is, so `controls="controls"` stays as it is.

## Size

Sizes are written as the resizer writes them:

- A video gets a CSS width. It gets a CSS height too when it already has one of its own (a `height` attribute or style), or when the ratio is unlocked. Otherwise its height follows from its width, so it stays responsive.
- An embed gets `width` and `height` attributes, and inline styles as well when it already has them.

The size is left alone unless its fields are changed. A video with no size of its own shows its rendered size.

## Poster

The Poster field takes a URL. When the uploader or the file browser is configured, the button next to it opens the same Upload and Browse tabs as the image dialog's, accepting images, and the uploaded or chosen file becomes the poster.

```javascript
const editor = Jodit.make('#editor', {
	uploader: {
		url: '/upload'
	}
});
```

## Opening the Dialog

The Edit button fires `openVideoProperties` with the clicked element: the media, or a wrapper round it (`jodit-media`, the resizer's `jodit` wrapper for an embed, or a wrapper from `mediaWrappers`). Delete in the dialog removes that element.

```javascript
const video = editor.editor.querySelector('video');
editor.events.fire('openVideoProperties', video);
```

To leave the dialog out, disable the plugin, and take Edit (`pencil`) out of the media popup with the `popup` option:

```javascript
Jodit.make('#editor', {
	disablePlugins: ['videoProperties']
});
```
