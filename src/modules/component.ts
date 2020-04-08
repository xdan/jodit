/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IViewBased } from '../types/view';
import {
	ComponentStatus,
	IComponent,
	IDictionary,
	Statuses
} from '../types/types';
import { isJoditObject } from '../core/helpers/checker/';
import { kebabCase } from '../core/helpers/string';
import { uniqueUid } from '../core/global';

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

	jodit!: T;

	private __componentStatus: ComponentStatus = STATUSES.beforeInit;

	get componentStatus(): ComponentStatus {
		return this.__componentStatus;
	}

	set componentStatus(componentStatus: ComponentStatus) {
		this.setStatus(componentStatus);
	}

	setStatus(componentStatus: ComponentStatus) {
		this.__componentStatus = componentStatus;

		const cbList = this.onStatusLst && this.onStatusLst[this.__componentStatus];

		if (cbList) {
			cbList.forEach(cb => cb(this));
		}
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

		if (isJoditObject(this.jodit)) {
			this.jodit.components.delete(this);
		}

		if (this.jodit) {
			(<any>this.jodit) = undefined;
		}

		this.setStatus(STATUSES.destructed);
	}

	constructor(jodit?: T) {
		this.componentName = 'jodit-' + kebabCase(this.constructor.name);
		this.uid = 'jodit-uid-' + uniqueUid();

		if (jodit && jodit instanceof Component) {
			this.jodit = jodit;

			if (isJoditObject(jodit)) {
				jodit.components.add(this);
			}
		}
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
