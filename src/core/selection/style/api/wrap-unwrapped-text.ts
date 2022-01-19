/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, Nullable } from 'jodit/types';
import type { CommitStyle } from '../commit-style';
import { Dom } from 'jodit/core/dom';

/**
 * Wrap text or inline elements inside Block element
 * @private
 */
export function wrapUnwrappedText(
	style: CommitStyle,
	elm: Node,
	jodit: IJodit,
	getRange: () => Range
): HTMLElement {
	const root = jodit.editor,
		ci = jodit.createInside,
		edge = (n: Node, key: keyof Node = 'previousSibling') => {
			let edgeNode: Node = n,
				node: Nullable<Node> = n;

			while (node) {
				if (Dom.isTag(node, jodit.o.enter)) {
					break;
				}

				edgeNode = node;

				if (node[key]) {
					node = node[key] as Nullable<Node>;
				} else {
					node =
						node.parentNode &&
						!Dom.isBlock(node.parentNode) &&
						node.parentNode !== root
							? node.parentNode
							: null;
				}

				if (Dom.isBlock(node)) {
					break;
				}
			}

			return edgeNode;
		};

	const start: Node = edge(elm),
		end: Node = edge(elm, 'nextSibling');

	const range = getRange();
	range.setStartBefore(start);
	range.setEndAfter(end);
	const fragment = range.extractContents();

	const wrapper = ci.element(style.element);
	wrapper.appendChild(fragment);
	range.insertNode(wrapper);

	if (style.elementIsBlock) {
		if (
			Dom.isEmpty(wrapper) &&
			!Dom.isTag(wrapper.firstElementChild, 'br')
		) {
			wrapper.appendChild(ci.element('br'));
		}
	}

	return wrapper;
}
