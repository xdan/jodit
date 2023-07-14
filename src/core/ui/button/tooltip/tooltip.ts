/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/ui/button/tooltip/README.md]]
 * @packageDocumentation
 * @module ui/button
 */

import './tooltip.less';

import type { IPoint, IViewBased } from 'jodit/types';
import { attr, css } from 'jodit/core/helpers/utils';
import { getContainer } from 'jodit/core/global';
import { autobind, component } from 'jodit/core/decorators';
import { UIElement } from 'jodit/core/ui/element';
import { Dom } from 'jodit/core/dom';
import { position } from 'jodit/core/helpers/size/position';
import { STATUSES } from 'jodit/core/component';

@component
export class UITooltip extends UIElement {
	private __isOpened = false;

	className(): string {
		return 'UITooltip';
	}

	protected override render(): string {
		return '<div><div class="&__content"></div></div>';
	}

	constructor(view: IViewBased) {
		super(view);
		if (
			!view.o.textIcons &&
			view.o.showTooltip &&
			!view.o.useNativeTooltip
		) {
			view.hookStatus(STATUSES.ready, () => {
				getContainer(view, UITooltip).appendChild(this.container);

				view.e.on(
					view.container,
					'mouseenter.tooltip',
					this.__onMouseEnter,
					{
						capture: true
					}
				);
			});
		}
	}

	private __listenClose: boolean = false;

	private __addListenersOnClose(): void {
		if (this.__listenClose) {
			return;
		}

		this.__listenClose = true;
		const view = this.j;
		view.e
			.on(view.ow, 'scroll.tooltip', this.__hide)
			.on(view.container, 'mouseleave.tooltip', this.__hide)
			.on(
				[
					'escape.tooltip',
					'change.tooltip',
					'changePlace.tooltip',
					'afterOpenPopup.tooltip',
					'hidePopup.tooltip',
					'closeAllPopups.tooltip'
				],
				this.__hide
			)
			.on(view.container, 'mouseleave', this.__onMouseLeave, {
				capture: true
			});
	}

	private __removeListenersOnClose(): void {
		if (!this.__listenClose) {
			return;
		}

		this.__listenClose = false;

		const view = this.j;
		view.e
			.off(view.ow, 'scroll.tooltip', this.__hide)
			.off(
				[
					'escape.tooltip',
					'change.tooltip',
					'changePlace.tooltip',
					'afterOpenPopup.tooltip',
					'hidePopup.tooltip',
					'closeAllPopups.tooltip'
				],
				this.__hide
			)
			.off(view.container, 'mouseleave.tooltip', this.__onMouseLeave);
	}

	private __currentTarget: HTMLElement | null = null;

	@autobind
	private __onMouseLeave(e: MouseEvent): void {
		if (this.__currentTarget === e.target) {
			this.__hideDelay();
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

		this.__addListenersOnClose();

		this.__delayOpen(
			() => ({
				x: pos.left + pos.width / 2,
				y: pos.top + pos.height
			}),
			tooltip
		);
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
	private __hide(): void {
		this.j.async.clearTimeout(this.__delayShowTimeout);
		this.j.async.clearTimeout(this.__hideTimeout);
		this.__removeListenersOnClose();

		if (this.__isOpened) {
			this.__isOpened = false;
			this.setMod('visible', false);

			css(this.container, {
				left: -5000
			});
		}
	}

	@autobind
	private __hideDelay(): void {
		if (!this.__isOpened) {
			return;
		}

		this.j.async.clearTimeout(this.__delayShowTimeout);

		this.__hideTimeout = this.async.setTimeout(
			this.__hide,
			this.j.defaultTimeout
		);
	}

	override destruct(): void {
		this.j.e.off(this.j.container, 'mouseenter', this.__onMouseEnter);
		this.__hide();
		super.destruct();
	}
}
