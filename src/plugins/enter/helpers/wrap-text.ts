/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/enter
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * If there is no container outside,
 * then we wrap all the nearest inline nodes in a container
 * @private
 */
export function wrapText(fake: Text, jodit: IJodit): HTMLElement {
	let needWrap: Node = fake;

	Dom.up(
		needWrap,
		node => {
			if (node && node.hasChildNodes() && node !== jodit.editor) {
				needWrap = node;
			}
		},
		jodit.editor
	);

	const currentBox = Dom.wrapInline(needWrap, jodit.o.enter, jodit);

	if (Dom.isEmpty(currentBox)) {
		const br = jodit.createInside.element('br');
		currentBox.appendChild(br);
		Dom.before(br, fake);
	}

	return currentBox;
}
