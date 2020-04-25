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
	ICreate, CanUndef, IAsync, IEventsNative, Nullable
} from '../types';

import { kebabCase, isJoditObject, get } from './helpers/';
import { uniqueUid } from './global';
import { cache } from './decorators';
import { Create } from './create';
import { Async } from './async';
import { EventsNative } from './events';

export const STATUSES: Statuses = {
	beforeInit: 'beforeInit',
	ready: 'ready',
	beforeDestruct: 'beforeDestruct',
	destructed: 'destructed'
};

export abstract class Component<T extends IViewBased = IViewBased>
	implements IComponent<T> {
	componentName!: string;
	uid!: string;

	jodit!: CanUndef<T>;
	get j(): this['jodit'] {
		return this.jodit;
	}

	setParentView(jodit: T): this {
		this.jodit = jodit;

		if (isJoditObject(jodit)) {
			jodit.components.add(this);
		}

		return this;
	}

	get ownerDocument(): Document {
		return this.ow.document;
	};

	get od(): this['ownerDocument'] {
		return this.ownerDocument;
	}

	ownerWindow!: Window;
	get ow(): this['ownerWindow'] {
		return this.ownerWindow;
	}

	async: IAsync = new Async();

	protected initOwners(): void {
		if (this.jodit && this.jodit.ownerWindow) {
			this.ownerWindow = this.jodit.ownerWindow;
		} else {
			this.ownerWindow = window;
		}
	}

	@cache
	get create(): ICreate {
		if (this.j) {
			return this.j.create;
		}

		return new Create();
	}

	get c(): this['create'] {
		return this.create;
	}

	@cache
	get events(): IEventsNative {
		if (this.j) {
			return this.j.events;
		}

		return new EventsNative(this.od);
	}

	/**
	 * Short alias for events
	 */
	get e(): this['events'] {
		return this.events;
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

	destruct(): any {
		this.setStatus(STATUSES.beforeDestruct);

		if (this.async) {
			this.async.destruct();
		}

		if (this.events) {
			this.events.destruct();
		}

		if (isJoditObject(this.j)) {
			this.j.components.delete(this);
		}

		if (this.jodit) {
			(<any>this.jodit) = undefined;
		}

		this.setStatus(STATUSES.destructed);
	}

	constructor(jodit?: T) {
		this.componentName = 'jodit-' + kebabCase(this.constructor.name);
		this.uid = 'jodit-uid-' + uniqueUid();

		if (jodit) {
			this.setParentView(jodit);
		}

		this.initOwners();
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
