/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Make a string's first character uppercase
 *
 * @param {string} value input string
 * @return {string}
 */
export const ucfirst = (value: string): string => {
	if (!value.length) {
		return '';
	}

	return value[0].toUpperCase() + value.substr(1);
};
