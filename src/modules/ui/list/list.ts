import './list.less';
import { UIElement } from '../element';
import { Buttons, IDictionary, IViewBased } from '../../../types';
import { UIButton } from '../button';
import { UIBreak } from '../break';
import { UISeparator } from '../separator';
import { getStrongControlTypes } from '../helpers/getStrongControlTypes';
import { STATUSES } from '../../component';

export class UIList extends UIElement {
	elements: UIElement[] = [];

	constructor(jodit: IViewBased) {
		super(jodit);
		this.setStatus(STATUSES.ready);
	}

	update(): void {
		this.elements.forEach(elm => elm.update());
	}

	build(items: Buttons | IDictionary<string>): void {
		this.clear();

		let lastBtnSeparator: boolean = false;

		getStrongControlTypes(items, this.jodit.options.controls).forEach(
			control => {
				let elm: UIElement | null = null;

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
						elm = new UIButton(this.jodit, control);
				}

				elm && this.append(elm);
			}
		);
	}

	append(elm: UIElement): void {
		this.elements.push(elm);
		this.container.appendChild(elm.container);
		elm.parentElement = this;
		elm.update();
	}

	clear(): void {
		this.elements.forEach(elm => elm.destruct());
		this.elements.length = 0;
	}
}
