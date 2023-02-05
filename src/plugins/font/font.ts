/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/font/README.md]]
 * @packageDocumentation
 * @module plugins/font
 */

import type { IJodit } from 'jodit/types';
import { normalizeSize } from 'jodit/core/helpers/';
import { pluginSystem } from 'jodit/core/global';

import './config';

/**
 * Process commands `fontsize` and `fontname`
 */
export function font(editor: IJodit): void {
	editor
		.registerButton({
			name: 'font',
			group: 'font'
		})
		.registerButton({
			name: 'fontsize',
			group: 'font'
		});

	const callback = (
		command: string,
		second: string,
		third: string
	): false | void => {
		switch (command) {
			case 'fontsize':
				editor.s.applyStyle({
					fontSize: normalizeSize(third)
				});
				break;

			case 'fontname':
				editor.s.applyStyle({
					fontFamily: third
				});
				break;
		}

		editor.synchronizeValues();

		return false;
	};

	editor
		.registerCommand('fontsize', callback)
		.registerCommand('fontname', callback);
}

pluginSystem.add('font', font);
