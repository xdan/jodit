/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/enter
 */

import type { HTMLTagNames, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { scrollIntoViewIfNeeded } from 'jodit/core/helpers/utils/scroll-into-view';

/**
 * Insert default paragraph
 * @private
 */
export function insertParagraph(
	fake: Text,
	editor: IJodit,
	wrapperTag: HTMLTagNames,
	style?: CSSStyleDeclaration
): HTMLElement {
	const isBR = wrapperTag.toLowerCase() === 'br',
		{ createInside } = editor,
		p = createInside.element(wrapperTag),
		br = createInside.element('br');

	if (!isBR) {
		p.appendChild(br);
	}

	if (style && style.cssText) {
		p.setAttribute('style', style.cssText);
	}

	Dom.after(fake, p);
	Dom.before(isBR ? p : br, fake);

	scrollIntoViewIfNeeded(p, editor.editor, editor.ed);

	return p;
}
