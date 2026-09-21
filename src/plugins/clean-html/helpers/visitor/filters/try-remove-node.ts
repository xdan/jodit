/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { IDictionary, IJodit, Nullable } from 'jodit/types';
import { IS_INLINE } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
import { trimInv } from 'jodit/core/helpers/string/trim';
import { attr } from 'jodit/core/helpers/utils/attr';

import { isAllowedMediaEmbed } from '../../is-allowed-media-embed';

/**
 * @private
 */
export function tryRemoveNode(
	jodit: IJodit,
	nodeElm: Node,
	hadEffect: boolean,
	allowTags: IDictionary | false,
	denyTags: IDictionary | false,
	currentSelectionNode: Nullable<Node>
): boolean {
	if (
		isRemovableNode(
			jodit,
			nodeElm,
			currentSelectionNode,
			allowTags,
			denyTags
		)
	) {
		Dom.safeRemove(nodeElm);
		return true;
	}

	return hadEffect;
}

/**
 * @private
 */
function isRemovableNode(
	jodit: IJodit,
	node: Node,
	current: Nullable<Node>,
	allow: IDictionary | false,
	deny: IDictionary | false
): boolean {
	if (!Dom.isText(node)) {
		// The allow/deny hashes are keyed by upper-cased tag name. HTML
		// `nodeName` is already upper-case, but foreign (SVG/MathML) elements
		// keep their original case — an SVG `<script>` reports `"script"`, so a
		// case-sensitive lookup let it slip past `denyTags` and execute. Normalise
		// to upper case so namespace can't bypass the filter. See
		// GHSA-45qg-252v-3f7p.
		const name = node.nodeName.toUpperCase();

		if (allow && !allow[name]) {
			return true;
		}

		// A YouTube/Vimeo player inserted through the Video button is trusted
		// editor content, so keep it even though `iframe` is denied by default
		// — otherwise the embed is stripped ~300ms after insertion (#1381).
		// Arbitrary/bare iframes stay denied.
		const isTrustedEmbed =
			name === 'IFRAME' &&
			isAllowedMediaEmbed(attr(node as Element, 'src') || '');

		if (!allow && deny && deny[name] && !isTrustedEmbed) {
			return true;
		}
	}

	if (!jodit.o.cleanHTML.removeEmptyElements) {
		return false;
	}

	// Never drop an empty inline element that currently holds the caret — it is
	// a pending-format marker the user is about to type into (#1291). `current`
	// is captured before a click moves the caret, so also check the live caret.
	const liveCaret = jodit.s.isCollapsed()
		? jodit.s.range.startContainer
		: null;

	return (
		Dom.isElement(node) &&
		node.nodeName.match(IS_INLINE) != null &&
		!Dom.isTemporary(node) &&
		!isFragmentTarget(node as Element) &&
		trimInv((node as Element).innerHTML).length === 0 &&
		(current == null || !Dom.isOrContains(node, current)) &&
		(liveCaret == null || !Dom.isOrContains(node, liveCaret))
	);
}

/**
 * An element with an `id`, or an `<a>` with a `name`, is where an in-page link
 * (`#fragment`) lands. It is usually empty (`<a name="top"></a>`), and removing
 * it silently breaks every link that points at it.
 */
function isFragmentTarget(element: Element): boolean {
	return (
		element.hasAttribute('id') ||
		(element.nodeName === 'A' && element.hasAttribute('name'))
	);
}
