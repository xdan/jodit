/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/color/README.md]]
 * @packageDocumentation
 * @module plugins/color
 */

import type { IJodit } from 'jodit/types';
import { normalizeColor } from 'jodit/core/helpers/';
import { pluginSystem } from 'jodit/core/global';

import './config';

/**
 * Process commands `background` and `forecolor`
 */
export function color(editor: IJodit): void {
	editor.registerButton({
		name: 'brush',
		group: 'color'
	});

	const callback = (
		command: string,
		second: string,
		third: string
	): false | void => {
		const colorHEX: string | false = normalizeColor(third);

		switch (command) {
			case 'background':
				editor.s.applyStyle({
					backgroundColor: !colorHEX ? '' : (colorHEX as string)
				});
				break;
			case 'forecolor':
				editor.s.applyStyle({
					color: !colorHEX ? '' : (colorHEX as string)
				});
				break;
		}

		editor.synchronizeValues();
		return false;
	};

	editor
		.registerCommand('forecolor', callback)
		.registerCommand('background', callback);
}

pluginSystem.add('color', color);
