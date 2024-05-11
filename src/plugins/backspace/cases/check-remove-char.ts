/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/backspace
 */

import type { CanUndef, HTMLTagNames, IJodit, Nullable } from 'jodit/types';
import type { DeleteMode } from 'jodit/plugins/backspace/interface';
import { INVISIBLE_SPACE, NBSP_SPACE } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom';
import { call, isVoid, toArray, trimInv } from 'jodit/core/helpers';

import { findMostNestedNeighbor } from 'jodit/plugins/backspace/helpers';

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
	const anotherSibling = Dom.sibling(fakeNode, !backspace);

	let sibling: Nullable<Node> = Dom.sibling(fakeNode, backspace);
	let removeNeighbor: Nullable<Node> = null;

	let charRemoved: boolean = false;
	let removed: CanUndef<string>;

	if (!sibling) {
		sibling = getNextInlineSibling(fakeNode, backspace, jodit.editor);
	}

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
			removed = tryRemoveChar(sibling, backspace, step, anotherSibling);

			if (
				!sibling.nodeValue.length &&
				Dom.isInlineBlock(sibling.parentNode)
			) {
				sibling.nodeValue = INVISIBLE_SPACE;
			}
		}

		if (!sibling.nodeValue?.length) {
			removeNeighbor = sibling;
		}

		if (!isVoid(removed) && removed !== INVISIBLE_SPACE) {
			checkRepeatRemoveCharAction(
				backspace,
				sibling,
				fakeNode,
				mode,
				removed,
				jodit
			);

			charRemoved = true;
			break;
		}

		const nextSibling = getNextInlineSibling(
			sibling,
			backspace,
			jodit.editor
		);

		if (removeNeighbor) {
			Dom.safeRemove(removeNeighbor);
			removeNeighbor = null;
		}

		sibling = nextSibling;
	}

	if (removeNeighbor) {
		Dom.safeRemove(removeNeighbor);
		removeNeighbor = null;
	}

	if (charRemoved) {
		removeEmptyForParent(fakeNode, 'a');
		addBRInsideEmptyBlock(jodit, fakeNode);
		jodit.s.setCursorBefore(fakeNode);

		if (
			Dom.isTag(fakeNode.previousSibling, 'br') &&
			!Dom.findNotEmptySibling(fakeNode, false)
		) {
			Dom.after(fakeNode, jodit.createInside.element('br'));
		}
	}

	return charRemoved;
}

function getNextInlineSibling(
	sibling: Node,
	backspace: boolean,
	root: HTMLElement
): Nullable<Node> {
	let nextSibling = Dom.sibling(sibling, backspace);

	if (!nextSibling && sibling.parentNode && sibling.parentNode !== root) {
		nextSibling = findMostNestedNeighbor(sibling, !backspace, root, true);
	}

	return nextSibling;
}

/**
 * Helper removes all empty inline parents
 */
function removeEmptyForParent(node: Node, tags: HTMLTagNames): void {
	let parent = node.parentElement;

	while (parent && Dom.isInlineBlock(parent) && Dom.isTag(parent, tags)) {
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

function tryRemoveChar(
	sibling: Node,
	backspace: boolean,
	step: number,
	anotherSibling: Node | null | Text
): string {
	// For Unicode escapes
	let value = toArray(sibling.nodeValue!);

	const length = value.length;

	let index = backspace ? length - 1 : 0;

	if (value[index] === INVISIBLE_SPACE) {
		while (value[index] === INVISIBLE_SPACE) {
			index += step;
		}
	}

	const removed = value[index];

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
	replaceSpaceOnNBSP(anotherSibling, backspace, value);

	sibling.nodeValue = value.join('');
	return removed;
}

function replaceSpaceOnNBSP(
	anotherSibling: Node | Text | null,
	backspace: boolean,
	value: string[]
): void {
	if (
		!anotherSibling ||
		!Dom.isText(anotherSibling) ||
		(!backspace ? / $/ : /^ /).test(anotherSibling.nodeValue ?? '') ||
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
}

function checkRepeatRemoveCharAction(
	backspace: boolean,
	sibling: Node,
	fakeNode: Node,
	mode: 'char' | 'word' | 'sentence',
	removed: string,
	jodit: IJodit
): void {
	call(backspace ? Dom.after : Dom.before, sibling, fakeNode);

	if (
		mode === 'sentence' ||
		(mode === 'word' && removed !== ' ' && removed !== NBSP_SPACE)
	) {
		checkRemoveChar(jodit, fakeNode, backspace, mode);
	}
}
