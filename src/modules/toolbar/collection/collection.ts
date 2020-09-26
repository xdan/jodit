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

import { isFunction, isJoditObject } from '../../../core/helpers/';

import { UIList } from '../../../core/ui';
import { makeButton } from '../factory';
import { STATUSES } from '../../../core/component';

export class ToolbarCollection<T extends IViewBased = IViewBased>
	extends UIList<T>
	implements IToolbarCollection {
	jodit!: T;

	readonly listenEvents =
		'updateToolbar changeStack mousedown mouseup keydown change afterInit readonly afterResize ' +
		'selectionchange changeSelection focus afterSetMode touchstart focus blur';

	/**
	 * First button in list
	 */
	get firstButton(): Nullable<IToolbarButton> {
		const [button] = this.buttons as IToolbarButton[];
		return button || null;
	}

	protected makeButton(
		control: IControlTypeStrong,
		target: Nullable<HTMLElement> = null
	): IUIButton {
		return makeButton(this.j, control, target);
	}

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
				!this.j.o.activeButtonsInReadOnly.includes(button.control.name))
		) {
			return true;
		}

		let isDisabled: boolean | void;

		if (isFunction(button.control.isDisabled)) {
			isDisabled = button.control.isDisabled(
				this.j,
				button.control,
				button
			);
		}

		return isDisabled;
	}

	/**
	 * Returns current target for button
	 */
	getTarget(button: IToolbarButton): Node | null {
		return button.target || null;
	}

	@autobind
	immediateUpdate(): void {
		if (this.isDestructed || this.j.isLocked) {
			return;
		}

		super.update();

		this.j.e.fire('afterUpdateToolbar');
	}

	update = this.j.async.debounce(
		this.immediateUpdate,
		() => this.j.defaultTimeout
	);

	/**
	 * Set direction
	 * @param direction
	 */
	setDirection(direction: 'rtl' | 'ltr'): void {
		this.container.style.direction = direction;
		this.container.setAttribute('dir', direction);
	}

	constructor(jodit: IViewBased) {
		super(jodit as T);
		this.initEvents();
		this.setStatus(STATUSES.ready);
	}

	private initEvents() {
		this.j.e
			// .on(this.j.ow, 'mousedown touchend', this.closeAllPopups)
			.on(this.listenEvents, this.update)
			.on('afterSetMode focus', this.immediateUpdate);
	}

	/** @override **/
	destruct(): void {
		if (this.isDestructed) {
			return;
		}

		this.j.e
			.off(this.listenEvents, this.update)
			.off('afterSetMode focus', this.immediateUpdate);

		super.destruct();
	}
}
