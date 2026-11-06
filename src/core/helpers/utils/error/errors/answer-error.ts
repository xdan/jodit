/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

// A connector refused the request: the answer and its `data.code` stay reachable for the handler
export class AnswerError<T = unknown> extends Error {
	constructor(
		message: string,
		readonly answer: T,
		readonly code?: number
	) {
		super(message);
		Object.setPrototypeOf(this, AnswerError.prototype);
	}
}
