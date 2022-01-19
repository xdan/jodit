/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/size
 */

/**
 * Calc relative offset by start editor field
 * @returns returns an object containing the properties top and left.
 */

import type { IBound, IHasScroll, IJodit, IViewBased } from 'jodit/types';

export const offset = (
	elm: HTMLElement | Range,
	jodit: IViewBased,
	doc: Document,
	recurse: boolean = false
): IBound => {
	let rect: ClientRect;
	try {
		rect = elm.getBoundingClientRect();
	} catch (e) {
		rect = {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			width: 0,
			height: 0
		} as ClientRect;
	}

	const body = doc.body,
		docElem: IHasScroll = doc.documentElement || {
			clientTop: 0,
			clientLeft: 0,
			scrollTop: 0,
			scrollLeft: 0
		},
		win: Window = doc.defaultView || (doc as any).parentWindow,
		scrollTop = win.pageYOffset || docElem.scrollTop || body.scrollTop,
		scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft,
		clientTop = docElem.clientTop || body.clientTop || 0,
		clientLeft = docElem.clientLeft || body.clientLeft || 0;

	let topValue: number, leftValue: number;

	const iframe = (jodit as IJodit).iframe;

	if (!recurse && jodit && jodit.options && jodit.o.iframe && iframe) {
		const { top, left } = offset(iframe, jodit, jodit.od, true);

		topValue = rect.top + top;
		leftValue = rect.left + left;
	} else {
		topValue = rect.top + scrollTop - clientTop;
		leftValue = rect.left + scrollLeft - clientLeft;
	}

	return {
		top: Math.round(topValue as number),
		left: Math.round(leftValue),
		width: rect.width,
		height: rect.height
	};
};
