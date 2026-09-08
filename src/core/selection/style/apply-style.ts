/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module selection
 */

import type { CommitMode, ICommitStyle, IJodit } from 'jodit/types';

import { FiniteStateMachine } from './api';
import { INITIAL } from './constants';
import {
	type IStyleTransactionValue,
	states,
	transactions
} from './transactions';

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
