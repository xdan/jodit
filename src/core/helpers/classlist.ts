/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { ClassNameValue } from '../../types';

/**
 * Get the value of a computed style property for the first element in the set of matched elements or set one or
 * more CSS properties for every matched element
 *
 * @param element
 * @param value A className to toggle.
 */
export const classlist = (
	element: HTMLElement,
	value: string | ClassNameValue
): void => {
	element.classList.toggle (value as string);
};
