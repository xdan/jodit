/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './list.less';

import type {
	IControlTypeStrong,
	IUIButton,
	IUIElement,
	IUIGroup,
	IUIList,
	IViewBased,
	Nullable,
	ButtonsOption
} from '../../../types';

import { UIButton } from '../button';
import { getStrongControlTypes } from '../helpers/get-strong-control-types';
import { component, watch } from '../../decorators';
import { UIGroup } from './group';
import { UISeparator } from '../separator';
import { isButtonGroup } from '../helpers/buttons';
import { getControlType } from '../helpers/get-control-type';
import { splitArray } from '../../helpers';

@component
export class UIList<T extends IViewBased = IViewBased>
	extends UIGroup<T>
	implements IUIList
{
	/** @override */
	className(): string {
		return 'UIList';
	}

	jodit!: T;

	mode: IUIList['mode'] = 'horizontal';

	@watch('mode')
	onChangeMode(): void {
		this.setMod('mode', this.mode);
	}

	constructor(jodit: T) {
		super(jodit);
		this.onChangeMode();
	}

	/**
	 * Make new group and append it in list of elements
	 */
	private makeGroup(): IUIGroup {
		return new UIGroup(this.jodit);
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

	build(items: ButtonsOption, target: Nullable<HTMLElement> = null): IUIList {
		items = splitArray(items);

		this.clear();

		let lastBtnSeparator: boolean = false;

		let line: IUIGroup = this.makeGroup();
		this.append(line);

		let group: IUIGroup;

		const addButton = (control: IControlTypeStrong) => {
			let elm: Nullable<IUIElement> = null;

			switch (control.name) {
				case '\n':
					line = this.makeGroup();
					group = this.makeGroup();
					line.append(group);
					this.append(line);
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

			if (elm) {
				if (!group) {
					group = this.makeGroup();
					line.append(group);
				}

				group.append(elm);
			}
		};

		const isNotRemoved = (b: IControlTypeStrong) =>
			!this.removeButtons.includes(b.name);

		items.forEach(item => {
			if (isButtonGroup(item)) {
				const buttons = item.buttons.filter(b => b);

				if (buttons.length) {
					group = this.makeGroup();
					line.append(group);
					group.setMod('separated', true).setMod('group', item.group);

					getStrongControlTypes(buttons, this.j.o.controls)
						.filter(isNotRemoved)
						.forEach(addButton);
				}
			} else {
				const control = getControlType(item, this.j.o.controls);
				isNotRemoved(control) && addButton(control);
			}
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
