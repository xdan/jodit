/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isNumeric } from 'jodit/core/helpers/checker/is-numeric';
import { attr } from 'jodit/core/helpers/utils/attr';
import { css } from 'jodit/core/helpers/utils/css';

import { normalSizeToString } from '../utils/utils';

/** @private */
export function applySize(
	image: HTMLImageElement,
	imageWidth: number | string,
	imageHeight: number | string,
	sizeIsLocked: boolean
): void {
	// Size
	if (
		imageWidth !== image.offsetWidth ||
		imageHeight !== image.offsetHeight
	) {
		const updatedWidth = imageWidth ? normalSizeToString(imageWidth) : null;

		let updatedHeight = imageHeight
			? normalSizeToString(imageHeight)
			: null;

		css(image, {
			width: updatedWidth,
			height: updatedWidth && sizeIsLocked ? null : updatedHeight
		});

		attr(
			image,
			'width',
			updatedWidth && isNumeric(imageWidth) && attr(image, 'width')
				? updatedWidth
				: null
		);

		if (!attr(image, 'width') || sizeIsLocked) {
			updatedHeight = null;
		}

		attr(image, 'height', updatedHeight);
	}
}
