/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/image/README.md]]
 * @packageDocumentation
 * @module plugins/image
 */

import type {
	IControlType,
	IFileBrowserCallBackData,
	IJodit
} from 'jodit/types';
import { Dom } from 'jodit/core/dom';
import { $$ } from 'jodit/core/helpers';
import { FileSelectorWidget } from 'jodit/modules/widget';
import { Config } from 'jodit/config';
import { pluginSystem } from 'jodit/core/global';
import { Icon } from 'jodit/core/ui/icon';

Icon.set('image', require('./image.svg'));

Config.prototype.controls.image = {
	popup: (editor: IJodit, current, ignore, close) => {
		let sourceImage: HTMLImageElement | null = null;

		if (
			current &&
			!Dom.isText(current) &&
			Dom.isHTMLElement(current) &&
			(Dom.isTag(current, 'img') || $$('img', current).length)
		) {
			sourceImage = Dom.isTag(current, 'img')
				? current
				: $$('img', current)[0];
		}

		editor.s.save();

		return FileSelectorWidget(
			editor,
			{
				filebrowser: (data: IFileBrowserCallBackData) => {
					editor.s.restore();

					data.files &&
						data.files.forEach(file =>
							editor.s.insertImage(
								data.baseurl + file,
								null,
								editor.o.imageDefaultWidth
							)
						);

					close();
				},
				upload: true,
				url: async (url: string, text: string) => {
					editor.s.restore();

					if (/^[a-z\d_-]+(\.[a-z\d_-]+)+/i.test(url)) {
						url = '//' + url;
					}

					const image: HTMLImageElement =
						sourceImage || editor.createInside.element('img');

					image.setAttribute('src', url);
					image.setAttribute('alt', text);

					if (!sourceImage) {
						await editor.s.insertImage(
							image,
							null,
							editor.o.imageDefaultWidth
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

export function image(editor: IJodit): void {
	editor.registerButton({
		name: 'image',
		group: 'media'
	});
}

pluginSystem.add('image', image);
