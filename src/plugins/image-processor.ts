/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { $$, debounce } from '../modules/helpers/';
import { IControlType, IFileBrowserCallBackData, IJodit } from '../types';
import { Config } from '../Config';
import { Widget } from '../modules/Widget';
import FileSelectorWidget = Widget.FileSelectorWidget;

const JODIT_IMAGE_PROCESSOR_BINDED = '__jodit_imageprocessor_binded';

Config.prototype.controls.image = {
	popup: (
		editor: IJodit,
		current: HTMLImageElement | false,
		self: IControlType,
		close
	) => {
		let sourceImage: HTMLImageElement | null = null;

		if (
			current &&
			current.nodeType !== Node.TEXT_NODE &&
			(current.tagName === 'IMG' || $$('img', current).length)
		) {
			sourceImage =
				current.tagName === 'IMG'
					? current
					: ($$('img', current)[0] as HTMLImageElement);
		}

		const selInfo = editor.selection.save();

		return FileSelectorWidget(
			editor,
			{
				filebrowser: async (data: IFileBrowserCallBackData) => {
					editor.selection.restore(selInfo);

					if (data.files && data.files.length) {
						for (let i = 0; i < data.files.length; i += 1) {
							await editor.selection.insertImage(
								data.baseurl + data.files[i],
								null,
								editor.options.imageDefaultWidth
							);
						}
					}

					close();
				},
				upload: true,
				url: async (url: string, text: string) => {
					editor.selection.restore(selInfo);

					const image: HTMLImageElement =
						sourceImage || editor.create.inside.element('img');

					image.setAttribute('src', url);
					image.setAttribute('alt', text);

					if (!sourceImage) {
						await editor.selection.insertImage(
							image,
							null,
							editor.options.imageDefaultWidth
						);
					}

					close();
				}
			},
			sourceImage,
			close
		);
	},
		tags: ['img'],
		tooltip: 'Insert Image'
} as IControlType;

/**
 * Change editor's size after load all images
 *
 * @param {Jodit} editor
 */
export function imageProcessor(editor: IJodit) {
	editor.events.on(
		'change afterInit',
		debounce(() => {
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
