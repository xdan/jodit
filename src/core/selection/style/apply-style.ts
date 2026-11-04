/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module selection
 */

import type {
	CommitMode,
	HTMLTagNames,
	ICommitStyle,
	IJodit
} from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { $$ } from 'jodit/core/helpers/utils/selector';

import { extractSelectedPart, FiniteStateMachine } from './api';
import { INITIAL } from './constants';
import {
	type IStyleTransactionValue,
	states,
	transactions
} from './transactions';

/**
 * Take a selected fragment out of the elements its style takes the place
 * of: one around it is split, so the fragment leaves it, and one in it is
 * unwrapped
 */
function takeOutOf(
	jodit: IJodit,
	font: HTMLElement,
	tags: HTMLTagNames[]
): void {
	const range = jodit.s.createRange();
	let outer = Dom.closest(font.parentNode, tags, jodit.editor);

	while (outer) {
		range.selectNodeContents(outer);
		range.setEndBefore(font);
		const before = range.cloneContents();

		range.selectNodeContents(outer);
		range.setStartAfter(font);

		// Split only when there's more in it, as a split leaves empty copies
		// of the elements between
		if (!Dom.isEmpty(before) || !Dom.isEmpty(range.cloneContents())) {
			extractSelectedPart(outer, font, jodit);
		}

		Dom.unwrap(outer);
		outer = Dom.closest(font.parentNode, tags, jodit.editor);
	}

	$$(tags.join(','), font).forEach(inner => Dom.unwrap(inner));
}

/** @internal */
export function ApplyStyle(jodit: IJodit, cs: ICommitStyle): void {
	const { s: sel, editor } = jodit;

	editor.firstChild?.normalize(); // FF fix for test "commandsTest - Exec command "bold"
	const fakes = sel.fakes();

	const collapsed = sel.isCollapsed();
	let mode: CommitMode = INITIAL;

	try {
		// for...of closes the generator on an exception, releasing every
		// temporary wrapper before the selection is restored in finally.
		for (const font of sel.wrapInTagGen(fakes)) {
			if (cs.options.exclude?.length) {
				takeOutOf(jodit, font, cs.options.exclude);
			}

			let state: IStyleTransactionValue = {
				collapsed,
				mode,
				element: font,
				next: states.START,
				jodit,
				style: cs
			};
			const machine = new FiniteStateMachine<
				keyof typeof states,
				IStyleTransactionValue
			>(states.START, transactions);

			while (!jodit.isInDestruct && machine.getState() !== states.END) {
				state = machine.dispatch('exec', state);
			}

			// The first selected fragment determines how later fragments toggle.
			mode = state.mode;
		}
	} finally {
		sel.restoreFakes(fakes);
	}
}
