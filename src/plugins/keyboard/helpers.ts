/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Nullable } from '../../types';
import { call } from '../../core/helpers/utils';
import { Dom } from '../../core/dom';
import { INSEPARABLE_TAGS } from '../../core/constants';
import { trim } from '../../core/helpers/string';

export function getNeighbor(
	node: Node,
	backspace: boolean,
	root: HTMLElement
): Nullable<Node> {
	return call(
		backspace ? Dom.prev : Dom.next,
		node,
		n => Boolean(n && (!Dom.isText(n) || trim(n?.nodeValue || '').length)),
		root
	);
}

export function getSibling(node: Node, backspace: boolean): Nullable<Node> {
	return backspace ? node.previousSibling : node.nextSibling;
}

export function getNotSpaceSibling(
	node: Node,
	backspace: boolean
): Nullable<Node> {
	return Dom.getNormalSibling(node, backspace, n => {
		return (
			!Dom.isEmptyTextNode(n) &&
			Boolean(
				!Dom.isText(n) || (n.nodeValue?.length && trim(n.nodeValue))
			)
		);
	});
}

export function normalizeCursorPosition(node: Node, backspace: boolean): void {
	let sibling = Dom.getNormalSibling(node, backspace),
		anotherSibling = Dom.getNormalSibling(node, !backspace);

	while (
		Dom.isElement(sibling) &&
		!Dom.isTag(sibling, INSEPARABLE_TAGS) &&
		!anotherSibling
	) {
		if (backspace || !sibling.firstChild) {
			sibling.appendChild(node);
		} else {
			Dom.before(sibling.firstChild, node);
		}

		sibling = getSibling(node, backspace);
		anotherSibling = getSibling(node, !backspace);
	}
}
