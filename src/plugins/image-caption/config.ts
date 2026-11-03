/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-caption
 */

import type { ImageCaptionMarkup } from 'jodit/types';
import { Config } from 'jodit/config';

declare module 'jodit/config' {
	interface Config {
		/**
		 * The elements a captioned image is kept in, read from the content and
		 * written by the Caption button in the image popup and the Caption
		 * checkbox in the image properties dialog. The default is a `<figure>`
		 * holding the image, or its link, and a `<figcaption>`. Content from
		 * another editor can be captioned in its own way, as Froala's is:
		 *
		 * ```javascript
		 * Jodit.make('#editor', {
		 *   imageCaption: {
		 *     wrapper: { tag: 'span', className: 'fr-img-caption' },
		 *     inner: { tag: 'span', className: 'fr-img-wrap' },
		 *     caption: { tag: 'span', className: 'fr-inner' }
		 *   }
		 * });
		 * ```
		 */
		imageCaption: ImageCaptionMarkup;
	}
}

Config.prototype.imageCaption = {
	wrapper: { tag: 'figure', className: '' },
	inner: null,
	caption: { tag: 'figcaption', className: '' }
};
