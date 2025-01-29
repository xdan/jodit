/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IS_PROD } from 'jodit/core/constants';

/**
 * @module helpers/utils
 */

class AssertionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AssertionError';
	}
}

/** Asserts that condition is truthy (or evaluates to true). */
function assert<T>(
	condition: T | false | 0 | '' | null | undefined,
	message: string
): asserts condition {
	if (IS_PROD) {
		return;
	}

	if (!condition) {
		throw new AssertionError(`Assertion failed: ${message}`);
	}
}

export { assert };
