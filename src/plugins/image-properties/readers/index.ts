/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-properties
 */

import type { IJodit } from 'jodit/types';
import { getAlignClasses } from 'jodit/core/helpers/utils/align';
import { attr } from 'jodit/core/helpers/utils/attr';
import { cssInline } from 'jodit/core/helpers/utils/css';
import { getCaptionWrapper } from 'jodit/core/helpers/utils/image-caption';

import type { ImagePropertiesState } from '../interface';

import { readAlign } from './align';
import { readLink } from './link';
import { readMargins } from './margin';
import { readSizes } from './size';

/**
 * Read values from image and set it to state
 * @private
 */
export async function readValuesFromImage(
	j: IJodit,
	state: ImagePropertiesState
): Promise<void> {
	const { sourceImage: image, values } = state;

	// A captioned image's caption element holds its place on the page and
	// its width
	const wrapper = getCaptionWrapper(j, image);
	const box = wrapper ?? image;
	values.imageCaption = Boolean(wrapper);

	readAlign(box, values, getAlignClasses(j, box));

	// Border radius
	values.borderRadius =
		parseInt(cssInline(image, 'border-radius') || '0', 10) || 0;

	// Id
	values.id = attr(image, 'id') || '';

	// Title
	values.imageTitle = attr(image, 'title') || '';

	// Alt
	values.imageAlt = attr(image, 'alt') || '';

	// Style
	values.style = attr(image, 'style') || '';

	// Classes
	values.classes = (attr(image, 'class') || '').replace(
		/jodit_focused_image[\s]*/,
		''
	);

	// Margins
	readMargins(box, values, state);

	// Link
	readLink(state, j, values);

	// Src
	values.imageSrc = attr(image, 'src') || '';

	// Image size
	return readSizes(image, values, state, wrapper);
}
