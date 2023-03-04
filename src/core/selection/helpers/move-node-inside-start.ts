/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module selection
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { INSEPARABLE_TAGS } from 'jodit/core/constants';

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
	let sibling = Dom.findSibling(node, start),
		anotherSibling = Dom.findSibling(node, !start);

	while (
		Dom.isElement(sibling) &&
		!Dom.isTag(sibling, INSEPARABLE_TAGS) &&
		Dom.isContentEditable(sibling, j.editor) &&
		(!anotherSibling || !Dom.closest(node, Dom.isElement, j.editor))
	) {
		if (start || !sibling.firstChild) {
			sibling.appendChild(node);
		} else {
			Dom.before(sibling.firstChild, node);
		}

		sibling = Dom.sibling(node, start);
		anotherSibling = Dom.sibling(node, !start);
	}
}
