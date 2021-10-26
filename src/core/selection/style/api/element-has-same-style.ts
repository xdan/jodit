/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IStyle } from '../../../../types';
import { css, isVoid, normalizeCssValue } from '../../../helpers';
import { Dom } from '../../../dom';

/**
 * Element has the same styles as in the commit
 */
export function elementHasSameStyle(elm: Node, rules: IStyle): boolean {
	return Boolean(
		!Dom.isTag(elm, 'font') &&
			Dom.isHTMLElement(elm) &&
			Object.keys(rules).every(property => {
				const value = css(elm, property, true);

				return (
					!isVoid(value) &&
					value !== '' &&
					!isVoid(rules[property]) &&
					normalizeCssValue(property, rules[property] as string)
						.toString()
						.toLowerCase() === value.toString().toLowerCase()
				);
			})
	);
}

/**
 * Element has the similar styles
 */
export function elementHasSameStyleKeys(elm: Node, rules: IStyle): boolean {
	return Boolean(
		!Dom.isTag(elm, 'font') &&
			Dom.isHTMLElement(elm) &&
			Object.keys(rules).every(
				property => !isVoid(css(elm, property, true))
			)
	);
}
