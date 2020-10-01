/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './list.less';

import {
	Buttons,
	IControlTypeStrong,
	IDictionary,
	IUIButton,
	IUIElement,
	IUIGroup,
	IUIList,
	IViewBased,
	Nullable
} from '../../../types';

import { UIButton } from '../button';
import { getStrongControlTypes } from '../helpers/get-strong-control-types';
import { STATUSES } from '../../component';
import { watch } from '../../decorators';
import { UIGroup } from './group';
import { UISeparator } from '../separator';
import { getClassName } from '../../helpers';

export class UIList<T extends IViewBased = IViewBased>
	extends UIGroup<T>
	implements IUIList {
	jodit!: T;

	mode: IUIList['mode'] = 'horizontal';

	@watch('mode')
	onChangeMode(): void {
		this.setMod('mode', this.mode);
	}

	constructor(jodit: T) {
		super(jodit);
		this.onChangeMode();

		if (getClassName(this) === getClassName(UIList.prototype)) {
			this.setStatus(STATUSES.ready);
		}
	}

	/**
	 * Make new group and append it in list of elements
	 */
	private addGroup(): IUIGroup {
		const group = new UIGroup(this.jodit);
		this.append(group);
		return group;
	}

	/**
	 * All buttons from list
	 */
	get buttons(): IUIButton[] {
		return this.allChildren.filter(
			elm => elm instanceof UIButton
		) as IUIButton[];
	}

	/**
	 * Helper for getting full plain button list
	 */
	getButtonsNames(): string[] {
		return this.buttons
			.map(a => (a instanceof UIButton && a.state.name) || '')
			.filter(a => a !== '');
	}

	protected removeButtons: string[] = [];

	setRemoveButtons(removeButtons?: string[]): this {
		this.removeButtons = removeButtons || [];
		return this;
	}

	build(
		items: Buttons | IDictionary<string>,
		target: Nullable<HTMLElement> = null
	): IUIList {
		this.clear();

		let lastBtnSeparator: boolean = false;

		let group = this.addGroup();

		getStrongControlTypes(items, this.j.o.controls)
			.filter(b => !this.removeButtons.includes(b.name))
			.forEach(control => {
				let elm: Nullable<IUIElement> = null;

				switch (control.name) {
					case '\n':
						group = this.addGroup();
						break;

					case '|':
						if (!lastBtnSeparator) {
							lastBtnSeparator = true;
							elm = new UISeparator(this.j);
						}
						break;

					default:
						lastBtnSeparator = false;
						elm = this.makeButton(control, target);
				}

				elm && group.append(elm);
			});

		this.update();

		return this;
	}

	/**
	 * Create button instance
	 *
	 * @param control
	 * @param target
	 */
	protected makeButton(
		control: IControlTypeStrong,
		target: Nullable<HTMLElement>
	): IUIButton {
		return new UIButton(this.j);
	}
}
