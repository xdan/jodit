/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module traits
 */

import type { IComponent, IContainer, IElms, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

export abstract class Elms implements IElms {
	/**
	 * Return element with BEM class name
	 */
	getElm<T extends IComponent & IContainer & IElms>(
		this: T,
		elementName: string
	): Nullable<HTMLElement> {
		const className = this.getFullElName(elementName);

		return Dom.first(
			this.container,
			node =>
				Dom.isHTMLElement(node) && node.classList.contains(className)
		) as Nullable<HTMLElement>;
	}

	/**
	 * Return elements with BEM class name
	 */
	getElms<T extends IComponent & IContainer & IElms>(
		this: T,
		elementName: string
	): HTMLElement[] {
		const className = this.getFullElName(elementName);
		const result: HTMLElement[] = [];

		Dom.each(this.container, node => {
			if (Dom.isHTMLElement(node) && node.classList.contains(className)) {
				result.push(node);
			}
		});

		return result;
	}
}
