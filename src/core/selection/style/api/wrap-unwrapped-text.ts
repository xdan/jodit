/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, Nullable, ICommitStyle } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { isMarker } from 'jodit/core/helpers/checker/is-marker';

/**
 * Wrap text or inline elements inside Block element
 * @private
 */
export function wrapUnwrappedText(
	style: ICommitStyle,
	elm: Node,
	jodit: IJodit
): HTMLElement {
	const root = jodit.editor,
		ci = jodit.createInside,
		edge = (n: Node, key: keyof Node = 'previousSibling'): Node => {
			let edgeNode: Node = n,
				node: Nullable<Node> = n;

			while (node && !isMarker(node)) {
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

	const range = jodit.s.createRange();
	range.setStartBefore(start);
	range.setEndAfter(end);
	const fragment = range.extractContents();

	const wrapper = ci.element(style.element);
	wrapper.appendChild(fragment);
	Dom.safeInsertNode(range, wrapper);

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
