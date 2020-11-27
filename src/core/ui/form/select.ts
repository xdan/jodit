/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './select.less';

import { UIElement } from '../element';
import type {
	// TODO BB : à supprimer ?
//	IDictionary,
	IUISelect,
	IUISelectValidator,
	IViewBased
} from '../../../types';
import { attr } from '../../helpers';
import { Dom } from '../../dom';
// TODO BB : à supprimer ?
//import * as validators from './validators';

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
		attr(this.nativeInput, 'dir', this.j.o.direction || 'auto');
		attr(this.nativeInput, 'data-ref', options.ref || options.name);
		attr(this.nativeInput, 'ref', options.ref || options.name);
		// TODO BB : à tester + mettre une valeur par défaut ?
		attr(this.nativeInput, 'size', options.size);
		// TODO BB : à tester + mettre une valeur par défaut ?
		attr(this.nativeInput, 'multiple', options.multiple);

		return container;
	}

	/** @override **/
	constructor(jodit: IViewBased, readonly options: IUISelect['options']) {
		super(jodit, options);

		// Début TODO BB : J'ai du supprimer la partie des validators car je n'ai pas encore trouvé comment ça marche
		// TODO BB : Placeholder à supprimer ou s'en servir pour la valeur vide
		/*
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
		*/
		// Fin TODO BB
	}

	focus() {
		this.nativeInput.focus();
	}
}
