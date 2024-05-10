/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module selection
 */

import type { ICommitStyle, IJodit } from 'jodit/types';

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

	// sel.save();
	editor.firstChild?.normalize(); // FF fix for test "commandsTest - Exec command "bold"
	const fakes = sel.fakes();

	const gen = jodit.s.wrapInTagGen(fakes);

	let font = gen.next();

	if (font.done) {
		return;
	}

	let state: IStyleTransactionValue = {
		collapsed: sel.isCollapsed(),
		mode: INITIAL,
		element: font.value,
		next: states.START,
		jodit,
		style: cs
	};

	while (font && !font.done) {
		const machine = new FiniteStateMachine<
			keyof typeof states,
			IStyleTransactionValue
		>(states.START, transactions);
		state.element = font.value;
		// machine.disableSilent();

		while (machine.getState() !== states.END) {
			// console.log(machine.getState(), state);
			state = machine.dispatch('exec', state);
		}
		// console.log('-------------------');

		font = gen.next();
	}

	// sel.restore();
	sel.restoreFakes(fakes);
}
