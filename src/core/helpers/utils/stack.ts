/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { CanUndef } from 'jodit/types';

export class LimitedStack<T> {
	private stack: T[] = [];

	constructor(readonly limit: number) {}

	push(item: T): this {
		this.stack.push(item);

		if (this.stack.length > this.limit) {
			this.stack.shift();
		}

		return this;
	}

	pop(): CanUndef<T> {
		return this.stack.pop();
	}

	find(clb: (item: T) => boolean): CanUndef<T> {
		return this.stack.find(clb);
	}
}
