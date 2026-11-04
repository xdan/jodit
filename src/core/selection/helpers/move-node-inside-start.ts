/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module selection
 */

import type { IJodit } from 'jodit/types';
import { INSEPARABLE_TAGS, NBSP_SPACE } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';

/**
 * Moves the fake node inside the adjacent element if it lies next to it but not inside.
 * When the cursor is positioned in its place, it must be inside the element and not outside its border.
 * @private
 */
export function moveNodeInsideStart(
	j: IJodit,
	node: Node,
	start: boolean
): void {
	// A text node of non-breaking spaces trims to nothing, but it's text the
	// node mustn't move past
	const isContent = (n: Node): boolean =>
		!Dom.isEmptyTextNode(n) || Boolean(n.nodeValue?.includes(NBSP_SPACE));

	let sibling = Dom.findSibling(node, start, isContent),
		anotherSibling = Dom.findSibling(node, !start, isContent);

	while (
		Dom.isElement(sibling) &&
		!Dom.isTag(sibling, INSEPARABLE_TAGS) &&
		Dom.isContentEditable(sibling, j.editor) &&
		(!anotherSibling || !Dom.closest(node, Dom.isElement, j.editor))
	) {
		if (start || !sibling.firstChild) {
			Dom.append(sibling, node);
		} else {
			Dom.before(sibling.firstChild, node);
		}

		sibling = Dom.sibling(node, start);
		anotherSibling = Dom.sibling(node, !start);
	}
}
