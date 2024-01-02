/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { IDestructible } from './types';

export type MessageVariant = 'info' | 'error' | 'success';

export interface IMessages extends IDestructible {
	info(text: string, timeout?: number): void;
	success(text: string, timeout?: number): void;
	error(text: string, timeout?: number): void;
	message(text: string, variant?: MessageVariant, timeout?: number): void;
}
