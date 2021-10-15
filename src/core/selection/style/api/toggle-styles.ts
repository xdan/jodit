/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CommitStyle } from '../commit-style';
import type { Nullable } from '../../../../types';
import { attr, css, normalizeCssValue } from '../../../helpers';
import { Dom } from '../../../dom';

/**
 * Add or remove styles to element
 *
 * @param elm - The element to switch styles
 */
export function toggleStyles(
	style: CommitStyle,
	elm: HTMLElement,
	wrap: Nullable<boolean>
): Nullable<boolean> {
	const {
		options: { style: styles },
		defaultTag,
		element
	} = style;

	const tag = elm.nodeName.toLowerCase(),
		isStyleCommit = style.elementIsDefault && Dom.isInlineBlock(elm);

	// toggle CSS rules
	if (styles && (tag === defaultTag || isStyleCommit)) {
		Object.keys(styles).forEach(rule => {
			if (
				wrap === false ||
				css(elm, rule) ===
					normalizeCssValue(rule, styles[rule] as string)
			) {
				css(elm, rule, '');

				if (wrap == null) {
					wrap = false;
				}
			} else {
				css(elm, rule, styles[rule]);

				if (wrap == null) {
					wrap = true;
				}
			}
		});
	}

	const isBlock = Dom.isBlock(elm);

	const isSuitableInline =
		!isBlock &&
		(!attr(elm, 'style') || (tag !== defaultTag && tag === element));

	// h1 apply h1
	const isSameBlockElement = !isSuitableInline && isBlock && tag === element;

	if (isSuitableInline || isSameBlockElement) {
		// toggle `<strong>test</strong>` to `test`, and
		// `<span style="">test</span>` to `test`
		Dom.unwrap(elm);

		if (wrap == null) {
			wrap = false;
		}
	}

	return wrap;
}
