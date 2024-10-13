/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/search
 */

import type {
	CanUndef,
	ICreate,
	IJodit,
	ISelectionRange,
	Nullable
} from 'jodit/types';
import { globalWindow } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
import { $$ } from 'jodit/core/helpers/utils/selector';

/**
 * @private
 */
const TMP_ATTR = 'jd-tmp-selection';

/**
 * @private
 */
export function highlightTextRanges(
	jodit: IJodit,
	rng: ISelectionRange,
	restRanges: ISelectionRange[],
	ci: ICreate,
	root: HTMLElement
): void {
	if (
		rng.startContainer.nodeValue == null ||
		rng.endContainer.nodeValue == null
	) {
		return;
	}

	if (checkNativeSelectionMethod(jodit, rng, restRanges)) {
		return;
	}

	const span = ci.element('span', {
		[TMP_ATTR]: true
	});

	Dom.markTemporary(span);

	normalizeRanges(rng, restRanges, ci);

	let next: CanUndef<Nullable<Node>> = rng.startContainer;

	do {
		if (!next) {
			break;
		}

		if (Dom.isText(next) && !isSelectionWrapper(next.parentNode)) {
			Dom.wrap(next, span.cloneNode() as HTMLElement, ci);
		}

		if (next === rng.endContainer) {
			break;
		}

		let step: Nullable<Node> = next.firstChild || next.nextSibling;

		if (!step) {
			while (next && !next.nextSibling && next !== root) {
				next = next.parentNode;
			}

			step = next?.nextSibling as Nullable<Node>;
		}

		next = step;
	} while (next && next !== root);
}

/**
 * @private
 */
export function getSelectionWrappers(root: HTMLElement): HTMLElement[] {
	return $$(`[${TMP_ATTR}]`, root);
}

/**
 * @private
 */
export function clearSelectionWrappers(root: HTMLElement): void {
	getSelectionWrappers(root).forEach(span => Dom.unwrap(span));
}

/**
 * @private
 */
export function clearSelectionWrappersFromHTML(root: string): string {
	return root.replace(
		RegExp(`<span[^>]+${TMP_ATTR}[^>]+>(.*?)</span>`, 'g'),
		'$1'
	);
}

/**
 * @private
 */
function isSelectionWrapper(node: unknown): boolean {
	return Dom.isElement(node) && node.hasAttribute(TMP_ATTR);
}

function checkNativeSelectionMethod(
	jodit: IJodit,
	rng: ISelectionRange,
	restRanges: ISelectionRange[]
): boolean {
	if (
		jodit.o.search.useCustomHighlightAPI &&
		// @ts-ignore Because Highlight is not defined in the types TS 5.3.3
		typeof globalWindow.Highlight !== 'undefined'
	) {
		const ranges = [rng, ...restRanges].map(rng => {
			const range = jodit.selection.createRange();
			range.setStart(rng.startContainer, rng.startOffset);
			range.setEnd(rng.endContainer, rng.endOffset);
			return range;
		});

		// @ts-ignore Because Highlight is not defined in the types TS 5.3.3
		const searchHighlight = new Highlight(...ranges);
		// @ts-ignore
		CSS.highlights.clear();
		// @ts-ignore
		CSS.highlights.set('jodit-search-result', searchHighlight);
		restRanges.length = 0;
		return true;
	}

	return false;
}

function normalizeRanges(
	rng: ISelectionRange,
	restRanges: ISelectionRange[],
	ci: ICreate
): void {
	const startText = rng.startContainer.nodeValue!;

	let diff = 0;
	if (rng.startOffset !== 0) {
		const text = ci.text(startText.substring(0, rng.startOffset));
		rng.startContainer.nodeValue = startText.substring(rng.startOffset);
		Dom.before(rng.startContainer, text);

		if (rng.startContainer === rng.endContainer) {
			diff = rng.startOffset;
			rng.endOffset -= diff;
		}

		rng.startOffset = 0;
	}

	const endText = rng.endContainer.nodeValue!;

	if (rng.endOffset !== endText.length) {
		const text = ci.text(endText.substring(rng.endOffset));
		rng.endContainer.nodeValue = endText.substring(0, rng.endOffset);
		Dom.after(rng.endContainer, text);

		for (const range of restRanges) {
			if (range.startContainer === rng.endContainer) {
				range.startContainer = text;
				range.startOffset = range.startOffset - rng.endOffset - diff;

				if (range.endContainer === rng.endContainer) {
					range.endContainer = text;
					range.endOffset = range.endOffset - rng.endOffset - diff;
				}
			} else {
				break;
			}
		}

		rng.endOffset = rng.endContainer.nodeValue.length;
	}
}
