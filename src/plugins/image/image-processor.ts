/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image
 */

import type { IJodit } from 'jodit/types';
import { $$, dataBind } from 'jodit/core/helpers';

const JODIT_IMAGE_PROCESSOR_BINDED = '__jodit_imageprocessor_binded';

/**
 * Change editor's size after load all images
 */
export function imageProcessor(editor: IJodit): void {
	editor.e.on(
		'change afterInit changePlace',
		editor.async.debounce(() => {
			if (editor.editor) {
				$$('img', editor.editor).forEach(elm => {
					if (!dataBind(elm, JODIT_IMAGE_PROCESSOR_BINDED)) {
						dataBind(elm, JODIT_IMAGE_PROCESSOR_BINDED, true);

						if (!elm.complete) {
							editor.e.on(elm, 'load', function ElementOnLoad() {
								!editor.isInDestruct &&
									editor.e?.fire('resize');

								editor.e.off(elm, 'load', ElementOnLoad);
							});
						}

						editor.e.on(elm, 'mousedown touchstart', () => {
							editor.s.select(elm);
						});
					}
				});
			}
		}, editor.defaultTimeout)
	);
}
