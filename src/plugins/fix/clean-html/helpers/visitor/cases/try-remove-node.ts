/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary, IJodit, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { IS_INLINE } from 'jodit/core/constants';
import { trim } from 'jodit/core/helpers/string/trim';

export function tryRemoveNode(
	jodit: IJodit,
	nodeElm: Node,
	currentSelectionNode: Nullable<Node>,
	allowTags: IDictionary | false,
	denyTags: IDictionary | false
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

	return false;
}

function isRemovableNode(
	jodit: IJodit,
	node: Node,
	current: Nullable<Node>,
	allow: IDictionary | false,
	deny: IDictionary | false
): boolean {
	if (
		!Dom.isText(node) &&
		((allow && !allow[node.nodeName]) || (deny && deny[node.nodeName]))
	) {
		return true;
	}

	// remove extra br
	if (
		current &&
		Dom.isTag(node, 'br') &&
		hasNotEmptyTextSibling(node) &&
		!hasNotEmptyTextSibling(node, true) &&
		Dom.up(node, Dom.isBlock, jodit.editor) !==
			Dom.up(current, Dom.isBlock, jodit.editor)
	) {
		return true;
	}

	return (
		jodit.o.cleanHTML.removeEmptyElements &&
		current != null &&
		Dom.isElement(node) &&
		node.nodeName.match(IS_INLINE) != null &&
		!Dom.isTemporary(node) &&
		trim((node as Element).innerHTML).length === 0 &&
		!Dom.isOrContains(node, current)
	);
}

function hasNotEmptyTextSibling(node: Node, next = false): boolean {
	let prev = next ? node.nextSibling : node.previousSibling;

	while (prev) {
		if (Dom.isElement(prev) || !Dom.isEmptyTextNode(prev)) {
			return true;
		}

		prev = next ? prev.nextSibling : prev.previousSibling;
	}

	return false;
}
