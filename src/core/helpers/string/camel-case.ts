/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Convert (kebab-case or snake_case) => camelCase
 * @param key
 */
export const camelCase = (key: string): string => {
	return key.replace(/([-_])(.)/g, (m, code, letter) => {
		return letter.toUpperCase();
	});
};
