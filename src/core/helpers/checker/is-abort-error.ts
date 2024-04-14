/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

import type { AbortError } from '../utils/error/errors/abort-error';

export function isAbortError(error: unknown): error is AbortError {
	return (
		Boolean(error) &&
		error instanceof DOMException &&
		error.name === 'AbortError'
	);
}
