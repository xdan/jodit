/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { stringify } from './string/stringify';

export function isAtom(obj: unknown): boolean {
	return obj && (obj as any).isAtom;
}

export function markAsAtomic<T>(obj: T): T {
	Object.defineProperty(obj, 'isAtom', {
		enumerable: false,
		value: true,
		configurable: false
	});

	return obj;
}

export function fastClone<T>(object: T): T {
	return JSON.parse(stringify(object));
}
