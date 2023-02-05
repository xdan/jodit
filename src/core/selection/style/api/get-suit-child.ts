/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Nullable, ICommitStyle } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { isNormalNode } from './is-normal-node';
import { isSuitElement } from './is-suit-element';

/**
 * Checks if child elements are suitable for applying styles.
 * An element is suitable for us only if it is the only significant child.
 * If the child matches then returns it.
 * @example
 * `<font><strong>selected</strong></font>`
 * @private
 */
export function getSuitChild(
	style: ICommitStyle,
	font: HTMLElement
): Nullable<HTMLElement> {
	let { firstChild: child } = font;

	while (child && !isNormalNode(child)) {
		child = child.nextSibling;

		if (!child) {
			return null;
		}
	}

	if (
		child &&
		!Dom.next(child, isNormalNode, font) &&
		isSuitElement(style, child, false)
	) {
		return child;
	}

	return null;
}
