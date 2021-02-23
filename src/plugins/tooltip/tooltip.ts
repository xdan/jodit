/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './tooltip.less';

import type { IJodit, IPoint } from '../../types';
import { css } from '../../core/helpers';
import { Plugin } from '../../core/plugin';
import { Dom } from '../../core/dom';
import { getContainer } from '../../core/global';
import { autobind } from '../../core/decorators';

export class tooltip extends Plugin {
	private isOpened = false;

	container!: HTMLElement;

	afterInit(jodit: IJodit): void {
		this.container = jodit.c.div('jodit-tooltip');
		getContainer(this.j, tooltip).appendChild(this.container);

		let timeout = 0;

		jodit.e
			.off('.tooltip')
			.on(
				'showTooltip.tooltip',
				(getPoint: () => IPoint, content: string) => {
					jodit.async.clearTimeout(timeout);
					this.open(getPoint, content);
				}
			)

			.on('delayShowTooltip.tooltip', this.delayOpen)

			.on('escape.tooltip', this.close)
			.on(
				'hideTooltip.tooltip change.tooltip scroll.tooltip changePlace.tooltip hidePopup.tooltip closeAllPopups.tooltip',
				() => {
					this.j.async.clearTimeout(this.delayShowTimeout);

					timeout = jodit.async.setTimeout(
						this.close,
						this.j.defaultTimeout
					);
				}
			);
	}

	private delayShowTimeout: number = 0;

	@autobind
	private delayOpen(getPoint: () => IPoint, content: string): void {
		const to = this.j.o.showTooltipDelay || this.j.defaultTimeout;

		this.j.async.clearTimeout(this.delayShowTimeout);

		this.delayShowTimeout = this.j.async.setTimeout(
			() => this.open(getPoint, content),
			{
				timeout: to,
				label: 'tooltip'
			}
		);
	}

	private open(getPoint: () => IPoint, content: string): void {
		this.container.classList.add('jodit-tooltip_visible');
		this.container.innerHTML = content;

		this.isOpened = true;
		this.setPosition(getPoint);
	}

	private setPosition(getPoint: () => IPoint) {
		const point = getPoint();

		css(this.container, {
			left: point.x,
			top: point.y
		});
	}

	@autobind
	private close(): void {
		this.j.async.clearTimeout(this.delayShowTimeout);

		if (this.isOpened) {
			this.isOpened = false;
			this.container.classList.remove('jodit-tooltip_visible');

			css(this.container, {
				left: -5000
			});
		}
	}

	beforeDestruct(jodit: IJodit): void {
		jodit?.e.off('.tooltip');
		this.close();
		Dom.safeRemove(this.container);
	}
}
