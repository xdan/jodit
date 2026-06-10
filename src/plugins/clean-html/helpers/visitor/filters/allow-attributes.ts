/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { IDictionary, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * @private
 */
export function allowAttributes(
	jodit: IJodit,
	nodeElm: Node,
	hadEffect: boolean,
	allow: IDictionary | false
): boolean {
	const allowedForTag =
		allow && Dom.isElement(nodeElm) && allow[nodeElm.nodeName];

	if (allow && Dom.isElement(nodeElm) && allowedForTag !== true) {
		// the tag is not in the allow list at all — attributes do not matter,
		// the element itself will be removed by the tags filter. Without this
		// check `allow[nodeName][attr]` threw on e.g. `<meta charset>`. See #1224
		if (!allowedForTag) {
			return hadEffect;
		}

		const attrs: NamedNodeMap = (nodeElm as Element).attributes;

		if (attrs && attrs.length) {
			const removeAttrs: string[] = [];

			for (let i = 0; i < attrs.length; i += 1) {
				const attr = allowedForTag[attrs[i].name];

				if (!attr || (attr !== true && attr !== attrs[i].value)) {
					removeAttrs.push(attrs[i].name);
				}
			}

			if (removeAttrs.length) {
				hadEffect = true;
			}

			removeAttrs.forEach(attr => {
				(nodeElm as Element).removeAttribute(attr);
			});
		}
	}

	return hadEffect;
}
