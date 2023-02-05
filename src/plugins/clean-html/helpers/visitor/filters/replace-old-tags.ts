/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { HTMLTagNames, IDictionary, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * @private
 */
export function replaceOldTags(
	jodit: IJodit,
	nodeElm: Node,
	hadEffect: boolean
): boolean {
	const newNodeElm = replaceIfMatched(
		jodit,
		nodeElm,
		jodit.o.cleanHTML.replaceOldTags
	);

	if (nodeElm !== newNodeElm) {
		nodeElm = newNodeElm;
		return true;
	}

	return hadEffect;
}

/**
 * Replaces an element with a newer one if specified in the configuration match
 * @private
 */
function replaceIfMatched(
	jodit: IJodit,
	oldParent: Node,
	list: IDictionary<HTMLTagNames> | false
): Node {
	if (!list || !Dom.isHTMLElement(oldParent)) {
		return oldParent;
	}

	const tagName: string =
		list[oldParent.nodeName.toLowerCase()] || list[oldParent.nodeName];

	if (tagName) {
		return Dom.replace(
			oldParent as HTMLElement,
			tagName as HTMLTagNames,
			jodit.createInside,
			true,
			false
		);
	}

	return oldParent;
}
