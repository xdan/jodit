/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CanUndef, IDictionary } from 'jodit/types';

/**
 * A state machine implementation for applying styles.
 */
export class FiniteStateMachine {
	setState(state: string, subState?: string): void {
		this.state = state;

		if (subState != null) {
			this.subState = subState;
		}
	}

	private subState: string = '';

	getState(): string {
		return this.state;
	}

	getSubState(): string {
		return this.subState;
	}

	private silent: boolean = true;
	disableSilent(): void {
		this.silent = false;
	}

	constructor(
		private state: string,
		private readonly transitions: IDictionary<
			IDictionary<(this: FiniteStateMachine, ...attrs: any[]) => any>
		>
	) {}

	dispatch<T>(actionName: string, ...attrs: any[]): CanUndef<T> {
		const action = this.transitions[this.state][actionName];

		if (action) {
			if (!this.silent) {
				console.log('State: ' + this.state, 'Action: ' + actionName);
			}

			const res = action.call(this, ...attrs);

			if (!this.silent) {
				console.log('State: ' + this.state);
			}

			return <T>res;
		}

		if (!this.silent) {
			throw new Error('invalid action: ' + this.state + '.' + actionName);
		}

		return;
	}
}
