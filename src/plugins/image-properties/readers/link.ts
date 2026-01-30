/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-properties
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { attr } from 'jodit/core/helpers/utils/attr';

import type { EditValues, ImagePropertiesState } from '../interface';

/** @private */
export function readLink(
	state: ImagePropertiesState,
	j: IJodit,
	values: EditValues
): void {
	const a = Dom.closest(state.sourceImage, 'a', j.editor);

	if (a) {
		values.imageLink = attr(a, 'href') || '';
		values.imageLinkOpenInNewTab = attr(a, 'target') === '_blank';
	} else {
		values.imageLink = '';
		values.imageLinkOpenInNewTab = false;
	}
}
