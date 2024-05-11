/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/preview/README.md]]
 * @packageDocumentation
 * @module plugins/preview
 */

import type { IControlType, IJodit } from 'jodit/types';
import { MODE_SOURCE, MODE_WYSIWYG } from 'jodit/core/constants';
import { pluginSystem } from 'jodit/core/global';
import { previewBox } from 'jodit/core/helpers/utils/print';
import { Config } from 'jodit/config';

import './preview.less';

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
			const dialog = editor.dlg();

			dialog
				.setSize(1024, 600)
				.open('', editor.i18n('Preview'))
				.setModal(true);

			const [, onDestrcut] = previewBox(
				editor,
				defaultValue,
				'px',
				dialog.getElm('content')
			);

			dialog.e.on(dialog, 'afterClose', onDestrcut);
		}
	);
}

pluginSystem.add('preview', preview);
