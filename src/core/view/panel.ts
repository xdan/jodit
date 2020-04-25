/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Component } from '../component';
import { IPanel, IViewBased, IViewOptions } from '../../types';
import { Dom } from '../dom';
import { error, isString } from '../helpers';

export abstract class Panel extends Component implements IPanel {
	protected __whoLocked: string | false = '';
	protected __isFullSize: boolean = false;

	container: HTMLDivElement;

	abstract options: IViewOptions;

	/**
	 * Short alias for options
	 */
	get o(): this['options'] {
		return this.options;
	}

	protected initOptions(options?: IViewOptions): void {
		this.options = { ...(this.options || {}), ...options };
	}

	/**
	 * Can change ownerWindow here
	 */
	protected initOwners(): void {}

	/**
	 * Try to find element by selector
	 * @param element
	 */
	protected resolveElement(element: string | HTMLElement): HTMLElement {
		let resolved = element;

		if (isString(element)) {
			try {
				resolved = this.od.querySelector(element) as HTMLInputElement;
			} catch {
				throw error(
					'String "' + element + '" should be valid HTML selector'
				);
			}
		}

		// Duck checking
		if (
			!resolved ||
			typeof resolved !== 'object' ||
			!Dom.isElement(resolved) ||
			!resolved.cloneNode
		) {
			throw error(
				'Element "' +
					element +
					'" should be string or HTMLElement instance'
			);
		}

		return resolved;
	}

	protected constructor(view?: IViewBased, options?: IViewOptions) {
		super();

		if (view) {
			this.setParentView(view);
		}

		this.initOptions(options);
		this.initOwners();

		this.container = this.c.div();
	}

	isLocked = (): boolean => this.__whoLocked !== '';

	isLockedNotBy = (name: string): boolean =>
		this.isLocked() && this.__whoLocked !== name;

	/**
	 * Disable selecting
	 */
	lock(name = 'any') {
		if (!this.isLocked()) {
			this.__whoLocked = name;
			return true;
		}

		return false;
	}

	/**
	 * Enable selecting
	 */
	unlock() {
		if (this.isLocked()) {
			this.__whoLocked = '';
			return true;
		}

		return false;
	}

	isFullSize = (): boolean => this.__isFullSize;

	toggleFullSize(isFullSize?: boolean) {
		if (isFullSize === undefined) {
			isFullSize = !this.__isFullSize;
		}

		if (isFullSize === this.__isFullSize) {
			return;
		}

		this.__isFullSize = isFullSize;
	}

	destruct(): any {
		if (this.isDestructed) {
			return;
		}

		Dom.safeRemove(this.container);
		super.destruct();
	}
}
