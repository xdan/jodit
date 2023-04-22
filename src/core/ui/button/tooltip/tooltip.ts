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
import { attr, css, dataBind } from 'jodit/core/helpers/utils';
import { getContainer } from 'jodit/core/global';
import { autobind } from 'jodit/core/decorators';
import { UIElement } from 'jodit/core/ui/element';
import { Dom } from 'jodit/core/dom';
import { position } from 'jodit/core/helpers/size/position';

export class UITooltip extends UIElement {
	private __isOpened = false;

	className(): string {
		return 'UITooltip';
	}

	protected override render(): string {
		return '<div><div class="&__content"></div></div>';
	}

	protected constructor(view: IViewBased) {
		super(view);
		getContainer(view, UITooltip).appendChild(this.container);

		view.e
			.off('.tooltip')
			.on(
				'showTooltip.tooltip',
				(getPoint: () => IPoint, content: string) => {
					view.async.clearTimeout(this.__hideTimeout);
					this.__open(getPoint, content);
				}
			)

			.on('delayShowTooltip.tooltip', this.__delayOpen)

			.on('escape.tooltip', this.__close)
			.on(
				[
					'hideTooltip.tooltip',
					'change.tooltip',
					'scroll.tooltip',
					'changePlace.tooltip',
					'hidePopup.tooltip',
					'afterOpenPopup.tooltip',
					'closeAllPopups.tooltip'
				],
				this.__hideTooltip
			);

		if (
			!this.j.o.textIcons &&
			this.j.o.showTooltip &&
			!this.j.o.useNativeTooltip
		) {
			this.j.e
				.on(view.od.body, 'mouseenter.tooltip', this.__onMouseEnter, {
					capture: true
				})
				.on(view.od.body, 'mouseleave.tooltip', this.__onMouseLeave, {
					capture: true
				});
		}
	}

	@autobind
	private __hideTooltip(): void {
		this.j.async.clearTimeout(this.__delayShowTimeout);

		this.__hideTimeout = this.async.setTimeout(
			this.__close,
			this.j.defaultTimeout
		);
	}

	private __currentTarget: HTMLElement | null = null;

	@autobind
	private __onMouseLeave(e: MouseEvent): void {
		if (this.__currentTarget === e.target) {
			this.__hideTooltip();
			this.__currentTarget = null;
		}
	}

	@autobind
	private __onMouseEnter(e: MouseEvent): void {
		if (!Dom.isHTMLElement(e.target)) {
			return;
		}

		const tooltip = attr(e.target, 'aria-label');

		if (!tooltip) {
			return;
		}

		const disabled = Boolean(attr(e.target, 'disabled'));

		if (disabled) {
			return;
		}

		const isOwn = e.target.className.includes('jodit');

		if (!isOwn) {
			return;
		}

		this.__currentTarget = e.target;

		const pos = position(e.target);

		this.__delayOpen(
			() => ({
				x: pos.left + pos.width / 2,
				y: pos.top + pos.height
			}),
			tooltip
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
	private __hideTimeout: number = 0;

	@autobind
	private __delayOpen(getPoint: () => IPoint, content: string): void {
		const to = this.j.o.showTooltipDelay || this.j.defaultTimeout;

		this.j.async.clearTimeout(this.__hideTimeout);
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
		this.getElm('content')!.innerHTML = content;

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
