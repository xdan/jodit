/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/size
 */

import type { IBound, IViewBased } from 'jodit/types';
import { isJoditObject } from '../checker/is-jodit-object';

export function position(elm: HTMLElement): IBound;
export function position(elm: HTMLElement, jodit: IViewBased): IBound;
export function position(
	elm: HTMLElement,
	jodit: IViewBased,
	recurse: boolean
): IBound;

/**
 * Calculate screen element position
 */
export function position(
	elm: HTMLElement,
	jodit?: IViewBased,
	recurse: boolean = false
): IBound {
	const rect = elm.getBoundingClientRect();

	let xPos = rect.left,
		yPos = rect.top;

	if (
		isJoditObject(jodit) &&
		jodit.iframe &&
		jodit.ed.body.contains(elm) &&
		!recurse
	) {
		const { left, top } = position(jodit.iframe, jodit, true);

		xPos += left;
		yPos += top;
	}

	return {
		left: Math.round(xPos),
		top: Math.round(yPos),
		width: Math.round(elm.offsetWidth),
		height: Math.round(elm.offsetHeight)
	};
}
