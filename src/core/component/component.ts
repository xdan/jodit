/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	ComponentStatus,
	IComponent,
	IDictionary,
	IViewBased,
	Nullable
} from '../../types';

import { kebabCase, get, getClassName, isFunction, isVoid } from '../helpers';
import { uniqueUid } from '../global';
import { STATUSES } from './statuses';

const StatusListHandlers: Map<Component, IDictionary<CallableFunction[]>> =
	new Map();

export abstract class Component implements IComponent {
	static STATUSES = STATUSES;

	readonly componentName: string;
	readonly uid: string;

	/**
	 * Calc BEM element class name
	 * @param elementName
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
	 * @param chain
	 * @param obj
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
	 * Component is destructing
	 */
	get isInDestruct(): boolean {
		return (
			STATUSES.beforeDestruct === this.componentStatus ||
			STATUSES.destructed === this.componentStatus
		);
	}

	/**
	 * Bind destructor to come View
	 * @param jodit
	 */
	bindDestruct(jodit: IViewBased): this {
		const destructMe = () => {
			!this.isInDestruct && this.destruct();
		};

		jodit.e && jodit.e.on(STATUSES.beforeDestruct, destructMe);

		this.hookStatus(STATUSES.beforeDestruct, () => {
			jodit.e && jodit.e.off(STATUSES.beforeDestruct, destructMe);
		});

		return this;
	}

	abstract className(): string;

	protected constructor() {
		this.componentName =
			'jodit-' + kebabCase(this.className() || getClassName(this));

		this.uid = 'jodit-uid-' + uniqueUid();
	}

	/**
	 * Destruct component method
	 */
	destruct(): void {
		this.setStatus(STATUSES.destructed);

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
	 * @param componentStatus
	 */
	setStatus(componentStatus: ComponentStatus): void {
		return this.setStatusComponent(componentStatus, this);
	}

	/**
	 * Set status recursively on all parents
	 *
	 * @param componentStatus
	 * @param component
	 * @private
	 */
	private setStatusComponent(
		componentStatus: ComponentStatus,
		component: this
	): void {
		if (componentStatus === this.__componentStatus) {
			return;
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

		if (component === this) {
			this.__componentStatus = componentStatus;
		}
	}

	/**
	 * Add hook on status
	 *
	 * @param status
	 * @param callback
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
}
