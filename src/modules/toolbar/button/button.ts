import './button.less';

import {
	IControlTypeStrong,
	IToolbarButton,
	IViewBased,
	Nullable
} from '../../../types';
import { UIButton, UIButtonState } from '../../../core/ui/button';
import { watch } from '../../../core/decorators';
import { Dom } from '../../../core/dom';
import { PopupMenu } from '../../popup/';
import { makeCollection } from '../factory';
import {
	isFunction,
	isString,
	position,
	camelCase,
	attr,
	isJoditObject,
	call
} from '../../../core/helpers/';
import { Icon, ToolbarCollection } from '../..';
import { STATUSES } from '../../../core/component';

export class ToolbarButton<T extends IViewBased = IViewBased> extends UIButton
	implements IToolbarButton {
	state = {
		...UIButtonState(),
		hasTrigger: false
	};

	trigger!: HTMLElement;

	/**
	 * Button element
	 */
	get button(): HTMLElement {
		return this.container.querySelector(
			`button.${this.componentName}__button`
		) as HTMLElement;
	}

	/** @override **/
	update(): void {
		const { control, parentElement, state } = this;

		if (parentElement instanceof ToolbarCollection) {
			state.disabled = Boolean(parentElement.shouldBeDisabled(this));
			state.activated = Boolean(parentElement.shouldBeActive(this));
		}

		if (this.jodit.options.textIcons) {
			state.icon = UIButtonState().icon;
			state.text = control.name;
		} else {
			if (control.iconURL) {
				state.icon.iconURL = control.iconURL;
			} else {
				const name = control.icon || control.name;
				state.icon.name = Icon.exists(name) ? name : '';
			}

			if (!control.iconURL && !state.icon.name) {
				state.text = control.name;
			}
		}

		if (control.tooltip) {
			state.tooltip = this.jodit.i18n(control.tooltip);
		}

		state.hasTrigger = Boolean(control.list || control.popup);

		state.size =
			this.jodit.options.toolbarButtonSize || UIButtonState().size;

		if (isFunction(control.update)) {
			control.update(this);
		}

		super.update();
	}

	/** @override */
	protected onChangeText(): void {
		if (isFunction(this.control.template)) {
			this.text.innerHTML = this.control.template(
				this.jodit,
				this.control.name,
				this.state.text
			);
		} else {
			super.onChangeText();
		}
	}

	/** @override */
	protected createContainer(): HTMLElement {
		const cn = this.componentName;
		const container = this.jodit.create.span(cn),
			button = super.createContainer();

		button.classList.remove(cn);
		button.classList.add(cn + '__button');

		container.appendChild(button);

		this.trigger = this.jodit.create.fromHTML(
			`<span class="${cn}__trigger">${Icon.get('chevron')}</span>`
		);

		this.jodit.events.on(
			this.trigger,
			`click`,
			this.onTriggerClick.bind(this)
		);

		return container;
	}

	/** @override */
	focus() {
		this.container.querySelector('button')?.focus();
	}

	@watch('state.hasTrigger')
	protected onChangeHasTrigger() {
		if (this.state.hasTrigger) {
			this.container.appendChild(this.trigger);
		} else {
			Dom.safeRemove(this.trigger);
		}

		this.container.classList.toggle(
			this.componentName + '_with-trigger',
			this.state.hasTrigger
		);
	}

	/** @override */
	protected onChangeDisabled(): void {
		const dsb = this.state.disabled ? 'disabled' : null;

		attr(this.trigger, 'disabled', dsb);
		attr(this.button, 'disabled', dsb);
		attr(this.container, 'disabled', dsb);
	}

	constructor(
		jodit: IViewBased,
		readonly control: IControlTypeStrong,
		readonly target: Nullable<HTMLElement> = null
	) {
		super(jodit);

		this.container.classList.add(
			`${this.componentName}_${this.clearName(control.name)}`
		);

		// Prevent lost focus
		this.jodit.events.on(this.button, 'mousedown', (e: MouseEvent) =>
			e.preventDefault()
		);

		this.onAction(this.onClick);

		this.setStatus(STATUSES.ready);
	}

	/**
	 * Click on trigger button
	 */
	protected onTriggerClick() {
		const { control } = this;

		if (control.list) {
			const list = control.list,
				menu = new PopupMenu(this.jodit),
				toolbar = makeCollection(this.jodit);

			const getButton = (key: string, value: string | number) => ({
				name: key.toString(),
				template: control.template,
				exec: control.exec,
				command: control.command,
				isActive: control.isActiveChild,
				isDisabled: control.isChildDisabled,
				mode: control.mode,
				args: [...[control.args || []], key, value]
			});

			toolbar.build(
				Array.isArray(list)
					? list.map(getButton)
					: Object.keys(list).map(getButton)
			);

			menu.open(toolbar.container, () => position(this.container));

			this.state.activated = true;

			this.jodit.events.on(menu, 'afterClose', () => {
				this.state.activated = false;
			});

			return;
		}

		if (isFunction(control.popup)) {
			const popup = new PopupMenu(this.jodit);

			if (
				this.jodit.events.fire(
					camelCase(`before-${control.name}-open-popup`),
					this.target,
					control,
					popup
				) !== false
			) {
				const popupElm = control.popup(
					this.jodit,
					this.target || false,
					control,
					popup.close,
					this
				);

				if (popupElm) {
					popup.open(
						isString(popupElm)
							? this.jodit.create.fromHTML(popupElm)
							: popupElm,
						() => position(this.container)
					);
				}
			}

			/**
			 * Fired after popup was opened for some control button
			 * @event after{CONTROLNAME}OpenPopup
			 */

			/**
			 * Close all opened popups
			 *
			 * @event closeAllPopups
			 */
			this.jodit.events.fire(
				camelCase(`after-${control.name}-open-popup`),
				popup.container
			);
		}
	}

	/**
	 * Click handler
	 * @param originalEvent
	 */
	protected onClick(originalEvent: MouseEvent) {
		const { control } = this;

		if (isFunction(control.exec)) {
			control.exec(
				this.jodit,
				this.target || false,
				control,
				originalEvent,
				this.container as HTMLLIElement
			);

			this.jodit?.events.fire('synchro');

			if (this.parentElement) {
				this.parentElement.update();
			}

			/**
			 * Fired after calling `button.exec` function
			 * @event afterExec
			 */
			this.jodit?.events.fire('closeAllPopups afterExec');

			return;
		}

		if (control.command || control.name) {
			call(
				isJoditObject(this.jodit)
					? this.jodit.execCommand.bind(this.jodit)
					: this.jodit.ownerDocument.execCommand.bind(
							this.jodit.ownerDocument
					  ),
				control.command || control.name,
				(control.args && control.args[0]) || false,
				(control.args && control.args[1]) || null
			);

			this.jodit.events.fire('closeAllPopups');
		}
	}
}
