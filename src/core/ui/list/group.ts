/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './group.less';

import type {
	IUIButtonState,
	IUIElement,
	IUIGroup,
	IViewBased
} from '../../../types';
import type { IDictionary } from '../../../types';
import { UIElement } from '../element';
import { component, watch } from '../../decorators';
import { isArray } from '../../helpers';
import { Dom } from '../../dom';

@component
export class UIGroup<T extends IViewBased = IViewBased>
	extends UIElement<T>
	implements IUIGroup
{
	/** @override */
	className(): string {
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
	update(): void {
		this.elements.forEach(elm => elm.update());
		this.setMod('size', this.buttonSize);
	}

	/**
	 * Append new element into group
	 * @param elm
	 */
	append(elm: IUIElement | IUIElement[], distElement?: string): this {
		if (isArray(elm)) {
			elm.forEach(item => this.append(item));
			return this;
		}

		this.elements.push(elm);

		if (elm.name) {
			elm.container.classList.add(this.getFullElName(elm.name));
		}

		if (distElement) {
			this.getElm(distElement).appendChild(elm.container);
		} else {
			this.appendChildToContainer(elm.container);
		}

		elm.parentElement = this;
		elm.update();

		return this;
	}

	/** @override */
	setMod(name: string, value: string | boolean | null): this {
		if (this.syncMod) {
			this.elements.forEach(elm => elm.setMod(name, value));
		}

		return super.setMod(name, value);
	}

	/**
	 * Allow set another container for the box of all children
	 * @param childContainer
	 */
	protected appendChildToContainer(childContainer: HTMLElement): void {
		this.container.appendChild(childContainer);
	}

	/**
	 * Remove element from group
	 * @param elm
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
	 * @override
	 * @param jodit
	 * @param elements Items of group
	 */
	constructor(
		jodit: T,
		elements?: Array<IUIElement | void | null | false>,
		options?: IDictionary
	) {
		super(jodit, options);
		elements?.forEach(elm => elm && this.append(elm));

		if (options?.name) {
			this.name = options.name;
		}
	}

	/** @override */
	destruct(): any {
		this.clear();
		return super.destruct();
	}
}
