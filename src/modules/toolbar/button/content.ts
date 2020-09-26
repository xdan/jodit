/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './content.less';

import {
	IControlTypeContent,
	IToolbarButton,
	IViewBased,
	Nullable
} from '../../../types';
import { UIButton } from '../../../core/ui/button';
import { isString } from '../../../core/helpers/checker';
import { Dom } from '../../../core/dom';
import { attr } from '../../../core/helpers/utils';

export class ToolbarContent<T extends IViewBased = IViewBased>
	extends UIButton
	implements IToolbarButton {
	/** @override */
	update(): void {
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
	protected createContainer(): HTMLElement {
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
