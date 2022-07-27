/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/print/preview
 */

import './preview.less';

import type { IControlType, IJodit } from 'jodit/types';
import { Config } from 'jodit/config';
import { MODE_SOURCE, MODE_WYSIWYG } from 'jodit/core/constants';
import { Dialog } from 'jodit/modules/dialog/dialog';
import { previewBox } from 'jodit/core/helpers/utils/print';
import { pluginSystem } from 'jodit/core/global';

Config.prototype.controls.preview = {
	icon: 'eye',
	command: 'preview',
	mode: MODE_SOURCE + MODE_WYSIWYG,
	tooltip: 'Preview'
} as IControlType;

export function preview(editor: IJodit): void {
	editor.registerButton({
		name: 'preview'
	});

	editor.registerCommand(
		'preview',
		(_: any, _1: any, defaultValue: string) => {
			const dialog = new Dialog({
				language: editor.o.language,
				theme: editor.o.theme
			});

			dialog
				.setSize(1024, 600)
				.open('', editor.i18n('Preview'))
				.setModal(true);

			previewBox(editor, defaultValue, 'px', dialog.getElm('content'));
		}
	);
}

pluginSystem.add('preview', preview);
