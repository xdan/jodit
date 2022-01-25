/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/ui/group/README.md]]
 * @packageDocumentation
 * @module ui/group
 */

import './group.less';

import type {
	IUIButtonState,
	IUIElement,
	IUIGroup,
	IViewBased
} from 'jodit/types';
import type { IDictionary } from 'jodit/types';
import { UIElement } from '../element';
import { component, watch } from 'jodit/core/decorators';
import { assert, isArray } from 'jodit/core/helpers';
import { Dom } from 'jodit/core/dom';

@component
export class UIGroup<T extends IViewBased = IViewBased>
	extends UIElement<T>
	implements IUIGroup
{
	/** @override */
	override className(): string {
		return 'UIGroup';
	}

	/**
	 * Synchronize mods to all children
	 */
	syncMod: boolean = false;

	elements: IUIElement[] = [];

	/**
	 * All group children
	 */
	get allChildren(): IUIElement[] {
		const result: IUIElement[] = [];

		const stack: Array<IUIElement | IUIElement[] | IUIGroup> = [
			...this.elements
		];

		while (stack.length) {
			const elm = stack.shift();

			if (isArray(elm)) {
				stack.push(...elm);
			} else if (elm instanceof UIGroup) {
				stack.push(...elm.elements);
			} else {
				elm && result.push(elm);
			}
		}

		return result;
	}

	buttonSize: IUIButtonState['size'] = 'middle';

	/**
	 * Update all children
	 */
	@watch('buttonSize')
	override update(): void {
		this.elements.forEach(elm => elm.update());
		this.setMod('size', this.buttonSize);
	}

	/**
	 * Append new element into group
	 */
	append(elm: IUIElement | IUIElement[], distElement?: string): this {
		if (isArray(elm)) {
			elm.forEach(item => this.append(item, distElement));
			return this;
		}

		this.elements.push(elm);

		if (elm.name) {
			elm.container.classList.add(this.getFullElName(elm.name));
		}

		if (distElement) {
			const distElm = this.getElm(distElement);
			assert(distElm != null, 'Element does not exist');
			distElm.appendChild(elm.container);
		} else {
			this.appendChildToContainer(elm.container);
		}

		elm.parentElement = this;
		elm.update();

		return this;
	}

	/** @override */
	override setMod(name: string, value: string | boolean | null): this {
		if (this.syncMod) {
			this.elements.forEach(elm => elm.setMod(name, value));
		}

		return super.setMod(name, value);
	}

	/**
	 * Allow set another container for the box of all children
	 */
	protected appendChildToContainer(childContainer: HTMLElement): void {
		this.container.appendChild(childContainer);
	}

	/**
	 * Remove element from group
	 */
	remove(elm: IUIElement): this {
		const index = this.elements.indexOf(elm);

		if (index !== -1) {
			this.elements.splice(index, 1);
			Dom.safeRemove(elm.container);
			elm.parentElement = null;
		}

		return this;
	}

	/**
	 * Clear group
	 */
	clear(): this {
		this.elements.forEach(elm => elm.destruct());
		this.elements.length = 0;

		return this;
	}

	/**
	 * @param elements - Items of group
	 */
	constructor(
		jodit: T,
		elements?: Array<IUIElement | void | null | false>,
		readonly options?: IDictionary
	) {
		super(jodit, options);
		elements?.forEach(elm => elm && this.append(elm));

		if (options?.name) {
			this.name = options.name;
		}
	}

	/** @override */
	override destruct(): any {
		this.clear();
		return super.destruct();
	}
}
