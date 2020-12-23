/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { EnterValidator, IKeyValidator, IUIInput } from '../../../../types';
import {
	KEY_BACKSPACE,
	KEY_DELETE,
	KEY_LEFT,
	KEY_RIGHT,
	KEY_UP,
	KEY_DOWN
} from '../../../constants';

export class KeyValidator implements IKeyValidator {
	private enterValidators: EnterValidator[] = [];

	addInputValidator(fn: EnterValidator): this {
		this.enterValidators.push(fn);
		return this;
	}

	validateInput(e: KeyboardEvent, input: IUIInput['nativeInput']): boolean {
		if (
			!this.enterValidators.length ||
			[KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT].includes(e.key)
		) {
			return true;
		}

		const { value } = input;

		const { key } = e,
			start = input.selectionStart ?? 0,
			end = input.selectionEnd ?? 0,
			validate = (v: string) =>
				this.enterValidators.every(fn => fn(v, start, end));

		if (validate(this.calculateValue(key, value, start, end))) {
			return true;
		}

		if (
			start === end &&
			validate(this.calculateValue(key, value, start, end + 1))
		) {
			input.selectionEnd = end + 1;
			return true;
		}

		return false;
	}

	private calculateValue(
		key: string,
		value: string,
		start: number,
		end: number
	): string {
		const diff = start === end ? 1 : 0;

		if (key.length === 1) {
			return value.substr(0, start) + key + value.substr(end);
		}

		switch (key) {
			case KEY_BACKSPACE:
				return value.substr(0, start - diff) + value.substr(end);

			case KEY_DELETE:
				return value.substr(0, start) + value.substr(end + diff);
		}

		return value;
	}
}
