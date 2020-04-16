/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Check if name has normal format
 * @param name
 */
export const isValidName = (name: string): boolean => {
	if (!name.length) {
		return false;
	}

	if (/[^0-9A-Za-zа-яА-ЯЁё\w\-_\.]/.test(name)) {
		return false;
	}

	return true;
};
