/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import type { Nullable } from '../../../../types';
import type { CommitStyle } from '../commit-style';
import { isNormalNode } from './is-normal-node';
import { elementHasSameStyle } from './element-has-same-style';
import { Dom } from '../../../dom';

/**
 * Checks if an item is suitable for applying a commit. The element suits us if it
 *  - has the same styles as in the commit (commitStyle.options.style)
 *  - has the same tag as in the commit (commitStyle.options.element)
 *
 * @param commitStyle - style commit
 * @param elm - checked item
 * @param strict - strict mode - false - the default tag is suitable for us if it is also in the commit
 */
export function isSuitElement(
	commitStyle: CommitStyle,
	elm: Nullable<Node>,
	strict: boolean
): elm is HTMLElement {
	if (!elm) {
		return false;
	}

	const { element, elementIsDefault, options } = commitStyle;

	const elmHasSameStyle = Boolean(
		options.style && elementHasSameStyle(elm, options.style)
	);

	const elmIsSame = elm.nodeName.toLowerCase() === element;

	if (
		((!elementIsDefault || !strict) && elmIsSame) ||
		(elmHasSameStyle && isNormalNode(elm))
	) {
		return true;
	}

	if (!elmIsSame && !strict && elementIsDefault && Dom.isInlineBlock(elm)) {
		return true;
	}

	return false;
}
