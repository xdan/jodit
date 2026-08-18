/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { IJodit, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * @private
 */
export function removeEmptyTextNode(
	jodit: IJodit,
	node: Node,
	hadEffect: boolean,
	arg: unknown,
	argi: unknown,
	currentNode: Nullable<Node>
): boolean {
	if (Dom.isText(node) && !node.nodeValue) {
		// Restore the caret only while the editor owns focus. The walker runs
		// asynchronously, so the user may have already tabbed away — moving the
		// selection here would call `focus()` and steal focus back from the
		// element the user navigated to (e.g. Shift+Tab accessibility flow).
		if (
			node === currentNode &&
			jodit.s.isFocused() &&
			jodit.s.isCollapsed()
		) {
			jodit.s.setCursorAfter(node);
		}

		Dom.safeRemove(node);
		return true;
	}

	return hadEffect;
}
