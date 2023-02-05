/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/normalize
 */

import { INVISIBLE_SPACE_REG_EXP } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';

export function normalizeNode(node: Node | null): void {
	if (!node) {
		return;
	}

	if (Dom.isText(node) && node.nodeValue != null && node.parentNode) {
		while (Dom.isText(node.nextSibling)) {
			if (node.nextSibling.nodeValue != null) {
				node.nodeValue += node.nextSibling.nodeValue;
			}

			node.nodeValue = node.nodeValue.replace(
				INVISIBLE_SPACE_REG_EXP(),
				''
			);

			Dom.safeRemove(node.nextSibling);
		}
	} else {
		normalizeNode(node.firstChild);
	}

	normalizeNode(node.nextSibling);
}
