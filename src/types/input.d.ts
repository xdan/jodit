/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IUIInput } from './ui';

export interface EnterValidator {
	(value: string, start: number, end: number): boolean;
}

export interface IKeyValidator {
	addInputValidator(fn: EnterValidator): this;
	validateInput(e: KeyboardEvent, input: IUIInput['nativeInput']): boolean;
}
