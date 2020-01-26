/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Check value is String
 *
 * @param value
 */
export const isString = (value: unknown): value is string => {
	return  typeof value === 'string';
};
