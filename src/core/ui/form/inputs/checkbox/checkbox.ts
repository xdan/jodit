/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui/form/inputs
 */

import './checkbox.less';

import type { IViewBased, IUICheckBox } from 'jodit/types';
import { UIInput } from 'jodit/core/ui/form/inputs/input/input';
import { component, watch, hook } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';

@component
export class UICheckbox extends UIInput implements IUICheckBox {
	/** @override */
	override className(): string {
		return 'UICheckbox';
	}

	/** @override */
	static override defaultState: IUICheckBox['state'] = {
		...UIInput.defaultState,
		checked: false,
		switch: false
	};

	/** @override */
	override state: IUICheckBox['state'] = { ...UICheckbox.defaultState };

	/** @override */
	protected override render(): HTMLElement {
		return this.j.c.element('label', {
			className: this.componentName
		});
	}

	/** @override **/
	constructor(jodit: IViewBased, options: Partial<IUICheckBox['state']>) {
		super(jodit, { ...options, type: 'checkbox' });
		Object.assign(this.state, options);
	}

	@watch('state.checked')
	@hook('ready')
	protected onChangeChecked(): void {
		this.value = this.state.checked.toString();
		(<HTMLInputElement>this.nativeInput).checked = this.state.checked;

		this.setMod('checked', this.state.checked);
	}

	@watch('nativeInput:change')
	protected onChangeNativeCheckBox(): void {
		this.state.checked = (<HTMLInputElement>this.nativeInput).checked;
	}

	@watch('state.switch')
	@hook('ready')
	protected onChangeSwitch(): void {
		this.setMod('switch', this.state.switch);

		let slider = this.getElm('switch-slider');

		if (this.state.switch) {
			if (!slider) {
				slider = this.j.c.div(this.getFullElName('switch-slider'));
			}

			Dom.after(this.nativeInput, slider);
		} else {
			Dom.safeRemove(slider);
		}
	}
}
