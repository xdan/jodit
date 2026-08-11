/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-properties
 */

import type { ImageHAlign } from 'jodit/types';
import { css } from 'jodit/core/helpers/utils/css';

import type { EditValues } from '../interface';

/**
 * @private
 */
export function readAlign(image: HTMLImageElement, values: EditValues): void {
	// Align
	if (
		image.style.getPropertyValue('float') &&
		['left', 'right'].indexOf(
			image.style.getPropertyValue('float').toLowerCase()
		) !== -1
	) {
		values.align = css(image, 'float') as ImageHAlign;
	} else {
		if (
			(css(image, 'display') as string) === 'block' &&
			image.style.getPropertyValue('margin-left') === 'auto' &&
			image.style.getPropertyValue('margin-right') === 'auto'
		) {
			values.align = 'center';
		} else {
			values.align = '';
		}
	}
}
