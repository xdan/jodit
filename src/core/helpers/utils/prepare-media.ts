/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { IJodit, Nullable } from 'jodit/types';
import { getAlignClasses, hAlignElement } from 'jodit/core/helpers/utils/align';
import { wrapMedia } from 'jodit/core/helpers/utils/media-wrapper';

/**
 * Puts new media in its wrapper (see `mediaWrappers`) and aligns it with
 * `mediaDefaultAlign`. Returns the wrapper, or `element` when there is none
 */
export function prepareMedia(jodit: IJodit, element: HTMLElement): HTMLElement {
	const media = wrapMedia(jodit, element);
	const { mediaDefaultAlign } = jodit.o;

	if (mediaDefaultAlign && mediaDefaultAlign !== 'normal') {
		hAlignElement(media, mediaDefaultAlign, getAlignClasses(jodit, media));
	}

	return media;
}

/**
 * Embed code that is one element is prepared as media (see `prepareMedia`);
 * other code is returned as it is
 */
export function prepareEmbedCode(
	jodit: IJodit,
	code: string
): string | HTMLElement {
	const box = jodit.createInside.div();
	box.innerHTML = code.trim();

	const element = box.firstElementChild as Nullable<HTMLElement>;

	return element && box.childNodes.length === 1
		? prepareMedia(jodit, element)
		: code;
}
