/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

/**
 * Check if name has normal format
 */
export function isValidName(name: string): boolean {
	if (!name.length) {
		return false;
	}

	return !/[^0-9A-Za-zа-яА-ЯЁё\w\-_.]/.test(name);
}
