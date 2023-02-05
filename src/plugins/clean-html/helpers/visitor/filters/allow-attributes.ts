/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
	if (allow && Dom.isElement(nodeElm) && allow[nodeElm.nodeName] !== true) {
		const attrs: NamedNodeMap = (nodeElm as Element).attributes;

		if (attrs && attrs.length) {
			const removeAttrs: string[] = [];

			for (let i = 0; i < attrs.length; i += 1) {
				const attr = allow[nodeElm.nodeName][attrs[i].name];

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
