/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, Nullable, CommitMode } from '../../../types';
import type { CommitStyle } from './commit-style';
import { normalizeNode } from '../../helpers';
import {
	getSuitParent,
	getSuitChild,
	getClosestWrapper,
	toggleCommitStyles,
	isInsideInvisibleElement,
	unwrapChildren
} from './api';
import { CHANGE, UNWRAP, WRAP } from './commit-style';
import { extractSelectedPart } from './api/extract';
import { wrapAndCommitStyle } from './api/wrap-and-commit-style';
import { Dom } from '../../dom';
import { checkAndToggleOrderedList } from './api/toggle/toggle-ordered-list';

/**
 * Apply options to selection
 */
export function ApplyStyle(jodit: IJodit, style: CommitStyle): void {
	const { s: sel, editor } = jodit;

	let wrap: Nullable<CommitMode> = null;

	sel.save();

	normalizeNode(sel.area.firstChild); // FF fix for test "commandsTest - Exec command "bold"

	const gen = jodit.s.wrapInTagGen();

	let font = gen.next();

	while (!font.done) {
		if (!isInsideInvisibleElement(font.value, editor)) {
			wrap = applyToElement(style, font.value, jodit, wrap);
		}

		font = gen.next();
	}

	sel.restore();
}

/**
 * Apply options to all selected fragment
 * @param font - a fake element that wraps all parts of the selection
 */
function applyToElement(
	cs: CommitStyle,
	font: HTMLElement,
	jodit: IJodit,
	mode: Nullable<CommitMode>
): Nullable<CommitMode> {
	const root = jodit.editor;

	const toggleElm = getSuitParent(cs, font, root) || getSuitChild(cs, font);

	if (toggleElm) {
		return toggleCommitStyles(cs, toggleElm, jodit, mode);
	}

	const wrapper = getClosestWrapper(cs, font, root);

	if (wrapper) {
		if (!cs.elementIsBlock) {
			extractSelectedPart(wrapper, font, jodit.s.createRange);
		} else {
			if (cs.elementIsList && Dom.isTag(wrapper, ['ul', 'ol'])) {
				return checkAndToggleOrderedList(cs, font, jodit, mode);
			}
		}

		return toggleCommitStyles(cs, wrapper, jodit, mode);
	}

	if (mode == null) {
		mode = WRAP;
	}

	if (mode === UNWRAP || mode === CHANGE) {
		return mode;
	}

	if (unwrapChildren(cs, font)) {
		return mode;
	}

	wrapAndCommitStyle(cs, font, jodit, mode);

	return WRAP;
}
