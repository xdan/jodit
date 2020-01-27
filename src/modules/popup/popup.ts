/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright 2013-2020 Valeriy Chupurnov https://xdsoft.net
 */

import { IViewBased } from '../../types/view';
import { Dom } from '../Dom';
import { css, offset } from '../helpers/';
import { Component, STATUSES } from '../Component';
import { IControlTypeStrong, IPopup } from '../../types';
import { Jodit } from '../../Jodit';

export class Popup extends Component implements IPopup {
	private calcPosition() {
		if (!this.isOpened || this.isInDestruct) {
			return;
		}

		const popup: HTMLElement = this.container;

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
	 * @param {boolean} [rightAlign=false] Open popup on right side
	 * @param {boolean} [noStandardActions=false] No call standarts action
	 */
	open(
		content: string | HTMLElement | IControlTypeStrong,
		rightAlign?: boolean,
		noStandardActions: boolean = false
	) {
		Jodit.fireEach('beforeOpenPopup closeAllPopups', this, content); // close popups in another editors too

		noStandardActions || this.jodit.events.on('closeAllPopups', this.close);
		this.jodit.markOwner(this.container);

		this.container.classList.add(this.className + '-open');
		this.doOpen(content);

		this.target.appendChild(this.container);

		if (this.jodit.options.textIcons) {
			this.firstInFocus();
		}

		if (rightAlign !== undefined) {
			this.container.classList.toggle('jodit_right', rightAlign);
		}

		if (!noStandardActions && this.container.parentNode) {
			this.jodit.events.fire(
				this.container.parentNode,
				'afterOpenPopup',
				this.container
			);
		}

		this.isOpened = true;

		!noStandardActions && this.calcPosition();
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
		readonly className: string = 'jodit_toolbar_popup'
	) {
		super(jodit);

		this.container = this.jodit.create.div(className);

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

