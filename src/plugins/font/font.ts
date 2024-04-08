/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/font/README.md]]
 * @packageDocumentation
 * @module plugins/font
 */

import type { IJodit } from 'jodit/types';
import { pluginSystem } from 'jodit/core/global';
import { normalizeSize } from 'jodit/core/helpers/';

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
				editor.s.commitStyle({
					attributes: {
						style: {
							fontSize: normalizeSize(
								third,
								editor.o.defaultFontSizePoints
							)
						}
					}
				});
				break;

			case 'fontname':
				editor.s.commitStyle({
					attributes: {
						style: {
							fontFamily: third
						}
					}
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
