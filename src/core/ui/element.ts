/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui
 */

import type {
	IDictionary,
	IUIElement,
	IViewBased,
	Nullable
} from 'jodit/types';
import { Component, ViewComponent } from 'jodit/core/component';
import { Dom } from 'jodit/core/dom/dom';
import { Elms, Mods } from 'jodit/core/traits';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { Icon } from 'jodit/core/ui/icon';
import { derive } from 'jodit/core/decorators';

export interface UIElement extends Mods, Elms {}

@derive(Mods, Elms)
export abstract class UIElement<T extends IViewBased = IViewBased>
	extends ViewComponent<T>
	implements IUIElement, Mods, Elms
{
	container!: HTMLElement;
	name: string = '';

	private __parentElement: Nullable<IUIElement> = null;

	get parentElement(): Nullable<IUIElement> {
		return this.__parentElement;
	}

	set parentElement(parentElement: Nullable<IUIElement>) {
		this.__parentElement = parentElement;

		if (parentElement) {
			parentElement.hookStatus('beforeDestruct', () => this.destruct());
		}

		this.updateParentElement(this);
	}

	bubble(callback: (parent: IUIElement) => void): this {
		let parent = this.parentElement;

		while (parent) {
			callback(parent);
			parent = parent.parentElement;
		}

		return this;
	}

	updateParentElement(target: IUIElement): this {
		this.__parentElement?.updateParentElement(target);
		return this;
	}

	/** @override */
	override get<T>(chain: string, obj?: IDictionary): Nullable<T> {
		return super.get(chain, obj) || (this.getElm(chain) as unknown as T);
	}

	/**
	 * Find match parent
	 */
	closest<T extends IUIElement>(type: Function | T): Nullable<T> {
		const c =
			typeof type === 'object'
				? (pe: IUIElement): boolean => pe === type
				: (pe: IUIElement): boolean => Component.isInstanceOf(pe, type);

		let pe = this.__parentElement;

		while (pe) {
			if (c(pe)) {
				return pe as T;
			}

			if (!pe.parentElement && pe.container.parentElement) {
				pe = UIElement.closestElement(
					pe.container.parentElement,
					UIElement
				);
			} else {
				pe = pe.parentElement;
			}
		}

		return null;
	}

	/**
	 * Find closest UIElement in DOM
	 */
	static closestElement(node: Node, type: Function): Nullable<IUIElement> {
		const elm = Dom.up(node, elm => {
			if (elm) {
				const { component } = elm as HTMLElement;
				return component && Component.isInstanceOf(component, type);
			}

			return false;
		});

		return elm ? (elm?.component as IUIElement) : null;
	}

	readonly mods: IDictionary<string | boolean | null> = {};

	/**
	 * Update UI from state
	 */
	update(): void {
		// empty
	}

	/**
	 * Append container to element
	 */
	appendTo(element: HTMLElement): this {
		element.appendChild(this.container);
		return this;
	}

	/**
	 * Valid name only with valid chars
	 */
	protected clearName(name: string): string {
		return name.replace(/[^a-zA-Z0-9]/g, '_');
	}

	/**
	 * Method create only box
	 */
	protected render(options?: IDictionary): HTMLElement | string {
		return this.j.c.div(this.componentName);
	}

	/**
	 * Create main HTML container
	 */
	protected createContainer(options?: IDictionary): HTMLElement {
		const result = this.render(options);

		if (isString(result)) {
			const elm = this.parseTemplate(result);
			elm.classList.add(this.componentName);
			return elm;
		}

		return result;
	}

	protected parseTemplate(result: string): HTMLElement {
		return this.j.c.fromHTML(
			result
				.replace(/\*([^*]+?)\*/g, (_, name) => Icon.get(name) || '')
				.replace(/&__/g, this.componentName + '__')
				.replace(/~([^~]+?)~/g, (_, s) => this.i18n(s))
		);
	}

	/** @override */
	constructor(jodit: T, options?: IDictionary) {
		super(jodit);

		this.container = this.createContainer(options);

		Object.defineProperty(this.container, 'component', {
			value: this,
			configurable: true
		});
	}

	/** @override */
	override destruct(): any {
		Dom.safeRemove(this.container);
		this.parentElement = null;
		return super.destruct();
	}
}
