/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/indent
 */

import { Dom } from 'jodit/core/dom/dom';

/**
 * Get style rule key for current direction
 * @internal
 */
export const getKey = (
	direction: string,
	box: HTMLElement
): 'marginLeft' | 'marginRight' | 'paddingLeft' | 'paddingRight' =>
	`${Dom.isCell(box) ? 'padding' : 'margin'}${
		direction === 'rtl' ? 'Right' : 'Left'
	}`;
