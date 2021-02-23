/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IControlType, IDialog, IJodit } from '../../types';
import { Config } from '../../config';
import { css } from '../../core/helpers';
import * as consts from '../../core/constants';

Config.prototype.controls.preview = {
	icon: 'eye',
	exec: (editor: IJodit) => {
		const dialog = <IDialog>editor.getInstance('Dialog', {
			language: editor.o.language,
			theme: editor.o.theme
		});

		const div = editor.c.div();
		css(div, {
			padding: 16
		});

		if (editor.iframe) {
			const iframe = editor.create.element('iframe');

			css(iframe, {
				minWidth: 800,
				minHeight: 600,
				border: 0
			});

			div.appendChild(iframe);
			dialog.open(div, editor.i18n('Preview'));

			const mywindow = iframe.contentWindow;

			if (mywindow) {
				editor.e.fire(
					'generateDocumentStructure.iframe',
					mywindow.document,
					editor
				);

				mywindow.document.body.innerHTML = editor.value;
			}
		} else {
			css(div, {
				minWidth: 1024,
				minHeight: 600,
				border: 0
			});

			div.innerHTML = editor.value;
			dialog.open(div, editor.i18n('Preview'));
		}

		dialog.setModal(true);
	},
	mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG,
	tooltip: 'Preview'
} as IControlType;

export function preview(editor: IJodit): void {
	editor.registerButton({
		name: 'preview'
	});
}
