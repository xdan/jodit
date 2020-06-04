/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './tooltip.less';

import { IJodit } from '../../types';
import { css, offset } from '../../core/helpers';
import { Plugin } from '../../core/plugin';
import { Dom } from '../../core/dom';
import { getContainer } from '../../core/global';
import autobind from 'autobind-decorator';

export class tooltip extends Plugin {
	private isOpened = false;

	container!: HTMLElement;

	afterInit(jodit: IJodit) {
		this.container = jodit.c.div('jodit-tooltip');
		getContainer(this.j, tooltip).appendChild(this.container);

		let timeout = 0;
		jodit.e
			.off('.tooltip')
			.on(
				'showTooltip.tooltip',
				(target: HTMLElement, content: string) => {
					jodit.async.clearTimeout(timeout);
					this.open(target, content);
				}
			)
			.on('escape.tooltip', this.close)
			.on(
				'hideTooltip.tooltip change.tooltip updateToolbar.tooltip scroll.tooltip changePlace.tooltip hidePopup.tooltip closeAllPopups.tooltip',
				() => {
					timeout = jodit.async.setTimeout(
						() => this.close(),
						this.j.defaultTimeout
					);
				}
			);
	}

	beforeDestruct(jodit: IJodit): void {
		jodit?.e.off('.tooltip');
		this.close();
		Dom.safeRemove(this.container);
	}

	private open(target: HTMLElement, content: string): void {
		if (!Dom.up(target, elm => elm && elm.nodeName === 'BODY')) {
			return;
		}

		this.container.classList.add('jodit-tooltip_visible');
		this.container.innerHTML = content;

		this.isOpened = true;
		this.calcPosition(target);
	}

	private calcPosition(target: HTMLElement) {
		const bound = offset(target, this.j, this.j.od, true);

		css(this.container, {
			left: bound.left - this.container.offsetWidth / 2 + bound.width / 2,
			top: bound.top + bound.height,
			position: null
		});
	}

	@autobind
	private close(): void {
		if (this.isOpened) {
			this.isOpened = false;
			this.container.classList.remove('jodit-tooltip_visible');

			css(this.container, {
				left: -5000,
				position: 'fixed'
			});
		}
	}
}
