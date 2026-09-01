/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { ICommitStyle, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

import { isNormalNode } from './is-normal-node';
import { isSuitElement } from './is-suit-element';

/**
 * Checks if the parent of an element is suitable for applying styles, if applicable, then returns the parent *
 *
 * @param style - styles to be applied
 * @param node - checked item
 * @param root - editor root
 * @private
 */
export function getSuitParent(
	style: ICommitStyle,
	node: Node,
	root: Node
): Nullable<HTMLElement> {
	const { parentNode } = node;

	if (
		parentNode === root ||
		!Dom.isHTMLElement(parentNode) ||
		Dom.next(node, isNormalNode, parentNode) ||
		Dom.prev(node, isNormalNode, parentNode)
	) {
		return null;
	}

	// <h3><span style="color:red">|test|</span></h3> => apply <h2>
	if (
		style.isElementCommit &&
		style.elementIsBlock &&
		!Dom.isBlock(parentNode)
	) {
		return getSuitParent(style, parentNode, root);
	}

	// <li>|test|</li> => apply the CSS style to the <li> itself, so the
	// list marker (bullet/number) gets the same color and size as the text.
	// Only for pure style commits: bold/italic keep wrapping the content.
	// See #1460
	if (
		Dom.isTag(parentNode, 'li') &&
		!style.isElementCommit &&
		style.options.attributes?.style
	) {
		return parentNode;
	}

	if (
		isSuitElement(style, parentNode, false) &&
		(!Dom.isBlock(parentNode) || style.elementIsBlock)
	) {
		return parentNode;
	}

	// <strong style="color:red"><em>|test|</em></strong> => apply <strong>
	if (style.isElementCommit && !Dom.isBlock(parentNode)) {
		return getSuitParent(style, parentNode, root);
	}

	return null;
}
