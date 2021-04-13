/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './file.less';

import type { IUIButton, IUIInput, IViewBased } from '../../../../../types';
import { UIInput } from '../input/input';
import { component } from '../../../../decorators';
import { UIButton } from '../../../button';

@component
export class UIFileInput extends UIInput {
	private button!: IUIButton;

	state: UIInput['state'] & {
		onlyImages: boolean;
	} = {
		...UIInput.defaultState,
		type: 'file',
		onlyImages: true
	};

	/** @override */
	className(): string {
		return 'UIFileInput';
	}

	protected createContainer(options: Partial<this['state']>): HTMLElement {
		this.button = new UIButton(this.j, {
			icon: {
				name: 'plus'
			}
		});

		const { container } = this.button;

		if (!this.nativeInput) {
			this.nativeInput = this.createNativeInput(options);
		}

		const { nativeInput } = this;

		nativeInput.classList.add(this.getFullElName('input'));
		container.classList.add(this.componentName);
		container.appendChild(nativeInput);

		return container;
	}

	protected createNativeInput(
		options: Partial<this['state']>
	): IUIInput['nativeInput'] {
		return this.j.create.fromHTML(`<input
			type="file"
			accept="${options.onlyImages ? 'image/*' : '*'}"
			tabindex="-1"
			dir="auto"
			multiple=""
		/>`) as HTMLInputElement;
	}

	constructor(jodit: IViewBased, options: Partial<UIFileInput['state']>) {
		super(jodit, {
			type: 'file',
			...options
		});
	}
}
