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

/**
 * Add `sandbox=""` attribute to all `<iframe>` elements in the editor content
 * @private
 */
export function sandboxIframesInContent(
	jodit: IJodit,
	nodeElm: Node,
	hadEffect: boolean
): boolean {
	if (
		!jodit.o.cleanHTML.sandboxIframesInContent ||
		!Dom.isElement(nodeElm) ||
		nodeElm.nodeName !== 'IFRAME'
	) {
		return hadEffect;
	}

	const elm = nodeElm as HTMLIFrameElement;

	if (!elm.hasAttribute('sandbox')) {
		elm.setAttribute('sandbox', '');
		return true;
	}

	return hadEffect;
}
