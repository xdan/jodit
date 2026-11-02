/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-properties
 */

import { isNumeric } from 'jodit/core/helpers/checker/is-numeric';
import { attr } from 'jodit/core/helpers/utils/attr';
import { css } from 'jodit/core/helpers/utils/css';

import { normalSizeToString } from '../utils/utils';

/**
 * A captioned image fills its caption's element, `box`, which takes the width
 * @private
 */
export function applySize(
	image: HTMLImageElement,
	imageWidth: number | string,
	imageHeight: number | string,
	sizeIsLocked: boolean,
	box: HTMLElement = image
): void {
	if (box !== image) {
		const width = imageWidth ? normalSizeToString(imageWidth) : null;

		css(box, 'width', width);
		css(image, {
			width: width && '100%',
			height:
				sizeIsLocked || !imageHeight
					? null
					: normalSizeToString(imageHeight)
		});

		return;
	}

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
