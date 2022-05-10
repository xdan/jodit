/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/fix/clean-html
 */

import type { IDictionary, IJodit, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { IS_INLINE } from 'jodit/core/constants';
import { trim } from 'jodit/core/helpers/string/trim';

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

	return (
		jodit.o.cleanHTML.removeEmptyElements &&
		Dom.isElement(node) &&
		node.nodeName.match(IS_INLINE) != null &&
		!Dom.isTemporary(node) &&
		trim((node as Element).innerHTML).length === 0 &&
		(current == null || !Dom.isOrContains(node, current))
	);
}

// @ts-ignore
function removeExtraBR(
	jodit: IJodit,
	node: Node,
	current: Nullable<Node>
): boolean {
	// remove extra br
	if (
		Dom.isTag(node, 'br') &&
		hasNotEmptyTextSibling(node) &&
		!hasNotEmptyTextSibling(node, true) &&
		(current == null ||
			Dom.up(node, Dom.isBlock, jodit.editor) !==
				Dom.up(current, Dom.isBlock, jodit.editor))
	) {
		return true;
	}

	return false;
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
