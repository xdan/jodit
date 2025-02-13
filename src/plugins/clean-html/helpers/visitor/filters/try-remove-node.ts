/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { IDictionary, IJodit, Nullable } from 'jodit/types';
import { IS_INLINE } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
import { trim } from 'jodit/core/helpers/string/trim';

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
		if (allow && !allow[node.nodeName]) {
			return true;
		}

		if (!allow && deny && deny[node.nodeName]) {
			return true;
		}
	}

	if (!jodit.o.cleanHTML.removeEmptyElements) {
		return false;
	}

	return (
		Dom.isElement(node) &&
		node.nodeName.match(IS_INLINE) != null &&
		!Dom.isTemporary(node) &&
		trim((node as Element).innerHTML).length === 0 &&
		(current == null || !Dom.isOrContains(node, current))
	);
}
