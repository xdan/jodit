/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module selection
 */

import type { IJodit } from 'jodit/types';
import type { CommitStyle } from './commit-style';
import { normalizeNode } from 'jodit/core/helpers/normalize/normalize-node';
import { FiniteStateMachine } from './api';
import { IStyleTransactionValue, states, transactions } from './transactions';
import { INITIAL } from './commit-style';

/** @internal */
export function ApplyStyle(jodit: IJodit, cs: CommitStyle): void {
	const { s: sel, editor } = jodit;

	sel.save();

	normalizeNode(editor.firstChild); // FF fix for test "commandsTest - Exec command "bold"
	const gen = jodit.s.wrapInTagGen();

	let font = gen.next();

	let state: IStyleTransactionValue = {
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

		while (machine.getState() !== states.END) {
			state = machine.dispatch('exec', state);
		}

		font = gen.next();
	}

	sel.restore();
}
