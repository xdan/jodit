/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/tooltip/README.md]]
 * @packageDocumentation
 * @module plugins/tooltip
 */

import './tooltip.less';

import type { IPoint, IViewBased } from 'jodit/types';
import { css, dataBind } from 'jodit/core/helpers';
import { getContainer } from 'jodit/core/global';
import { autobind } from 'jodit/core/decorators';
import { UIElement } from '../../element';

export class UITooltip extends UIElement {
	private __isOpened = false;

	className(): string {
		return 'UITooltip';
	}

	protected constructor(view: IViewBased) {
		super(view);
		getContainer(view, UITooltip).appendChild(this.container);

		let timeout = 0;

		view.e
			.off('.tooltip')
			.on(
				'showTooltip.tooltip',
				(getPoint: () => IPoint, content: string) => {
					view.async.clearTimeout(timeout);
					this.__open(getPoint, content);
				}
			)

			.on('delayShowTooltip.tooltip', this.__delayOpen)

			.on('escape.tooltip', this.__close)
			.on(
				'hideTooltip.tooltip change.tooltip scroll.tooltip changePlace.tooltip hidePopup.tooltip closeAllPopups.tooltip',
				() => {
					this.j.async.clearTimeout(this.__delayShowTimeout);

					timeout = view.async.setTimeout(
						this.__close,
						this.j.defaultTimeout
					);
				}
			);
	}

	private __useCount: number = 1;

	/**
	 * Creates only one instance of the tooltip for the container
	 */
	static make(view: IViewBased): UITooltip {
		let instance = dataBind<UITooltip>(view, 'ui-tooltip');
		if (instance) {
			instance.__useCount += 1;
			return instance;
		}
		instance = new UITooltip(view);
		dataBind<UITooltip>(view, 'ui-tooltip', instance);
		return instance;
	}

	private __delayShowTimeout: number = 0;

	@autobind
	private __delayOpen(getPoint: () => IPoint, content: string): void {
		const to = this.j.o.showTooltipDelay || this.j.defaultTimeout;

		this.j.async.clearTimeout(this.__delayShowTimeout);

		this.__delayShowTimeout = this.j.async.setTimeout(
			() => this.__open(getPoint, content),
			{
				timeout: to,
				label: 'tooltip'
			}
		);
	}

	private __open(getPoint: () => IPoint, content: string): void {
		this.setMod('visible', true);
		this.container.innerHTML = content;

		this.__isOpened = true;
		this.__setPosition(getPoint);
	}

	private __setPosition(getPoint: () => IPoint): void {
		const point = getPoint();

		css(this.container, {
			left: point.x,
			top: point.y
		});
	}

	@autobind
	private __close(): void {
		this.j.async.clearTimeout(this.__delayShowTimeout);

		if (this.__isOpened) {
			this.__isOpened = false;
			this.setMod('visible', false);

			css(this.container, {
				left: -5000
			});
		}
	}

	override destruct(): void {
		this.__useCount--;
		if (!this.__useCount) {
			this.j?.e.off('.tooltip');
			this.__close();
			super.destruct();
		}
	}
}
