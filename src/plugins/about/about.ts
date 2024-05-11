/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/about/README.md]]
 * @packageDocumentation
 * @module plugins/about
 */

import type { IControlType, IJodit } from 'jodit/types';
import * as constants from 'jodit/core/constants';
import { HOMEPAGE } from 'jodit/core/constants';
import { pluginSystem } from 'jodit/core/global';
import { css, isLicense, normalizeLicense } from 'jodit/core/helpers/';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import aboutIcon from './about.svg';

import './about.less';

Config.prototype.controls.about = {
	exec: (editor: IJodit) => {
		const dialog = editor.dlg({ closeOnClickOverlay: true }),
			i = editor.i18n.bind(editor);

		dialog
			.setMod('theme', editor.o.theme)
			.setHeader(i('About Jodit'))
			.setContent(
				`<div class="jodit-about">
					<div>${i('Jodit Editor')} v.${editor.getVersion()}</div>
					<div>${i(
						'License: %s',
						!isLicense(editor.o.license)
							? 'MIT'
							: normalizeLicense(editor.o.license)
					)}</div>
					<div>
						<a href="${HOMEPAGE}" target="_blank">${HOMEPAGE}</a>
					</div>
					<div>
						<a href="https://xdsoft.net/jodit/docs/" target="_blank">${i(
							"Jodit User's Guide"
						)}</a>
						${i('contains detailed help for using')}
					</div>
					<div>${i(
						'Copyright © XDSoft.net - Chupurnov Valeriy. All rights reserved.'
					)}</div>
				</div>`
			);

		css(dialog.dialog, {
			minHeight: 200,
			minWidth: 420
		});

		dialog.open(true, true);
	},
	tooltip: 'About Jodit',
	mode: constants.MODE_SOURCE + constants.MODE_WYSIWYG
} as IControlType;

function about(editor: IJodit): void {
	editor.registerButton({
		name: 'about',
		group: 'info'
	});
}

pluginSystem.add('about', about);
Icon.set('about', aboutIcon);
