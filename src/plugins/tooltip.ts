/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit } from '../types';
import { offset } from '../modules/helpers/size';
import { css } from '../modules/helpers';
import { Plugin } from '../modules/Plugin';
import { Dom } from '../modules/Dom';

export class tooltip extends Plugin {
	private isOpened = false;

	container!: HTMLElement;

	afterInit(jodit: IJodit) {
		this.container = jodit.create.div('jodit_tooltip');
		this.jodit.ownerDocument.body.appendChild(this.container);

		let timeout = 0;
		jodit.events
			.off('.tooltip')
			.on(
				'showTooltip.tooltip',
				(target: HTMLElement, content: string) => {
					jodit.async.clearTimeout(timeout);
					this.open(target, content);
				}
			)
			.on(
				'hideTooltip.tooltip change.tooltip updateToolbar.tooltip scroll.tooltip changePlace.tooltip hidePopup.tooltip closeAllPopups.tooltip',
				() => {
					timeout = jodit.async.setTimeout(
						() => this.close(),
						this.jodit.defaultTimeout
					);
				}
			);
	}

	beforeDestruct(jodit: IJodit): void {
		jodit?.events.off('.tooltip');
		this.close();
		Dom.safeRemove(this.container);
	}

	private open(target: HTMLElement, content: string): void {
		this.container.classList.add('jodit_tooltip_visible');
		this.container.innerHTML = content;

		this.isOpened = true;
		this.calcPosition(target);
	}

	private calcPosition(target: HTMLElement) {
		const bound = offset(
			target,
			this.jodit,
			this.jodit.ownerDocument,
			true
		);

		css(this.container, {
			left: bound.left - this.container.offsetWidth / 2 + bound.width / 2,
			top: bound.top + bound.height,
			position: null
		});
	}

	private close(): void {
		if (this.isOpened) {
			this.isOpened = false;
			this.container.classList.remove('jodit_tooltip_visible');

			css(this.container, {
				left: -5000,
				position: 'fixed'
			});
		}
	}
}
