/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IComponent, IContainer, IElms } from '../../types';
import { toArray } from '../helpers/array/to-array';

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
		return this.container.querySelector<HTMLElement>(
			`.${this.getFullElName(elementName)}`
		)!;
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
