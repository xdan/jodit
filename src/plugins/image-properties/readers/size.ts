/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isNumeric } from 'jodit/core/helpers/checker/is-numeric';
import { attr } from 'jodit/core/helpers/utils/attr';
import { css } from 'jodit/core/helpers/utils/css';

import type { EditValues, ImagePropertiesState } from '../interface';
import { normalSizeFromString } from '../utils/utils';

/** @private */
export async function readSizes(
	image: HTMLImageElement,
	values: EditValues,
	state: ImagePropertiesState
): Promise<void> {
	await image.decode();

	const width = css(image, 'width', true) || attr(image, 'width') || false;

	const height = css(image, 'height', true) || attr(image, 'height') || false;

	values.imageWidth =
		width !== false
			? normalSizeFromString(width)
			: image.offsetWidth || image.naturalWidth;

	if (isNumeric(values.imageWidth)) {
		values.imageHeight =
			height !== false
				? normalSizeFromString(height)
				: image.offsetHeight || image.naturalHeight;
	} else {
		values.imageHeight = height || '';
	}

	const { imageWidth, imageHeight } = values;

	const w = parseFloat(imageWidth.toString());

	if (!isNumeric(imageWidth) || !isNumeric(imageHeight)) {
		state.sizeIsLocked = false;
		return;
	}

	if (height === false) {
		values.imageHeight = Math.round(w / state.ratio);
		state.sizeIsLocked = true;
		return;
	}

	const h = parseFloat(imageHeight.toString());

	state.sizeIsLocked = Math.abs(w - h * state.ratio) < 1;
}
