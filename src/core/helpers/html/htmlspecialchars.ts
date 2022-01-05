/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/html
 */

/**
 * Convert special characters to HTML entities
 */
export function htmlspecialchars(html: string): string {
	const tmp = document.createElement('div');
	tmp.textContent = html;
	return tmp.innerHTML;
}
