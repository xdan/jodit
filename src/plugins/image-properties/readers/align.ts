/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { ImageHAlign } from 'jodit/types';
import { css } from 'jodit/core/helpers/utils/css';

import type { EditValues } from '../interface';

/** @private */
export function readAlign(image: HTMLImageElement, values: EditValues): void {
	// Align
	if (
		image.style.cssFloat &&
		['left', 'right'].indexOf(image.style.cssFloat.toLowerCase()) !== -1
	) {
		values.align = css(image, 'float') as ImageHAlign;
	} else {
		if (
			(css(image, 'display') as string) === 'block' &&
			image.style.marginLeft === 'auto' &&
			image.style.marginRight === 'auto'
		) {
			values.align = 'center';
		} else {
			values.align = '';
		}
	}
}
