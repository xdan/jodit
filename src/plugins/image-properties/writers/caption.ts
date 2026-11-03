/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-properties
 */

import type { IJodit } from 'jodit/types';
import { getCaptionWrapper } from 'jodit/core/helpers/utils/image-caption';

/**
 * Gives the image a caption or takes it away, and returns the element that
 * holds the image's place on the page: the caption's, or the image
 * @private
 */
export function applyCaption(
	j: IJodit,
	image: HTMLImageElement,
	imageCaption: boolean
): HTMLElement {
	if (j.o.image.showCaptionCheckbox) {
		j.e.fire('toggleImageCaption', image, imageCaption);
	}

	return getCaptionWrapper(j, image) ?? image;
}
