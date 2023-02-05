/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

/**
 * Check if function or method was not replaced on some custom implementation
 */
export function isNativeFunction(f: Function): boolean {
	return (
		Boolean(f) &&
		(typeof f).toLowerCase() === 'function' &&
		(f === Function.prototype ||
			/^\s*function\s*(\b[a-z$_][a-z0-9$_]*\b)*\s*\((|([a-z$_][a-z0-9$_]*)(\s*,[a-z$_][a-z0-9$_]*)*)\)\s*{\s*\[native code]\s*}\s*$/i.test(
				String(f)
			))
	);
}
