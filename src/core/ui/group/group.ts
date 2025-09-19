/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/ui/group/README.md]]
 * @packageDocumentation
 * @module ui/group
 */

import type {
	IDictionary,
	IUIButtonState,
	IUIElement,
	IUIGroup,
	IViewBased,
	ModType
} from 'jodit/types';
import { Component } from 'jodit/core/component/component';
import { component, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { isArray } from 'jodit/core/helpers';
import { UIElement } from 'jodit/core/ui/element';

import './group.less';

@component
export class UIGroup<T extends IViewBased = IViewBased>
	extends UIElement<T>
	implements IUIGroup
{
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
			} else if (Component.isInstanceOf<UIGroup>(elm, UIGroup)) {
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
	append(elm: IUIElement, index?: number): this;
	append(elm: IUIElement, distElement?: string): this;
	append(elm: IUIElement[], distElement?: string): this;
	append(
		elms: IUIElement | IUIElement[],
		distElementOrIndex?: string | number
	): this {
		if (isArray(elms)) {
			if (typeof distElementOrIndex === 'number') {
				throw new Error(
					'You can not use index when append array of elements'
				);
			}
			elms.forEach(item => this.append(item, distElementOrIndex));
			return this;
		}

		const elm = elms;
		let index = undefined;

		if (typeof distElementOrIndex === 'number') {
			index = Math.min(
				Math.max(0, distElementOrIndex),
				this.elements.length
			);
			this.elements.splice(index, 0, elm);
		} else {
			this.elements.push(elm);
		}

		if (elm.name) {
			elm.container.classList.add(this.getFullElName(elm.name));
		}

		if (distElementOrIndex && typeof distElementOrIndex === 'string') {
			const distElm = this.getElm(distElementOrIndex);
			if (distElm == null) {
				throw new Error('Element does not exist');
			}
			distElm.appendChild(elm.container);
		} else {
			this.appendChildToContainer(elm.container, index);
		}

		elm.parentElement = this;

		return this;
	}

	/** @override */
	override afterSetMod(name: string, value: ModType): void {
		if (this.syncMod) {
			this.elements.forEach(elm => elm.setMod(name, value));
		}
	}

	/**
	 * Allow set another container for the box of all children
	 */
	protected appendChildToContainer(
		childContainer: HTMLElement,
		index?: number
	): void {
		if (
			index === undefined ||
			index < 0 ||
			index > this.elements.length - 1 ||
			this.container.children[index] == null
		) {
			this.container.appendChild(childContainer);
		} else {
			this.container.insertBefore(
				childContainer,
				this.container.children[index]
			);
		}
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
