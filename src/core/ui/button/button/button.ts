/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui/button
 */

import './button.less';

import type {
	IUIButton,
	IUIButtonState,
	IUIButtonStatePartial,
	IViewBased,
	ButtonVariant
} from 'jodit/types';
import { UIElement } from 'jodit/core/ui';
import { Dom } from 'jodit/core/dom';
import { attr, isString, isFunction } from 'jodit/core/helpers';
import { Icon } from 'jodit/core/ui';
import { UIList } from 'jodit/core/ui';
import { autobind, component, watch } from 'jodit/core/decorators';
import { STATUSES } from 'jodit/core/component';

export const UIButtonState = (): IUIButtonState => ({
	size: 'middle',
	type: 'button',
	name: '',
	value: '',

	variant: 'initial',
	disabled: false,
	activated: false,

	icon: {
		name: 'empty',
		fill: '',
		iconURL: ''
	},

	tooltip: '',
	text: '',
	tabIndex: undefined
});

@component
export class UIButton extends UIElement implements IUIButton {
	/** @override */
	className(): string {
		return 'UIButton';
	}

	/**
	 * Marker for buttons
	 */
	isButton: true = true;

	state = UIButtonState();

	/**
	 * Set state
	 */
	setState(state: IUIButtonStatePartial): this {
		Object.assign(this.state, state);
		return this;
	}

	/**
	 * DOM container for text content
	 */
	text!: HTMLElement;

	/**
	 * DOM container for icon
	 */
	icon!: HTMLElement;

	@watch('state.size')
	protected onChangeSize(): void {
		this.setMod('size', this.state.size);
	}

	@watch('state.type')
	protected onChangeType(): void {
		attr(this.container, 'type', this.state.type);
	}

	/**
	 * Set size from parent list
	 */
	@watch('parentElement')
	protected updateSize(): void {
		const pe = this.closest(UIList) as UIList;

		if (pe) {
			this.state.size = pe.buttonSize;
			return;
		}
	}

	@watch('state.variant')
	protected onChangeStatus(): void {
		this.setMod('variant', this.state.variant);
	}

	@watch('state.text')
	protected onChangeText(): void {
		this.text.textContent = this.jodit.i18n(this.state.text);
	}

	@watch('state.text')
	protected onChangeTextSetMode(): void {
		this.setMod('text-icons', Boolean(this.state.text.trim().length));
	}

	@watch('state.disabled')
	protected onChangeDisabled(): void {
		attr(this.container, 'disabled', this.state.disabled || null);
	}

	@watch('state.activated')
	protected onChangeActivated(): void {
		attr(this.container, 'aria-pressed', this.state.activated);
	}

	@watch('state.name')
	protected onChangeName(): void {
		this.container.classList.add(
			`${this.componentName}_${this.clearName(this.state.name)}`
		);

		this.name = this.state.name;

		attr(this.container, 'data-ref', this.state.name);
		attr(this.container, 'ref', this.state.name);
	}

	@watch('state.tooltip')
	protected onChangeTooltip(): void {
		if (this.get('j.o.useNativeTooltip')) {
			attr(this.container, 'title', this.state.tooltip);
		}

		attr(this.container, 'aria-label', this.state.tooltip);
	}

	@watch('state.tabIndex')
	onChangeTabIndex(): void {
		attr(this.container, 'tabindex', this.state.tabIndex);
	}

	@watch('state.icon')
	protected onChangeIcon(): void {
		const textIcons = this.get('j.o.textIcons');

		if (
			textIcons === true ||
			(isFunction(textIcons) && textIcons(this.state.name))
		) {
			return;
		}

		Dom.detach(this.icon);

		const iconElement = Icon.makeIcon(this.j, this.state.icon);
		iconElement && this.icon.appendChild(iconElement);
	}

	/**
	 * Set focus on element
	 */
	focus(): void {
		this.container.focus();
	}

	/**
	 * Element has focus
	 */
	isFocused(): boolean {
		const { activeElement } = this.od;

		return Boolean(
			activeElement && Dom.isOrContains(this.container, activeElement)
		);
	}

	/** @override */
	protected override createContainer(): HTMLElement {
		const cn = this.componentName;

		const button = this.j.c.element('button', {
			class: cn,
			type: 'button',
			role: 'button',
			ariaPressed: false
		});

		this.icon = this.j.c.span(cn + '__icon');
		this.text = this.j.c.span(cn + '__text');

		button.appendChild(this.icon);
		button.appendChild(this.text);

		this.j.e.on(button, 'click', this.onActionFire);

		return button;
	}

	constructor(jodit: IViewBased, state?: IUIButtonStatePartial) {
		super(jodit);

		this.updateSize();
		this.onChangeSize();
		this.onChangeStatus();

		if (state) {
			this.hookStatus(STATUSES.ready, () => {
				this.setState(state);
			});
		}
	}

	override destruct(): any {
		this.j.e.off(this.container);
		return super.destruct();
	}

	private actionHandlers: Function[] = [];

	/**
	 * Add action handler
	 */
	onAction(callback: (originalEvent: MouseEvent) => void): this {
		this.actionHandlers.push(callback);
		return this;
	}

	/**
	 * Fire all click handlers
	 */
	@autobind
	private onActionFire(e: MouseEvent): void {
		e.buffer = {
			actionTrigger: this
		};

		this.actionHandlers.forEach(callback => callback.call(this, e));
	}
}

export function Button(jodit: IViewBased, icon: string): IUIButton;
export function Button(
	jodit: IViewBased,
	icon: string,
	text?: string
): IUIButton;
export function Button(
	jodit: IViewBased,
	icon: string,
	text: string,
	variant?: ButtonVariant
): IUIButton;
export function Button(
	jodit: IViewBased,
	state: IUIButtonStatePartial,
	variant?: ButtonVariant
): IUIButton;

export function Button(
	jodit: IViewBased,
	stateOrText: string | IUIButtonStatePartial,
	text?: string,
	variant?: ButtonVariant
): IUIButton {
	const button = new UIButton(jodit);

	button.state.tabIndex = jodit.o.allowTabNavigation ? 0 : -1;

	if (isString(stateOrText)) {
		button.state.icon.name = stateOrText;
		button.state.name = stateOrText;

		if (variant) {
			button.state.variant = variant;
		}

		if (text) {
			button.state.text = text;
		}
	} else {
		button.setState(stateOrText);
	}

	return button;
}
