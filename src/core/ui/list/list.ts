import './list.less';

import {
	Buttons,
	IControlTypeStrong,
	IDictionary,
	IUIButton,
	IUIButtonState,
	IUIElement,
	IUIGroup,
	IUIList,
	IViewBased,
	Nullable
} from '../../../types';

import { UIButton } from '../button';
import { getStrongControlTypes } from '../helpers/getStrongControlTypes';
import { STATUSES } from '../../component';
import { watch } from '../../decorators';
import { UIGroup } from './group';
import { UISeparator } from '../separator';

export class UIList<T extends IViewBased = IViewBased> extends UIGroup<T>
	implements IUIList {
	jodit!: T;

	mode: IUIList['mode'] = 'horizontal';
	buttonSize: IUIButtonState['size'] = 'middle';

	@watch('mode')
	onChangeMode() {
		this.setMod('mode', this.mode);
	}

	constructor(jodit: T) {
		super(jodit);
		this.onChangeMode();

		if (this.constructor.name === UIList.name) {
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
		const walk = (elms: IUIElement[]): IUIButton[] =>
			elms.reduce((res, elm) => {
				if (elm instanceof UIGroup) {
					return res.concat(walk(elm.elements));
				}

				if (elm instanceof UIButton) {
					res.push(elm);
				}

				return res;
			}, [] as IUIButton[]);

		return walk(this.elements);
	}

	/**
	 * Helper for getting full plain button list
	 */
	getButtonsNames(): string[] {


		return this.buttons
			.map(
				a =>
					(a instanceof UIButton && a.state.name) ||
					''
			)
			.filter(a => a !== '');
	}

	build(
		items: Buttons | IDictionary<string>,
		target: Nullable<HTMLElement> = null
	): IUIList {
		this.clear();

		let lastBtnSeparator: boolean = false;

		let group = this.addGroup();

		getStrongControlTypes(items, this.j.o.controls).forEach(control => {
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

	protected makeButton(
		control: IControlTypeStrong,
		target: Nullable<HTMLElement>
	): IUIButton {
		return new UIButton(this.j);
	}
}
