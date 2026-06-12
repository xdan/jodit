/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/toolbar/button
 */

import type {
	IControlTypeContent,
	IToolbarButton,
	IViewBased,
	Nullable
} from 'jodit/types';
import { component } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom';
import { attr, isString } from 'jodit/core/helpers';
import { UIButton } from 'jodit/core/ui/button';

import './content.less';

@component
export class ToolbarContent<T extends IViewBased = IViewBased>
	extends UIButton
	implements IToolbarButton
{
	/** @override */
	override className(): string {
		return 'ToolbarContent';
	}

	/** @override */
	override update(): void {
		const { control } = this;
		const content = control.getContent(this.j, this);

		if (isString(content) || content.parentNode !== this.container) {
			Dom.detach(this.container);

			this.container.appendChild(
				isString(content) ? this.j.create.fromHTML(content) : content
			);
		}

		// Content controls never went through the ToolbarButton status
		// calculation, so `isDisabled`/`isActive`/`update` declared on the
		// control were silently ignored (e.g. the FileBrowser Upload button
		// ignored the backend permissions). See
		// https://github.com/xdan/jodit/issues/1094
		this.state.disabled = Boolean(control.isDisabled?.(this.j, this));
		this.state.activated = Boolean(control.isActive?.(this.j, this));
		control.update?.(this.j, this);

		// The first update() runs before the state watchers are attached, so
		// apply the calculated state explicitly (the calls are idempotent)
		this.onChangeDisabled();
		this.onChangeActivated();

		super.update();
	}

	/**
	 * The content is arbitrary HTML — propagate the disabled state to the
	 * nested form controls (e.g. the file input of the Upload button),
	 * otherwise they stay interactive.
	 */
	protected override onChangeDisabled(): void {
		super.onChangeDisabled();

		this.container
			.querySelectorAll('input,button,select,textarea')
			.forEach(elm => attr(elm, 'disabled', this.state.disabled || null));
	}

	/** @override */
	protected override createContainer(): HTMLElement {
		return this.j.c.span(this.componentName);
	}

	constructor(
		jodit: T,
		readonly control: IControlTypeContent,
		readonly target: Nullable<HTMLElement> = null
	) {
		super(jodit);

		this.container.classList.add(
			`${this.componentName}_${this.clearName(control.name)}`
		);

		attr(this.container, 'role', 'content');
	}
}
