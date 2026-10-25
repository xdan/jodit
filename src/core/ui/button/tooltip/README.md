---
title: Button Tooltip
description: A UI component that displays special tooltips for buttons and other interface elements in the Jodit editor.
keywords: jodit, tooltip, button tooltip, ui element, hint, interface
---

# Tooltip for buttons

`UITooltip` renders Jodit's custom (non-native) tooltips. A single instance is created per
view and it listens, via delegation, for `mouseenter`/`mouseleave` on the editor container.
When the pointer enters any Jodit element that carries an `aria-label`, the tooltip shows
that label near the element.

You normally don't call it directly — buttons get tooltips just by setting
`state.tooltip` (which becomes the element's `aria-label`, see [[UIButton]]). The component
activates automatically only when all of these editor options hold:

- `showTooltip` is enabled,
- `useNativeTooltip` is **off** (otherwise the browser's native `title` is used),
- `textIcons` is off.

```js
// Any Jodit element with an aria-label gets a custom tooltip for free:
const btn = Jodit.modules.Button(jodit, 'link');
btn.state.tooltip = 'Insert link'; // -> aria-label="Insert link"
```

## Behaviour

- **Delayed show.** Appears after `showTooltipDelay` (falls back to the view's
  `defaultTimeout`); a `0` delay shows it immediately.
- **Smart placement.** Positioned below the target and centered; if it would overflow the
  bottom of the viewport it flips above (a `_above` modifier is set). It is `position: fixed`
  and compensates for any `transform`ed ancestor (e.g. an editor inside a modal) and for a
  pinch-zoomed page in Safari.
- **Auto-hide.** Hidden on `mouseleave`, page scroll, `escape`, editor `change`, dialog
  close, and whenever popups open/close — so it never lingers over stale UI.
- **Skips disabled elements** and elements without the `jodit` class prefix.

Disabled entirely when `useNativeTooltip: true` (native `title` attribute is used instead)
or when `showTooltip: false`.
