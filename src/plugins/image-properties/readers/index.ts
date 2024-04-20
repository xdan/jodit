/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from 'jodit/types';
import { attr } from 'jodit/core/helpers/utils/attr';

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
	readAlign(image, values);

	// Border radius
	values.borderRadius = parseInt(image.style.borderRadius || '0', 10) || 0;

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
	readMargins(image, values, state);

	// Link
	readLink(state, j, values);

	// Src
	values.imageSrc = attr(image, 'src') || '';

	// Image size
	return readSizes(image, values, state);
}
