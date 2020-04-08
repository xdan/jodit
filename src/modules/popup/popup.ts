/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright 2013-2020 Valeriy Chupurnov https://xdsoft.net
 */

import { IViewBased } from '../../types/view';
import { Dom } from '../dom';
import { css, offset } from '../../core/helpers/';
import { Component, STATUSES } from '../component';
import { IControlTypeStrong, IPopup } from '../../types';
import { fireEach } from '../../core/global';

export class Popup extends Component implements IPopup {
	private calcPosition() {
		if (!this.isOpened || this.isInDestruct) {
			return;
		}

		const popup = this.container;

		const offsetContainer = offset(
			this.jodit.container as HTMLDivElement,
			this.jodit,
			this.jodit.ownerDocument,
			true
		);

		const offsetPopup = offset(
			popup,
			this.jodit,
			this.jodit.ownerDocument,
			true
		);

		const marginLeft: number = (css(popup, 'marginLeft') as number) || 0;

		offsetPopup.left -= marginLeft;

		let diffLeft: number = marginLeft;
		let width: number | string = 'auto';

		if (offsetPopup.left < offsetContainer.left) {
			diffLeft = offsetContainer.left - offsetPopup.left;
		} else if (
			offsetPopup.left + offsetPopup.width >=
			offsetContainer.left + offsetContainer.width
		) {
			diffLeft = -(
				offsetPopup.left +
				offsetPopup.width -
				(offsetContainer.left + offsetContainer.width)
			);
		} else {
			diffLeft = 0;
		}

		if (offsetPopup.width >= offsetContainer.width) {
			diffLeft = offsetContainer.left - offsetPopup.left;
			width = offsetContainer.width;
		}

		if (diffLeft !== marginLeft) {
			try {
				popup.style.setProperty(
					'margin-left',
					diffLeft + 'px',
					'important'
				);
			} catch {
				popup.style.marginLeft = diffLeft + 'px'; // fallback for ie9
			}
		}

		const triangle: HTMLSpanElement | null = popup.querySelector(
			'.jodit_popup_triangle'
		);

		if (triangle) {
			triangle.style.marginLeft = -diffLeft + 'px';
		}

		css(popup, 'width', width);
	}

	private throttleCalcPosition = this.jodit.async.throttle(
		this.calcPosition.bind(this),
		this.jodit.defaultTimeout
	);

	protected doOpen(content: string | HTMLElement | IControlTypeStrong) {
		if (!content) {
			return;
		}

		Dom.detach(this.container);

		this.container.innerHTML = '<span class="jodit_popup_triangle"></span>';

		this.container.appendChild(
			Dom.isNode(content, this.jodit.ownerWindow)
				? content
				: this.jodit.create.fromHTML(content.toString())
		);

		this.container.style.display = 'block';
		this.container.style.removeProperty('marginLeft');
	}

	protected doClose() {
		// do nothing
	}

	isOpened: boolean = false;

	/**
	 * Open popup
	 *
	 * @param {HTMLElement} content
	 */
	open(
		content: HTMLElement
	) {
		fireEach('beforeOpenPopup closeAllPopups', this, content); // close popups in another editors too

		this.container.classList.add(this.className + '_open');
		this.doOpen(content);

		this.target.appendChild(this.container);

		if (this.jodit.options.textIcons) {
			this.firstInFocus();
		}

		this.isOpened = true;

		this.calcPosition();
	}

	/**
	 * Close popup
	 * @param current
	 */
	close = (current?: HTMLElement | Popup) => {
		if (!this.isOpened && !this.isDestructed) {
			return;
		}

		if (
			!current ||
			!Dom.isOrContains(
				this.container,
				current instanceof Popup ? current.target : current
			)
		) {
			this.isOpened = false;
			this.jodit.events.off('closeAllPopups', this.close);

			this.doClose();

			Dom.safeRemove(this.container);

			this.jodit.events.fire('removeMarkers');
			this.jodit.events.fire(this, 'afterClose');
		}
	};

	container: HTMLElement;

	constructor(
		jodit: IViewBased,
		readonly target: HTMLElement,
		readonly current?: HTMLElement,
		readonly className: string = 'jodit-toolbar__popup'
	) {
		super(jodit);

		this.container = this.jodit.create.div(className);
		this.jodit.markOwner(this.container);

		this.jodit.events
			.on(
				this.container,
				'mousedown touchstart touchend',
				(e: MouseEvent) => {
					e.stopPropagation();
				}
			)
			.on(
				[this.jodit.ownerWindow, this.jodit.events],
				'resize',
				this.throttleCalcPosition
			)
			.on('afterInsertNode, afterInsertImage', this.close);
	}

	firstInFocus() {}

	destruct() {
		if (this.isDestructed) {
			return;
		}

		this.setStatus(STATUSES.beforeDestruct);

		this.jodit.events.off(
			[this.jodit.ownerWindow, this.jodit.events],
			'resize',
			this.throttleCalcPosition
		);

		Dom.safeRemove(this.container);
		delete this.container;

		super.destruct();
	}
}
