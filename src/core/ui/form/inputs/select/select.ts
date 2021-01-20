/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './select.less';

import type {
	IDictionary,
	IUISelect,
	IUISelectValidator,
	IViewBased
} from '../../../../../types';
import { UIElement } from '../../../element';
import { attr } from '../../../../helpers';
import { Dom } from '../../../../dom';
import { selectValidators } from '../../validators';
import { component } from '../../../../decorators';

@component
export class UISelect extends UIElement implements IUISelect {
	/** @override */
	className(): string {
		return 'UISelect';
	}

	nativeInput!: IUISelect['nativeInput'];

	private __errorBox = this.j.c.span(this.getFullElName('error'));

	set error(value: string) {
		this.setMod('has-error', Boolean(value));

		if (!value) {
			Dom.safeRemove(this.__errorBox);
		} else {
			this.__errorBox.innerText = this.j.i18n(
				value,
				this.j.i18n(this.options.label || '')
			);
			this.container.appendChild(this.__errorBox);
		}
	}

	get value(): string {
		return this.nativeInput.value;
	}

	private validators: IUISelectValidator[] = [];

	validate(): boolean {
		this.error = '';

		return this.validators.every(validator => validator(this));
	}

	/** @override **/
	protected createContainer(options: this['options']): HTMLElement {
		const container = super.createContainer();

		if (!this.nativeInput) {
			this.nativeInput = this.j.create.element('select');
		}

		this.nativeInput.classList.add(this.getFullElName('select'));

		if (options.label) {
			const label = this.j.c.span(this.getFullElName('label'));
			container.appendChild(label);
			label.innerText = this.j.i18n(options.label);
		}

		if (options.placeholder !== undefined) {
			const option = this.j.create.element('option');
			option.value = '';
			option.text = options.placeholder;
			this.nativeInput.add(option);
		}

		options.options.forEach(element => {
			const option = this.j.create.element('option');
			option.value = element.value;
			option.text = element.text;
			this.nativeInput.add(option);
		});

		container.appendChild(this.nativeInput);

		attr(this.nativeInput, 'name', options.name);
		attr(this.nativeInput, 'dir', this.j.o.direction || 'auto');
		attr(this.nativeInput, 'data-ref', options.ref || options.name);
		attr(this.nativeInput, 'ref', options.ref || options.name);
		if (options.size && options.size > 0) {
			attr(this.nativeInput, 'size', options.size);
		}
		if (options.multiple) {
			attr(this.nativeInput, 'multiple', '');
		}

		return container;
	}

	/** @override **/
	constructor(jodit: IViewBased, readonly options: IUISelect['options']) {
		super(jodit, options);

		if (this.options.required) {
			this.validators.push(selectValidators.required);
		}

		options.validators?.forEach(name => {
			const validator = (selectValidators as IDictionary<IUISelectValidator>)[
				name
			];
			validator && this.validators.push(validator);
		});
	}

	focus() {
		this.nativeInput.focus();
	}
}
