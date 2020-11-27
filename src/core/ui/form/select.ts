// TODO : vérifier les adaptations par rapport à ./input.ts
/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './select.less';

import { UIElement } from '../element';
import type {
	IUISelect,
	IUISelectValidator,
	IViewBased
} from '../../../types';
import { attr } from '../../helpers';
import { Dom } from '../../dom';

export class UISelect extends UIElement implements IUISelect {
	nativeInput!: IUISelect['nativeInput'];

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

		this.nativeInput.classList.add(this.getClassName('select'));

		if (options.label) {
			const label = this.j.c.span(this.getClassName('label'));
			container.appendChild(label);
			label.innerText = this.j.i18n(options.label);
		}

		options.options.forEach(element => {
			let option = this.j.create.element('option');
			option.value = element.value;
			option.text = element.text;
			this.nativeInput.add(option);
		});

		container.appendChild(this.nativeInput);

		attr(this.nativeInput, 'name', options.name);
		attr(this.nativeInput, 'data-ref', options.ref || options.name);
		attr(this.nativeInput, 'ref', options.ref || options.name);
		// TODO : il manque certainement des attr

		return container;
	}

	/** @override **/
	constructor(jodit: IViewBased, readonly options: IUISelect['options']) {
		super(jodit, options);

		// TODO : J'ai du supprimer la partie des validators car je n'ai pas encore trouvé comment ça marche
	}

	focus() {
		this.nativeInput.focus();
	}
}
