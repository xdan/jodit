/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-properties
 */

import type { IJodit } from 'jodit/types';
import { css, cssInline } from 'jodit/core/helpers/utils/css';

import { normalSizeToString } from '../utils/utils';

/** @private */
export function applyMargin(
	j: IJodit,
	marginTop: number | string,
	marginRight: number | string,
	marginBottom: number | string,
	marginLeft: number | string,
	image: HTMLImageElement,
	marginIsLocked: boolean
): void {
	const margins = [marginTop, marginRight, marginBottom, marginLeft];

	// Compared with the inline value, which is what `readMargins` showed, so a
	// margin from a stylesheet is not overwritten when the field is unchanged
	const applyMargin = (key: string, value: number | string): void => {
		const oldValue = normalSizeToString(cssInline(image, key) || 0);
		const v = normalSizeToString(value);
		if (oldValue !== v) {
			css(image, key, v);
		}
	};

	if (!marginIsLocked) {
		const sides = [
			'margin-top',
			'margin-right',
			'margin-bottom',
			'margin-left'
		];
		margins.forEach((margin, index) => {
			const side = sides[index];
			applyMargin(side, margin);
		});
	} else {
		applyMargin('margin', marginTop);
	}
}
