/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './group.less';

import type {
	IDictionary,
	IUIButton,
	IUIOption,
	IViewBased
} from '../../../../types';
import { UIGroup } from '../../list/group';
import { component } from '../../../decorators';
import { UIButton } from '../button/button';

@component
export class UIButtonGroup extends UIGroup {
	elements!: IUIButton[];

	/** @override */
	className(): string {
		return 'UIButtonGroup';
	}

	/** @override */
	protected createContainer(options: IDictionary): HTMLElement {
		const container = super.createContainer(options);
		container.innerHTML = `<div class="${this.getFullElName(
			'label'
		)}">${this.j.i18n(options.label)}</div>
			<div class="${this.getFullElName('options')}"></div>`;

		return container;
	}

	/** @override */
	protected appendChildToContainer(childContainer: HTMLElement) {
		this.container
			.querySelector('.' + this.getFullElName('options'))
			?.appendChild(childContainer);
	}

	constructor(
		jodit: IViewBased,
		items: IUIOption[],
		readonly options: {
			value?: string;
			label?: string;
			onChange?: (values: IUIOption[]) => void;
			radio: boolean;
		} = {
			radio: true
		}
	) {
		super(
			jodit,
			items.map(opt => {
				const btn = new UIButton(jodit, {
					text: opt.text,
					name: opt.value,
					status: 'primary'
				});

				btn.onAction(() => {
					this.select(opt.value);
				});

				return btn;
			}),
			options
		);

		this.select(options.value ?? 0);
	}

	protected select(indexOrValue: number | string): void {
		this.elements.forEach((elm, index) => {
			if (index === indexOrValue || elm.state.name === indexOrValue) {
				elm.state.activated = true;
			} else if (this.options.radio) {
				elm.state.activated = false;
			}
		});

		const result = this.elements
			.filter(elm => elm.state.activated)
			.map(elm => ({
				text: elm.state.text,
				value: elm.state.name
			}));

		this.jodit.e.fire(
			this,
			'select',
			result
		);

		this.options.onChange?.(result);
	}
}
