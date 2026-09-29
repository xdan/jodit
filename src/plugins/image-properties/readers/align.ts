/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-properties
 */

import type { ImageAlignClasses, Nullable } from 'jodit/types';
import { getHAlign } from 'jodit/core/helpers/utils/align';

import type { EditValues } from '../interface';

/**
 * @private
 */
export function readAlign(
	image: HTMLImageElement,
	values: EditValues,
	classes?: Nullable<ImageAlignClasses>
): void {
	const align = getHAlign(image, classes);
	values.align = align === 'normal' ? '' : align;
}
