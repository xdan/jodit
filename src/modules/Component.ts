/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IViewBased } from '../types/view';
import { ComponentStatus, IComponent } from '../types/types';
import { isJoditObject } from './helpers/checker/isJoditObject';

export const STATUSES = {
	beforeInit: 0,
	ready: 1,
	beforeDestruct: 2,
	destructed: 3
};

export abstract class Component<T extends IViewBased = IViewBased>
	implements IComponent<T> {
	jodit!: T;

	private __componentStatus: ComponentStatus = STATUSES.beforeInit;
	get componentStatus(): ComponentStatus {
		return this.__componentStatus;
	}

	set componentStatus(componentStatus: ComponentStatus) {
		this.__componentStatus = componentStatus;
	}

	setStatus(componentStatus: ComponentStatus) {
		this.__componentStatus = componentStatus;
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
		return [STATUSES.beforeDestruct, STATUSES.destructed].includes(this.componentStatus);
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
		if (jodit && jodit instanceof Component) {
			this.jodit = jodit;

			if (isJoditObject(jodit)) {
				jodit.components.add(this);
			}
		}
	}
}
