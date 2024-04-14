/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import { isAbortError } from 'jodit/core/helpers/checker/is-abort-error';

/**
 * `AbortError` is not a separate exception, but rather a {@link DOMException} with a special `name`.
 * https://webidl.spec.whatwg.org/#aborterror
 */
export type AbortError = DOMException & { name: 'AbortError' };

export function abort(message: string = 'Aborted'): Error {
	return new DOMException(message, 'AbortError') as AbortError;
}

/**
 * @deprecated use `isAbortError` instead
 */
export const isAbort = isAbortError;
