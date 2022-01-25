/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui/form/inputs
 */

import './input.less';

import type {
	IDictionary,
	IUIInput,
	IUIInputValidator,
	IViewBased
} from 'jodit/types';
import { UIElement } from 'jodit/core/ui/element';
import { attr, toArray } from 'jodit/core/helpers';
import { Dom } from 'jodit/core/dom';
import { autobind, component, debounce, watch } from 'jodit/core/decorators';
import { Icon } from 'jodit/core/ui/icon';
import { inputValidators } from 'jodit/core/ui/form/validators';

@component
export class UIInput extends UIElement implements IUIInput {
	/** @override */
	override className(): string {
		return 'UIInput';
	}

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
		value: '',
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
	protected onChangeClear(): void {
		if (this.state.clearButton) {
			Dom.after(this.nativeInput, this.clearButton);
		} else {
			Dom.safeRemove(this.clearButton);
		}
	}

	@watch('state.className')
	protected onChangeClassName(ignore?: unknown, oldClassName?: string): void {
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
	protected onChangeState(): void {
		this.name = this.state.name;

		const input = this.nativeInput,
			{
				name,
				icon,
				type,
				ref,
				required,
				placeholder,
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

		this.updateValidators();
	}

	protected updateValidators(): void {
		this.validators.clear();

		if (this.state.required) {
			this.validators.add(inputValidators.required);
		}

		this.state.validators?.forEach(name => {
			const validator = (
				inputValidators as IDictionary<IUIInputValidator>
			)[name];

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

	set value(value: string) {
		if (this.value !== value) {
			this.nativeInput.value = value;
			this.onChangeValue();
		}
	}

	/**
	 * Call on every state value changed
	 */
	@watch('state.value')
	protected onChangeStateValue(): void {
		const value = this.state.value.toString();

		if (value !== this.value) {
			this.value = value;
		}
	}

	/**
	 * Call on every native value changed
	 */
	@autobind
	protected onChangeValue(): void {
		const { value } = this;

		if (this.state.value !== value) {
			this.state.value = value;
			this.j.e.fire(this, 'change', value);
			this.state.onChange?.(value);
		}
	}

	protected validators: Set<IUIInputValidator> = new Set([]);

	validate(): boolean {
		this.error = '';

		return toArray(this.validators).every(validator => validator(this));
	}

	/** @override **/
	protected override createContainer(
		options: Partial<this['state']>
	): HTMLElement {
		const container = super.createContainer();

		this.wrapper = this.j.c.div(this.getFullElName('wrapper'));

		if (!this.nativeInput) {
			this.nativeInput = this.createNativeInput();
		}

		const { nativeInput } = this;

		nativeInput.classList.add(this.getFullElName('input'));

		this.wrapper.appendChild(nativeInput);
		container.appendChild(this.wrapper);

		attr(nativeInput, 'dir', this.j.o.direction || 'auto');

		return container;
	}

	/**
	 * Create native input element
	 */
	protected createNativeInput(
		options?: Partial<this['state']>
	): IUIInput['nativeInput'] {
		return this.j.create.element('input');
	}

	/** @override **/
	constructor(jodit: IViewBased, options?: Partial<IUIInput['state']>) {
		super(jodit, options);

		if (options?.value !== undefined) {
			options.value = options.value.toString();
		}

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
			.on(this.nativeInput, 'focus blur', () => {
				this.onChangeFocus();
			})
			.on(this.nativeInput, 'input change', this.onChangeValue);

		this.onChangeState();
		this.onChangeClassName();
		this.onChangeStateValue();
	}

	focus(): void {
		this.nativeInput.focus();
	}

	get isFocused(): boolean {
		return this.nativeInput === this.j.od.activeElement;
	}

	/**
	 * Set `focused` mod on change focus
	 */
	private onChangeFocus() {
		this.setMod('focused', this.isFocused);
	}
}
