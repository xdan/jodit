/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

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
function assert(condition: boolean, message: string): asserts condition {
	if (!condition) {
		throw new AssertionError(`Assertion failed: ${message}`);
	}
}

export { assert };
