/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CanUndef, IJodit, Nullable } from 'jodit/types';
import type { DeleteMode } from 'jodit/plugins/keyboard/backspace/interface';
import {
	findMostNestedNeighbor,
	getSibling
} from 'jodit/plugins/keyboard/helpers';
import { Dom } from 'jodit/core/dom';
import { call, isVoid, toArray, trimInv } from 'jodit/core/helpers';
import { INVISIBLE_SPACE, NBSP_SPACE } from 'jodit/core/constants';

/**
 * Check possibility the char can be removed
 *
 * @example
 * ```html
 * te|st
 * ```
 * result
 * ```html
 * t|st
 * ```
 * @private
 */
export function checkRemoveChar(
	jodit: IJodit,
	fakeNode: Node,
	backspace: boolean,
	mode: DeleteMode
): boolean {
	const step = backspace ? -1 : 1;
	const anotherSibling: Nullable<Node> = getSibling(fakeNode, !backspace);

	let sibling: Nullable<Node> = getSibling(fakeNode, backspace),
		removeNeighbor: Nullable<Node> = null;

	let charRemoved: boolean = false,
		removed: CanUndef<string>;

	while (sibling && (Dom.isText(sibling) || Dom.isInlineBlock(sibling))) {
		while (Dom.isInlineBlock(sibling)) {
			sibling = (
				backspace ? sibling?.lastChild : sibling?.firstChild
			) as Nullable<Node>;
		}

		if (!sibling) {
			break;
		}

		if (sibling.nodeValue?.length) {
			// For Unicode escapes
			let value = toArray(sibling.nodeValue);

			const length = value.length;

			let index = backspace ? length - 1 : 0;

			if (value[index] === INVISIBLE_SPACE) {
				while (value[index] === INVISIBLE_SPACE) {
					index += step;
				}
			}

			removed = value[index];

			if (value[index + step] === INVISIBLE_SPACE) {
				index += step;

				while (value[index] === INVISIBLE_SPACE) {
					index += step;
				}

				index += backspace ? 1 : -1;
			}

			if (backspace && index < 0) {
				value = [];
			} else {
				value = value.slice(
					backspace ? 0 : index + 1,
					backspace ? index : length
				);
			}

			if (
				!anotherSibling ||
				!Dom.isText(anotherSibling) ||
				(!backspace ? / $/ : /^ /).test(
					anotherSibling.nodeValue ?? ''
				) ||
				!trimInv(anotherSibling.nodeValue || '').length
			) {
				for (
					let i = backspace ? value.length - 1 : 0;
					backspace ? i >= 0 : i < value.length;
					i += backspace ? -1 : 1
				) {
					if (value[i] === ' ') {
						value[i] = NBSP_SPACE;
					} else {
						break;
					}
				}
			}

			sibling.nodeValue = value.join('');
		}

		if (!sibling.nodeValue?.length) {
			removeNeighbor = sibling;
		}

		if (!isVoid(removed) && removed !== INVISIBLE_SPACE) {
			charRemoved = true;

			call(backspace ? Dom.after : Dom.before, sibling, fakeNode);

			if (
				mode === 'sentence' ||
				(mode === 'word' && removed !== ' ' && removed !== NBSP_SPACE)
			) {
				checkRemoveChar(jodit, fakeNode, backspace, mode);
			}

			break;
		}

		let nextSibling = getSibling(sibling, backspace);

		if (
			!nextSibling &&
			sibling.parentNode &&
			sibling.parentNode !== jodit.editor
		) {
			nextSibling = findMostNestedNeighbor(
				sibling,
				!backspace,
				jodit.editor,
				true
			);
		}

		if (removeNeighbor) {
			Dom.safeRemove(removeNeighbor);
			removeNeighbor = null;
		}

		sibling = nextSibling;
	}

	if (charRemoved) {
		removeEmptyInlineParent(fakeNode);
		addBRInsideEmptyBlock(jodit, fakeNode);
		jodit.s.setCursorBefore(fakeNode);
	}

	return charRemoved;
}

/**
 * Helper remove all empty inline parents
 */
function removeEmptyInlineParent(node: Node): void {
	let parent = node.parentElement;

	while (parent && Dom.isInlineBlock(parent)) {
		const p = parent.parentElement;

		if (Dom.isEmpty(parent)) {
			Dom.after(parent, node);
			Dom.safeRemove(parent);
		}

		parent = p;
	}
}

/**
 * Helper add BR element inside empty block element
 */
function addBRInsideEmptyBlock(jodit: IJodit, node: Node): void {
	if (
		node.parentElement !== jodit.editor &&
		Dom.isBlock(node.parentElement) &&
		Dom.each(node.parentElement, Dom.isEmptyTextNode)
	) {
		Dom.after(node, jodit.createInside.element('br'));
	}
}
