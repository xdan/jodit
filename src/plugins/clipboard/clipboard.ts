/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/clipboard/README.md]]
 * @packageDocumentation
 * @module plugins/clipboard
 */

import type { IJodit, IPlugin } from 'jodit/types';
import type { Plugin } from 'jodit/core/plugin';
import {
	CLIPBOARD_ID,
	INSERT_AS_HTML,
	TEXT_HTML,
	TEXT_PLAIN
} from 'jodit/core/constants';
import { getDataTransfer, stripTags } from 'jodit/core/helpers';
import { pluginSystem } from 'jodit/core/global';

import './config';

/**
 * Clipboard plugin - cut and copy functionality
 */
export class clipboard implements IPlugin {
	jodit!: IJodit;

	/** @override */
	buttons: Plugin['buttons'] = [
		{
			name: 'cut',
			group: 'clipboard'
		},
		{
			name: 'copy',
			group: 'clipboard'
		},
		{
			name: 'paste',
			group: 'clipboard'
		},
		{
			name: 'selectall',
			group: 'clipboard'
		}
	];

	init(editor: IJodit): void {
		this.buttons?.forEach(btn => editor.registerButton(btn));

		editor.e
			.off(`copy.${CLIPBOARD_ID} cut.${CLIPBOARD_ID}`)
			.on(
				`copy.${CLIPBOARD_ID} cut.${CLIPBOARD_ID}`,
				(event: ClipboardEvent): false | void => {
					const selectedText = editor.s.html;

					const clipboardData =
						getDataTransfer(event) ||
						getDataTransfer(editor.ew as any) ||
						getDataTransfer((event as any).originalEvent);

					if (clipboardData) {
						clipboardData.setData(
							TEXT_PLAIN,
							stripTags(selectedText)
						);
						clipboardData.setData(TEXT_HTML, selectedText);
					}

					editor.buffer.set(CLIPBOARD_ID, selectedText);
					editor.e.fire('pasteStack', {
						html: selectedText,
						action:
							(editor.o as any).defaultActionOnPaste ||
							INSERT_AS_HTML
					});

					if (event.type === 'cut') {
						editor.s.remove();
						editor.s.focus();
					}

					event.preventDefault();

					editor?.events?.fire('afterCopy', selectedText);
				}
			);
	}

	/** @override */
	destruct(editor: IJodit): void {
		editor?.buffer?.set(CLIPBOARD_ID, '');
		editor?.events?.off('.' + CLIPBOARD_ID);
	}
}

pluginSystem.add('clipboard', clipboard);
