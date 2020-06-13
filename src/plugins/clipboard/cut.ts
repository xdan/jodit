/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IControlType, IJodit, IPlugin } from '../../types';
import { Config } from '../../config';
import { TEXT_HTML, TEXT_PLAIN } from '../../core/constants';
import { stripTags } from '../../core/helpers';
import { getDataTransfer } from './paste';

Config.prototype.controls.cut = {
	command: 'cut',
	isDisabled: (editor: IJodit) => editor.s.isCollapsed(),
	tooltip: 'Cut selection'
} as IControlType;

Config.prototype.controls.copy = {
	command: 'copy',
	isDisabled: (editor: IJodit) => editor.s.isCollapsed(),
	tooltip: 'Copy selection'
} as IControlType;

export const pluginKey = 'clipboard';

/**
 * Clipboard plugin - cut and copy functionality
 */
export class clipboard implements IPlugin {
	jodit!: IJodit;

	init(editor: IJodit): void {
		editor.e
			.off(`copy.${pluginKey} cut.${pluginKey}`)
			.on(`copy.${pluginKey} cut.${pluginKey}`, (event: ClipboardEvent):
				| false
				| void => {
				const selectedText = editor.s.html;

				const clipboardData =
					getDataTransfer(event) ||
					getDataTransfer(editor.ew as any) ||
					getDataTransfer((event as any).originalEvent);

				if (clipboardData) {
					clipboardData.setData(TEXT_PLAIN, stripTags(selectedText));
					clipboardData.setData(TEXT_HTML, selectedText);
				}

				editor.buffer.set(pluginKey, selectedText);

				if (event.type === 'cut') {
					editor.s.remove();
					editor.s.focus();
				}

				event.preventDefault();

				editor?.events?.fire('afterCopy', selectedText);
			});
	}

	destruct(editor: IJodit): void {
		editor?.buffer?.set(pluginKey, '');
		editor?.events?.off('.' + pluginKey);
	}
}
