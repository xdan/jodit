/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { IJodit, MediaWrapper, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

const isWrapper = (node: Nullable<Node>, wrapper: MediaWrapper): boolean =>
	Dom.isHTMLElement(node) &&
	node.nodeName.toLowerCase() === wrapper.tag.toLowerCase() &&
	node.classList.contains(wrapper.className);

/**
 * The wrapper media keep in the content (see `mediaWrappers`) that is or
 * holds `node`: one that holds an element whose type it's the wrapper for
 */
export function getMediaWrapper(
	jodit: IJodit,
	node: Nullable<Node>
): Nullable<HTMLElement> {
	const wrappers = Object.entries(jodit.o.mediaWrappers ?? {});

	if (!wrappers.length) {
		return null;
	}

	return Dom.closest(
		node,
		elm =>
			wrappers.some(
				([tag, wrapper]) =>
					isWrapper(elm, wrapper) &&
					Boolean((elm as HTMLElement).querySelector(tag))
			),
		jodit.editor
	);
}

/**
 * An empty wrapper for media of type `tag` to keep in the content (see
 * `mediaWrappers`), or null when there is none for it
 */
export function createMediaWrapper(
	jodit: IJodit,
	tag: string
): Nullable<HTMLElement> {
	const wrapper = jodit.o.mediaWrappers?.[tag.toLowerCase()];

	if (!wrapper) {
		return null;
	}

	return jodit.createInside.element(wrapper.tag, {
		class: wrapper.className,
		contenteditable: false,
		draggable: true
	});
}

/**
 * Puts `element` in the wrapper for its type (see `mediaWrappers`), and
 * returns the wrapper, or `element` when there is none for it
 */
export function wrapMedia(jodit: IJodit, element: HTMLElement): HTMLElement {
	const wrapper = createMediaWrapper(jodit, element.nodeName);

	if (!wrapper) {
		return element;
	}

	if (element.parentNode) {
		Dom.before(element, wrapper);
	}

	Dom.append(wrapper, element);

	return wrapper;
}
