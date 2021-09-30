/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import type { Nullable } from '../../../../types';
import type { CommitStyle } from '../commit-style';
import { isNormalNode } from './is-normal-node';
import { elementHasSameStyle } from './element-has-same-style';

/**
 * This element is suitable for options
 *
 * @param style
 * @param elm
 * @param [strict]
 */
export function isSuitElement(
	style: CommitStyle,
	elm: Nullable<Node>,
	strict: boolean = true
): elm is HTMLElement {
	if (!elm) {
		return false;
	}

	const { element, elementIsDefault, options } = style;

	const elmHasSameStyle = elementHasSameStyle(elm, options.style);
	const elmIsSame = elm.nodeName.toLowerCase() === element;

	return (
		((!elementIsDefault || !strict) && elmIsSame) ||
		(elmHasSameStyle && isNormalNode(elm))
	);
}
