/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary } from 'jodit/types';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { assert } from 'jodit/src/core/helpers/utils/assert';

/**
 * A state machine implementation for applying styles.
 */
export class FiniteStateMachine<
	K extends string,
	V extends object & { next: K },
	T extends IDictionary<IDictionary<(value: V) => V>, K> = IDictionary<
		IDictionary<(...attrs: any[]) => any>,
		K
	>,
	A extends keyof T[K] = keyof T[K]
> {
	private __state!: K;
	private __setState(state: K): void {
		assert(!this.__previewsStates.has(state), 'Circled states');

		this.__previewsStates.add(state);
		this.__state = state;
	}

	getState(): K {
		return this.__state;
	}

	private __silent: boolean = true;
	disableSilent(): void {
		this.__silent = false;
	}

	private __previewsStates: Set<K> = new Set();
	constructor(state: K, private readonly __transitions: T) {
		this.__setState(state);
	}

	dispatch(actionName: A, value: V): V {
		const action = this.__transitions[this.getState()][actionName];

		if (action) {
			const res = action.call(this, value);

			assert(res && res !== value, 'Action should return new value');
			assert(isString(res.next), 'Value should contains next state');
			assert(
				res.next !== this.getState(),
				'The new state should not be equal to the old one.'
			);

			this.__setState(res.next);

			if (!isProd && !this.__silent) {
				console.log(`State: ${this.getState()}`);
			}

			return res;
		}

		throw new Error(
			`invalid action: ${this.getState()}.${actionName.toString()}`
		);
	}
}
