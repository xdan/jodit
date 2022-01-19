/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui/form/inputs
 */

import './file.less';

import type { IUIButton, IUIInput, IViewBased } from 'jodit/types';
import { UIInput } from 'jodit/core/ui/form/inputs/input/input';
import { component } from 'jodit/core/decorators';
import { UIButton } from 'jodit/core/ui/button';

@component
export class UIFileInput extends UIInput {
	private button!: IUIButton;

	override state: UIInput['state'] & {
		onlyImages: boolean;
	} = {
		...UIInput.defaultState,
		type: 'file',
		onlyImages: true
	};

	/** @override */
	override className(): string {
		return 'UIFileInput';
	}

	protected override createContainer(
		options: Partial<this['state']>
	): HTMLElement {
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

	protected override createNativeInput(
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
