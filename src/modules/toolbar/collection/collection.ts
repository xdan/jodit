/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import "./collection.less";

import {
	IDictionary,
	IToolbarButton,
	IToolbarCollection,
	IToolbarElement,
	Nullable
} from '../../../types';

import {
	Buttons,
	Controls,
	IControlType,
	IControlTypeStrong
} from '../../../types/toolbar';

import { IViewBased } from '../../../types/view';
import { ToolbarBreak } from '../break';
import { ToolbarSeparator } from '../separator';
import { Dom } from '../../dom';
import { Component } from '../../component';
import { Config } from '../../../config';
import { isFunction, isJoditObject, isToolbarButtonObject } from '../../../core/helpers/checker';
import { makeButton } from '../factory';

export class ToolbarCollection<T extends IViewBased = IViewBased>
	extends Component<T>
	implements IToolbarCollection {
	readonly listenEvents =
		'changeStack mousedown mouseup keydown change afterInit readonly afterResize ' +
		'selectionchange changeSelection focus afterSetMode touchstart focus blur';

	/**
	 * Helper for getting full plain button list
	 */
	getButtonsList(): string[] {
		return this.__elements
			.map(a => (isToolbarButtonObject(a) ? a.control.name : ''))
			.filter(a => a !== '');
	}

	private __elements: IToolbarElement[] = [];

	private __parentContainer!: HTMLElement;

	/**
	 * First button in list
	 */
	get firstButton(): Nullable<IToolbarButton> {
		const button = this.__elements.find(
			isToolbarButtonObject
		) as IToolbarButton;
		return button || null;
	}

	/**
	 * Returns parent container
	 */
	getParentContainer(): HTMLElement {
		return this.__parentContainer;
	}

	appendChild(elements: IToolbarElement) {
		this.__elements.push(elements);
		elements.setParentToolbar(this);
	}

	removeChild(element: IToolbarElement) {
		const index = this.__elements.indexOf(element);

		if (index !== -1) {
			this.__elements.splice(index, 1);
			element.setParentToolbar(null);
		}
	}

	build(
		buttons: Buttons,
		parentContainer: HTMLElement,
		target?: HTMLElement
	) {
		this.applyContainerOptions();

		this.jodit.events.off('rebuildToolbar');
		this.jodit.events.on('afterInit rebuildToolbar', () =>
			this.build(buttons, parentContainer, target)
		);

		this.__parentContainer = parentContainer;

		let lastBtnSeparator: boolean = false;
		this.clear();

		buttons
			.map(this.getControlType.bind(this))
			.forEach((buttonControl: IControlTypeStrong) => {
				let button: IToolbarElement | null = null;

				if (
					this.jodit.options.removeButtons.indexOf(
						buttonControl.name
					) !== -1
				) {
					return;
				}

				switch (buttonControl.name) {
					case '\n':
						button = new ToolbarBreak(this.jodit);
						break;
					case '|':
						if (!lastBtnSeparator) {
							lastBtnSeparator = true;
							button = new ToolbarSeparator(this.jodit);
						}
						break;
					default:
						lastBtnSeparator = false;
						button = makeButton(this.jodit, buttonControl);
				}

				if (button) {
					this.appendChild(button);
				}
			});

		if (this.container.parentNode !== parentContainer) {
			parentContainer.appendChild(this.container);
		}

		this.immediateUpdate();
	}

	private applyContainerOptions() {
		this.container.classList.add(
			'jodit_' + (this.jodit.options.theme || 'default') + '_theme'
		);

		this.jodit.container.classList.toggle(
			'jodit_text_icons',
			this.jodit.options.textIcons
		);

		this.container.classList.toggle(
			'jodit_text_icons',
			this.jodit.options.textIcons
		);

		if (this.jodit.options.zIndex) {
			this.container.style.zIndex = parseInt(
				this.jodit.options.zIndex.toString(),
				10
			).toString();
		}

		const bs = (
			this.jodit.options.toolbarButtonSize || 'middle'
		).toLowerCase();

		this.container.classList.add(
			'jodit_toolbar_size-' +
				(['middle', 'large', 'small'].indexOf(bs) !== -1
					? bs
					: 'middle')
		);
	}

	private getControlType(button: IControlType | string): IControlTypeStrong {
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
	}

	/**
	 * Button should be active
	 */
	shouldBeActive(button: IToolbarButton): boolean {
		if (isJoditObject(this.jodit) && !this.jodit.editorIsActive) {
			return false;
		}

		if (isFunction(button.control.isActive)) {
			return button.control.isActive(this.jodit, button.control, button);
		}

		return false;
	}

	/**
	 * Button should be disabled
	 */
	shouldBeDisabled(button: IToolbarButton): boolean {
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

		let isDisabled: boolean = false;

		if (isFunction(button.control.isDisabled)) {
			isDisabled = button.control.isDisabled(
				this.jodit,
				button.control,
				button
			);
		}

		return isDisabled;
	}

	clear() {
		[...this.__elements].forEach(element => {
			this.removeChild(element);
			element.destruct();
		});

		this.__elements.length = 0;
	}

	immediateUpdate = () => {
		if (this.isDestructed || this.jodit.isLocked()) {
			return;
		}

		(this.__elements.filter(
			isToolbarButtonObject
		) as IToolbarButton[]).forEach(button => button.update());

		this.jodit.events && this.jodit.events.fire('updateToolbar');
	};

	update = this.jodit.async.debounce(
		this.immediateUpdate,
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

		this.container = this.jodit.create.element('div');
		this.container.classList.add('jodit-toolbar__collection');

		this.initEvents();
	}

	private initEvents = () => {
		this.jodit.events
			.on(this.jodit.ownerWindow, 'mousedown touchend', this.closeAll)
			.on(this.listenEvents, this.update)
			.on('afterSetMode focus', this.immediateUpdate);
	};

	private closeAll = () => {
		this.jodit &&
			this.jodit.events &&
			this.jodit.events.fire('closeAllPopups');
	};

	/** @override **/
	destruct() {
		if (this.isDestructed) {
			return;
		}

		this.jodit.events
			.off(this.jodit.ownerWindow, 'mousedown touchstart', this.closeAll)
			.off(this.listenEvents, this.update)
			.off('afterSetMode focus', this.immediateUpdate);

		this.clear();

		Dom.safeRemove(this.container);
		delete this.container;
		super.destruct();
	}
}
