import { IBound, IJodit } from '../../../types';

export function position(elm: HTMLElement): IBound;

export function position(elm: HTMLElement, jodit: IJodit): IBound;

export function position(
	elm: HTMLElement,
	jodit: IJodit,
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
	jodit?: IJodit,
	recurse: boolean = false
): IBound {
	let xPos = 0,
		yPos = 0,
		el: HTMLElement | null = elm;

	const doc: Document = elm.ownerDocument || jodit?.ownerDocument || document;

	while (el) {
		if (el.tagName == 'BODY') {
			// deal with browser quirks with body/window/document and page scroll
			const xScroll = el.scrollLeft || doc.documentElement.scrollLeft,
				yScroll = el.scrollTop || doc.documentElement.scrollTop;

			xPos += el.offsetLeft - xScroll + el.clientLeft;
			yPos += el.offsetTop - yScroll + el.clientTop;
		} else {
			// for all other non-BODY elements
			xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
			yPos += el.offsetTop - el.scrollTop + el.clientTop;
		}

		el = el.offsetParent as HTMLElement;
	}

	if (jodit && jodit.iframe && !recurse) {
		const { left, top } = position(jodit.iframe, jodit, true);

		xPos += left;
		yPos += top;
	}

	return {
		left: xPos,
		top: yPos,
		width: elm.offsetWidth,
		height: elm.offsetHeight
	};
}
