/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

export const inView = (elm: HTMLElement, root: HTMLElement, doc: Document) => {
	let rect: ClientRect = elm.getBoundingClientRect(),
		el: HTMLElement | null = elm as HTMLElement | null;
	const top: number = rect.top,
		height: number = rect.height;

	do {
		if (el && el.parentNode) {
			el = el.parentNode as HTMLElement;
			rect = el.getBoundingClientRect();
			if (!(top <= rect.bottom)) {
				return false;
			}

			// Check if the element is out of view due to a container scrolling
			if (top + height <= rect.top) {
				return false;
			}
		}
	} while (el && el !== root && el.parentNode);

	// Check its within the document viewport
	return (
		top <= ((doc.documentElement && doc.documentElement.clientHeight) || 0)
	);
};

export const scrollIntoView = (
	elm: HTMLElement,
	root: HTMLElement,
	doc: Document
) => {
	if (!inView(elm, root, doc)) {
		if (root.clientHeight !== root.scrollHeight) {
			root.scrollTop = elm.offsetTop;
		}
		if (!inView(elm, root, doc)) {
			elm.scrollIntoView();
		}
	}
};
