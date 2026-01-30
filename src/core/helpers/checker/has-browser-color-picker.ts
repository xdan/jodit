/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

import { globalDocument } from 'jodit/core/constants';

/**
 * Check if browser has a color picker (a new HTML5 attribute for input tag)
 */
export function hasBrowserColorPicker(): boolean {
	let supportsColor = true;

	try {
		const a = globalDocument.createElement('input');

		a.type = 'color';
		a.value = '!';
		supportsColor = a.type === 'color' && a.value !== '!';
	} catch (e) {
		supportsColor = false;
	}

	return supportsColor;
}
