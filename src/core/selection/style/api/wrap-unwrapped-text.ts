/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { ICreate, Nullable } from '../../../../types';
import type { CommitStyle } from '../commit-style';
import { Dom } from '../../../dom';
import { postProcessListElement } from './post-process-list-element';

/**
 * Wrap text or inline elements inside Block element
 */
export function wrapUnwrappedText(
	style: CommitStyle,
	elm: Node,
	root: HTMLElement,
	ci: ICreate,
	getRange: () => Range
): HTMLElement {
	const edge = (n: Node, key: keyof Node = 'previousSibling') => {
		let edgeNode: Node = n,
			node: Nullable<Node> = n;

		while (node) {
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
		postProcessListElement(style, wrapper, ci);

		if (
			Dom.isEmpty(wrapper) &&
			!Dom.isTag(wrapper.firstElementChild, 'br')
		) {
			wrapper.appendChild(ci.element('br'));
		}
	}

	return wrapper;
}
