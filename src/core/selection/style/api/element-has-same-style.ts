/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CanUndef, IStyle } from '../../../../types';
import {
	css,
	each,
	isPlainObject,
	isVoid,
	normalizeCssValue
} from '../../../helpers';
import { Dom } from '../../../dom';

/**
 * Element has all rules
 */
export function elementHasSameStyle(
	elm: Node,
	rules: CanUndef<IStyle>
): boolean {
	return Boolean(
		isPlainObject(rules) &&
			!Dom.isTag(elm, 'font') &&
			Dom.isHTMLElement(elm) &&
			each(rules, (property, checkValue) => {
				const value = css(elm, property, true);

				return (
					!isVoid(value) &&
					value !== '' &&
					!isVoid(checkValue) &&
					normalizeCssValue(property, checkValue)
						.toString()
						.toLowerCase() === value.toString().toLowerCase()
				);
			})
	);
}
