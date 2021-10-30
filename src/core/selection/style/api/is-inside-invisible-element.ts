/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Dom } from '../../../dom';

/**
 * Check if FONT inside STYLE or SCRIPT element
 */
export function isInsideInvisibleElement(
	font: HTMLElement,
	root: HTMLElement
): boolean {
	return Boolean(Dom.closest(font, ['style', 'script'], root));
}
