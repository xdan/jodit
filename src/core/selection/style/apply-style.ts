/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { ICreate, IJodit, Nullable } from '../../../types';
import type { CommitStyle } from './commit-style';
import { Dom } from '../../dom';
import { attr, css, normalizeNode } from '../../helpers';
import {
	getSuitParent,
	getSuitChild,
	checkSpecialElements,
	getClosestWrapper,
	unwrapChildren,
	wrapUnwrappedText,
	postProcessListElement,
	toggleStyles
} from './api';

/**
 * Apply options to selection
 */
export function ApplyStyle(jodit: IJodit, style: CommitStyle): void {
	const { s: sel, editor: root, createInside: ci } = jodit,
		rng = () => sel.createRange();

	let wrap: Nullable<boolean> = null;

	normalizeNode(sel.area.firstChild); // FF fix for test "commandsTest - Exec command "bold"

	sel.save();

	for (const font of jodit.s.wrapInTagGen()) {
		wrap = applyToElement(style, font, root, rng, ci, wrap);
	}

	sel.restore();
}

/**
 * Apply options to all selected fragment
 * @param font - a fake element that wraps all parts of the selection
 */
function applyToElement(
	style: CommitStyle,
	font: HTMLElement,
	root: HTMLElement,
	range: () => Range,
	ci: ICreate,
	wrap: Nullable<boolean>
): Nullable<boolean> {
	if (checkSpecialElements(font, root)) {
		return wrap;
	}

	const toggleNode =
		getSuitParent(style, font, root) ||
		getSuitChild(style, font) ||
		getClosestWrapper(style, font, root, range);

	if (toggleNode) {
		return toggleStyles(style, toggleNode, wrap);
	}

	if (unwrapChildren(style, font)) {
		return wrap;
	}

	if (wrap == null) {
		wrap = true;
	}

	if (!wrap) {
		return wrap;
	}

	let wrapper = font;

	if (style.elementIsBlock) {
		const ulReg = /^(ul|ol|li|td|th|tr|tbody|table)$/i;

		const box = Dom.up(
			font,
			node => {
				if (Dom.isBlock(node)) {
					if (
						ulReg.test(style.element) ||
						!ulReg.test(node.nodeName)
					) {
						return true;
					}
				}

				return false;
			},
			root
		);

		if (box) {
			wrapper = box;
		} else {
			wrapper = wrapUnwrappedText(style, font, root, ci, range);
		}
	}

	const newWrapper = Dom.replace(wrapper, style.element, ci, true);

	attr(newWrapper, 'size', null);

	if (style.elementIsBlock) {
		postProcessListElement(style, newWrapper, ci);
	}

	if (style.options.style && style.elementIsDefault) {
		css(newWrapper, style.options.style);
	}

	if (style.options.className) {
		newWrapper.classList.toggle(style.options.className);
	}

	return wrap;
}
