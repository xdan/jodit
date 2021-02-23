/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './select.less';

import type { IUISelect, IViewBased } from '../../../../../types';
import { attr } from '../../../../helpers';
import { component } from '../../../../decorators';
import { UIInput } from '../input/input';
import { inputValidators, selectValidators } from '../../validators';

@component
export class UISelect extends UIInput implements IUISelect {
	/** @override */
	className(): string {
		return 'UISelect';
	}

	/** @override */
	nativeInput!: IUISelect['nativeInput'];

	/** @override */
	static defaultState: IUISelect['state'] = {
		...UIInput.defaultState,
		options: [],
		size: 1,
		multiple: false
	};

	/** @override */
	state: IUISelect['state'] = { ...UISelect.defaultState };

	/** @override **/
	protected createContainer(state: Partial<IUISelect['state']>): HTMLElement {
		const container = super.createContainer(state);

		const { j } = this,
			{ nativeInput } = this;

		const opt = () => j.create.element('option');

		if (state.placeholder !== undefined) {
			const option = opt();
			option.value = '';
			option.text = j.i18n(state.placeholder);
			nativeInput.add(option);
		}

		state.options?.forEach(element => {
			const option = opt();
			option.value = element.value.toString();
			option.text = j.i18n(element.text);
			nativeInput.add(option);
		});

		if (state.size && state.size > 0) {
			attr(nativeInput, 'size', state.size);
		}

		if (state.multiple) {
			attr(nativeInput, 'multiple', '');
		}

		return container;
	}

	/** @override **/
	protected createNativeInput(): IUISelect['nativeInput'] {
		return this.j.create.element('select');
	}

	/** @override **/
	protected updateValidators() {
		super.updateValidators();

		if (this.state.required) {
			this.validators.delete(inputValidators.required);
			this.validators.add(selectValidators.required);
		}
	}

	constructor(jodit: IViewBased, state: Partial<IUISelect['state']>) {
		super(jodit, state);
		Object.assign(this.state, state);
	}
}
