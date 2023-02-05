/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/string
 */

/**
 * Make a string's first character uppercase
 */
export function ucfirst(value: string): string {
	if (!value.length) {
		return '';
	}

	return value[0].toUpperCase() + value.substr(1);
}
