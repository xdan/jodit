/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { attr } from 'jodit/core/helpers/utils/attr';

/**
 * Convert `<object>` and `<embed>` elements to safer `<iframe>` elements.
 * @private
 */
export function convertUnsafeEmbeds(
	jodit: IJodit,
	nodeElm: Node,
	hadEffect: boolean
): boolean {
	const opt = jodit.o.cleanHTML.convertUnsafeEmbeds;

	if (!opt || !Dom.isElement(nodeElm)) {
		return hadEffect;
	}

	const tag = nodeElm.nodeName.toLowerCase();

	if (!opt.includes(tag)) {
		return hadEffect;
	}

	const elm = nodeElm as HTMLElement;
	const src =
		attr(elm, 'data') || attr(elm, 'src') || attr(elm, 'movie') || '';

	if (!src) {
		Dom.safeRemove(elm);
		return true;
	}

	const iframe = jodit.createInside.element('iframe');
	attr(iframe, {
		src,
		sandbox: '',
		frameborder: '0',
		width: attr(elm, 'width'),
		height: attr(elm, 'height')
	});

	Dom.replace(elm, iframe, undefined, false, true);

	return true;
}
