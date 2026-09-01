/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-properties
 */

import type { ImageHAlign } from 'jodit/types';
import { css, cssInline } from 'jodit/core/helpers/utils/css';

import type { EditValues } from '../interface';

/**
 * @private
 */
export function readAlign(image: HTMLImageElement, values: EditValues): void {
	// Align
	if (
		cssInline(image, 'float') &&
		['left', 'right'].indexOf(cssInline(image, 'float').toLowerCase()) !==
			-1
	) {
		values.align = css(image, 'float') as ImageHAlign;
	} else {
		if (
			(css(image, 'display') as string) === 'block' &&
			cssInline(image, 'margin-left') === 'auto' &&
			cssInline(image, 'margin-right') === 'auto'
		) {
			values.align = 'center';
		} else {
			values.align = '';
		}
	}
}
