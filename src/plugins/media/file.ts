/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/media
 */

import type {
	IControlType,
	IFileBrowserCallBackData,
	IJodit
} from 'jodit/types';
import { Config } from 'jodit/config';
import { Dom } from 'jodit/core/dom';
import { FileSelectorWidget } from 'jodit/modules/widget';

Config.prototype.controls.file = {
	popup: (
		editor: IJodit,
		current: Node | false,
		self: IControlType,
		close
	) => {
		const insert = (url: string, title: string = '') => {
			editor.s.insertNode(
				editor.createInside.fromHTML(
					`<a href="${url}" title="${title}">${title || url}</a>`
				)
			);
		};

		let sourceAnchor: HTMLAnchorElement | null = null;

		if (
			current &&
			(Dom.isTag(current, 'a') ||
				Dom.closest(current, 'a', editor.editor))
		) {
			sourceAnchor = Dom.isTag(current, 'a')
				? current
				: (Dom.closest(
						current,
						'a',
						editor.editor
				  ) as HTMLAnchorElement);
		}

		return FileSelectorWidget(
			editor,
			{
				filebrowser: (data: IFileBrowserCallBackData) => {
					data.files &&
						data.files.forEach(file => insert(data.baseurl + file));

					close();
				},
				upload: true,
				url: (url: string, text: string) => {
					if (sourceAnchor) {
						sourceAnchor.setAttribute('href', url);
						sourceAnchor.setAttribute('title', text);
					} else {
						insert(url, text);
					}
					close();
				}
			},
			sourceAnchor,
			close,
			false
		);
	},
	tags: ['a'],
	tooltip: 'Insert file'
} as IControlType;

export function file(editor: IJodit): void {
	editor.registerButton({
		name: 'file',
		group: 'media'
	});
}
