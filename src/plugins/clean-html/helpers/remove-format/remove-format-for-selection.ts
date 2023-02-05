/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { attr } from 'jodit/core/helpers/utils';

import {
	isInlineBlock,
	removeFormatForCollapsedSelection
} from './remove-format-for-collapsed-selection';

/**
 * Remove formatting for all selected elements
 * @private
 */
export function removeFormatForSelection(jodit: IJodit): void {
	const { s, editor, createInside } = jodit,
		{ range } = s,
		left = range.cloneRange(),
		right = range.cloneRange(),
		fakeLeft = createInside.fake(),
		fakeRight = createInside.fake();

	left.collapse(true);
	right.collapse(false);

	Dom.safeInsertNode(left, fakeLeft);
	Dom.safeInsertNode(right, fakeRight);

	range.setStartBefore(fakeLeft);
	range.collapse(true);
	s.selectRange(range);
	removeFormatForCollapsedSelection(jodit, fakeLeft);

	range.setEndAfter(fakeRight);
	range.collapse(false);
	s.selectRange(range);
	removeFormatForCollapsedSelection(jodit, fakeRight);

	const shouldUnwrap: Node[] = [];

	Dom.between(fakeLeft, fakeRight, node => {
		if (isInlineBlock(node) && !Dom.isTag(node, ['a'])) {
			shouldUnwrap.push(node);
		}

		if (Dom.isElement(node) && attr(node, 'style')) {
			attr(node, 'style', null);
		}
	});

	shouldUnwrap.forEach(node => Dom.unwrap(node));

	const clearParent = (node: Node, left: boolean): true | void => {
		if (!Dom.findNotEmptySibling(node, left)) {
			const pn = node.parentNode as Element;

			if (pn && pn !== editor && attr(pn, 'style')) {
				attr(pn, 'style', null);
				clearParent(pn, left);

				return true;
			}
		}
	};

	clearParent(fakeLeft, true) && clearParent(fakeRight, false);

	range.setStartAfter(fakeLeft);
	range.setEndBefore(fakeRight);
	s.selectRange(range);

	Dom.safeRemove(fakeLeft);
	Dom.safeRemove(fakeRight);
}
