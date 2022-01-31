/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/toolbar/button/README.md]]
 * @packageDocumentation
 * @module modules/toolbar/button
 */

import './button.less';

import type {
	Controls,
	IControlType,
	IControlTypeStrong,
	IControlTypeStrongList,
	IToolbarButton,
	IToolbarCollection,
	IViewBased,
	Nullable
} from 'jodit/types';
import { UIButton, UIButtonState } from 'jodit/core/ui/button';
import { component, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom';
import { Popup } from 'jodit/core/ui/popup/';
import { makeCollection } from 'jodit/modules/toolbar/factory';
import {
	isFunction,
	isString,
	position,
	camelCase,
	attr,
	isJoditObject,
	call,
	isArray,
	keys
} from 'jodit/core/helpers';
import { Icon } from 'jodit/core/ui';
import { ToolbarCollection } from 'jodit/modules/toolbar/collection/collection';
import { STATUSES } from 'jodit/core/component';
import { findControlType } from 'jodit/core/ui/helpers/get-control-type';

@component
export class ToolbarButton<T extends IViewBased = IViewBased>
	extends UIButton
	implements IToolbarButton
{
	/** @override */
	override className(): string {
		return 'ToolbarButton';
	}

	override state = {
		...UIButtonState(),
		theme: 'toolbar',
		currentValue: '',
		hasTrigger: false
	};

	protected trigger!: HTMLElement;

	/**
	 * Get parent toolbar
	 */
	protected get toolbar(): Nullable<IToolbarCollection> {
		return this.closest<ToolbarCollection>(ToolbarCollection);
	}

	/**
	 * Button element
	 */
	get button(): HTMLElement {
		return this.container.querySelector(
			`button.${this.componentName}__button`
		) as HTMLElement;
	}

	/** @override **/
	override update(): void {
		const { control, state } = this,
			tc = this.closest(ToolbarCollection) as ToolbarCollection;

		state.disabled = this.calculateDisabledStatus(tc);
		state.activated = this.calculateActivatedStatus(tc);

		if (isFunction(control.update)) {
			control.update(this);
		}

		super.update();
	}

	/**
	 * Calculates whether the button is active
	 */
	private calculateActivatedStatus(tc?: ToolbarCollection): boolean {
		if (isJoditObject(this.j) && !this.j.editorIsActive) {
			return false;
		}

		if (
			isFunction(this.control.isActive) &&
			this.control.isActive(this.j, this.control, this)
		) {
			return true;
		}

		return Boolean(tc && tc.shouldBeActive(this));
	}

	/**
	 * Calculates whether an element is blocked for the user
	 */
	private calculateDisabledStatus(tc?: ToolbarCollection): boolean {
		if (this.j.o.disabled) {
			return true;
		}

		if (
			this.j.o.readonly &&
			(!this.j.o.activeButtonsInReadOnly ||
				!this.j.o.activeButtonsInReadOnly.includes(this.control.name))
		) {
			return true;
		}

		if (
			isFunction(this.control.isDisabled) &&
			this.control.isDisabled(this.j, this.control, this)
		) {
			return true;
		}

		return Boolean(tc && tc.shouldBeDisabled(this));
	}

	/** @override */
	protected override onChangeActivated(): void {
		attr(this.button, 'aria-pressed', this.state.activated);
		super.onChangeActivated();
	}

	/** @override */
	protected override onChangeText(): void {
		if (isFunction(this.control.template)) {
			this.text.innerHTML = this.control.template(
				this.j,
				this.control.name,
				this.j.i18n(this.state.text)
			);
		} else {
			super.onChangeText();
		}

		this.setMod('text-icons', Boolean(this.text.innerText.trim().length));
	}

	/** @override */
	override onChangeTabIndex(): void {
		attr(this.button, 'tabindex', this.state.tabIndex);
	}

	@watch('state.tooltip')
	protected override onChangeTooltip(): void {
		attr(this.button, 'aria-label', this.state.tooltip);
		super.onChangeTooltip();
	}

	/** @override */
	protected override createContainer(): HTMLElement {
		const cn = this.componentName;
		const container = this.j.c.span(cn),
			button = super.createContainer();

		attr(container, 'role', 'listitem');

		button.classList.remove(cn);
		button.classList.add(cn + '__button');

		Object.defineProperty(button, 'component', {
			value: this
		});

		container.appendChild(button);

		this.trigger = this.j.c.fromHTML(
			`<span role="trigger" class="${cn}__trigger">${Icon.get(
				'chevron'
			)}</span>`
		);

		this.j.e.on(this.trigger, 'click', this.onTriggerClick.bind(this));

		return container;
	}

	/** @override */
	override focus(): void {
		this.container.querySelector('button')?.focus();
	}

	@watch('state.hasTrigger')
	protected onChangeHasTrigger(): void {
		if (this.state.hasTrigger) {
			this.container.appendChild(this.trigger);
		} else {
			Dom.safeRemove(this.trigger);
		}

		this.setMod('with-trigger', this.state.hasTrigger || null);
	}

	/** @override */
	protected override onChangeDisabled(): void {
		const dsb = this.state.disabled ? 'disabled' : null;

		attr(this.trigger, 'disabled', dsb);
		attr(this.button, 'disabled', dsb);
		attr(this.container, 'disabled', dsb);
	}

	/**
	 * Add tooltip to button
	 */
	protected initTooltip(): void {
		if (
			!this.j.o.textIcons &&
			this.j.o.showTooltip &&
			!this.j.o.useNativeTooltip
		) {
			this.j.e
				.off(this.container, 'mouseenter mouseleave')
				.on(this.container, 'mousemove', (e: MouseEvent) => {
					if (!this.state.tooltip) {
						return;
					}

					!this.state.disabled &&
						this.j.e.fire(
							'delayShowTooltip',
							() => ({
								x: e.clientX + 10,
								y: e.clientY + 10
							}),
							this.state.tooltip
						);
				})
				.on(this.container, 'mouseleave', () => {
					this.j.e.fire('hideTooltip');
				});
		}
	}

	constructor(
		jodit: T,
		readonly control: IControlTypeStrong,
		readonly target: Nullable<HTMLElement> = null
	) {
		super(jodit);

		// Prevent lost focus
		jodit.e.on([this.button, this.trigger], 'mousedown', (e: MouseEvent) =>
			e.preventDefault()
		);

		this.onAction(this.onClick);

		this.hookStatus(STATUSES.ready, () => {
			this.initFromControl();
			this.initTooltip();

			this.update();
		});
	}

	/**
	 * Init constant data from control
	 */
	private initFromControl(): void {
		const { control: ctr, state } = this;

		this.updateSize();

		state.name = ctr.name;

		const { textIcons } = this.j.o;

		if (
			textIcons === true ||
			(isFunction(textIcons) && textIcons(ctr.name)) ||
			ctr.template
		) {
			state.icon = UIButtonState().icon;
			state.text = ctr.text || ctr.name;
		} else {
			if (ctr.iconURL) {
				state.icon.iconURL = ctr.iconURL;
			} else {
				const name = ctr.icon || ctr.name;
				state.icon.name =
					Icon.exists(name) || this.j.o.extraIcons?.[name]
						? name
						: '';
			}

			if (!ctr.iconURL && !state.icon.name) {
				state.text = ctr.text || ctr.name;
			}
		}

		if (ctr.tooltip) {
			state.tooltip = this.j.i18n(
				isFunction(ctr.tooltip)
					? ctr.tooltip(this.j, ctr, this)
					: ctr.tooltip
			);
		}

		state.hasTrigger = Boolean(ctr.list || (ctr.popup && ctr.exec));
	}

	/**
	 * Click on trigger button
	 */
	protected onTriggerClick(e: MouseEvent): void {
		const { control: ctr } = this;

		e.buffer = {
			actionTrigger: this
		};

		if (ctr.list) {
			return this.openControlList(ctr as IControlTypeStrongList);
		}

		if (isFunction(ctr.popup)) {
			const popup = new Popup(this.j);
			popup.parentElement = this;

			if (
				this.j.e.fire(
					camelCase(`before-${ctr.name}-open-popup`),
					this.target,
					ctr,
					popup
				) !== false
			) {
				const target =
					this.toolbar?.getTarget(this) ?? this.target ?? null;

				const elm = ctr.popup(this.j, target, ctr, popup.close, this);

				if (elm) {
					popup
						.setContent(
							isString(elm) ? this.j.c.fromHTML(elm) : elm
						)
						.open(() => position(this.container));
				}
			}

			/**
			 * Fired after popup was opened for some control button
			 */

			/**
			 * Close all opened popups
			 */
			this.j.e.fire(
				camelCase(`after-${ctr.name}-open-popup`),
				popup.container
			);
		}
	}

	/**
	 * Create and open popup list
	 */
	private openControlList(control: IControlTypeStrongList): void {
		const controls: Controls = this.jodit.options.controls ?? {},
			getControl = (key: string): IControlType | void =>
				findControlType(key, controls);

		const list = control.list,
			menu = new Popup(this.j),
			toolbar = makeCollection(this.j);

		menu.parentElement = this;
		toolbar.parentElement = menu;

		toolbar.mode = 'vertical';

		const getButton = (
			key: string,
			value: string | number | object
		): IControlTypeStrong => {
			if (isString(value) && getControl(value)) {
				return {
					name: value.toString(),
					...getControl(value)
				};
			}

			if (isString(key) && getControl(key)) {
				return {
					name: key.toString(),
					...getControl(key),
					...(typeof value === 'object' ? value : {})
				};
			}

			const childControl: IControlTypeStrong = {
				name: key.toString(),
				template: control.childTemplate,
				exec: control.exec,
				data: control.data,
				command: control.command,
				isActive: control.isChildActive,
				isDisabled: control.isChildDisabled,
				mode: control.mode,
				args: [...(control.args ? control.args : []), key, value]
			};

			if (isString(value)) {
				childControl.text = value;
			}

			return childControl;
		};

		toolbar.build(
			isArray(list)
				? list.map(getButton)
				: keys(list, false).map(key => getButton(key, list[key])),
			this.target
		);

		menu.setContent(toolbar.container).open(() => position(this.container));

		this.state.activated = true;

		this.j.e.on(menu, 'afterClose', () => {
			this.state.activated = false;
		});
	}

	/**
	 * Click handler
	 */
	protected onClick(originalEvent: MouseEvent): void {
		const { control: ctr } = this;

		if (isFunction(ctr.exec)) {
			const target = this.toolbar?.getTarget(this) ?? this.target ?? null;

			const result = ctr.exec(this.j, target, {
				control: ctr,
				originalEvent,
				button: this
			});

			// For memorise exec
			if (result !== false && result !== true) {
				this.j?.e?.fire('synchro');

				if (this.parentElement) {
					this.parentElement.update();
				}

				/**
				 * Fired after calling `button.exec` function
				 */
				this.j?.e?.fire('closeAllPopups afterExec');
			}

			if (result !== false) {
				return;
			}
		}

		if (ctr.list) {
			return this.openControlList(ctr as IControlTypeStrongList);
		}

		if (isFunction(ctr.popup)) {
			return this.onTriggerClick(originalEvent);
		}

		if (ctr.command || ctr.name) {
			call(
				isJoditObject(this.j)
					? this.j.execCommand.bind(this.j)
					: this.j.od.execCommand.bind(this.j.od),
				ctr.command || ctr.name,
				false,
				ctr.args && ctr.args[0]
			);

			this.j.e.fire('closeAllPopups');
		}
	}
}
