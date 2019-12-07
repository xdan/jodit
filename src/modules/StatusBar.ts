/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Component } from './Component';
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

	/**
	 * Add element in statusbar
	 *
	 * @param child
	 * @param inTheRight
	 */
	append(child: HTMLElement, inTheRight: boolean = false) {
		const wrapper = this.jodit.create.div('jodit_statusbar_item');

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
		Dom.safeRemove(this.container);
		delete this.container;
		super.destruct();
	}
}
