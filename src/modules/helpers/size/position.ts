import { IBound } from '../../../types';

export function position(elm: HTMLElement): IBound {
	let xPos = 0,
		yPos = 0,
		el: HTMLElement | null = elm;

	while (el) {
		if (el.tagName == 'BODY') {
			// deal with browser quirks with body/window/document and page scroll
			const xScroll =
					el.scrollLeft || document.documentElement.scrollLeft,
				yScroll = el.scrollTop || document.documentElement.scrollTop;

			xPos += el.offsetLeft - xScroll + el.clientLeft;
			yPos += el.offsetTop - yScroll + el.clientTop;
		} else {
			// for all other non-BODY elements
			xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
			yPos += el.offsetTop - el.scrollTop + el.clientTop;
		}

		el = el.offsetParent as HTMLElement;
	}

	return {
		left: xPos,
		top: yPos,
		width: elm.offsetWidth,
		height: elm.offsetHeight
	};
}
