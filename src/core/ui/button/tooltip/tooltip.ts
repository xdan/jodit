/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/ui/button/tooltip/README.md]]
 * @packageDocumentation
 * @module ui/button
 */

import type { IPoint, IViewBased } from 'jodit/types';
import { STATUSES } from 'jodit/core/component';
import { autobind, component } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom';
import { getContainer } from 'jodit/core/global';
import { position } from 'jodit/core/helpers/size/position';
import { attr, css } from 'jodit/core/helpers/utils';
import { UIElement } from 'jodit/core/ui/element';

import './tooltip.less';

const WINDOW_EVENTS_ON_HIDE = [
	'scroll.tooltip',
	'joditCloseDialog',
	'mouseleave.tooltip'
];

const JODIT_EVENTS_ON_HIDE = [
	'escape.tooltip',
	'change.tooltip',
	'changePlace.tooltip',
	'afterOpenPopup.tooltip',
	'hidePopup.tooltip',
	'closeAllPopups.tooltip'
];

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
			this.j.e.on('getContainer', (box: HTMLElement) => {
				this.__onAttach(box);
			});

			view.hookStatus(STATUSES.ready, () => {
				this.__onAttach(this.j.container);
			});
		}
	}

	private __onAttach(container: HTMLElement): void {
		// TODO Move it inside __show method. Now it is here because testcase failed with capturing
		getContainer(this.j, UITooltip).appendChild(this.container);

		this.j.e.on(container, 'mouseenter.tooltip', this.__onMouseEnter, {
			capture: true
		});
	}

	private __listenClose: boolean = false;

	private __addListenersOnEnter(): void {
		if (this.__listenClose) {
			return;
		}

		this.__listenClose = true;
		const view = this.j;

		view.e
			.on(view.ow, WINDOW_EVENTS_ON_HIDE, this.__hide)
			.on(JODIT_EVENTS_ON_HIDE, this.__hide)
			.on(view.container, 'mouseleave.tooltip', this.__onMouseLeave, {
				capture: true
			});
	}

	private __removeListenersOnLeave(): void {
		if (!this.__listenClose) {
			return;
		}

		this.__listenClose = false;

		const view = this.j;
		view.e
			.off(view.ow, WINDOW_EVENTS_ON_HIDE, this.__hide)
			.off(JODIT_EVENTS_ON_HIDE, this.__hide)
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

		const target = e.target as HTMLElement;

		this.__open(() => {
			const pos = position(target);

			return {
				x: pos.left + pos.width / 2,
				y: pos.top + pos.height
			};
		}, tooltip);
	}

	private __delayShowTimeout: number = 0;
	private __hideTimeout: number = 0;

	private __open(getPoint: () => IPoint, content: string): void {
		this.__addListenersOnEnter();

		this.__isOpened = true;

		this.j.async.clearTimeout(this.__hideTimeout);
		this.j.async.clearTimeout(this.__delayShowTimeout);

		const to = this.j.o.showTooltipDelay || this.j.defaultTimeout;

		if (!to) {
			this.__show(getPoint, content);
			return;
		}

		this.__delayShowTimeout = this.j.async.setTimeout(
			() => this.__show(getPoint, content),
			to
		);
	}

	private __show(getPoint: () => IPoint, content: string): void {
		this.setMod('visible', true);
		this.getElm('content')!.innerHTML = content;
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
		this.__removeListenersOnLeave();

		if (this.__isOpened) {
			this.__isOpened = false;
			this.setMod('visible', false);
			this.getElm('content')!.innerHTML = '';
			css(this.container, {
				left: -5000
			});
		}
	}

	@autobind
	private __hideDelay(): void {
		this.j.async.clearTimeout(this.__delayShowTimeout);
		this.j.async.clearTimeout(this.__hideTimeout);

		if (!this.__isOpened) {
			return;
		}

		this.__hideTimeout = this.async.setTimeout(
			this.__hide,
			this.j.defaultTimeout
		);
	}

	override destruct(): void {
		this.j.e.off(
			this.j.container,
			'mouseenter.tooltip',
			this.__onMouseEnter
		);
		this.__hide();
		super.destruct();
	}
}
