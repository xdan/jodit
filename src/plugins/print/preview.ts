/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/print
 */

import './preview.less';

import type { IControlType, IDialog, IJodit } from 'jodit/types';
import { Config } from 'jodit/config';
import * as consts from 'jodit/core/constants';
import { previewBox } from 'jodit/plugins/print/helpers';

Config.prototype.controls.preview = {
	icon: 'eye',
	command: 'preview',
	mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG,
	tooltip: 'Preview'
} as IControlType;

export function preview(editor: IJodit): void {
	editor.registerButton({
		name: 'preview'
	});

	editor.registerCommand(
		'preview',
		(_: any, _1: any, defaultValue: string) => {
			const dialog = <IDialog>editor.getInstance('Dialog', {
				language: editor.o.language,
				theme: editor.o.theme
			});

			const div = previewBox(editor, defaultValue);

			dialog
				.setSize(1024, 600)
				.open(div, editor.i18n('Preview'))
				.setModal(true);
		}
	);
}
