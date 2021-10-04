/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Nullable } from '../../../types';
import { css } from '../css';
import { Dom } from '../../dom';

export function getScrollParent(node: Nullable<Node>): Nullable<Element> {
	const isElement = Dom.isHTMLElement(node);
	const overflowY = isElement && css(node, 'overflowY');
	const isScrollable =
		isElement && overflowY !== 'visible' && overflowY !== 'hidden';

	if (!node) {
		return null;
	} else if (isScrollable && node.scrollHeight >= node.clientHeight) {
		return node;
	}

	return (
		getScrollParent(node.parentNode) ||
		document.scrollingElement ||
		document.body
	);
}
