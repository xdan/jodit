/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IViewBased, IViewComponent } from '../../types';
import { Component } from './component';

export abstract class ViewComponent<T extends IViewBased = IViewBased>
	extends Component
	implements IViewComponent<T> {
	/**
	 * Parent View element
	 */
	jodit!: T;

	get defaultTimeout(): number {
		return this.j.defaultTimeout;
	}

	/**
	 * Shortcut for `this.jodit`
	 */
	get j(): T {
		return this.jodit;
	}

	/**
	 * Attach component to View
	 * @param jodit
	 */
	setParentView(jodit: T): this {
		this.jodit = jodit;

		jodit.components.add(this);

		return this;
	}

	constructor(jodit: T) {
		super();
		this.setParentView(jodit);
	}

	/** @override */
	destruct(): any {
		this.j.components.delete(this);
		return super.destruct();
	}
}
