/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IBound, IViewBased } from '../../../types';
import { isJoditObject } from '../checker';

export function position(elm: HTMLElement): IBound;
export function position(elm: HTMLElement, jodit: IViewBased): IBound;
export function position(
	elm: HTMLElement,
	jodit: IViewBased,
	recurse: boolean
): IBound;

/**
 * Calculate screen element position
 *
 * @param elm
 * @param jodit
 * @param recurse
 */
export function position(
	elm: HTMLElement,
	jodit?: IViewBased,
	recurse: boolean = false
): IBound {
	// let xPos = 0,
	// 	yPos = 0,
	// 	el: HTMLElement | null = elm;
	//
	// const doc: Document = elm.ownerDocument || jodit?.od || document;
	//
	// while (el) {
	// 	if (el.tagName == 'BODY') {
	// 		// deal with browser quirks with body/window/document and page scroll
	// 		const xScroll = el.scrollLeft || doc.documentElement.scrollLeft,
	// 			yScroll = el.scrollTop || doc.documentElement.scrollTop;
	//
	// 		xPos += el.offsetLeft - xScroll + el.clientLeft;
	// 		yPos += el.offsetTop - yScroll + el.clientTop;
	// 	} else {
	// 		// for all other non-BODY elements
	// 		xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
	// 		yPos += el.offsetTop - el.scrollTop + el.clientTop;
	// 	}
	//
	// 	el = el.offsetParent as HTMLElement;
	// }
	const rect = elm.getBoundingClientRect();
	let xPos = rect.left,
		yPos = rect.top;

	if (isJoditObject(jodit) && jodit.iframe && !recurse) {
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
