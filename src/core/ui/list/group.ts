/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './group.less';

import { IUIElement, IUIGroup, IViewBased } from '../../../types';
import { UIElement } from '../element';
import { watch } from '../../decorators';

export class UIGroup<T extends IViewBased = IViewBased> extends UIElement<T>
	implements IUIGroup {
	elements: IUIElement[] = [];

	/**
	 * Update all children
	 */
	@watch('buttonSize')
	update(): void {
		this.elements.forEach(elm => elm.update());
	}

	append(elm: IUIElement): void {
		this.elements.push(elm);
		this.container.appendChild(elm.container);
		elm.parentElement = this;
		elm.update();
	}

	clear(): void {
		this.elements.forEach(elm => elm.destruct());
		this.elements.length = 0;
	}

	destruct(): any {
		this.clear();
		return super.destruct();
	}
}
