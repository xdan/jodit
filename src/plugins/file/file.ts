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
import { normalizeUploaderData } from 'jodit/modules/uploader/helpers/normalize-uploader-data';
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
			 * 				data.items.forEach(({ file }) => {
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

/**
 * Selected text becomes the link's text, as the Link button does, instead
 * of being replaced by the file's name. Returns false with nothing selected
 */
function wrapSelectionInLink(
	editor: IJodit,
	href: string,
	title: string = ''
): boolean {
	if (editor.s.isCollapsed()) {
		return false;
	}

	const links = editor.s.wrapInTag('a') as HTMLAnchorElement[];

	if (!links.length) {
		return false;
	}

	links.forEach(link => {
		attr(link, 'href', href);

		if (title) {
			attr(link, 'title', title);
		}
	});

	editor.s.setCursorAfter(links[links.length - 1]);
	return true;
}

function insertLinks(this: IJodit, data: IUploaderData): void {
	const { baseurl, items } = normalizeUploaderData(data);

	items.forEach(({ file }) => {
		const href = baseurl + file;

		if (wrapSelectionInLink(this, href)) {
			return;
		}

		const link = this.createInside.element('a', { href });

		link.textContent = this.o.uploader.getDisplayName.call(
			this.uploader,
			baseurl,
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
		// The popup's first field takes the focus, so the selection the
		// popup was opened for is kept and put back before the link goes in
		const selected = editor.s.isCollapsed() ? null : editor.s.range;

		const restoreSelection = (): void => {
			if (selected) {
				editor.s.selectRange(selected);
			}
		};

		const insert = (url: string, title: string = ''): void => {
			restoreSelection();

			if (wrapSelectionInLink(editor, url, title)) {
				return;
			}

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
					data.items?.forEach(({ file }) =>
						insert(data.baseurl + file)
					);

					close();
				},
				upload: (data: IUploaderData) => {
					restoreSelection();
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
