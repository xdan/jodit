/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isNumber } from 'jodit/core/helpers/checker/is-number';
import { trim } from 'jodit/core/helpers/string/trim';

/** @private */
export const normalSizeFromString = (
	value: string | number
): string | number => {
	return /^[-+]?[0-9.]+(px)?$/.test(value.toString())
		? parseFloat(value.toString())
		: value;
};

/** @private */
export const normalSizeToString = (value: string | number): string => {
	if (isNumber(value)) {
		return value ? value + 'px' : value.toString();
	}

	value = trim(value);
	return /^[0-9]+$/.test(value) ? value + 'px' : value;
};
