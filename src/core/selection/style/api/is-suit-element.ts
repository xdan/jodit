/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import type { IStyle, Nullable, ICommitStyle } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { isNormalNode } from './is-normal-node';
import { hasSameStyle, hasSameStyleKeys } from './has-same-style';

/**
 * Checks if an item is suitable for applying a commit. The element suits us if it
 *  - has the same styles as in the commit (commitStyle.options.style)
 *  - has the same tag as in the commit (commitStyle.options.element)
 *
 * @param commitStyle - style commit
 * @param elm - checked item
 * @param strict - strict mode - false - the default tag is suitable for us if it is also in the commit
 * @private
 */
export function isSuitElement(
	commitStyle: ICommitStyle,
	elm: Nullable<Node>,
	strict: boolean
): elm is HTMLElement {
	if (!elm) {
		return false;
	}

	const { element, elementIsDefault, options } = commitStyle;

	const elmHasSameStyle = Boolean(
		options.attributes?.style &&
			hasSameStyle(elm, options.attributes.style as IStyle)
	);

	const elmIsSame =
		elm.nodeName.toLowerCase() === element ||
		(Dom.isTag(elm, ['ul', 'ol']) && commitStyle.elementIsList);

	if (
		((!elementIsDefault || !strict) && elmIsSame) ||
		(elmHasSameStyle && isNormalNode(elm) && !commitStyle.elementIsList)
	) {
		return true;
	}

	return Boolean(
		!elmIsSame && !strict && elementIsDefault && Dom.isInlineBlock(elm)
	);
}

export function findSuitClosest(
	commitStyle: ICommitStyle,
	element: HTMLElement,
	root: HTMLElement
): Nullable<HTMLElement> {
	return Dom.closest(
		element,
		node => isSuitElement(commitStyle, node, true),
		root
	);
}

/**
 * Inside the parent element there is a block with the same styles
 * @example
 * For selection:
 * ```html
 * <p>|test<strong>test</strong>|</p>
 * ```
 * Apply `{element:'strong'}`
 */
export function isSameStyleChild(
	commitStyle: ICommitStyle,
	elm: Nullable<Node>
): elm is HTMLElement {
	const { element, options } = commitStyle;

	if (!elm || !isNormalNode(elm)) {
		return false;
	}

	const elmIsSame = elm.nodeName.toLowerCase() === element;

	const elmHasSameStyle = Boolean(
		options.attributes?.style &&
			hasSameStyleKeys(elm, options.attributes?.style as IStyle)
	);

	return elmIsSame && elmHasSameStyle;
}
