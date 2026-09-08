/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module selection
 */

import {
	INVISIBLE_SPACE_REG_EXP_END as INV_END,
	INVISIBLE_SPACE_REG_EXP_START as INV_START
} from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';

export * from './move-node-inside-start';
export * from './move-the-node-along-the-edge-outward';

/**
 * Despite the name, returns `true` when the cursor is NOT at the checked edge
 * of the text node: there is significant (non invisible-space) text between
 * the offset and the start (`start = true`) or the end (`end = true`) of the string.
 * @private
 */
export function cursorInTheEdgeOfString(
	container: Node,
	offset: number,
	start: boolean,
	end: boolean
): boolean {
	const text = container.nodeValue?.length ? container.nodeValue : '';

	if (end && text.replace(INV_END(), '').length > offset) {
		return true;
	}

	const inv = INV_START().exec(text);

	return start && ((inv && inv[0].length < offset) || (!inv && offset > 0));
}

export function findCorrectCurrentNode(
	node: Node,
	range: Range,
	rightMode: boolean,
	isCollapsed: boolean,
	checkChild: boolean,
	child: (nd: Node) => Node | null
): { node: Node; rightMode: boolean } {
	node = range.startContainer.childNodes[range.startOffset];

	if (!node) {
		node = range.startContainer.childNodes[range.startOffset - 1];
		rightMode = true;
	}

	if (node && isCollapsed && !Dom.isText(node)) {
		// test Current method - Cursor in the left of some SPAN
		if (!rightMode && Dom.isText(node.previousSibling)) {
			node = node.previousSibling;
		} else if (checkChild) {
			// The fallback to the previous child changes the traversal direction
			// before the caller receives the updated rightMode.
			const nextChild = (nd: Node): Node | null =>
				rightMode ? nd.lastChild : child(nd);
			let current: Node | null = nextChild(node);

			while (current) {
				if (current && Dom.isText(current)) {
					node = current;
					break;
				}
				current = nextChild(current);
			}
		}
	}

	if (node && !isCollapsed && !Dom.isText(node)) {
		let leftChild: Node | null = node,
			rightChild: Node | null = node;

		do {
			leftChild = leftChild.firstChild;
			rightChild = rightChild.lastChild;
		} while (leftChild && rightChild && !Dom.isText(leftChild));

		if (leftChild === rightChild && leftChild && Dom.isText(leftChild)) {
			node = leftChild;
		}
	}

	return { node, rightMode };
}
