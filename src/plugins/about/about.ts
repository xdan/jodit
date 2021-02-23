/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './about.less';

import type { IControlType, IJodit } from '../../types';
import { Config } from '../../config';
import { css, isLicense, normalizeLicense } from '../../core/helpers/';
import * as constants from '../../core/constants';
import { Dialog } from '../../modules/dialog';

Config.prototype.controls.about = {
	exec: (editor: IJodit) => {
		const dialog = new Dialog({
				language: editor.o.language
			}),
			i18n = editor.i18n.bind(editor);

		dialog.setMod('theme', editor.o.theme);
		dialog.setHeader(i18n('About Jodit'));

		dialog.setContent(
			`<div class="jodit-about">
					<div>${i18n('Jodit Editor')} v.${editor.getVersion()}</div>
					<div>${i18n(
						'License: %s',
						!isLicense(editor.o.license)
							? 'MIT'
							: normalizeLicense(editor.o.license)
					)}</div>
					<div>
						<a href="https://xdsoft.net/jodit/" target="_blank">http://xdsoft.net/jodit/</a>
					</div>
					<div>
						<a href="https://xdsoft.net/jodit/doc/" target="_blank">${i18n(
							"Jodit User's Guide"
						)}</a>
						${i18n('contains detailed help for using')}
					</div>
					<div>${i18n(
						'Copyright © XDSoft.net - Chupurnov Valeriy. All rights reserved.'
					)}</div>
				</div>`
		);

		css(dialog.dialog, {
			minHeight: 200,
			minWidth: 420
		});

		dialog.open(true);
		dialog.bindDestruct(editor);
	},
	tooltip: 'About Jodit',
	mode: constants.MODE_SOURCE + constants.MODE_WYSIWYG
} as IControlType;

export function about(editor: IJodit): void {
	editor.registerButton({
		name: 'about',
		group: 'info'
	});
}
