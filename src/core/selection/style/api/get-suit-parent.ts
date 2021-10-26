/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Nullable } from '../../../../types';
import type { CommitStyle } from '../commit-style';
import { Dom } from '../../../dom';
import { isNormalNode } from './is-normal-node';
import { isSuitElement } from './is-suit-element';

/**
 * Checks if the parent of an element is suitable for applying styles, if applicable, then returns the parent *
 *
 * @param style - styles to be applied
 * @param node - checked item
 * @param root - editor root
 */
export function getSuitParent(
	style: CommitStyle,
	node: Node,
	root: Node
): Nullable<HTMLElement> {
	const { parentNode } = node;

	if (
		Dom.isHTMLElement(parentNode) &&
		!Dom.next(node, isNormalNode, parentNode) &&
		!Dom.prev(node, isNormalNode, parentNode) &&
		isSuitElement(style, parentNode, false) &&
		parentNode !== root &&
		(!Dom.isBlock(parentNode) || style.elementIsBlock)
	) {
		return parentNode;
	}

	return null;
}
