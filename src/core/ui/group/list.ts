/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui/group
 */

import type {
	ButtonsOption,
	IControlTypeStrong,
	IUIButton,
	IUIElement,
	IUIGroup,
	IUIList,
	IViewBased,
	Nullable
} from 'jodit/types';
import { Component } from 'jodit/core/component/component';
import { component, hook, watch } from 'jodit/core/decorators';
import { splitArray } from 'jodit/core/helpers/array/split-array';
import { UIButton } from 'jodit/core/ui/button/button/button';
import { UIGroup } from 'jodit/core/ui/group/group';
import { UISeparator } from 'jodit/core/ui/group/separator';
import { UISpacer } from 'jodit/core/ui/group/spacer';
import { isButtonGroup } from 'jodit/core/ui/helpers/buttons';
import { getControlType } from 'jodit/core/ui/helpers/get-control-type';
import { getStrongControlTypes } from 'jodit/core/ui/helpers/get-strong-control-types';

import './list.less';

@component
export class UIList<T extends IViewBased = IViewBased>
	extends UIGroup<T>
	implements IUIList
{
	/** @override */
	override className(): string {
		return 'UIList';
	}

	declare jodit: T;

	mode: IUIList['mode'] = 'horizontal';

	@watch('mode')
	@hook('ready')
	protected __onChangeMode(): void {
		this.setMod('mode', this.mode);
	}

	constructor(jodit: T) {
		super(jodit);
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
		return this.allChildren.filter(elm =>
			Component.isInstanceOf<UIButton>(elm, UIButton)
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

		let line = this.makeGroup();
		this.append(line);
		line.setMod('line', true);

		let group: IUIGroup;

		const addButton = (control: IControlTypeStrong): void => {
			let elm: Nullable<IUIElement> = null;

			switch (control.name) {
				case '\n':
					line = this.makeGroup();
					line.setMod('line', true);
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

				case '---': {
					group.setMod('before-spacer', true);

					const space = new UISpacer(this.j);
					line.append(space);

					group = this.makeGroup();
					line.append(group);
					lastBtnSeparator = false;

					break;
				}

				default:
					lastBtnSeparator = false;
					switch (control.component) {
						case 'select':
							elm = this.makeSelect(control, target);
							break;

						case 'button':
						default:
							elm = this.makeButton(control, target);
					}
			}

			if (elm) {
				if (!group) {
					group = this.makeGroup();
					line.append(group);
				}

				group.append(elm);
			}
		};

		const isNotRemoved = (b: IControlTypeStrong): boolean =>
			!this.removeButtons.includes(b.name) &&
			(!b.isVisible || b.isVisible?.(this.j, b));

		items.forEach(item => {
			if (isButtonGroup(item)) {
				const buttons = item.buttons.filter(b => b);

				if (buttons.length) {
					group = this.makeGroup();
					group.setMod('separated', true).setMod('group', item.group);

					line.append(group);

					getStrongControlTypes(buttons, this.j.o.controls)
						.filter(isNotRemoved)
						.forEach(addButton);
				}
			} else {
				if (!group) {
					group = this.makeGroup();
					line.append(group);
				}

				const control = getControlType(item, this.j.o.controls);
				isNotRemoved(control) && addButton(control);
			}
		});

		this.update();

		return this;
	}

	protected makeSelect(
		control: IControlTypeStrong,
		target: Nullable<HTMLElement>
	): IUIButton {
		throw new Error('Not implemented behaviour');
	}

	/**
	 * Create button instance
	 */
	protected makeButton(
		control: IControlTypeStrong,
		target: Nullable<HTMLElement>
	): IUIButton {
		return new UIButton(this.j, {
			name: control.name
		});
	}
}
