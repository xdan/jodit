---
title: Video Properties Plugin
description: A dialog, opened from the media popup's Edit button, for the size, poster and playback settings of a video, and the size of an embed or the playback settings of audio, and the media popup's Replace.
keywords: jodit, video properties, video dialog, autoplay, poster, loop, muted, controls, embed size, replace video
---

# Video Properties Plugin

Adds a dialog for editing a video after it has been inserted, and a way to replace it. The dialog opens from the Edit button in the media popup (`jodit-media`, `jodit` and `iframe` in the `popup` option), which shows when a video, audio or an embedded iframe is clicked, and Replace from its Replace button.

## Features

- Width and height, with the ratio locked
- The poster: shown when there is one, replaced by URL or by upload, and removed
- Autoplay, Loop, Muted and Controls
- Delete
- Replace, keeping the classes, size and settings

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

## Replace

The media popup's Replace button opens the video popup's tabs (Upload, Link and Code) for the clicked media. What a tab inserts takes the old media's place:

- It keeps its own source and poster. A video uploaded through `video.defaultHandlerSuccess` has the poster that handler gives it, and Jodit's default handler gives none.
- It takes the old media's classes and inline styles, and its wrapper's when both are in a wrapper from `mediaWrappers`.
- It takes the old media's size, if it had one of its own, and its playback settings, written as the dialog writes them. So an embed that replaces a video gets the video's size as attributes, and a video that replaces an embed gets a CSS width.

The tabs insert as the video popup does, with the cursor after the old media, and the first thing inserted takes its place. So a `video.defaultHandlerSuccess` that inserts straight away with `editor.s.insertNode` or `editor.s.insertHTML` works for Replace too. Undo puts the old media back in one step.

The Replace button gets the tabs from the `generateReplaceVideoTabs` event:

```javascript
const tabs = editor.events.fire('generateReplaceVideoTabs', video, close);
```

## Opening the Dialog

The Edit button fires `openVideoProperties` with the clicked element: the media, or a wrapper round it (`jodit-media`, the resizer's `jodit` wrapper for an embed, or a wrapper from `mediaWrappers`). Delete in the dialog removes that element.

```javascript
const video = editor.editor.querySelector('video');
editor.events.fire('openVideoProperties', video);
```

To leave the dialog and Replace out, disable the plugin, and take Edit (`pencil`) and Replace (`replace`) out of the media popup with the `popup` option:

```javascript
Jodit.make('#editor', {
	disablePlugins: ['videoProperties']
});
```
