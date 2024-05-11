/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/toolbar/button/README.md]]
 * @packageDocumentation
 * @module modules/toolbar/button
 */

import type {
	Controls,
	IControlListItem,
	IControlType,
	IControlTypeStrong,
	IControlTypeStrongList,
	IPopup,
	IToolbarButton,
	IToolbarCollection,
	IViewBased,
	Nullable
} from 'jodit/types';
import { STATUSES } from 'jodit/core/component/statuses';
import { autobind, cacheHTML, component, watch } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom';
import {
	assert,
	attr,
	call,
	camelCase,
	isArray,
	isFunction,
	isJoditObject,
	isPlainObject,
	isString,
	keys,
	position
} from 'jodit/core/helpers';
import { UIButton, UIButtonState } from 'jodit/core/ui/button';
import { findControlType } from 'jodit/core/ui/helpers/get-control-type';
import { Icon } from 'jodit/core/ui/icon';
import { Popup } from 'jodit/core/ui/popup/popup';
import { ToolbarCollection } from 'jodit/modules/toolbar/collection/collection';
import { makeCollection } from 'jodit/modules/toolbar/factory';

import './button.less';

@component
export class ToolbarButton<T extends IViewBased = IViewBased>
	extends UIButton
	implements IToolbarButton
{
	/** @override */
	override className(): string {
		return 'ToolbarButton';
	}

	override readonly state = {
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
		return this.closest(ToolbarCollection) as Nullable<IToolbarCollection>;
	}

	/** @override **/
	override update(): void {
		const { control, state } = this,
			tc = this.closest<ToolbarCollection>(ToolbarCollection);

		if (!tc) {
			return;
		}

		const value = control.value?.(tc.jodit, this);
		if (value !== undefined) {
			state.value = value;
		}

		state.disabled = this.__calculateDisabledStatus(tc);
		state.activated = this.__calculateActivatedStatus(tc);

		control.update?.(tc.jodit, this);
	}

	/**
	 * Calculates whether the button is active
	 */
	private __calculateActivatedStatus(tc?: ToolbarCollection): boolean {
		if (isJoditObject(this.j) && !this.j.editorIsActive) {
			return false;
		}

		if (this.control.isActive?.(this.j, this)) {
			return true;
		}

		return Boolean(tc && tc.shouldBeActive(this));
	}

	/**
	 * Calculates whether an element is blocked for the user
	 */
	private __calculateDisabledStatus(tc?: ToolbarCollection): boolean {
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

		if (this.control.isDisabled?.(this.j, this)) {
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
	protected override onChangeTabIndex(): void {
		attr(this.button, 'tabindex', this.state.tabIndex);
	}

	@cacheHTML
	protected override createContainer(): HTMLElement {
		const cn = this.componentName;
		const container = this.j.c.span(cn);
		const button = super.createContainer();

		attr(container, 'role', 'listitem');

		button.classList.remove(cn);
		button.classList.add(cn + '__button');

		Object.defineProperty(button, 'component', {
			value: this
		});

		container.appendChild(button);

		const trigger = this.j.c.fromHTML(
			`<span role="trigger" class="${cn}__trigger">${Icon.get(
				'chevron'
			)}</span>`
		);

		// For caching
		button.appendChild(trigger);

		return container;
	}

	/** @override */
	override focus(): void {
		this.container.querySelector('button')?.focus();
	}

	@watch('state.hasTrigger', { immediately: false })
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
		const disabled = this.state.disabled ? 'disabled' : null;

		attr(this.trigger, 'disabled', disabled);
		attr(this.button, 'disabled', disabled);
		attr(this.container, 'disabled', disabled);
	}

	constructor(
		jodit: T,
		readonly control: IControlTypeStrong,
		readonly target: Nullable<HTMLElement> = null
	) {
		super(jodit);

		const button = this.getElm('button');
		assert(button, 'Element button should exists');
		this.button = button;

		Object.defineProperty(button, 'component', {
			value: this,
			configurable: true
		});

		const trigger = this.getElm('trigger');
		assert(trigger, 'Element trigger should exists');
		this.trigger = trigger;
		trigger.remove();

		// Prevent lost focus
		jodit.e.on([this.button, this.trigger], 'mousedown', (e: MouseEvent) =>
			e.preventDefault()
		);

		this.onAction(this.onClick);

		this.hookStatus(STATUSES.ready, () => {
			this.__initFromControl();
			this.update();
		});

		if (control.mods) {
			Object.keys(control.mods).forEach(mod => {
				control.mods && this.setMod(mod, control.mods[mod]);
			});
		}
	}

	/**
	 * Init constant data from control
	 */
	protected __initFromControl(): void {
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
	@watch('trigger:click')
	protected onTriggerClick(e: MouseEvent): void {
		if (this.openedPopup) {
			this.__closePopup();
			return;
		}
		const { control: ctr } = this;

		e.buffer = {
			actionTrigger: this
		};

		if (ctr.list) {
			return this.__openControlList(ctr as IControlTypeStrongList);
		}

		if (isFunction(ctr.popup)) {
			const popup = this.openPopup();
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

				const elm = ctr.popup(this.j, target, this.__closePopup, this);

				if (elm) {
					popup
						.setContent(
							isString(elm) ? this.j.c.fromHTML(elm) : elm
						)
						.open(
							() => position(this.container),
							false,
							this.j.o.allowTabNavigation
								? this.container
								: undefined
						);
				}
			}

			/**
			 * Fired after the popup was opened for some control button
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

	private openedPopup: Nullable<IPopup> = null;

	/**
	 * Create an open popup list
	 */
	private __openControlList(control: IControlTypeStrongList): void {
		const controls: Controls = this.jodit.options.controls ?? {},
			getControl = (key: string): IControlTypeStrong | void =>
				findControlType(key, controls);

		const list = control.list,
			menu = this.openPopup(),
			toolbar = makeCollection(this.j);

		menu.parentElement = this;
		toolbar.parentElement = menu;

		toolbar.mode = 'vertical';

		const isListItem = (
			key: number | string | IControlListItem | IControlType
		): key is IControlListItem =>
			isPlainObject(key) && 'title' in key && 'value' in key;

		const getButton = (
			key: number | string | IControlListItem | IControlType,
			value?: string | number | object
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

			if (isListItem(key)) {
				value = key.value;
				key = key.title;
			}

			const { childTemplate } = control;
			const childControl: IControlTypeStrong = {
				name: key.toString(),
				template:
					childTemplate &&
					((j, k, v): string => childTemplate(j, k, v, this)),
				exec: control.childExec
					? (view, current, options): unknown =>
							control.childExec?.(view, current, {
								...options,
								parentControl: control
							})
					: control.exec,
				data: control.data,
				command: control.command,
				isActive: control.isChildActive,
				value: control.value,
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

		menu.setContent(toolbar).open(
			() => position(this.container),
			false,
			this.j.o.allowTabNavigation ? this.container : undefined
		);

		this.state.activated = true;
	}

	@autobind
	protected onOutsideClick(e: MouseEvent): void {
		if (!this.openedPopup) {
			return;
		}

		if (
			!e ||
			!Dom.isNode(e.target) ||
			(!Dom.isOrContains(this.container, e.target) &&
				!this.openedPopup.isOwnClick(e))
		) {
			this.__closePopup();
		}
	}

	private openPopup(): IPopup {
		this.__closePopup();
		this.openedPopup = new Popup(this.j, false);
		this.j.e
			.on(this.ow, 'mousedown touchstart', this.onOutsideClick)
			.on('escape closeAllPopups', this.onOutsideClick);
		return this.openedPopup;
	}

	@autobind
	private __closePopup(): void {
		if (this.openedPopup) {
			this.j.e
				.off(this.ow, 'mousedown touchstart', this.onOutsideClick)
				.off('escape closeAllPopups', this.onOutsideClick);

			this.state.activated = false;
			this.openedPopup.close();
			this.openedPopup.destruct();
			this.openedPopup = null;
		}
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
			return this.__openControlList(ctr as IControlTypeStrongList);
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

	override destruct(): any {
		this.__closePopup();
		return super.destruct();
	}
}
