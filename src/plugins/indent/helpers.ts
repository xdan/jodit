/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/indent
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { attr } from 'jodit/core/helpers/utils';
import { css, cssInline } from 'jodit/core/helpers/utils/css';

/**
 * Get style rule key for current direction
 * @internal
 */
export const getKey = (
	direction: string,
	box: HTMLElement
): 'marginLeft' | 'marginRight' | 'paddingLeft' | 'paddingRight' =>
	`${Dom.isCell(box) ? 'padding' : 'margin'}${
		direction === 'rtl' ? 'Right' : 'Left'
	}`;

/**
 * Indents or outdents a box by `indentMargin`
 * @internal
 */
export const applyIndentToBox = (
	processedElements: Set<HTMLElement>,
	currentBox: HTMLElement,
	editor: IJodit,
	command: string
): void => {
	if (!currentBox) {
		return;
	}

	if (processedElements.has(currentBox)) {
		return;
	}

	const key = getKey(editor.o.direction, currentBox);

	processedElements.add(currentBox);

	const current = cssInline(currentBox, key);
	let value = current ? parseInt(current, 10) : 0;

	value += editor.o.indentMargin * (command === 'outdent' ? -1 : 1);

	css(currentBox, key, value > 0 ? value : '');

	if (!attr(currentBox, 'style')) {
		attr(currentBox, 'style', null);
	}
};
