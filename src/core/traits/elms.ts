/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module traits
 */

import type { IComponent, IContainer, IElms } from 'jodit/types';
import { toArray } from '../helpers/array/to-array';
import { assert } from 'jodit/core/helpers';

export abstract class Elms implements IElms {
	abstract getElm(elementName: string): HTMLElement;

	abstract getElms(elementName: string): HTMLElement[];

	/**
	 * Return element with BEM class name
	 */
	static getElm(
		this: IComponent & IContainer,
		elementName: string
	): HTMLElement {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const elm = this.container.querySelector<HTMLElement>(
			`.${this.getFullElName(elementName)}`
		)!;

		assert(elm != null, 'Element does not exist');

		return elm;
	}

	/**
	 * Return elements with BEM class name
	 */
	static getElms(
		this: IComponent & IContainer,
		elementName: string
	): HTMLElement[] {
		return toArray(
			this.container.querySelectorAll(
				`.${this.getFullElName(elementName)}`
			)
		);
	}
}
