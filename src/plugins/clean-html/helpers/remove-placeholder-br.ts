/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { IJodit, Nullable } from 'jodit/types';
import { INSEPARABLE_TAGS } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
import { trim } from 'jodit/core/helpers/string/trim';

function lastNode(node: Node): Nullable<Node> {
	let last = node.lastChild;

	while (Dom.isText(last) && !last.nodeValue) {
		last = last.previousSibling;
	}

	return last;
}

/**
 * Remove the `<br>` that kept the block with the caret open while it was
 * empty, once text has gone into the block: when the block is one line of
 * text that ends in that `<br>`, the `<br>` adds nothing to it
 * @private
 */
export function removePlaceholderBr(jodit: IJodit): void {
	const block = Dom.closest(jodit.s.current(), Dom.isBlock, jodit.editor);

	if (!block || !trim(block.textContent ?? '')) {
		return;
	}

	let br = lastNode(block);

	while (
		Dom.isElement(br) &&
		!Dom.isTag(br, INSEPARABLE_TAGS) &&
		!Dom.isBlock(br)
	) {
		br = lastNode(br);
	}

	if (!Dom.isTag(br, 'br')) {
		return;
	}

	// Another line break, a block, an image or an embed means the `<br>` may
	// end an empty line, or give the caret a place after the embed
	const isOneLineOfText = Dom.each(block, (node): false | void => {
		if (
			node !== br &&
			Dom.isElement(node) &&
			(Dom.isTag(node, INSEPARABLE_TAGS) ||
				Dom.isBlock(node) ||
				(Dom.isHTMLElement(node) && !node.isContentEditable))
		) {
			return false;
		}
	});

	if (isOneLineOfText) {
		Dom.safeRemove(br);
	}
}
