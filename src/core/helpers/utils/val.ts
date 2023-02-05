/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

export const val = (
	elm: HTMLInputElement | HTMLElement,
	selector: string,
	value?: string | null
): string => {
	const child = elm.querySelector(selector) as HTMLInputElement;

	if (!child) {
		return '';
	}

	if (value) {
		child.value = value;
	}

	return child.value;
};
