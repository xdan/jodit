/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/status-bar/README.md]]
 * @packageDocumentation
 * @module modules/status-bar
 */

import './status-bar.less';

import type {
	IJodit,
	IStatusBar,
	IDictionary,
	ModType,
	CanUndef
} from 'jodit/types';
import { ViewComponent, STATUSES } from 'jodit/core/component';
import { Dom } from 'jodit/core/dom';
import { Elms, Mods } from 'jodit/core/traits';
import { component } from 'jodit/core/decorators';

@component
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

	readonly mods: IDictionary<ModType> = {};

	/** @see [[Mods.setMod]] */
	setMod(name: string, value: ModType): this {
		Mods.setMod.call(this, name, value);
		return this;
	}

	/** @see [[Mods.getMod]] */
	getMod(name: string): ModType {
		return Mods.getMod.call(this, name);
	}

	/**
	 * Height of statusbar
	 */
	getHeight(): number {
		return this.container?.offsetHeight ?? 0;
	}

	private findEmpty(inTheRight: boolean = false): CanUndef<HTMLElement> {
		const items = Elms.getElms.call(
			this,
			inTheRight ? 'item-right' : 'item'
		);

		for (let i = 0; i < items.length; i += 1) {
			if (!items[i].innerHTML.trim().length) {
				return items[i];
			}
		}

		return;
	}

	/**
	 * Add element in statusbar
	 */
	append(child: HTMLElement, inTheRight: boolean = false): void {
		const wrapper =
			this.findEmpty(inTheRight) ||
			this.j.c.div(this.getFullElName('item'));

		if (inTheRight) {
			wrapper.classList.add(this.getFullElName('item-right'));
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
