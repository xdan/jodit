/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/color
 */

/**
 * Converts rgba text representation of color in hex
 *
 * @param color - string like rgba(red, green, blue, alpha) or rgb(red, green, blue)
 * @returns hex color view, NaN - for transparent color
 * @example
 * ```javascript
 * var p = document.createElement('p');
 * p.style.color = '#ffffff';
 * console.log(p.getAttribute('style')); // color: rgb(255, 255, 255);
 * console.log(colorTohex(p.style.color)); // #ffffff
 * ```
 */
export const colorToHex = (color: string): string | false => {
	if (color === 'rgba(0, 0, 0, 0)' || color === '') {
		return false;
	}

	if (!color) {
		return '#000000';
	}

	if (color.substr(0, 1) === '#') {
		return color;
	}

	const digits =
		/([\s\n\t\r]*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color) ||
		/([\s\n\t\r]*?)rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/.exec(color);

	if (!digits) {
		return '#000000';
	}

	const red = parseInt(digits[2], 10),
		green = parseInt(digits[3], 10),
		blue = parseInt(digits[4], 10),
		rgb = blue | (green << 8) | (red << 16);

	let hex = rgb.toString(16).toUpperCase();

	while (hex.length < 6) {
		hex = '0' + hex;
	}

	return digits[1] + '#' + hex;
};
