/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/toolbar/button
 */

import './content.less';

import type {
	IControlTypeContent,
	IToolbarButton,
	IViewBased,
	Nullable
} from 'jodit/types';
import { UIButton } from 'jodit/core/ui/button';
import { Dom } from 'jodit/core/dom';
import { isString, attr } from 'jodit/core/helpers';
import { component } from 'jodit/core/decorators';

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
		const content = this.control.getContent(this.j, this.control, this);

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
