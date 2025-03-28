/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/normalize
 */

import { colorToHex } from 'jodit/core/helpers/color/color-to-hex';
import { trim } from 'jodit/core/helpers/string/trim';

/**
 * Convert rgba and short HEX color to Full text color. #fff to #FFFFFF
 *
 * @param colorInput - string like rgba(red, green, blue, alpha) or rgb(red, green, blue) or #fff or #ffffff
 * @returns HEX color, false - for transparent color
 */
export const normalizeColor = (colorInput: string): string | false => {
	const newcolor: string[] = ['#'];

	let color: string = colorToHex(colorInput) as string;

	if (!color) {
		return false;
	}

	color = trim(color.toUpperCase());
	color = color.substring(1);

	if (color.length === 3) {
		for (let i = 0; i < 3; i += 1) {
			newcolor.push(color[i]);
			newcolor.push(color[i]);
		}
		return newcolor.join('');
	}

	if (color.length > 6) {
		color = color.slice(0, 6);
	}

	return '#' + color;
};
