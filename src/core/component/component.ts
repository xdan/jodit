/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	ComponentStatus,
	IComponent,
	IDictionary,
	IViewBased,
	Nullable
} from '../../types';

import { kebabCase, get, getClassName } from '../helpers';
import { uniqueUid } from '../global';
import { STATUSES } from './statuses';

export abstract class Component implements IComponent {
	static STATUSES = STATUSES;

	componentName!: string;
	uid!: string;

	/**
	 * The document in which jodit was created
	 */
	get ownerDocument(): Document {
		return this.ow.document;
	}

	/**
	 * Shortcut for `this.ownerDocument`
	 */
	get od(): this['ownerDocument'] {
		return this.ownerDocument;
	}

	/**
	 * The window in which jodit was created
	 */
	ownerWindow: Window = window;
	get ow(): this['ownerWindow'] {
		return this.ownerWindow;
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
		if (componentStatus === this.__componentStatus) {
			return;
		}

		this.__componentStatus = componentStatus;

		const cbList = this.onStatusLst && this.onStatusLst[componentStatus];

		if (cbList) {
			cbList.forEach(cb => cb(this));
		}
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

	protected constructor() {
		this.componentName = 'jodit-' + kebabCase(getClassName(this));
		this.uid = 'jodit-uid-' + uniqueUid();
	}

	/**
	 * Destruct component method
	 */
	destruct(): void {
		this.setStatus(STATUSES.destructed);
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
		if (!this.onStatusLst) {
			this.onStatusLst = {};
		}

		if (!this.onStatusLst[status]) {
			this.onStatusLst[status] = [];
		}

		this.onStatusLst[status].push(callback);
	}

	private onStatusLst!: IDictionary<CallableFunction[]>;
}
