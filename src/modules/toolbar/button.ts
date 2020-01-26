/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	IControlTypeStrong,
	IToolbarButton,
	IToolbarCollection
} from '../../types/toolbar';
import { Dom } from '../Dom';
import { asArray, camelCase } from '../helpers/';
import { ToolbarElement } from './element';
import { PopupList } from '../popup/list';
import { Popup } from '../popup/popup';
import { IViewBased } from '../../types';
import { isJoditObject } from '../helpers/checker/isJoditObject';
import { KEY_ENTER } from '../../constants';
import { ToolbarIcon } from './icon';

export class ToolbarButton extends ToolbarElement implements IToolbarButton {
	set disable(disable: boolean) {
		this.__disabled = disable;
		this.container.classList.toggle('jodit_disabled', disable);

		if (!disable) {
			if (this.container.hasAttribute('disabled')) {
				this.container.removeAttribute('disabled');
			}
		} else {
			if (!this.container.hasAttribute('disabled')) {
				this.container.setAttribute('disabled', 'disabled');
			}
		}
	}

	get disable(): boolean {
		return this.__disabled;
	}

	set active(enable: boolean) {
		this.__actived = enable;
		this.container.classList.toggle('jodit_active', enable);
	}

	get active(): boolean {
		return this.__actived;
	}

	private __disabled: boolean = false;

	private __actived: boolean = false;

	readonly control: IControlTypeStrong;
	readonly target: HTMLElement | undefined;

	textBox: HTMLSpanElement;
	anchor: HTMLAnchorElement;

	/**
	 * Button cannot be pressed
	 */
	isDisable(): boolean {
		return Boolean(
			this.parentToolbar && this.parentToolbar.buttonIsDisabled(this)
		);
	}

	/**
	 * Button is in active state (pressed)
	 */
	isActive(): boolean {
		return Boolean(
			this.parentToolbar && this.parentToolbar.buttonIsActive(this)
		);
	}

	private onMouseDown = (
		originalEvent: MouseEvent | KeyboardEvent
	): false | void => {
		if (
			originalEvent.type === 'keydown' &&
			originalEvent.which !== KEY_ENTER
		) {
			return;
		}

		originalEvent.stopImmediatePropagation();
		originalEvent.preventDefault();

		if (this.disable) {
			return false;
		}

		const control: IControlTypeStrong = this.control,
			getTarget = (): Node | false =>
				(this.parentToolbar && this.parentToolbar.getTarget(this)) ||
				this.target ||
				false;

		if (control.list) {
			const list = new PopupList(this.jodit, this.container, this.target);

			list.open(control);

			this.jodit.events.fire('closeAllPopups', list.container);

			this.anchor.setAttribute('aria-expanded', 'true');

			this.jodit.events.on(list, 'afterClose', () => {
				this.anchor.setAttribute('aria-expanded', 'false');
			});
		} else if (
			control.exec !== undefined &&
			typeof control.exec === 'function'
		) {
			control.exec(this.jodit, getTarget(), control, originalEvent, this
				.container as HTMLLIElement);

			this.jodit?.events.fire('synchro');

			if (this.parentToolbar) {
				this.parentToolbar.immediateCheckActiveButtons();
			}

			/**
			 * Fired after calling `button.exec` function
			 * @event afterExec
			 */
			this.jodit?.events.fire('closeAllPopups afterExec');
		} else if (
			control.popup !== undefined &&
			typeof control.popup === 'function'
		) {
			const popup: Popup = new Popup(
				this.jodit,
				this.container,
				this.target
			);

			if (
				this.jodit.events.fire(
					camelCase(`before-${control.name}-OpenPopup`),
					getTarget(),
					control,
					popup
				) !== false
			) {
				const popupElm = control.popup(
					this.jodit,
					getTarget(),
					control,
					popup.close,
					this
				);

				if (popupElm) {
					popup.open(popupElm);
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
				camelCase(`after-${control.name}-OpenPopup`) +
					' closeAllPopups',
				popup.container
			);
		} else {
			if (control.command || control.name) {
				if (isJoditObject(this.jodit)) {
					this.jodit.execCommand(
						control.command || control.name,
						(control.args && control.args[0]) || false,
						(control.args && control.args[1]) || null
					);
				} else {
					this.jodit.ownerDocument.execCommand(
						control.command || control.name,
						(control.args && control.args[0]) || false,
						(control.args && control.args[1]) || null
					);
				}

				this.jodit.events.fire('closeAllPopups');
			}
		}
	};

	/**
	 * Title text
	 */
	get tooltipText(): string {
		if (!this.control.tooltip) {
			return '';
		}

		return (
			this.jodit.i18n(this.control.tooltip) +
			(this.control.hotkeys
				? '<br>' + asArray(this.control.hotkeys).join(' ')
				: '')
		);
	}

	/**
	 * Focus on the button
	 */
	focus() {
		this.anchor.focus();
	}

	constructor(
		parentToolbarOrView: IToolbarCollection | IViewBased,
		control: IControlTypeStrong,
		target?: HTMLElement
	) {
		super(parentToolbarOrView);

		this.control = control;
		this.target = target;

		this.anchor = this.jodit.create.element('a', {
			role: 'button',
			href: 'javascript:void(0)'
		});

		let tabIndex = '-1';
		if (this.jodit.options.allowTabNavigation) {
			tabIndex = '0';
		}

		this.anchor.setAttribute('tabindex', tabIndex);

		this.container.appendChild(this.anchor);

		if (this.jodit.options.showTooltip && control.tooltip) {
			if (!this.jodit.options.useNativeTooltip) {
				const to =
					this.jodit.options.showTooltipDelay ||
					this.jodit.defaultTimeout;

				let timeout: number = 0;

				this.jodit.events
					.on(this.anchor, 'mouseenter', () => {
						timeout = this.jodit.async.setTimeout(
							() =>
								!this.isDisable() &&
								this.jodit?.events.fire(
									'showTooltip',
									this.anchor,
									this.tooltipText
								),
							{
								timeout: to,
								label: 'tooltip'
							}
						);
					})
					.on(this.anchor, 'mouseleave', () => {
						this.jodit.async.clearTimeout(timeout);
						this.jodit.events.fire('hideTooltip');
					});
			} else {
				this.anchor.setAttribute('title', this.tooltipText);
			}

			this.anchor.setAttribute('aria-label', this.tooltipText);
		}

		this.textBox = this.jodit.create.span();
		this.anchor.appendChild(this.textBox);

		const clearName: string = control.name.replace(/[^a-zA-Z0-9]/g, '_');

		if (control.getContent && typeof control.getContent === 'function') {
			Dom.detach(this.container);
			const content = control.getContent(this.jodit, control, this);
			this.container.appendChild(
				typeof content === 'string'
					? this.jodit.create.fromHTML(content)
					: content
			);
		} else {
			if (control.list && this.anchor) {
				const trigger = this.jodit.create.fromHTML(
					ToolbarIcon.getIcon('dropdown-arrow')
				);
				trigger.classList.add('jodit_with_dropdownlist-trigger');

				this.container.classList.add('jodit_with_dropdownlist');
				this.anchor.appendChild(trigger);
			}

			this.textBox.appendChild(this.createIcon(clearName, control));
		}

		this.container.classList.add('jodit_toolbar_btn-' + clearName);

		if (this.jodit.options.direction) {
			const direction = this.jodit.options.direction.toLowerCase();

			this.container.style.direction =
				direction === 'rtl' ? 'rtl' : 'ltr';
		}

		if (control.isInput) {
			this.container.classList.add('jodit_toolbar-input');
		} else {
			/**
			 * You can emulate click on some button
			 *
			 * @event click-%buttonName%-btn
			 * @example
			 * ```javascript
			 * var editor = new Jodit('#editor');
			 * editor.events.fire('click-image-btn'); // will open Image popup
			 * ```
			 */

			this.jodit.events
				.on(
					this.container,
					'mousedown touchend keydown',
					this.onMouseDown
				)
				.on(`click-${clearName}-btn`, this.onMouseDown);
		}
	}

	destruct() {
		if (this.isDestructed) {
			return;
		}

		this.jodit &&
			this.jodit.events &&
			this.jodit.events.off(this.anchor) &&
			this.jodit.events.off(this.container);

		super.destruct();
	}
}
