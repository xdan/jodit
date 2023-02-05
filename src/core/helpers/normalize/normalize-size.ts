/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/normalize
 */

/**
 * Normalize value to CSS meters
 */
export const normalizeSize = (value: string | number): string => {
	if (/^[0-9]+$/.test(value.toString())) {
		return value + 'px';
	}
	return value.toString();
};
