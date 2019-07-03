/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
