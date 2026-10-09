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
 * The media in `elm` when `elm` is a wrapper media keep in the content (see
 * `mediaWrappers`): an element of a type `elm` is the wrapper for
 */
export function getWrappedMedia(
	jodit: IJodit,
	elm: Nullable<Node>
): Nullable<HTMLElement> {
	for (const [tag, wrapper] of Object.entries(jodit.o.mediaWrappers ?? {})) {
		if (isWrapper(elm, wrapper)) {
			const media = (elm as HTMLElement).querySelector<HTMLElement>(tag);

			if (media) {
				return media;
			}
		}
	}

	return null;
}

/**
 * The wrapper media keep in the content (see `mediaWrappers`) that is or
 * holds `node`
 */
export function getMediaWrapper(
	jodit: IJodit,
	node: Nullable<Node>
): Nullable<HTMLElement> {
	return Dom.closest(
		node,
		elm => Boolean(getWrappedMedia(jodit, elm)),
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
