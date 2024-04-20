/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { attr } from 'jodit/core/helpers/utils/attr';

/** @private */
export function applyLink(
	j: IJodit,
	image: HTMLImageElement,
	imageLink: string,
	imageLinkOpenInNewTab: boolean
): void {
	// Link
	let link = Dom.closest(image, 'a', j.editor);

	if (imageLink) {
		if (!link) {
			link = Dom.wrap(image, 'a', j.createInside);
		}

		attr(link, 'href', imageLink);
		attr(link, 'target', imageLinkOpenInNewTab ? '_blank' : null);
	} else {
		if (link && link.parentNode) {
			link.parentNode.replaceChild(image, link);
		}
	}
}
