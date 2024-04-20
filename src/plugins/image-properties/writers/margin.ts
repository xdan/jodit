/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from 'jodit/types';
import { css } from 'jodit/core/helpers/utils/css';

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

	const applyMargin = (key: string, value: number | string): void => {
		const oldValue = css(image, key);
		const v = normalSizeToString(value);
		if (oldValue.toString() !== v.toString()) {
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
