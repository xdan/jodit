/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

/**
 * `AbortError` is not a separate exception, but rather a {@link DOMException} with a special `name`.
 * https://webidl.spec.whatwg.org/#aborterror
 */
export type AbortError = DOMException & { name: 'AbortError' };

export function abort(message: string = 'Aborted'): Error {
	return new DOMException(message, 'AbortError') as AbortError;
}
