/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Nullable } from '../../types';
import { call } from '../../core/helpers/utils';
import { Dom } from '../../core/dom';
import { INSEPARABLE_TAGS } from '../../core/constants';
import { trim } from '../../core/helpers/string';

export function getSibling(node: Node, backspace: boolean): Nullable<Node> {
	return backspace ? node.previousSibling : node.nextSibling;
}

/**
 * Returns the nearest non-empty neighbor
 *
 * @param node
 * @param backspace
 */
export function findNotEmptyNeighbor(
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

/**
 * Returns the nearest non-empty sibling
 *
 * @param node
 * @param backspace
 */
export function findNotEmptySibling(
	node: Node,
	backspace: boolean
): Nullable<Node> {
	return Dom.findSibling(node, backspace, n => {
		return (
			!Dom.isEmptyTextNode(n) &&
			Boolean(
				!Dom.isText(n) || (n.nodeValue?.length && trim(n.nodeValue))
			)
		);
	});
}

/**
 * Finds the nearest neighbor that would be in the maximum nesting depth.
 * Ie if neighbor `<DIV><SPAN>Text` then return Text node.
 *
 * @param node
 * @param right
 * @param root
 * @param onlyInlide
 */
export function findMostNestedNeighbor(
	node: Node,
	right: boolean,
	root: HTMLElement,
	onlyInlide: boolean = false
): Nullable<Node> {
	const nextChild = (node: Node) =>
		right ? node.firstChild : node.lastChild;

	let next = findNotEmptyNeighbor(node, !right, root);

	if (onlyInlide && Dom.isElement(next) && !Dom.isInlineBlock(next)) {
		return null;
	}

	if (next) {
		do {
			if (nextChild(next)) {
				next = nextChild(next);
			} else {
				return next;
			}
		} while (next);
	}

	return null;
}

/**
 * Moves the fake node inside the adjacent element if it lies next to it but not inside.
 * When the cursor is positioned in its place, it must be inside the element and not outside its border.
 *
 * @param node
 * @param backspace
 */
export function normalizeCursorPosition(node: Node, backspace: boolean): void {
	let sibling = Dom.findSibling(node, backspace),
		anotherSibling = Dom.findSibling(node, !backspace);

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
