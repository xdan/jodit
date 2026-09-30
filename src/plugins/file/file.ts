/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/file/README.md]]
 * @packageDocumentation
 * @module plugins/file
 */

import type {
	IControlType,
	IFileBrowserCallBackData,
	IJodit,
	IUploaderData
} from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { attr } from 'jodit/core/helpers/utils/attr';
import { Config } from 'jodit/config';
import { FileSelectorWidget } from 'jodit/modules/widget';

declare module 'jodit/config' {
	interface Config {
		file: {
			/**
			 * Inserts the files uploaded from the file popup's Upload tab. By default
			 * each one goes in as a link, an image as well, the way
			 * `uploader.defaultHandlerSuccess` inserts a file that isn't an image.
			 * ```javascript
			 * Jodit.make('#editor', {
			 * 		file: {
			 * 			defaultHandlerSuccess(data) {
			 * 				data.files.forEach(file => {
			 * 					this.s.insertHTML(`<a class="file" href="${data.baseurl + file}">${file}</a>`);
			 * 				});
			 * 			}
			 * 		}
			 * });
			 * ```
			 */
			defaultHandlerSuccess?: (this: IJodit, data: IUploaderData) => void;
		};
	}
}

function insertLinks(this: IJodit, data: IUploaderData): void {
	data.files?.forEach(file => {
		const link = this.createInside.element('a', {
			href: data.baseurl + file
		});

		link.textContent = this.o.uploader.getDisplayName.call(
			this.uploader,
			data.baseurl,
			file
		);

		this.s.insertNode(link);
	});
}

Config.prototype.file = {
	defaultHandlerSuccess: insertLinks
};

Config.prototype.controls.file = {
	popup: (editor: IJodit, current: Node | false, close) => {
		const insert = (url: string, title: string = ''): void => {
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
				upload: (data: IUploaderData) => {
					(editor.o.file?.defaultHandlerSuccess ?? insertLinks).call(
						editor,
						data
					);
				},
				url: (url: string, text: string) => {
					if (sourceAnchor) {
						attr(sourceAnchor, 'href', url);
						attr(sourceAnchor, 'title', text);
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

pluginSystem.add('file', file);
