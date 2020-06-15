/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './status-bar.less';

import { ViewComponent, STATUSES } from '../../core/component';
import { Dom } from '../../core/dom';
import { IJodit, IStatusBar } from '../../types';

export class StatusBar extends ViewComponent implements IStatusBar {
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
		const items = this.container.querySelectorAll(
			'.jodit-status-bar__item' +
				(inTheRight ? '.jodit-status-bar__item-right' : '')
		);

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
		const wrapper =
			this.findEmpty(inTheRight) ||
			this.j.c.div('jodit-status-bar__item');

		if (inTheRight) {
			wrapper.classList.add('jodit-status-bar__item-right');
		}

		wrapper.appendChild(child);

		this.container.appendChild(wrapper);
		this.show();
		this.j.e.fire('resize');
	}

	constructor(jodit: IJodit, readonly target: HTMLElement) {
		super(jodit);

		this.container = jodit.c.div('jodit-status-bar');

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
