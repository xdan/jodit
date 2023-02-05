/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary, IStyle, ICommitStyle } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { attr, css } from 'jodit/core/helpers';
import { hasSameStyleKeys } from 'jodit/core/selection/style/api/has-same-style';
import { isSameStyleChild, isSuitElement } from './is-suit-element';

/**
 * Unwrap all suit elements inside
 * @private
 */
export function unwrapChildren(
	style: ICommitStyle,
	font: HTMLElement
): boolean {
	const needUnwrap: Node[] = [];
	const needChangeStyle: any[] = [];

	let firstElementSuit: boolean | undefined;

	const cssStyle = style.options.attributes?.style as IStyle;

	if (font.firstChild) {
		const gen = Dom.eachGen(font);

		let item = gen.next();

		while (!item.done) {
			const elm = item.value;

			if (
				isSuitElement(style, elm as HTMLElement, true) &&
				(!cssStyle || hasSameStyleKeys(elm, cssStyle))
			) {
				if (firstElementSuit === undefined) {
					firstElementSuit = true;
				}

				needUnwrap.push(elm);
			} else if (cssStyle && isSameStyleChild(style, elm)) {
				if (firstElementSuit === undefined) {
					firstElementSuit = false;
				}

				needChangeStyle.push(() => {
					css(
						elm,
						Object.keys(cssStyle).reduce((acc, key) => {
							acc[key] = null;
							return acc;
						}, <IDictionary>{})
					);

					if (!attr(elm, 'style')) {
						attr(elm, 'style', null);
					}

					if (
						!attr(elm, 'style') &&
						elm.nodeName.toLowerCase() === style.element
					) {
						needUnwrap.push(elm);
					}
				});
			} else if (!Dom.isEmptyTextNode(elm)) {
				if (firstElementSuit === undefined) {
					firstElementSuit = false;
				}
			}

			item = gen.next();
		}
	}

	needChangeStyle.forEach(clb => clb());
	needUnwrap.forEach(Dom.unwrap);

	return Boolean(firstElementSuit);
}
