/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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

	return value[0].toUpperCase() + value.substr(1)
};
