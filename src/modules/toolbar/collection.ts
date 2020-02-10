/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDictionary, IToolbarCollection } from '../../types';
import {
	Buttons,
	Controls,
	IControlType,
	IControlTypeStrong
} from '../../types/toolbar';

import { IViewBased } from '../../types/view';
import { ToolbarBreak } from './break';
import { ToolbarButton } from './button';
import { ToolbarElement } from './element';
import { ToolbarSeparator } from './separator';
import { Dom } from '../Dom';
import { Component } from '../Component';
import { Config } from '../../Config';
import { isJoditObject } from '../helpers/checker/isJoditObject';

export class ToolbarCollection<T extends IViewBased = IViewBased>
	extends Component<T>
	implements IToolbarCollection {
	private __buttons: ToolbarElement[] = [];

	private __getControlType = (
		button: IControlType | string
	): IControlTypeStrong => {
		let buttonControl: IControlTypeStrong;
		const controls: Controls =
			this.jodit.options.controls || Config.defaultOptions.controls;

		if (typeof button !== 'string') {
			buttonControl = { name: 'empty', ...button };
			if (controls[buttonControl.name] !== undefined) {
				buttonControl = <IControlTypeStrong>{
					...controls[buttonControl.name],
					...buttonControl
				};
			}
		} else {
			const list = button.split(/\./);

			let store: IDictionary<IControlType> = controls;

			if (list.length > 1) {
				if (controls[list[0]] !== undefined) {
					store = controls[list[0]] as IDictionary<IControlType>;
					button = list[1];
				}
			}

			if (store[button] !== undefined) {
				buttonControl = { name: button, ...store[button] };
			} else {
				buttonControl = {
					name: button,
					command: button,
					tooltip: button
				};
			}
		}

		return buttonControl;
	};

	private closeAll = () => {
		this.jodit &&
			this.jodit.events &&
			this.jodit.events.fire('closeAllPopups');
	};

	private initEvents = () => {
		this.jodit.events
			.on(this.jodit.ownerWindow, 'mousedown touchend', this.closeAll)
			.on(this.listenEvents, this.checkActiveButtons)
			.on('afterSetMode focus', this.immediateCheckActiveButtons);
	};

	readonly listenEvents: string =
		'changeStack mousedown mouseup keydown change afterInit readonly afterResize ' +
		'selectionchange changeSelection focus afterSetMode touchstart focus blur';

	getButtonsList(): string[] {
		return this.__buttons
			.map((a: ToolbarElement) =>
				a instanceof ToolbarButton ? a.control.name : ''
			)
			.filter(a => a !== '');
	}

	private __parentContainer!: HTMLElement;

	/**
	 * Returns parent container
	 */
	getParentContainer(): HTMLElement {
		return this.__parentContainer;
	}

	appendChild(button: ToolbarElement) {
		this.__buttons.push(button);
		this.container.appendChild(button.container);
	}

	get firstButton(): ToolbarElement {
		return this.__buttons[0];
	}

	removeChild(button: ToolbarElement) {
		const index: number = this.__buttons.indexOf(button);

		if (index !== -1) {
			this.__buttons.splice(index, 1);
			if (button.container.parentNode === this.container) {
				Dom.safeRemove(button.container);
			}
		}
	}

	private applyContainerOptions() {
		this.container.classList.add(
			'jodit_' + (this.jodit.options.theme || 'default') + '_theme'
		);

		this.jodit.container.classList.toggle('jodit_text_icons', this.jodit.options.textIcons);
		this.container.classList.toggle('jodit_text_icons', this.jodit.options.textIcons);

		if (this.jodit.options.zIndex) {
			this.container.style.zIndex = parseInt(
				this.jodit.options.zIndex.toString(),
				10
			).toString();
		}

		const bs = (this.jodit.options.toolbarButtonSize || 'middle').toLowerCase();

		this.container.classList.add(
			'jodit_toolbar_size-' +
			(['middle', 'large', 'small'].indexOf(bs) !== -1
				? bs
				: 'middle')
		);
	}

	build(buttons: Buttons, parentContainer: HTMLElement, target?: HTMLElement) {
		this.applyContainerOptions();

		this.jodit.events.off('rebuildToolbar');
		this.jodit.events.on('afterInit rebuildToolbar', () => this.build(buttons, parentContainer, target));

		this.__parentContainer = parentContainer;

		let lastBtnSeparator: boolean = false;
		this.clear();

		const buttonsList: Array<IControlType | string> =
			typeof buttons === 'string' ? buttons.split(/[,\s]+/) : buttons;

		buttonsList
			.map(this.__getControlType)
			.forEach((buttonControl: IControlTypeStrong) => {
				let button: ToolbarElement | null = null;

				if (
					this.jodit.options.removeButtons.indexOf(
						buttonControl.name
					) !== -1
				) {
					return;
				}

				switch (buttonControl.name) {
					case '\n':
						button = new ToolbarBreak(this);
						break;
					case '|':
						if (!lastBtnSeparator) {
							lastBtnSeparator = true;
							button = new ToolbarSeparator(this);
						}
						break;
					default:
						lastBtnSeparator = false;
						button = new ToolbarButton(this, buttonControl, target);
				}

				if (button) {
					this.appendChild(button);
				}
			});

		if (this.container.parentNode !== parentContainer) {
			parentContainer.appendChild(this.container);
		}

		this.immediateCheckActiveButtons();
	}

	clear() {
		// in removeChild __buttons is changed
		[...this.__buttons].forEach((button: ToolbarElement) => {
			this.removeChild(button);
			button.destruct();
		});

		this.__buttons.length = 0;
	}

	immediateCheckActiveButtons = () => {
		if (this.isDestructed || this.jodit.isLocked()) {
			return;
		}

		(this.__buttons.filter(
			(button: ToolbarElement) => button instanceof ToolbarButton
		) as ToolbarButton[]).forEach((button: ToolbarButton) => {
			button.disable = button.isDisable();

			if (!button.disable) {
				button.active = button.isActive();
			}

			if (typeof button.control.getLabel === 'function') {
				button.control.getLabel(this.jodit, button.control, button);
			}
		});

		this.jodit.events && this.jodit.events.fire('updateToolbar');
	};

	/**
	 * Check if button has active state
	 * @param button
	 */
	buttonIsActive(button: ToolbarButton): boolean | void {
		if (isJoditObject(this.jodit) && !this.jodit.editorIsActive) {
			return false;
		}

		if (typeof button.control.isActive === 'function') {
			return button.control.isActive(this.jodit, button.control, button);
		}
	}

	buttonIsDisabled(button: ToolbarButton): boolean | void {
		if (this.jodit.options.disabled) {
			return true;
		}

		if (
			this.jodit.options.readonly &&
			(!this.jodit.options.activeButtonsInReadOnly ||
				this.jodit.options.activeButtonsInReadOnly.indexOf(
					button.control.name
				) === -1)
		) {
			return true;
		}

		let isDisabled: boolean | void;

		if (typeof button.control.isDisable === 'function') {
			isDisabled = button.control.isDisable(
				this.jodit,
				button.control,
				button
			);
		}

		return isDisabled;
	}

	/**
	 * Target for button element
	 *
	 * @param button
	 */
	getTarget(button: ToolbarButton): Node | void {
		return button.target;
	}

	checkActiveButtons = this.jodit.async.debounce(
		this.immediateCheckActiveButtons,
		this.jodit.defaultTimeout
	);

	container: HTMLElement;

	/**
	 * Set direction
	 * @param direction
	 */
	setDirection(direction: 'rtl' | 'ltr'): void {
		this.container.style.direction = direction;
		this.container.setAttribute('dir', direction);
	}

	constructor(jodit: IViewBased) {
		super(<T>jodit);

		this.container = this.jodit.create.element('ul');
		this.container.classList.add('jodit_toolbar');

		this.initEvents();
	}

	destruct() {
		if (this.isDestructed) {
			return;
		}

		this.jodit.events
			.off(this.jodit.ownerWindow, 'mousedown touchstart', this.closeAll)
			.off(this.listenEvents, this.checkActiveButtons)
			.off('afterSetMode focus', this.immediateCheckActiveButtons);

		this.clear();

		Dom.safeRemove(this.container);
		delete this.container;
		super.destruct();
	}
}
