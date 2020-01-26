/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { INVISIBLE_SPACE_REG_EXP } from '../../../constants';
import { Dom } from '../../Dom';

export const normalizeNode = (node: Node | null) => {
	if (!node) {
		return;
	}

	if (Dom.isText(node) && node.nodeValue !== null && node.parentNode) {
		while (Dom.isText(node.nextSibling)) {
			if (node.nextSibling.nodeValue !== null) {
				node.nodeValue += node.nextSibling.nodeValue;
			}

			node.nodeValue = node.nodeValue.replace(
				INVISIBLE_SPACE_REG_EXP,
				''
			);

			Dom.safeRemove(node.nextSibling);
		}
	} else {
		normalizeNode(node.firstChild);
	}

	normalizeNode(node.nextSibling);
};
