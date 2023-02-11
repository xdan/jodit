/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/enter
 */

import type { IJodit, Nullable } from 'jodit/types';
import * as consts from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';

/**
 * Finds a suitable parent block container
 * @private
 */
export function getBlockWrapper(
	fake: Node | null,
	jodit: IJodit,
	tagReg = consts.IS_BLOCK
): Nullable<HTMLElement> {
	let node: Node | null = fake;
	const root = jodit.editor;

	do {
		if (!node || node === root) {
			break;
		}

		if (tagReg.test(node.nodeName)) {
			if (Dom.isTag(node, 'li')) {
				return node;
			}

			return (
				getBlockWrapper(node.parentNode, jodit, /^li$/i) ||
				(node as HTMLElement)
			);
		}

		node = node.parentNode;
	} while (node && node !== root);

	return null;
}
