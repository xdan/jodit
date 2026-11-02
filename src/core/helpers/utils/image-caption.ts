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
import { toArray } from 'jodit/core/helpers/array/to-array';

const isPart = (
	node: Nullable<Node>,
	part: MediaWrapper
): node is HTMLElement =>
	Dom.isHTMLElement(node) &&
	node.nodeName.toLowerCase() === part.tag.toLowerCase() &&
	(!part.className || node.classList.contains(part.className));

/**
 * The caption in `wrapper`, an element holding an image and its caption (see
 * `imageCaption`)
 */
export function getImageCaption(
	jodit: IJodit,
	wrapper: Nullable<Node>
): Nullable<HTMLElement> {
	const markup = jodit.o.imageCaption;

	if (!markup || !isPart(wrapper, markup.wrapper)) {
		return null;
	}

	return (
		toArray(wrapper.getElementsByTagName(markup.caption.tag)).find(
			(elm): elm is HTMLElement => isPart(elm, markup.caption)
		) ?? null
	);
}

/**
 * The image in `wrapper` when it is an element holding one image and its
 * caption (see `imageCaption`)
 */
export function getCaptionedImage(
	jodit: IJodit,
	wrapper: Nullable<Node>
): Nullable<HTMLImageElement> {
	const caption = getImageCaption(jodit, wrapper);

	if (!caption) {
		return null;
	}

	const images = (wrapper as HTMLElement).getElementsByTagName('img');

	return images.length === 1 && !caption.contains(images[0])
		? images[0]
		: null;
}

/**
 * The element holding an image and its caption (see `imageCaption`) that is
 * or holds `node`
 */
export function getCaptionWrapper(
	jodit: IJodit,
	node: Nullable<Node>
): Nullable<HTMLElement> {
	return Dom.closest(
		node,
		elm => Boolean(getCaptionedImage(jodit, elm)),
		jodit.editor
	);
}
