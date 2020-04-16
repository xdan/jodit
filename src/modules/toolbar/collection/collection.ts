/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import autobind from 'autobind-decorator';

import './collection.less';

import {
	IToolbarButton,
	IToolbarCollection,
	IUIButton,
	Nullable,
	IControlTypeStrong,
	IViewBased
} from '../../../types/';

import {
	isFunction,
	isJoditObject,
	get,
	camelCase
} from '../../../core/helpers/';

import { UIList } from '../../../core/ui';
import { makeButton } from '../factory';
import { getContainer } from '../../../core/global';
import { PopupMenu } from '../../popup';
import { Dom } from '../../../core/dom';
import { STATUSES } from '../../../core/component';

export class ToolbarCollection<T extends IViewBased = IViewBased>
	extends UIList<T>
	implements IToolbarCollection {
	readonly listenEvents =
		'changeStack mousedown mouseup keydown change afterInit readonly afterResize ' +
		'selectionchange changeSelection focus afterSetMode touchstart focus blur';

	/**
	 * Helper for getting full plain button list
	 */
	getButtonsList(): string[] {
		return this.elements
			.map(a => get<string>('control.name', a) || '')
			.filter(a => a !== '');
	}

	/**
	 * First button in list
	 */
	get firstButton(): Nullable<IToolbarButton> {
		const button = this.elements.find(a => a.isButton) as IToolbarButton;

		return button || null;
	}

	/**
	 * Returns parent container
	 */
	getParentContainer(): Nullable<HTMLElement> {
		return this.parentElement?.container || null;
	}

	protected makeButton(
		control: IControlTypeStrong,
		target: Nullable<HTMLElement> = null
	): IUIButton {
		return makeButton(this.j, control, target);
	}

	// protected applyContainerOptions() {
	// 	this.container.classList.add(
	// 		'jodit_' + (this.j.o.theme || 'default') + '_theme'
	// 	);
	//
	// 	if (this.j.o.zIndex) {
	// 		this.container.style.zIndex = parseInt(
	// 			this.j.o.zIndex.toString(),
	// 			10
	// 		).toString();
	// 	}
	// }

	/**
	 * Button should be active
	 */
	shouldBeActive(button: IToolbarButton): boolean | void {
		if (isJoditObject(this.j) && !this.j.editorIsActive) {
			return false;
		}

		if (isFunction(button.control.isActive)) {
			return button.control.isActive(this.j, button.control, button);
		}

		return undefined;
	}

	/**
	 * Button should be disabled
	 */
	shouldBeDisabled(button: IToolbarButton): boolean | void {
		if (this.j.o.disabled) {
			return true;
		}

		if (
			this.j.o.readonly &&
			(!this.j.o.activeButtonsInReadOnly ||
				this.j.o.activeButtonsInReadOnly.includes(button.control.name))
		) {
			return true;
		}

		let isDisabled: boolean | void = undefined;

		if (isFunction(button.control.isDisabled)) {
			isDisabled = button.control.isDisabled(
				this.j,
				button.control,
				button
			);
		}

		return isDisabled;
	}

	@autobind
	immediateUpdate() {
		if (this.isDestructed || this.j.isLocked()) {
			return;
		}

		super.update();

		this.j.events && this.j.e.fire('updateToolbar');
	}

	update = this.j.async.debounce(this.immediateUpdate, this.j.defaultTimeout);

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
		this.initEvents();
		this.setStatus(STATUSES.ready);
	}

	private initEvents() {
		this.j.e
			.on(this.j.ow, 'mousedown touchend', this.closeAllPopups)
			.on(this.listenEvents, this.update)
			.on('afterSetMode focus', this.immediateUpdate);
	}

	@autobind
	private closeAllPopups(e: MouseEvent) {
		const box = getContainer(this.j, PopupMenu.name);
		if (e.target && Dom.isOrContains(box, e.target as Node)) {
			return;
		}

		this.j?.events?.fire(camelCase('close-all-popups'));
	}

	/** @override **/
	destruct() {
		if (this.isDestructed) {
			return;
		}

		this.j.e
			.off(this.j.ow, 'mousedown touchstart', this.closeAllPopups)
			.off(this.listenEvents, this.update)
			.off('afterSetMode focus', this.immediateUpdate);

		super.destruct();
	}
}
