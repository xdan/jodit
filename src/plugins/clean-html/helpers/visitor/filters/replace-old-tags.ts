/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { HTMLTagNames, IDictionary, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * @private
 */
export function replaceOldTags(
	jodit: IJodit,
	nodeElm: Node,
	hadEffect: boolean
): boolean {
	const newNodeElm = replaceIfMatched(
		jodit,
		nodeElm,
		jodit.o.cleanHTML.replaceOldTags
	);

	if (nodeElm !== newNodeElm) {
		return true;
	}

	return hadEffect;
}

/**
 * Replaces an element with a newer one if specified in the configuration match
 * @private
 */
function replaceIfMatched(
	jodit: IJodit,
	oldParent: Node,
	list: IDictionary<HTMLTagNames> | false
): Node {
	if (!list || !Dom.isHTMLElement(oldParent)) {
		return oldParent;
	}

	const tagName: string =
		list[oldParent.nodeName.toLowerCase()] || list[oldParent.nodeName];

	if (tagName) {
		const restoreSelection = keepSelection(jodit, oldParent);

		const newParent = Dom.replace(
			oldParent as HTMLElement,
			tagName as HTMLTagNames,
			jodit.createInside,
			true,
			false
		);

		restoreSelection?.(newParent);

		return newParent;
	}

	return oldParent;
}

/**
 * Moving the children out of an element collapses a selection inside them to
 * where the element was, so the caret jumps to the start of the text being
 * typed. Returns a callback that puts the selection back on the same nodes.
 *
 * Like `removeEmptyTextNode`, it leaves the selection alone once focus has
 * left the editor, because selecting would take focus back.
 */
function keepSelection(
	jodit: IJodit,
	elm: Node
): ((newElm: Node) => void) | null {
	const { sel } = jodit.s;

	if (!sel?.anchorNode || !sel.focusNode || !jodit.s.isFocused()) {
		return null;
	}

	const { anchorNode, anchorOffset, focusNode, focusOffset } = sel;

	if (
		!Dom.isOrContains(elm, anchorNode) &&
		!Dom.isOrContains(elm, focusNode)
	) {
		return null;
	}

	return (newElm: Node): void => {
		sel.setBaseAndExtent(
			anchorNode === elm ? newElm : anchorNode,
			anchorOffset,
			focusNode === elm ? newElm : focusNode,
			focusOffset
		);
	};
}
