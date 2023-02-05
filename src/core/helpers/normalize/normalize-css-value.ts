/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/normalize
 */

import { isNumeric } from '../checker/is-numeric';
import { kebabCase } from '../string/kebab-case';
import { colorToHex } from '../color/color-to-hex';
import { isVoid } from '../checker/is-void';

export const NUMBER_FIELDS_REG =
	/^(left|top|bottom|right|width|min|max|height|margin|padding|fontsize|font-size)/i;

export function normalizeCssNumericValue(
	key: string,
	value: string | number | undefined | null
): string | number | undefined | null {
	if (
		!isVoid(value) &&
		NUMBER_FIELDS_REG.test(key) &&
		isNumeric(value.toString())
	) {
		return parseInt(value.toString(), 10) + 'px';
	}

	return value;
}

export function normalizeCssValue(
	key: string,
	value: string | number
): string | number {
	switch (kebabCase(key)) {
		case 'font-weight':
			switch (value.toString().toLowerCase()) {
				case '700':
				case 'bold':
					return 700;

				case '400':
				case 'normal':
					return 400;

				case '900':
				case 'heavy':
					return 900;
			}

			return isNumeric(value) ? Number(value) : value;
	}

	if (/color/i.test(key) && /^rgb/i.test(value.toString())) {
		return colorToHex(value.toString()) || value;
	}

	return value;
}
