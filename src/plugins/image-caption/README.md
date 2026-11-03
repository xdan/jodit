---
title: Image Caption Plugin
description: Gives an image a caption that moves, aligns and resizes with it, written as a figure and figcaption or in another editor's markup.
keywords: jodit, image caption, figure, figcaption, caption toggle, froala caption
---

# Image Caption Plugin

Gives an image a caption. The image, with its link if it has one, goes in a `<figure>` followed by a `<figcaption>`:

```html
<figure style="width: 300px;">
	<img src="photo.jpg" alt="" style="width: 100%;" />
	<figcaption>Testing the water at the river</figcaption>
</figure>
```

## Features

- A Caption button in the image popup, and a Caption checkbox in the image properties dialog, turn a caption on and off
- The figure takes the image's place: its alignment (`alignClasses.img` or an inline float), its margins and its width, so a long caption wraps under the image
- Resizing the image resizes the figure, which the image fills
- Only the caption can be edited, so typing can't land between the image and its caption
- A blank caption shows a placeholder, and goes when the caret leaves it
- Existing captions are recognised, in the markup `imageCaption` describes
- Another editor's caption markup can be read and written, as Froala's

## Turning a Caption On and Off

Click an image and press Caption in its popup (an image with a line under it). The image goes in a figure with an empty caption, and the caret goes into the caption. The button shows as on while the image has a caption, and pressing it again takes the caption away. The popup then stays open.

The image properties dialog has a Caption checkbox, shown while `image.showCaptionCheckbox` is `true`. A caption it adds takes the caret too.

With a caption:

- **Alignment and margins** move from the image to the figure, and back when the caption goes. The image popup's Align button and the dialog's alignment and margins act on the figure.
- **Width** moves to the figure, and the image gets `width: 100%`. Resizing the image or changing its width in the dialog sets the figure's width.
- **A paragraph** can't hold a figure, so an image in a line of text gets a line of its own, and the text either side stays. When the caption goes, the image is left in a paragraph of its own.
- **Vertical align** is disabled, as the figure places the image.
- **The popup** opens below the caption, so the caption stays in view.

The caption's text goes when the caption is turned off. Undo brings it back.

## Blank Captions

A blank caption shows "Caption" in the editor's language, in the placeholder's colour, until there's text. The placeholder is the `data-jodit-placeholder` attribute, which isn't in the editor's value or the source view.

A caption left blank goes when the caret leaves it, by a click elsewhere, Enter, an arrow key or the focus leaving the editor. It stays while another window or the editor's own popups and dialogs have the focus, as the link form does. A click on the image itself takes the caption away once the click is over, and the image's popup opens below the image.

Giving a caption and leaving it blank changes nothing. The line the caption split comes back together, the image gets its own `style` and `class` back, and the history has no step for it. Pressing Caption again before typing does the same.

Until something is typed in it, a new caption isn't in the editor's value either, and giving it fires no `change`. Saving straight away keeps the image as it was. That covers a tap on a Save button, which can come before the caption goes, and a toolbar button that leaves the caret in the caption.

Giving a caption isn't a step in the history of its own: the first thing typed in it is. Undo then goes from the caption back to the image without one, never to a blank caption, and Undo with the caret in a new, blank caption takes it off.

## Editing a Caption

The figure is `contenteditable="false"` and the caption `contenteditable="true"` while it's in the editor. Neither attribute is in the editor's value or the source view. A caption being typed in has a 1px outline in Jodit's focus colour, in place of the browser's focus ring.

| Key in a caption | Result |
| --- | --- |
| Enter | Starts a line after the image |
| Shift+Enter | Breaks the line in the caption |
| Backspace at its start, Delete at its end | Nothing, as the image isn't part of the caption |
| An arrow key that can't move the caret further | Takes the caret out, past the image, adding a line when there's none |
| Select all | Selects the caption |

Bold, italic, links, alignment and the other inline formats work in a caption. Headings, quotes and lists don't, as they would replace the caption.

A caption holds text. An image, a table, a rule or another block inserted with the caret in a caption goes after the captioned image, as Enter would take the caret there.

A click on a captioned image selects the figure. Delete, Backspace or typing then replaces the figure, as they do an image on a line of its own, and dragging the image moves the figure.

## Configuration

### `imageCaption`

**Type:** `{ wrapper: { tag: string; className: string }; inner: { tag: string; className: string } | null; caption: { tag: string; className: string } }`

**Default:**

```javascript
{
	wrapper: { tag: 'figure', className: '' },
	inner: null,
	caption: { tag: 'figcaption', className: '' }
}
```

The elements a captioned image is kept in, read from the content and written by the Caption button and checkbox:

- `wrapper` holds the image, or its link, and the caption.
- `inner`, when set, goes inside the wrapper, round the image and the caption.
- `caption` holds the caption's text.

An empty `className` matches the tag alone. A wrapper holding exactly one image and a caption is a captioned image. A figure holding a table, or two images, is left as it is.

Content from another editor can be captioned in its own way. Froala's caption is an inline `<span>`, which stays in its line:

```javascript
Jodit.make('#editor', {
	imageCaption: {
		wrapper: { tag: 'span', className: 'fr-img-caption' },
		inner: { tag: 'span', className: 'fr-img-wrap' },
		caption: { tag: 'span', className: 'fr-inner' }
	},
	alignClasses: {
		img: {
			left: 'fr-fil fr-dii',
			right: 'fr-fir fr-dii',
			center: 'fr-fic fr-dib',
			normal: 'fr-fic fr-dii'
		}
	}
});
```

which writes:

```html
<span class="fr-img-caption fr-fic fr-dib" style="width: 300px;">
	<span class="fr-img-wrap">
		<img src="photo.jpg" style="width: 100%;" />
		<span class="fr-inner">Testing the water at the river</span>
	</span>
</span>
```

## Styling

Browsers give a `<figure>` a margin of `1em 40px`, and Jodit doesn't style captions, so the page's stylesheet decides how they look, in the editor (`iframeStyle` or `iframeCSSLinks` in iframe mode) and on the page:

```css
figure {
	margin: 0 0 1em;
}

figcaption {
	font-size: 0.9em;
	text-align: center;
}
```

In the editor only, the plugin adds the outline round a caption being typed in and the placeholder's look. Both are in `:where()`, so any rule of the content's own changes them:

```css
figcaption:focus {
	outline: 2px dashed #888;
}

figcaption[data-jodit-placeholder]::before {
	color: #767676;
}
```

## Events

### `toggleImageCaption`

Gives an image a caption, or takes it away. The second argument says which, and without it the caption is toggled. Returns the new caption, `null` when a caption was taken away, or `undefined` when nothing changed.

```javascript
const image = editor.editor.querySelector('img');
const caption = editor.e.fire('toggleImageCaption', image, true);

editor.s.setCursorIn(caption);
editor.synchronizeValues();
```

## Helpers

`Jodit.modules.Helpers` has `getCaptionWrapper(editor, node)`, the captioned image's wrapper that is or holds `node`, `getCaptionedImage(editor, wrapper)` and `getImageCaption(editor, wrapper)`.

## Disabling the Plugin

```javascript
Jodit.make('#editor', {
	disablePlugins: ['imageCaption'],
	toolbarInlineDisabledButtons: ['source', 'caption'],
	image: { showCaptionCheckbox: false }
});
```
