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
 * Automatically add `rel="noopener noreferrer"` to links with `target="_blank"`
 * @private
 */
export function safeLinksTarget(
	jodit: IJodit,
	nodeElm: Node,
	hadEffect: boolean
): boolean {
	if (
		!jodit.o.cleanHTML.safeLinksTarget ||
		!Dom.isElement(nodeElm) ||
		nodeElm.nodeName !== 'A'
	) {
		return hadEffect;
	}

	const elm = nodeElm as HTMLAnchorElement;

	if (attr(elm, 'target') !== '_blank') {
		return hadEffect;
	}

	const rel = attr(elm, 'rel') || '';
	const parts = rel.split(/\s+/).filter(Boolean);
	let changed = false;

	if (!parts.includes('noopener')) {
		parts.push('noopener');
		changed = true;
	}

	if (!parts.includes('noreferrer')) {
		parts.push('noreferrer');
		changed = true;
	}

	if (changed) {
		attr(elm, 'rel', parts.join(' '));
		return true;
	}

	return hadEffect;
}
