/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/enter
 */

import type { IJodit, Nullable } from 'jodit/types';
import { BR } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
import { scrollIntoViewIfNeeded } from 'jodit/core/helpers/utils/scroll-into-view';

/**
 * Checks the possibility and necessity of inserting a BR instead of a block
 * @private
 */
export function checkBR(
	fake: Text,
	jodit: IJodit,
	shiftKeyPressed?: boolean,
	block?: Nullable<HTMLElement>
): boolean {
	const isMultiLineBlock = Boolean(
		Dom.closest(fake, ['pre', 'blockquote'], jodit.editor)
	);

	// A cell itself can't be split into two cells, so bare cell content gets
	// a BR. But when the cell already holds a real block (<p>, <h3>, ...) that
	// block is split like anywhere else, otherwise every line of the cell
	// stays inside one block and block styles apply to all of them at once.
	const isCell =
		!isMultiLineBlock &&
		(block
			? Dom.isCell(block)
			: Boolean(Dom.closest(fake, ['td', 'th'], jodit.editor)));

	const isBRMode = jodit.o.enter.toLowerCase() === BR.toLowerCase();

	// if you use <br> defaultTag for break line or when was entered SHIFt key or in <td> or <th> or <blockquote>
	if (
		isBRMode ||
		isCell ||
		(shiftKeyPressed && !isMultiLineBlock) ||
		(!shiftKeyPressed && isMultiLineBlock)
	) {
		// 2 BR before
		if (isMultiLineBlock && checkSeveralBR(fake)) {
			return false;
		}

		const br = jodit.createInside.element('br');
		Dom.before(fake, br);

		if (!Dom.findNotEmptySibling(br, false)) {
			const clone = br.cloneNode();
			Dom.after(br, clone);
			Dom.before(clone, fake);
		}

		scrollIntoViewIfNeeded(br, jodit.editor, jodit.ed);

		return true;
	}

	return false;
}

function checkSeveralBR(fake: Text): boolean {
	// 2 BR before
	const preBr = brBefore(brBefore(fake));
	if (preBr) {
		Dom.safeRemove(brBefore(fake));
		Dom.safeRemove(preBr);
		return true;
	}

	return false;
}

function brBefore(start: Node | false): Node | false {
	if (!start) {
		return false;
	}

	const prev = Dom.findSibling(start, true);
	if (!prev || !Dom.isTag(prev, 'br')) {
		return false;
	}

	return prev;
}
