/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { $$ } from '../modules/helpers/';
import { IJodit } from '../types';

const JODIT_IMAGE_PROCESSOR_BINDED = '__jodit_imageprocessor_binded';

/**
 * Change editor's size after load all images
 *
 * @param {Jodit} editor
 */
export function imageProcessor(editor: IJodit) {
	editor.events.on(
		'change afterInit changePlace',
		editor.async.debounce(() => {
			if (editor.editor) {
				$$('img', editor.editor).forEach((elm: HTMLElement) => {
					if (!(elm as any)[JODIT_IMAGE_PROCESSOR_BINDED]) {
						(elm as any)[JODIT_IMAGE_PROCESSOR_BINDED] = true;
						if (!(elm as HTMLImageElement).complete) {
							elm.addEventListener(
								'load',
								function ElementOnLoad() {
									editor.events &&
										editor.events.fire &&
										editor.events.fire('resize');
									elm.removeEventListener(
										'load',
										ElementOnLoad
									);
								}
							);
						}

						editor.events.on(elm, 'mousedown touchstart', () => {
							editor.selection.select(elm);
						});
					}
				});
			}
		}, editor.defaultTimeout)
	);
}
