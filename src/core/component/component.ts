/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/component/README.md]]
 * @packageDocumentation
 * @module component
 */

import type {
	ComponentStatus,
	IAsync,
	IComponent,
	IDictionary,
	Nullable
} from 'jodit/types';

import {
	kebabCase,
	get,
	getClassName,
	isFunction,
	isVoid
} from 'jodit/core/helpers';
import { uniqueUid } from 'jodit/core/global';
import { STATUSES } from 'jodit/core/component/statuses';
import { Async } from 'jodit/core/async';

const StatusListHandlers: Map<
	Component,
	IDictionary<CallableFunction[]>
> = new Map();

/**
 * The base class of all Jodit UI components. Provides work with a life cycle.
 */
export abstract class Component implements IComponent {
	static STATUSES = STATUSES;

	private __componentName!: string;

	readonly async: IAsync = new Async();

	get componentName(): string {
		if (!this.__componentName) {
			this.__componentName =
				'jodit-' +
				kebabCase(
					(isFunction(this.className) ? this.className() : '') ||
						getClassName(this)
				);
		}

		return this.__componentName;
	}

	readonly uid: string;

	/**
	 * Calc BEM element class name
	 * @param elementName - element name in the bem classification
	 */
	getFullElName(elementName: string): string;
	getFullElName(elementName: string, mod: string): string;
	getFullElName(
		elementName: string,
		mod: string,
		modValue: boolean | string
	): string;
	getFullElName(
		elementName: string,
		mod?: string,
		modValue?: boolean | string
	): string {
		const result = [this.componentName];

		if (elementName) {
			elementName = elementName.replace(/[^a-z0-9-]/gi, '-');
			result.push(`__${elementName}`);
		}

		if (mod) {
			result.push('_', mod);
			result.push('_', isVoid(modValue) ? 'true' : modValue.toString());
		}

		return result.join('');
	}

	/**
	 * The document in which jodit was created
	 */
	get ownerDocument(): Document {
		return this.ow.document;
	}

	/**
	 * Shortcut for `this.ownerDocument`
	 */
	get od(): Document {
		return this.ownerDocument;
	}

	/**
	 * The window in which jodit was created
	 */
	ownerWindow: Window = window;
	get ow(): Window {
		return this.ownerWindow;
	}

	/**
	 * Safe get any field
	 * @example
	 * ```js
	 * private a = {
	 * 	b: {
	 * 		c: {
	 * 			e: {
	 * 				g: {
	 * 					color: 'red'
	 * 				}
	 * 			}
	 * 		}
	 * 	}
	 * }
	 *
	 * this.get('a.b.c.e.g.color'); // Safe access to color
	 * // instead using optionsl chaining
	 * this?.a?.b?.c?.e?.g?.color
	 * ```
	 *
	 * @param chain - the path to be traversed in the obj object
	 * @param obj - the object in which the value is searched
	 */
	get<T>(chain: string, obj?: IDictionary): Nullable<T> {
		return get<T>(chain, obj || this);
	}

	/**
	 * Component is ready for work
	 */
	get isReady(): boolean {
		return this.componentStatus === STATUSES.ready;
	}

	/**
	 * Component was destructed
	 */
	get isDestructed(): boolean {
		return this.componentStatus === STATUSES.destructed;
	}

	/**
	 * The component is currently undergoing destructuring or has already been destroyed.
	 * Those. you should not hang new events on him now or do anything else with him.
	 */
	get isInDestruct(): boolean {
		return (
			STATUSES.beforeDestruct === this.componentStatus ||
			STATUSES.destructed === this.componentStatus
		);
	}

	/**
	 * Bind destructor to some View
	 */
	bindDestruct(component: IComponent): this {
		component.hookStatus(
			STATUSES.beforeDestruct,
			() => !this.isInDestruct && this.destruct()
		);

		return this;
	}

	abstract className(): string;

	protected constructor() {
		this.uid = 'jodit-uid-' + uniqueUid();
	}

	/**
	 * Destruct component method
	 */
	destruct(): void {
		this.setStatus(STATUSES.destructed);
		this.async.destruct();

		if (StatusListHandlers.get(this)) {
			StatusListHandlers.delete(this);
		}
	}

	private __componentStatus: ComponentStatus = STATUSES.beforeInit;

	/**
	 * Current component status
	 */
	get componentStatus(): ComponentStatus {
		return this.__componentStatus;
	}

	/**
	 * Setter for current component status
	 */
	set componentStatus(componentStatus: ComponentStatus) {
		this.setStatus(componentStatus);
	}

	/**
	 * Set component status
	 * @param componentStatus - component status
	 * @see ComponentStatus
	 */
	setStatus(componentStatus: ComponentStatus): void {
		return this.setStatusComponent(componentStatus, this);
	}

	/**
	 * Set status recursively on all parents
	 */
	private setStatusComponent(
		componentStatus: ComponentStatus,
		component: this
	): void {
		if (componentStatus === this.__componentStatus) {
			return;
		}

		if (component === this) {
			this.__componentStatus = componentStatus;
		}

		const proto = Object.getPrototypeOf(this);

		if (proto && isFunction(proto.setStatusComponent)) {
			proto.setStatusComponent(componentStatus, component);
		}

		const statuses = StatusListHandlers.get(this),
			list = statuses?.[componentStatus];

		if (list && list.length) {
			list.forEach(cb => cb(component));
		}
	}

	/**
	 * Adds a handler for changing the component's status
	 *
	 * @param status - the status at which the callback is triggered
	 * @param callback - a function that will be called when the status is `status`
	 */
	hookStatus(
		status: ComponentStatus,
		callback: (component: this) => void
	): void {
		let list = StatusListHandlers.get(this);

		if (!list) {
			list = {};
			StatusListHandlers.set(this, list);
		}

		if (!list[status]) {
			list[status] = [];
		}

		list[status].push(callback);
	}

	static isInstanceOf<T extends IComponent>(
		c: unknown | IComponent,
		constructorFunc: Function
	): c is T {
		return c instanceof constructorFunc;
	}
}
