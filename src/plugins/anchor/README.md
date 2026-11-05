---
title: Anchor Plugin
description: Inserts anchors, empty `<a id>` elements that links reach as `#name`, shows each as a marker in the editor, and renames or removes them, updating the links to them.
keywords: jodit, anchor plugin, anchor, bookmark, a id, a name, link to anchor, in-page link, jump link
---

# Anchor Plugin

Adds anchors: points in the document that links jump to, for long pages such as policies, newsletters and FAQs. An anchor is an `<a>` with an `id`, no `href` and nothing in it. A link reaches it with `#name` as its URL.

## Features

- An **Insert anchor** button in the `insert` group, which asks for a name and inserts `<a id="name"></a>` at the caret, or at the start of selected text
- The name can't have spaces, or be the `id` of another element or the name of another anchor; the form says why when it doesn't fit. A `#` typed before it is dropped
- Each anchor shows as a small marker in the editing area only, so the value doesn't change
- Clicking a marker opens a popup to rename the anchor or remove it, and Escape closes it. A rename also updates the links to it in the document, unless something else still has the old name, as after a copy of the anchor is pasted
- An empty `<a id>` or `<a name>` with no `href`, as older content has, counts as an anchor and keeps whichever attribute it has. New anchors use `id`, as `name` on `<a>` is obsolete in HTML5
- The link popup lists the document's anchors by the words after them, to pick as the URL (see the link plugin)

## Configuration Options

### Control Configuration: `anchor`

```typescript
const editor = Jodit.make('#editor', {
	buttons: ['bold', 'italic', '|', 'link', 'anchor']
});
```

The popup for an anchor is `popup.anchor`, as other elements' popups are, so it can be replaced:

```typescript
const editor = Jodit.make('#editor', {
	popup: {
		anchor: (editor, anchor, close) => myAnchorForm(editor, anchor, close)
	}
});
```

## How It Works

### Insert

1. The button fires `generateAnchorForm` and shows the form it returns
2. On submit, the selection is restored and collapsed to its start
3. Inside a link, the anchor goes just before it, as an `<a>` can't hold another
4. The anchor is inserted with `insertNode`, and the caret goes after it

### In the Editor

- On `change`, `afterInit` and `afterSetMode`, each anchor gets `contenteditable="false"`, so typing beside it never goes into it, the arrow keys step over it, and Backspace or Delete removes it whole.
- On `afterGetValueFromEditor`, that attribute comes off again, so it isn't saved
- The marker is a `::before`, drawn by a style in the editing document (the iframe's in iframe mode)

### Click

- A `clickA` handler, at the top, opens `popup.anchor` for an anchor through `showPopup`, and stops the link's toolbar opening for it. With the plugin off, an anchor gets the link's toolbar as before
- In a readonly editor a click opens nothing, and a form still open when the editor turns readonly closes on Insert, Update or Remove without changing anything

## Notes

- An `<a name>` that holds text is a link target too, but not an anchor here: it has no marker, as its text shows where it is
- Removing an anchor leaves the links to it as they are
- The labels can be renamed through `i18n`, for example to "bookmark": `i18n: { en: { 'Insert anchor': 'Insert bookmark', Anchor: 'Bookmark', 'Link to an anchor': 'Link to a bookmark' } }`
