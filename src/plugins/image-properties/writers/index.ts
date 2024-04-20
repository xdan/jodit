/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { attr, hAlignElement } from 'jodit/core/helpers/utils';

import type { ImagePropertiesState } from '../interface';

import { applyLink } from './link';
import { applyMargin } from './margin';
import { applySize } from './size';

/**
 * Apply form's values to image
 * @private
 */
export function applyValuesToImage(
	j: IJodit,
	state: ImagePropertiesState,
	image: HTMLImageElement
): void {
	const {
		style,
		imageSrc,
		borderRadius,
		imageTitle,
		imageAlt,
		imageLink,
		imageWidth,
		imageHeight,
		marginTop,
		marginRight,
		marginBottom,
		marginLeft,
		imageLinkOpenInNewTab,
		align,
		classes,
		id
	} = state.values;

	const opt = j.o;

	// styles
	if (opt.image.editStyle) {
		attr(image, 'style', style || null);
	}

	// Src
	if (imageSrc) {
		attr(image, 'src', imageSrc);
	} else {
		Dom.safeRemove(image);
		return;
	}

	// Border radius
	image.style.borderRadius = borderRadius ? borderRadius + 'px' : '';

	// Title
	attr(image, 'title', imageTitle || null);

	// Alt
	attr(image, 'alt', imageAlt || null);

	// Link
	applyLink(j, image, imageLink, imageLinkOpenInNewTab);

	// Size
	applySize(image, imageWidth, imageHeight, state.sizeIsLocked);

	// Margin
	if (j.o.image.editMargins) {
		applyMargin(
			j,
			marginTop,
			marginRight,
			marginBottom,
			marginLeft,
			image,
			state.marginIsLocked
		);
	}

	if (opt.image.editClass) {
		attr(image, 'class', classes || null);
	}

	if (opt.image.editId) {
		attr(image, 'id', id || null);
	}

	if (opt.image.editAlign) {
		hAlignElement(image, align);
	}
}
