/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/dtd
 * @internal
 */

import type { IJodit, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * Checks whether the insertion of an element at the current location is allowed,
 * if it is not allowed, it deletes an empty block element or moves the cursor after it
 * @internal
 */
export function checkBlockNesting(jodit: IJodit, node: Nullable<Node>): void {
	if (Dom.isFragment(node)) {
		node = node.firstChild;
	}

	if (jodit.o.dtd.checkBlockNesting && Dom.isBlock(node)) {
		let parent: Nullable<Element> = null;
		let current: Nullable<Element> =
			jodit.s.current()?.parentElement ?? null;

		while (current && current !== jodit.editor) {
			if (Dom.isBlock(current)) {
				if (jodit.o.dtd.blockLimits[current.nodeName.toLowerCase()]) {
					break;
				}

				parent = current;
			}

			current = current.parentElement;
		}

		if (parent) {
			jodit.s.setCursorAfter(parent);

			if (Dom.isEmpty(parent)) {
				Dom.safeRemove(parent);
			}
		}
	}
}
