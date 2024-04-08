/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
		const content = this.control.getContent(this.j, this);

		if (isString(content) || content.parentNode !== this.container) {
			Dom.detach(this.container);

			this.container.appendChild(
				isString(content) ? this.j.create.fromHTML(content) : content
			);
		}

		super.update();
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
