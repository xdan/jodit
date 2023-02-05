/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/indent
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Config } from 'jodit/config';
import { Dom } from 'jodit/core/dom';
import { Icon } from 'jodit/core/ui/icon';

import { getKey } from './helpers';

Icon.set('indent', require('./icons/indent.svg')).set(
	'outdent',
	require('./icons/outdent.svg')
);

Config.prototype.controls.indent = {
	tooltip: 'Increase Indent'
} as IControlType;

Config.prototype.controls.outdent = {
	isDisabled: (editor: IJodit): boolean => {
		const current = editor.s.current();

		if (current) {
			const currentBox = Dom.closest(current, Dom.isBlock, editor.editor);

			if (currentBox) {
				const arrow = getKey(editor.o.direction, currentBox);
				return (
					!currentBox.style[arrow] ||
					parseInt(currentBox.style[arrow], 10) <= 0
				);
			}
		}

		return true;
	},
	tooltip: 'Decrease Indent'
} as IControlType;

declare module 'jodit/config' {
	interface Config {
		/**
		 * The number of pixels to use for indenting the current line.
		 */
		indentMargin: number;
	}
}

Config.prototype.indentMargin = 10;
