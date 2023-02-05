/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module component
 */

import type { IViewBased, IViewComponent } from 'jodit/types';
import { Component } from './component';

export abstract class ViewComponent<T extends IViewBased = IViewBased>
	extends Component
	implements IViewComponent<T>
{
	/**
	 * Parent View element
	 */
	jodit!: T;

	/**
	 * Shortcut for `this.jodit`
	 */
	get j(): T {
		return this.jodit;
	}

	get defaultTimeout(): number {
		return this.j.defaultTimeout;
	}

	i18n(text: string, ...params: Array<string | number>): string {
		return this.j.i18n(text, ...params);
	}

	/**
	 * Attach component to View
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
	override destruct(): any {
		this.j.components.delete(this);
		return super.destruct();
	}
}
