/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import type { CanUndef } from 'jodit/types';

export class LimitedStack<T> {
	private __stack: T[] = [];

	constructor(readonly limit: number) {}

	push(item: T): this {
		this.__stack.push(item);

		if (this.__stack.length > this.limit) {
			this.__stack.shift();
		}

		return this;
	}

	pop(): CanUndef<T> {
		return this.__stack.pop();
	}

	find(clb: (item: T) => boolean): CanUndef<T> {
		return this.__stack.find(clb);
	}
}
