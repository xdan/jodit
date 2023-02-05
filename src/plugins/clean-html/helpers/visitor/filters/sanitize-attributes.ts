/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { sanitizeHTMLElement } from 'jodit/core/helpers';

/**
 * @private
 */
export function sanitizeAttributes(
	jodit: IJodit,
	nodeElm: Node,
	hadEffect: boolean
): boolean {
	if (
		Dom.isElement(nodeElm) &&
		sanitizeHTMLElement(nodeElm, {
			safeJavaScriptLink: jodit.options.cleanHTML.safeJavaScriptLink,
			removeOnError: jodit.options.cleanHTML.removeOnError
		})
	) {
		return true;
	}

	return hadEffect;
}
