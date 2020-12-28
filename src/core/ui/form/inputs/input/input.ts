/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './input.less';

import type {
	IDictionary, IKeyValidator,
	IUIInput,
	IUIInputValidator,
	IViewBased
} from '../../../../../types';
import { UIElement } from '../../../element';
import { attr, toArray } from '../../../../helpers';
import { Dom } from '../../../../dom';
import { component, debounce, watch } from '../../../../decorators';
import { Icon } from '../../../icon';
import { inputValidators, KeyValidator } from '../../validators';

@component
export class UIInput extends UIElement implements IUIInput {
	/** @override */
	className(): string {
		return 'UIInput';
	}

	validator: IKeyValidator = new KeyValidator();
	nativeInput!: IUIInput['nativeInput'];

	private label = this.j.c.span(this.getFullElName('label'));
	private icon = this.j.c.span(this.getFullElName('icon'));
	private clearButton = this.j.c.span(
		this.getFullElName('clear'),
		Icon.get('cancel')
	);

	private wrapper!: HTMLElement;

	static defaultState: IUIInput['state'] = {
		className: '',
		autocomplete: true,
		name: '',
		icon: '',
		label: '',
		ref: '',
		type: 'text',
		placeholder: '',
		required: false,
		validators: []
	};

	state: IUIInput['state'] = { ...UIInput.defaultState };

	@watch('state.clearButton')
	onChangeClear(): void {
		if (this.state.clearButton) {
			Dom.after(this.nativeInput, this.clearButton);
		} else {
			Dom.safeRemove(this.clearButton);
		}
	}

	@watch('state.className')
	onChangeClassName(ignore?: unknown, oldClassName?: string): void {
		oldClassName && this.container.classList.remove(oldClassName);
		this.state.className &&
			this.container.classList.add(this.state.className);
	}

	@watch([
		'state.name',
		'state.type',
		'state.label',
		'state.placeholder',
		'state.autocomplete',
		'state.icon'
	])
	@debounce()
	onChangeState(): void {
		const input = this.nativeInput,
			{
				name,
				icon,
				type,
				ref,
				required,
				placeholder,
				validators,
				autocomplete,
				label
			} = this.state;

		attr(input, 'name', name);
		attr(input, 'type', type);
		attr(input, 'data-ref', ref || name);
		attr(input, 'ref', ref || name);
		attr(input, 'required', required || null);
		attr(input, 'autocomplete', !autocomplete ? 'off' : null);
		attr(input, 'placeholder', placeholder ? this.j.i18n(placeholder) : '');

		if (icon && Icon.exists(icon)) {
			Dom.before(input, this.icon);
			this.icon.innerHTML = Icon.get(icon);
		} else {
			Dom.safeRemove(this.icon);
		}

		if (label) {
			Dom.before(this.wrapper, this.label);
			this.label.innerText = this.j.i18n(label);
		} else {
			Dom.safeRemove(this.label);
		}

		this.validators.clear();

		if (required) {
			this.validators.add(inputValidators.required);
		}

		validators?.forEach(name => {
			const validator = (inputValidators as IDictionary<IUIInputValidator>)[
				name
			];

			validator && this.validators.add(validator);
		});
	}

	private __errorBox = this.j.c.span(this.getFullElName('error'));

	set error(value: string) {
		this.setMod('has-error', Boolean(value));

		if (!value) {
			Dom.safeRemove(this.__errorBox);
		} else {
			this.__errorBox.innerText = this.j.i18n(
				value,
				this.j.i18n(this.state.label || '')
			);
			this.container.appendChild(this.__errorBox);
		}
	}

	get value(): string {
		return this.nativeInput.value;
	}

	set value(value) {
		this.nativeInput.value = value;
		this.j.e.fire(this, 'change', value);
	}

	private validators: Set<IUIInputValidator> = new Set([]);

	validate(): boolean {
		this.error = '';

		return toArray(this.validators).every(validator => validator(this));
	}

	/** @override **/
	protected createContainer(options: Partial<this['state']>): HTMLElement {
		const container = super.createContainer();

		this.wrapper = this.j.c.div(this.getFullElName('wrapper'));

		if (!this.nativeInput) {
			this.nativeInput = this.j.create.element('input');
		}

		this.nativeInput.classList.add(this.getFullElName('input'));

		this.wrapper.appendChild(this.nativeInput);
		container.appendChild(this.wrapper);

		attr(this.nativeInput, 'dir', this.j.o.direction || 'auto');

		return container;
	}

	/** @override **/
	constructor(jodit: IViewBased, options?: Partial<IUIInput['state']>) {
		super(jodit, options);

		Object.assign(this.state, options);

		if (this.state.clearButton !== undefined) {
			this.j.e
				.on(this.clearButton, 'click', (e: MouseEvent) => {
					e.preventDefault();
					this.nativeInput.value = '';
					this.j.e.fire(this.nativeInput, 'input');
					this.focus();
				})
				.on(this.nativeInput, 'input', () => {
					this.state.clearButton = Boolean(this.value.length);
				});

			this.state.clearButton = Boolean(this.value.length);
		}

		this.j.e
			.on(this.nativeInput, 'input change', () => {
				this.j.e.fire(this, 'change', this.value)
			})
			.on(this.nativeInput, 'keydown', (e: KeyboardEvent) => {
				return this.validator.validateInput(e, this.nativeInput);
			});

		this.onChangeState();
		this.onChangeClassName();
	}

	focus() {
		this.nativeInput.focus();
	}

	get isFocused(): boolean {
		return this.nativeInput === this.j.od.activeElement;
	}
}
