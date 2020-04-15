import './list.less';
import { UIElement } from '../element';
import {
	Buttons,
	IControlTypeStrong,
	IDictionary,
	IUIButton,
	IUIElement,
	IUIList,
	IViewBased,
	Nullable
} from '../../../types';
import { UIButton } from '../button';
import { UIBreak } from '../break';
import { UISeparator } from '../separator';
import { getStrongControlTypes } from '../helpers/getStrongControlTypes';
import { STATUSES } from '../../component';

export class UIList<T extends IViewBased = IViewBased> extends UIElement<T>
	implements IUIList {
	elements: IUIElement[] = [];

	constructor(jodit: T) {
		super(jodit);
		this.container.classList.add('jodit-ui-list');
		this.setStatus(STATUSES.ready);
	}

	/**
	 * Update all children
	 */
	update(): void {
		this.elements.forEach(elm => elm.update());
	}

	build(
		items: Buttons | IDictionary<string>,
		target: Nullable<HTMLElement> = null
	): IUIList {
		this.clear();

		let lastBtnSeparator: boolean = false;

		getStrongControlTypes(items, this.jodit.options.controls).forEach(
			control => {
				let elm: Nullable<IUIElement> = null;

				switch (control.name) {
					case '\n':
						elm = new UIBreak(this.jodit);
						break;

					case '|':
						if (!lastBtnSeparator) {
							lastBtnSeparator = true;
							elm = new UISeparator(this.jodit);
						}
						break;

					default:
						lastBtnSeparator = false;
						elm = this.makeButton(control, target);
				}

				elm && this.append(elm);
			}
		);

		this.update();

		return this;
	}

	protected makeButton(control: IControlTypeStrong, target: Nullable<HTMLElement>): IUIButton {
		return new UIButton(this.jodit);
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
