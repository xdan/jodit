# VDOM migration — ideas for the next minor

Working notes for the move to virtual-DOM editing. This file collects what
**cannot** be done right now without breaking the public API, plus candidates
for the next minor release. Current stage (patch releases): all code talks to
the DOM only through the `Dom` module and the `attr()`/`css()` helpers; `Dom`
is typed with the `VNode`/`VElement`/... interfaces (`src/types/vdom.d.ts`),
and the contract is pinned by the `dom.test.js → Virtual DOM contract` suite
(`Dom` runs against a non-browser VNode implementation).

## Do in the next minor (breaking for TS users)

- **`NodeCondition` → `(node: Nullable<VNode>) => boolean`.** All traversal
  methods (`first/last/find/next/prev/up/closest/each/between/
  findWithCurrent/nextGen/eachGen`) are still typed with the browser `Node`,
  because with `strictFunctionTypes` changing the callback parameter type
  breaks user callbacks that are explicitly typed (contravariance). In the
  minor release switch `NodeCondition` and every traversal method to `VNode`.
- **`Dom.wrap` / `Dom.replace`** are tied to `HTMLElementTagNameMap` and
  `ICreate` (they return browser types). In the minor: generics over the
  `VElement` subset.
- **Guards `isText/isElement/isHTMLElement/...`** narrow to
  `node is Text/Element/HTMLElement`. In the minor: `node is VText/VElement/...`,
  otherwise the whole browser API is still reachable behind the guard.
- **`css()`** requires a real `HTMLElement`: the getter goes through
  `getComputedStyle` (layout!). For VDOM split it: writing styles is pure
  (`VStyle`), reading computed values is a separate measuring service that
  becomes a stub/async in virtual mode.
- **`Dom.isHTMLElement`** does a realm check via `instanceof
  win.HTMLElement` — purely browser semantics; in VDOM mode a flag on the
  node itself is needed.

## Fundamental VDOM blockers (need design)

- **Range/Selection**: `Dom.safeInsertNode(range)` and the whole
  `core/selection` — native `Range`/`Selection` cannot be abstracted by a
  structural subset. A virtual selection model is needed (anchor/focus as
  paths in the tree) plus an adapter to the native one.
- **Measurements/layout**: `getBoundingClientRect`, `offset*`, `scroll*`
  (scroll-into-view, popups, resizers) are unavailable in VDOM. A separate
  "measurer" interface living only in the browser renderer.
- **contenteditable events** (`beforeinput/input/composition`) are the source
  of truth for the VDOM diff — must be designed together with History.

## Removal/simplification candidates

- `Dom.temporaryList` — deprecated, rewritten without `querySelectorAll`;
  remove entirely in the minor.

## Split `css()` into computed vs raw-inline reading

Today one function covers three different questions and the call sites have
to pick between three spellings:

- `css(elm, key)` — **computed** value (falls back to `getComputedStyle`,
  forces a style recalc);
- `css(elm, key, true)` — inline-only, but the result still goes through
  `normalizeCssValue`/`NUMBER_FIELDS_REG` (`'0px'` → `0`, potential
  `700 ↔ bold` rewrites), so it is unusable for exact string comparisons and
  save/restore;
- `elm.style.getPropertyValue(key)` — raw inline value (part of the `VStyle`
  subset); used where exactness matters (`resizer`, `media`, `jodit.ts`
  display save/restore, `image-properties` readers, `table.ts`).

In the minor make the intent explicit instead of positional booleans:

- `css(elm, key)` — computed read (later: the "measurer" service, see the
  VDOM blockers section);
- `cssInline(elm, key)` (or `css.raw`) — exact inline read, no normalization,
  no layout access — pure against `VStyle`, works in virtual mode;
- keep the setter as is.

Then migrate the `getPropertyValue` call sites and the `css(elm, key, true)`
call sites (popup/dialog `zIndex`, `align.ts`, `indent`, `resizer`) to the
new helper and deprecate the `onlyStyleMode` boolean argument.

## `attr()` helper needs an exact-name mode

`attr()` runs the key through `CamelCaseToKebabCase`, so it cannot be used
with dynamic attribute names that may contain uppercase (`onLoad`, `viewBox`)
— sanitizers and attribute-comparison code keep raw
`getAttribute`/`removeAttribute` for exactness (`safe-html.ts`,
`is-same-attributes.ts`). In the minor add `attr.raw(elm, name, value?)` (no
kebab-casing, no `data-` fallback, no IMG px stripping) and migrate those
spots.

## Sanctioned direct-DOM boundaries

- `src/core/dom/dom.ts`, `src/core/create/create.ts`, the `attr`/`css`
  helpers — they are the abstraction boundary; browser API inside is fine.
- `src/core/helpers/utils/selector.ts` — `$$` (deprecated, internal) and
  `resolveElement` resolve **user-supplied CSS selectors** (options may pass a
  selector string) — a selector engine is unavoidable there.
- `src/core/helpers/html/apply-styles.ts` — applies selectors coming from
  pasted `<style>` sheets (`CSSStyleRule.selectorText`) — same reason.
- `src/core/constants.ts` — bootstrap `document.querySelectorAll('script[src]')`
  to detect the editor's own `<script>` for `BASE_PATH`.
- `src/core/helpers/html/safe-html.ts` — raw attribute reads/removals in the
  sanitizer (see the exact-name note above).
- Scratch-iframe factories (`reset.ts`, `apply-styles.ts`,
  `toggle-attributes.ts` shadow root, `create.ts` sandbox) use
  `document.createElement('iframe')` + `contentWindow` — browser-only by
  nature, stays in the browser renderer layer.
- `src/core/helpers/utils/reset.ts` keeps raw `appendChild`/`removeChild`:
  it is imported by `to-array`, which `Dom` itself depends on — importing
  `Dom` there creates a circular dependency (`to-array → reset → dom`).

## Other follow-ups

- `Dialog.setMaxZIndex` now walks the whole `destination` subtree
  (`Dom.each`) instead of `querySelectorAll('.jodit-dialog')`. Fine for
  normal pages; for a huge `document.body` a dialog registry (track open
  dialogs in a static set) would be cleaner and O(1) — do it in the minor.
- `getElm`/`getElms` (`core/traits/elms.ts`) and the class-based lookups in
  `image-editor`/`table`/`symbols` share the same "find by class inside
  container" pattern — could become `Dom.firstWithClass`/`Dom.allWithClass`
  helpers.
- `VTokenList` lacks `length` (used by `toggle-attributes.ts` via
  `classList.length`) — add it to the interface when that file migrates to
  `VElement`.
