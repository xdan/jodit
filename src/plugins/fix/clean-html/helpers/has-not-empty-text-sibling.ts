/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Dom } from 'jodit/core/dom';

export function hasNotEmptyTextSibling(node: Node, next = false): boolean {
	let prev = next ? node.nextSibling : node.previousSibling;

	while (prev) {
		if (Dom.isElement(prev) || !Dom.isEmptyTextNode(prev)) {
			return true;
		}

		prev = next ? prev.nextSibling : prev.previousSibling;
	}

	return false;
}
