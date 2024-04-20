/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { kebabCase } from 'jodit/core/helpers/string/kebab-case';

import type { EditValues, ImagePropertiesState } from '../interface';

/** @private */
export function readMargins(
	image: HTMLImageElement,
	values: EditValues,
	state: ImagePropertiesState
): void {
	// Margins
	let equal = true,
		wasEmptyField = false;

	(
		['marginTop', 'marginRight', 'marginBottom', 'marginLeft'] as const
	).forEach(id => {
		let value: number | string = image.style.getPropertyValue(
			kebabCase(id)
		);

		if (!value) {
			wasEmptyField = true;
			values[id] = 0;
			return;
		}

		if (/^[0-9]+(px)?$/.test(value)) {
			value = parseInt(value, 10);
		}

		values[id] = value;

		if (
			(wasEmptyField && values[id]) ||
			(equal && id !== 'marginTop' && values[id] !== values.marginTop)
		) {
			equal = false;
		}
	});

	state.marginIsLocked = equal;
}
