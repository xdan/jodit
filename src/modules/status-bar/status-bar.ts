/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './status-bar.less';

import type { IJodit, IStatusBar, IDictionary } from '../../types';
import { ViewComponent, STATUSES } from '../../core/component';
import { Dom } from '../../core/dom';
import { Mods } from '../../core/traits';

export class StatusBar extends ViewComponent<IJodit> implements IStatusBar {
	className(): string {
		return 'StatusBar';
	}

	container!: HTMLDivElement;

	/**
	 * Hide statusbar
	 */
	hide(): void {
		this.container.classList.add('jodit_hidden');
	}

	/**
	 * Show statusbar
	 */
	show(): void {
		this.container.classList.remove('jodit_hidden');
	}

	/**
	 * Status bar is shown
	 */
	get isShown(): boolean {
		return !this.container.classList.contains('jodit_hidden');
	}

	readonly mods: IDictionary<string | boolean | null> = {};

	/** @see [[Mods.setMod]] */
	setMod(name: string, value: string | boolean | null): this {
		Mods.setMod.call(this, name, value);
		return this;
	}

	/** @see [[Mods.getMod]] */
	getMod(name: string): string | boolean | null {
		return Mods.getMod.call(this, name);
	}

	/**
	 * Height of statusbar
	 */
	getHeight(): number {
		return this.container?.offsetHeight ?? 0;
	}

	private findEmpty(inTheRight: boolean = false): HTMLDivElement | void {
		const items = this.container?.querySelectorAll(
			'.jodit-status-bar__item' +
				(inTheRight ? '.jodit-status-bar__item-right' : '')
		);

		if (items) {
			for (let i = 0; i < items.length; i += 1) {
				if (!items[i].innerHTML.trim().length) {
					return items[i] as HTMLDivElement;
				}
			}
		}
	}

	/**
	 * Add element in statusbar
	 */
	append(child: HTMLElement, inTheRight: boolean = false): void {
		const wrapper =
			this.findEmpty(inTheRight) ||
			this.j.c.div('jodit-status-bar__item');

		if (inTheRight) {
			wrapper.classList.add('jodit-status-bar__item-right');
		}

		wrapper.appendChild(child);

		this.container?.appendChild(wrapper);

		if (this.j.o.statusbar) {
			this.show();
		}

		this.j.e.fire('resize');
	}

	constructor(jodit: IJodit, readonly target: HTMLElement) {
		super(jodit);

		this.container = jodit.c.div('jodit-status-bar');

		target.appendChild(this.container);
		this.hide();
	}

	override destruct(): void {
		this.setStatus(STATUSES.beforeDestruct);
		Dom.safeRemove(this.container);
		super.destruct();
	}
}
