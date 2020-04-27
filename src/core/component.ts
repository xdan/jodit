/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	ComponentStatus,
	IComponent,
	IDictionary,
	Statuses,
	IViewBased,
	Nullable,
	IViewComponent
} from '../types';

import { kebabCase, get } from './helpers/';
import { uniqueUid } from './global';

export const STATUSES: Statuses = {
	beforeInit: 'beforeInit',
	ready: 'ready',
	beforeDestruct: 'beforeDestruct',
	destructed: 'destructed'
};

export abstract class Component implements IComponent {
	componentName!: string;
	uid!: string;

	get ownerDocument(): Document {
		return this.ow.document;
	}

	get od(): this['ownerDocument'] {
		return this.ownerDocument;
	}

	ownerWindow: Window = window;
	get ow(): this['ownerWindow'] {
		return this.ownerWindow;
	}

	private __componentStatus: ComponentStatus = STATUSES.beforeInit;

	get componentStatus(): ComponentStatus {
		return this.__componentStatus;
	}

	set componentStatus(componentStatus: ComponentStatus) {
		this.setStatus(componentStatus);
	}

	/**
	 * Set component status
	 * @param componentStatus
	 */
	setStatus(componentStatus: ComponentStatus) {
		this.__componentStatus = componentStatus;

		const cbList =
			this.onStatusLst && this.onStatusLst[this.__componentStatus];

		if (cbList) {
			cbList.forEach(cb => cb(this));
		}
	}

	/**
	 * Safe get any field
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

	constructor() {
		this.componentName = 'jodit-' + kebabCase(this.constructor.name);
		this.uid = 'jodit-uid-' + uniqueUid();
	}

	destruct(): any {
		this.setStatus(STATUSES.destructed);
	}

	/**
	 * Add hook on status
	 *
	 * @param status
	 * @param callback
	 */
	hookStatus(
		status: keyof Statuses,
		callback: (component: Component) => void
	): void {
		if (!this.onStatusLst) {
			this.onStatusLst = {};
		}

		if (!this.onStatusLst[status]) {
			this.onStatusLst[status] = [];
		}

		this.onStatusLst[status].push(callback);
	}

	private onStatusLst!: IDictionary<Function[]>;
}

export class ViewComponent<T extends IViewBased = IViewBased>
	extends Component
	implements IViewComponent<T> {
	jodit!: T;

	get j(): this['jodit'] {
		return this.jodit;
	}

	setParentView(jodit: T): this {
		this.jodit = jodit;

		jodit.components.add(this);

		return this;
	}

	constructor(jodit: T) {
		super();
		this.setParentView(jodit);
	}

	destruct(): any {
		this.j.components.delete(this);
		return super.destruct();
	}
}
