/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Component, STATUSES } from './Component';
import { Dom } from './Dom';
import { IJodit, IStatusBar } from '../types';

export class StatusBar extends Component implements IStatusBar {
	container: HTMLElement;

	/**
	 * Hide statusbar
	 */
	hide() {
		this.container && this.container.classList.add('jodit_hidden');
	}

	/**
	 * Show statusbar
	 */
	show() {
		this.container && this.container.classList.remove('jodit_hidden');
	}

	/**
	 * Height of statusbar
	 */
	getHeight(): number {
		return this.container.offsetHeight;
	}

	private findEmpty(inTheRight: boolean = false): HTMLDivElement | void {
		const items = this.container.querySelectorAll('.jodit_statusbar_item' + (inTheRight ? '.jodit_statusbar_item-right' : ''));
		for (let i = 0; i < items.length; i += 1) {
			if (!items[i].innerHTML.trim().length) {
				return items[i] as HTMLDivElement;
			}
		}
	}

	/**
	 * Add element in statusbar
	 *
	 * @param child
	 * @param inTheRight
	 */
	append(child: HTMLElement, inTheRight: boolean = false) {
		const wrapper = this.findEmpty(inTheRight) || this.jodit.create.div('jodit_statusbar_item');

		if (inTheRight) {
			wrapper.classList.add('jodit_statusbar_item-right');
		}

		wrapper.appendChild(child);

		this.container.appendChild(wrapper);
		this.show();
		this.jodit.events.fire('resize');
	}

	constructor(jodit: IJodit, readonly target: HTMLElement) {
		super(jodit);
		this.container = jodit.create.div('jodit_statusbar');

		target.appendChild(this.container);
		this.hide();
	}

	destruct() {
		this.setStatus(STATUSES.beforeDestruct);

		Dom.safeRemove(this.container);
		delete this.container;

		super.destruct();
	}
}
