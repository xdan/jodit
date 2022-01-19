/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/string
 */

import {
	SPACE_REG_EXP_END,
	SPACE_REG_EXP_START,
	INVISIBLE_SPACE_REG_EXP_END,
	INVISIBLE_SPACE_REG_EXP_START
} from 'jodit/core/constants';

/**
 * It clears the line of all auxiliary invisible characters , from the spaces and line breaks , tabs
 * from the beginning and end of the line
 */
export function trim(value: string): string {
	return value
		.replace(SPACE_REG_EXP_END(), '')
		.replace(SPACE_REG_EXP_START(), '');
}

/**
 * Trim only invisible chars
 */
export function trimInv(value: string): string {
	return value
		.replace(INVISIBLE_SPACE_REG_EXP_END(), '')
		.replace(INVISIBLE_SPACE_REG_EXP_START(), '');
}
