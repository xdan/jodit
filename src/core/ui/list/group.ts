/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './group.less';

import {
	IUIButtonState,
	IUIElement,
	IUIGroup,
	IViewBased
} from '../../../types';
import { UIElement } from '../element';
import { watch } from '../../decorators';
import { isArray } from '../../helpers';

export class UIGroup<T extends IViewBased = IViewBased>
	extends UIElement<T>
	implements IUIGroup {
	elements: IUIElement[] = [];

	/**
	 * All group children
	 */
	get allChildren(): IUIElement[] {
		const result: IUIElement[] = [];
		const stack: Array<IUIElement | IUIElement[] | IUIGroup> = [
			...this.elements
		];

		while (stack.length) {
			const elm = stack.pop();

			if (isArray(elm)) {
				stack.push(...elm);
			} else if (elm instanceof UIGroup) {
				stack.push(...elm.elements.reverse());
			} else {
				elm && result.push(elm);
			}
		}

		return result;
	}

	buttonSize: IUIButtonState['size'] = 'middle';

	/**
	 * Update all children
	 */
	@watch('buttonSize')
	update(): void {
		this.elements.forEach(elm => elm.update());
		this.setMod('size', this.buttonSize);
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

	constructor(jodit: T, elements?: Array<IUIElement | void | null | false>) {
		super(jodit);
		elements?.forEach(elm => elm && this.append(elm));
	}

	destruct(): any {
		this.clear();
		return super.destruct();
	}
}
