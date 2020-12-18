/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Nullable } from '../../types';
import { Dom } from '../../core/dom';
import { INSEPARABLE_TAGS } from '../../core/constants';
import { findNotEmptySibling } from './helpers';

export function getSiblingBox(
	node: HTMLElement,
	backspace: boolean,
	root: HTMLElement
): Nullable<Node> {
	while (node) {
		const isBox = (elm: Nullable<Node>): elm is HTMLElement =>
			Dom.isElement(elm) && !Dom.isTag(elm, INSEPARABLE_TAGS);

		const getBox = (node: Element): Nullable<Node> => {
			const child = backspace ? node.lastChild : node.firstChild;

			if (isBox(child)) {
				return getBox(child);
			}

			return isBox(node) ? node : null;
		};

		const sibling = findNotEmptySibling(node, backspace);

		if (sibling) {
			return isBox(sibling) ? getBox(sibling) : null;
		}

		if (node.parentElement && node.parentElement !== root) {
			node = node.parentElement;
		}
	}

	return null;
}
