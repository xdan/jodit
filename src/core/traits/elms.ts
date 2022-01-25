/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module traits
 */

import type { IComponent, IContainer, IElms, Nullable } from 'jodit/types';
import { toArray } from 'jodit/core/helpers/array/to-array';

export abstract class Elms implements IElms {
	abstract getElm(elementName: string): Nullable<HTMLElement>;

	abstract getElms(elementName: string): HTMLElement[];

	/**
	 * Return element with BEM class name
	 */
	static getElm(
		this: IComponent & IContainer,
		elementName: string
	): Nullable<HTMLElement> {
		return this.container.querySelector(
			`.${this.getFullElName(elementName)}`
		) as Nullable<HTMLElement>;
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
