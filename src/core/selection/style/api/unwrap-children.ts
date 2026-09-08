/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { ICommitStyle, IStyle } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { attr, css } from 'jodit/core/helpers/utils';
import { hasSameStyleKeys } from 'jodit/core/selection/style/api/has-same-style';

import { isSuitElement } from './is-suit-element';

/**
 * Unwrap all suit elements inside
 * @private
 */
export function unwrapChildren(
	style: ICommitStyle,
	font: HTMLElement
): boolean {
	const needUnwrap: Node[] = [];
	const needChangeStyle: Array<() => void> = [];

	let firstElementSuit: boolean | undefined;

	const cssStyle = style.options.attributes?.style as IStyle;
	const styleKeys = Object.keys(cssStyle ?? {});
	const clearedStyle: IStyle = {};
	styleKeys.forEach(key => {
		clearedStyle[key] = null;
	});

	const clearStyle = (elm: HTMLElement): void => {
		css(elm, clearedStyle);
		if (!attr(elm, 'style')) {
			attr(elm, 'style', null);
		}
		if (!elm.attributes.length && Dom.isTag(elm, style.element)) {
			needUnwrap.push(elm);
		}
	};

	for (const elm of Dom.eachGen(font)) {
		if (!Dom.isContentEditable(elm, font)) {
			continue;
		}

		if (
			isSuitElement(style, elm as HTMLElement, true) &&
			(!cssStyle || hasSameStyleKeys(elm, cssStyle))
		) {
			if (firstElementSuit === undefined) {
				firstElementSuit = true;
			}

			if (cssStyle) {
				needChangeStyle.push(() => clearStyle(elm as HTMLElement));
			} else {
				needUnwrap.push(elm);
			}
		} else if (
			cssStyle &&
			Dom.isHTMLElement(elm) &&
			styleKeys.some(key => css(elm, key, true) !== '')
		) {
			if (firstElementSuit === undefined) {
				firstElementSuit = false;
			}

			needChangeStyle.push(() => clearStyle(elm));
		} else if (!Dom.isEmptyTextNode(elm)) {
			if (firstElementSuit === undefined) {
				firstElementSuit = false;
			}
		}
	}

	needChangeStyle.forEach(clb => clb());
	needUnwrap.forEach(Dom.unwrap);

	return Boolean(firstElementSuit);
}
