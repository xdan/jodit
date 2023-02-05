/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/string
 */

/**
 * Convert (kebab-case or snake_case) to camelCase
 */
export const camelCase = (key: string): string => {
	return key.replace(/([-_])(.)/g, (m, code, letter) => {
		return letter.toUpperCase();
	});
};
