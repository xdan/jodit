/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './input.less';

import { UIElement } from '../element';
import type {
	IDictionary,
	IUIInput,
	IUIInputValidator,
	IViewBased
} from '../../../types';
import { attr } from '../../helpers';
import { Dom } from '../../dom';
import * as validators from './validators';

export class UIInput extends UIElement implements IUIInput {
	nativeInput!: IUIInput['nativeInput'];

	private __errorBox = this.j.c.span(this.getClassName('error'));

	set error(value: string) {
		this.setMod('has-error', !!value);

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

	private validators: IUIInputValidator[] = [];

	validate(): boolean {
		this.error = '';

		return this.validators.every(validator => validator(this));
	}

	/** @override **/
	protected createContainer(options: this['options']): HTMLElement {
		const container = super.createContainer();

		if (!this.nativeInput) {
			this.nativeInput = this.j.create.element('input');
		}

		this.nativeInput.classList.add(this.getClassName('input'));

		if (options.label) {
			const label = this.j.c.span(this.getClassName('label'));
			container.appendChild(label);
			label.innerText = this.j.i18n(options.label);
		}

		container.appendChild(this.nativeInput);

		attr(this.nativeInput, 'name', options.name);
		attr(this.nativeInput, 'dir', this.j.o.direction || 'auto');
		attr(this.nativeInput, 'type', options.type);
		attr(this.nativeInput, 'data-ref', options.ref || options.name);
		attr(this.nativeInput, 'ref', options.ref || options.name);

		return container;
	}

	/** @override **/
	constructor(jodit: IViewBased, readonly options: IUIInput['options']) {
		super(jodit, options);

		if (this.options.required) {
			attr(this.nativeInput, 'required', true);
			this.validators.push(validators.required);
		}

		if (this.options.placeholder) {
			attr(this.nativeInput, 'placeholder', this.options.placeholder);
		}

		options.validators?.forEach(name => {
			const validator = (validators as IDictionary<IUIInputValidator>)[
				name
			];
			validator && this.validators.push(validator);
		});
	}

	focus() {
		this.nativeInput.focus();
	}
}
